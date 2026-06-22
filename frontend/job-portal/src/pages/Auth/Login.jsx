import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle,
  Eye,
  EyeOff,
  Loader,
  Lock,
  Mail,
  Moon,
  ShieldCheck,
  Sun,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { normalizeApiError, validateEmail } from "../utils/helper";

function Login() {
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [formState, setFormState] = useState({
    loading: false,
    errors: {},
    showPassword: false,
    success: false,
  });

  const handleInputChange = (event) => {
    const { name, type, checked, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (formState.errors[name] || formState.errors.submit) {
      setFormState((current) => ({
        ...current,
        errors: { ...current.errors, [name]: "", submit: "" },
      }));
    }
  };

  const validateForm = () => {
    const errors = {
      email: validateEmail(formData.email),
      password: !formData.password ? "كلمة المرور مطلوبة" : "",
    };
    Object.keys(errors).forEach((key) => !errors[key] && delete errors[key]);
    setFormState((current) => ({ ...current, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setFormState((current) => ({ ...current, loading: true, errors: {} }));

    try {
      const user = await login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      const path =
        user.role === "admin"
          ? "/admin"
          : user.role === "employer"
            ? "/employer-dashboard"
            : "/dashboard";
      setFormState((current) => ({ ...current, loading: false, success: true }));
      setTimeout(() => navigate(path, { replace: true }), 700);
    } catch (error) {
      setFormState((current) => ({
        ...current,
        loading: false,
        errors: {
          submit: normalizeApiError(
            error,
            "تعذر تسجيل الدخول. تحقق من بياناتك وحاول مرة أخرى.",
          ),
        },
      }));
    }
  };

  if (formState.success) {
    return (
      <div dir="rtl" className="auth-page flex min-h-screen items-center justify-center bg-[var(--auth-bg)] px-4 text-[var(--auth-text)]">
        <div className="w-full max-w-md border border-[var(--auth-border)] bg-[var(--auth-surface)] p-9 text-center shadow-[0_30px_90px_var(--auth-shadow)]">
          <span className="mx-auto flex h-16 w-16 items-center justify-center bg-[var(--auth-accent)] text-[var(--auth-ink)]"><CheckCircle className="h-8 w-8" /></span>
          <h1 className="mt-6 text-3xl font-bold">مرحبًا بعودتك</h1>
          <p className="mt-3 text-[var(--auth-muted)]">تم تسجيل الدخول بنجاح.</p>
          <Loader className="mx-auto mt-7 h-6 w-6 animate-spin text-[var(--auth-accent)]" />
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="auth-page min-h-screen bg-[var(--auth-bg)] text-[var(--auth-text)]">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(420px,.78fr)]">
        <main className="relative flex min-w-0 items-center justify-center px-5 py-24 sm:px-10 lg:px-16">
          <Link to="/" className="absolute right-5 top-6 flex items-center gap-3 sm:right-10 lg:right-16">
            <span className="flex h-11 w-11 items-center justify-center bg-[var(--auth-accent)] text-xl font-bold text-[var(--auth-ink)]">ر</span>
            <span><strong className="block text-xl leading-none">رُشد</strong><small className="mt-1 block text-[10px] font-semibold text-[var(--auth-muted)]" dir="ltr">CAREER PLATFORM</small></span>
          </Link>
          <button type="button" onClick={toggleTheme} className="absolute left-5 top-6 flex h-11 w-11 items-center justify-center border border-[var(--auth-border)] text-[var(--auth-text)] transition hover:border-[var(--auth-border-strong)] sm:left-10 lg:left-16" aria-label="تبديل المظهر" title="تبديل المظهر">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="w-full max-w-md">
            <div className="mb-9">
              <p className="mb-3 text-sm font-bold text-[var(--auth-accent)]">مرحبًا بعودتك</p>
              <h1 className="text-4xl font-bold sm:text-5xl">سجّل دخولك</h1>
              <p className="mt-4 leading-8 text-[var(--auth-muted)]">واصل مسارك من حيث توقفت، كل أدواتك وفرصك محفوظة في مكانها.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="login-email" className="mb-2 block text-sm font-bold">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--auth-muted)]" />
                  <input id="login-email" dir="ltr" type="email" name="email" value={formData.email} onChange={handleInputChange} autoComplete="email" placeholder="name@example.com" className={`auth-input auth-input-email ${formState.errors.email ? "auth-input-error" : ""}`} />
                </div>
                {formState.errors.email && <p className="auth-error"><AlertCircle className="h-4 w-4" />{formState.errors.email}</p>}
              </div>

              <div>
                <label htmlFor="login-password" className="mb-2 block text-sm font-bold">كلمة المرور</label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--auth-muted)]" />
                  <input id="login-password" type={formState.showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} autoComplete="current-password" placeholder="أدخل كلمة المرور" className={`auth-input auth-input-password ${formState.errors.password ? "auth-input-error" : ""}`} />
                  <button type="button" onClick={() => setFormState((current) => ({ ...current, showPassword: !current.showPassword }))} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--auth-muted)] transition hover:text-[var(--auth-text)]" aria-label={formState.showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}>
                    {formState.showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {formState.errors.password && <p className="auth-error"><AlertCircle className="h-4 w-4" />{formState.errors.password}</p>}
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex cursor-pointer items-center gap-3 text-[var(--auth-muted)]">
                  <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleInputChange} className="h-4 w-4 accent-[var(--auth-accent)]" />
                  تذكرني
                </label>
                <span className="text-[var(--auth-muted)]">استعادة كلمة المرور قريبًا</span>
              </div>

              {formState.errors.submit && <div className="auth-submit-error"><AlertCircle className="h-5 w-5 shrink-0" /><p>{formState.errors.submit}</p></div>}

              <button type="submit" disabled={formState.loading} className="group flex min-h-14 w-full items-center justify-center gap-3 bg-[var(--auth-accent)] px-7 font-bold text-[var(--auth-ink)] transition hover:bg-[var(--auth-accent-hover)] disabled:cursor-not-allowed disabled:opacity-60">
                {formState.loading ? <><Loader className="h-5 w-5 animate-spin" /> جاري التحقق...</> : <>تسجيل الدخول <ArrowLeft className="h-5 w-5 transition group-hover:-translate-x-1" /></>}
              </button>

              <p className="pt-2 text-center text-sm text-[var(--auth-muted)]">ليس لديك حساب؟ <Link to="/signup" className="font-bold text-[var(--auth-accent)] hover:underline">إنشاء حساب جديد</Link></p>
            </form>
          </div>
        </main>

        <aside className="auth-aside relative hidden overflow-hidden bg-[var(--auth-deep)] p-12 text-[var(--auth-on-deep)] lg:flex lg:flex-col lg:justify-between">
          <div className="auth-rings absolute inset-0" />
          <div className="relative flex items-center justify-between text-xs text-[var(--auth-on-deep-muted)]"><span dir="ltr">RUSHD / ACCESS</span><ShieldCheck className="h-5 w-5 text-[var(--auth-accent)]" /></div>
          <div className="relative py-16">
            <span className="text-7xl font-bold text-[var(--auth-accent)]">رُشد.</span>
            <h2 className="mt-8 text-4xl font-bold leading-tight">مسارك لم يتوقف.<br />كان ينتظر عودتك.</h2>
            <p className="mt-6 max-w-sm leading-8 text-[var(--auth-on-deep-muted)]">ادخل إلى مساحة مهنية تجمع ما أنجزته وما ينتظرك في خطوة واحدة.</p>
          </div>
          <div className="relative border-t border-[var(--auth-on-deep-border)] pt-7">
            {["سيرتك محفوظة وجاهزة", "طلباتك وحالاتها أمامك", "تدريبك يتطور مع هدفك"].map((item) => <div key={item} className="flex items-center gap-3 py-2 text-sm text-[var(--auth-on-deep-muted)]"><Check className="h-4 w-4 text-[var(--auth-pistachio)]" />{item}</div>)}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Login;
