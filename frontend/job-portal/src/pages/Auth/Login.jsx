import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Loader,
  Lock,
  Mail,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { normalizeApiError, validateEmail } from "../utils/helper";

function Login() {
  const { login } = useAuth();
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

  const validatePassword = (password) => {
    if (!password) return "كلمة المرور مطلوبة";
    return "";
  };

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (formState.errors[name] || formState.errors.submit) {
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [name]: "", submit: "" },
      }));
    }
  };

  const validateForm = () => {
    const errors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };

    Object.keys(errors).forEach((key) => {
      if (!errors[key]) delete errors[key];
    });

    setFormState((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormState((prev) => ({ ...prev, loading: true, errors: {} }));

    try {
      const user = await login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      const fallbackPath =
        user.role === "employer" ? "/employer-dashboard" : "/dashboard";
      setFormState((prev) => ({
        ...prev,
        loading: false,
        success: true,
      }));
      setTimeout(() => {
        navigate(fallbackPath, {
          replace: true,
        });
      }, 700);
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        loading: false,
        errors: {
          submit:
            normalizeApiError(
              error,
              "تعذر تسجيل الدخول. تحقق من بياناتك وحاول مرة أخرى.",
            ),
        },
      }));
    }
  };

  const inputClass = (hasError) =>
    `w-full rounded-xl border bg-[var(--rushd-surface-strong)] py-3.5 pl-11 pr-11 text-right text-[var(--rushd-text)] outline-none transition placeholder:text-[var(--rushd-muted)] ${
      hasError
        ? "border-red-400/70 focus:border-red-300"
        : "border-[var(--rushd-border)] focus:border-[var(--rushd-border-strong)]"
    }`;

  if (formState.success) {
    return (
      <div
        dir="rtl"
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--rushd-bg)] px-4 text-[var(--rushd-text)]"
      >
        <div className="landing-grid absolute inset-0 opacity-[0.18] [background-image:linear-gradient(var(--rushd-glow)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.11)_1px,transparent_1px)] [background-size:92px_92px]" />
        <div className="relative w-full max-w-sm rounded-2xl border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-7 text-center shadow-2xl shadow-black/50 backdrop-blur">
          <CheckCircle className="mx-auto mb-5 h-14 w-14 text-[var(--rushd-accent)]" />
          <h2 className="text-2xl font-black">مرحبًا بعودتك</h2>
          <p className="mt-3 text-[var(--rushd-muted)]">تم تسجيل الدخول بنجاح.</p>
          <div className="mx-auto mt-6 h-7 w-7 animate-spin border-2 border-[var(--rushd-accent)] border-t-transparent rounded-full" />
          <p className="mt-3 text-sm text-[var(--rushd-muted)]">
            يتم تحويلك إلى لوحة التحكم...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[var(--rushd-bg)] px-4 py-6 text-[var(--rushd-text)]"
    >
      <div className="landing-grid absolute inset-0 opacity-[0.2] [background-image:linear-gradient(var(--rushd-glow)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.11)_1px,transparent_1px)] [background-size:92px_92px]" />
      <div className="absolute left-1/2 top-24 h-[460px] w-[860px] -translate-x-1/2 rounded-[2rem] border border-[var(--rushd-border)] bg-[var(--rushd-surface)] shadow-2xl shadow-black/50" />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-[var(--rushd-border)] bg-[var(--rushd-surface)] shadow-2xl shadow-black/50 backdrop-blur lg:grid-cols-[0.86fr_1fr]">
          <aside className="relative hidden border-l border-[var(--rushd-border)] p-8 lg:block">
            <Link to="/" className="mb-10 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--rushd-accent)] text-xl font-black text-[var(--rushd-ink)]">
                ر
              </div>
              <div className="leading-none">
                <span className="block text-xl font-black">رُشد</span>
                <span className="mt-1 block text-xs font-bold text-[var(--rushd-muted)]">
                  للجاهزية المهنية
                </span>
              </div>
            </Link>

            <div className="mt-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded-xl border border-[var(--rushd-border-strong)] bg-[var(--rushd-card)] px-3.5 py-2 text-xs font-bold text-[var(--rushd-accent)]">
                <Sparkles className="h-4 w-4" />
                بوابة العودة لمسارك المهني
              </div>
              <h1 className="text-4xl font-black leading-tight">
                أهلاً بك في
                <span className="block text-[var(--rushd-accent)]">رُشد</span>
              </h1>
              <p className="mt-5 max-w-sm leading-8 text-[var(--rushd-muted)]">
                تابع سيرتك، طلباتك، فرصك الوظيفية، وتدريب المقابلات من مساحة
                واحدة مصممة للجاهزية المهنية.
              </p>
            </div>

            <div className="mt-9 grid gap-2.5">
              {["سيرتك جاهزة للتحديث", "فرصك محفوظة في مكان واحد", "مقابلاتك التدريبية بانتظارك"].map(
                (item) => (
                  <div
                    key={item}
                    className="border border-[var(--rushd-border)] bg-[var(--rushd-card)] px-3.5 py-2.5 text-sm font-semibold text-[var(--rushd-muted)]"
                  >
                    <span className="ml-3 inline-block h-2 w-2 bg-[var(--rushd-accent)]" />
                    {item}
                  </div>
                ),
              )}
            </div>
          </aside>

          <main className="p-5 sm:p-8">
            <div className="mb-7 text-right">
              <Link
                to="/"
                className="mb-6 inline-flex items-center gap-3 lg:hidden"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--rushd-accent)] text-xl font-black text-[var(--rushd-ink)]">
                  ر
                </div>
                <span className="text-xl font-black">رُشد</span>
              </Link>

           
              <h2 className="text-3xl font-black">
                تسجيل الدخول
              </h2>
              <p className="mt-3 leading-7 text-[var(--rushd-muted)]">
                أدخل بياناتك للوصول إلى حسابك في رُشد.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-[var(--rushd-text)]">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--rushd-muted)]" />
                  <input
                    type="email"
                    name="email"
                    onChange={handleInputChange}
                    value={formData.email}
                    className={inputClass(formState.errors.email)}
                    placeholder="name@example.com"
                  />
                </div>
                {formState.errors.email && (
                  <p className="mt-2 flex items-center gap-2 text-sm text-red-300">
                    <AlertCircle className="h-4 w-4" />
                    {formState.errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[var(--rushd-text)]">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--rushd-muted)]" />
                  <input
                    type={formState.showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={inputClass(formState.errors.password)}
                    placeholder="أدخل كلمة المرور"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormState((prev) => ({
                        ...prev,
                        showPassword: !prev.showPassword,
                      }))
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--rushd-muted)] transition hover:text-[var(--rushd-text)]"
                    aria-label={
                      formState.showPassword
                        ? "إخفاء كلمة المرور"
                        : "إظهار كلمة المرور"
                    }
                  >
                    {formState.showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {formState.errors.password && (
                  <p className="mt-2 flex items-center gap-2 text-sm text-red-300">
                    <AlertCircle className="h-4 w-4" />
                    {formState.errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex cursor-pointer items-center gap-3 text-[var(--rushd-muted)]">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 accent-[var(--rushd-accent)]"
                  />
                  تذكرني
                </label>
                <span className="font-semibold text-[var(--rushd-muted)]">
                  استعادة كلمة المرور قريبًا
                </span>
              </div>

              {formState.errors.submit && (
                <div className="rounded-xl border border-red-300/20 bg-red-400/10 p-3.5">
                  <p className="flex items-center gap-2 text-sm text-red-200">
                    <AlertCircle className="h-4 w-4" />
                    {formState.errors.submit}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={formState.loading}
                className="group inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-xl bg-[var(--rushd-accent)] px-7 py-3.5 font-black text-[var(--rushd-ink)] transition hover:-translate-y-1 hover:bg-[var(--rushd-accent-2)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {formState.loading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>جاري التحقق...</span>
                  </>
                ) : (
                  <>
                    <span>تسجيل الدخول</span>
                    <ArrowLeft className="h-5 w-5 transition group-hover:-translate-x-1" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-sm text-[var(--rushd-muted)]">
                ليس لديك حساب؟{" "}
                <Link
                  to="/signup"
                  className="font-bold text-[var(--rushd-accent)] transition hover:text-[var(--rushd-text)]"
                >
                  إنشاء حساب جديد
                </Link>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Login;
