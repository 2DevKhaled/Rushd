import { useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Upload,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  CheckCircle,
  AlertCircle,
  Loader,
  Moon,
  Sun,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  normalizeApiError,
  validateAvatar,
  validateEmail,
  validatePassword,
} from "../utils/helper";
import uploadImage from "../utils/uploadImage";
function SignUp() {
  const { register } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
    avatar: null,
  });
  const [formState, setFormState] = useState({
    loading: false,
    errors: {},
    showPassword: false,
    avatarPreview: null,
    success: false,
  });
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
  const handleRoleChange = (role) => {
    setFormData((prev) => ({ ...prev, role }));
    if (formState.errors.role) {
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, role: "" },
      }));
    }
  };
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const error = validateAvatar(file);
      if (error) {
        setFormState((prev) => ({
          ...prev,
          errors: { ...prev.errors, avatar: error },
        }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        avatar: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState((prev) => ({
          ...prev,
          avatarPreview: reader.result,
          errors: { ...prev.errors, avatar: "" },
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const validateForm = () => {
    const errors = {
      fullName: !formData.fullName.trim() ? "الاسم الكامل مطلوب" : "",
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      role: !formData.role ? "اختر نوع الحساب" : "",
      avatar: "",
    };
    // Remove empty errors
    Object.keys(errors).forEach((key) => {
      if (!errors[key]) delete errors[key];
    });
    setFormState((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setFormState((prev) => ({ ...prev, loading: true }));
    try {
      let avatar = "";

      if (formData.avatar) {
        const uploadResult = await uploadImage(formData.avatar);
        avatar = uploadResult.imageUrl || "";
      }

      const user = await register({
        name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
        avatar,
      });
      const fallbackPath =
        user.role === "employer" ? "/employer-dashboard" : "/dashboard";
      setFormState((prev) => ({
        ...prev,
        loading: false,
        success: true,
      }));
      setTimeout(() => navigate(fallbackPath, { replace: true }), 700);
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        loading: false,
        errors: {
          submit:
            normalizeApiError(error, "تعذر إنشاء الحساب. حاول مرة أخرى."),
        },
      }));
    }
  };

  const fieldClass = (hasError) =>
    `auth-input auth-input-icon ${hasError ? "auth-input-error" : ""}`;

  if (formState.success) {
    return (
      <div dir="rtl" className="auth-page flex min-h-screen items-center justify-center bg-[var(--auth-bg)] px-4 text-[var(--auth-text)]">
        <div className="w-full max-w-md border border-[var(--auth-border)] bg-[var(--auth-surface)] p-9 text-center shadow-[0_30px_90px_var(--auth-shadow)]">
          <span className="mx-auto flex h-16 w-16 items-center justify-center bg-[var(--auth-accent)] text-[var(--auth-ink)]"><CheckCircle className="h-8 w-8" /></span>
          <h1 className="mt-6 text-3xl font-bold">أهلًا بك في رُشد</h1>
          <p className="mt-3 text-[var(--auth-muted)]">تم إنشاء حسابك بنجاح.</p>
          <Loader className="mx-auto mt-7 h-6 w-6 animate-spin text-[var(--auth-accent)]" />
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="auth-page min-h-screen bg-[var(--auth-bg)] text-[var(--auth-text)]">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(410px,.68fr)]">
        <main className="relative min-w-0 px-5 py-24 sm:px-10 lg:px-14 xl:px-20">
          <Link to="/" className="absolute right-5 top-6 flex items-center gap-3 sm:right-10 lg:right-14 xl:right-20">
            <span className="flex h-11 w-11 items-center justify-center bg-[var(--auth-accent)] text-xl font-bold text-[var(--auth-ink)]">ر</span>
            <span><strong className="block text-xl leading-none">رُشد</strong><small className="mt-1 block text-[10px] font-semibold text-[var(--auth-muted)]" dir="ltr">CAREER PLATFORM</small></span>
          </Link>
          <button type="button" onClick={toggleTheme} className="absolute left-5 top-6 flex h-11 w-11 items-center justify-center border border-[var(--auth-border)] text-[var(--auth-text)] transition hover:border-[var(--auth-border-strong)] sm:left-10 lg:left-14 xl:left-20" aria-label="تبديل المظهر" title="تبديل المظهر">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="mx-auto w-full max-w-2xl">
            <div className="mb-8">
              <p className="mb-3 text-sm font-bold text-[var(--auth-accent)]">حساب جديد</p>
              <h1 className="text-4xl font-bold sm:text-5xl">ابدأ رحلتك مع رُشد</h1>
              <p className="mt-4 leading-8 text-[var(--auth-muted)]">اختر نوع حسابك، ثم أضف بياناتك الأساسية للانطلاق.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <fieldset>
                <legend className="mb-3 text-sm font-bold">أنا هنا بصفتي</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { role: "jobseeker", title: "باحث عن عمل", text: "أبني مساري وأبحث عن فرصة", Icon: UserCheck },
                    { role: "employer", title: "صاحب عمل", text: "أنشر الفرص وأبحث عن المواهب", Icon: Building2 },
                  ].map(({ role, title, text, Icon }) => {
                    const selected = formData.role === role;
                    return (
                      <button key={role} type="button" onClick={() => handleRoleChange(role)} className={`relative flex items-center gap-4 border p-4 text-right transition ${selected ? "border-[var(--auth-accent)] bg-[var(--auth-soft)]" : "border-[var(--auth-border)] bg-[var(--auth-surface)] hover:border-[var(--auth-border-strong)]"}`} aria-pressed={selected}>
                        <span className={`flex h-12 w-12 shrink-0 items-center justify-center ${selected ? "bg-[var(--auth-accent)] text-[var(--auth-ink)]" : "bg-[var(--auth-soft)] text-[var(--auth-accent)]"}`}><Icon className="h-6 w-6" /></span>
                        <span><strong className="block">{title}</strong><small className="mt-1 block text-[var(--auth-muted)]">{text}</small></span>
                        {selected && <CheckCircle className="absolute left-3 top-3 h-4 w-4 text-[var(--auth-accent)]" />}
                      </button>
                    );
                  })}
                </div>
                {formState.errors.role && <p className="auth-error"><AlertCircle className="h-4 w-4" />{formState.errors.role}</p>}
              </fieldset>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="signup-name" className="mb-2 block text-sm font-bold">الاسم الكامل</label>
                  <div className="relative"><User className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--auth-muted)]" /><input id="signup-name" type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} autoComplete="name" placeholder="اسمك الكامل" className={fieldClass(formState.errors.fullName)} /></div>
                  {formState.errors.fullName && <p className="auth-error"><AlertCircle className="h-4 w-4" />{formState.errors.fullName}</p>}
                </div>
                <div>
                  <label htmlFor="signup-email" className="mb-2 block text-sm font-bold">البريد الإلكتروني</label>
                  <div className="relative"><Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--auth-muted)]" /><input id="signup-email" dir="ltr" type="email" name="email" value={formData.email} onChange={handleInputChange} autoComplete="email" placeholder="name@example.com" className={`auth-input auth-input-email ${formState.errors.email ? "auth-input-error" : ""}`} /></div>
                  {formState.errors.email && <p className="auth-error"><AlertCircle className="h-4 w-4" />{formState.errors.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="signup-password" className="mb-2 block text-sm font-bold">كلمة المرور</label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--auth-muted)]" />
                  <input id="signup-password" type={formState.showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} autoComplete="new-password" placeholder="8 أحرف على الأقل" className={`auth-input auth-input-password ${formState.errors.password ? "auth-input-error" : ""}`} />
                  <button type="button" onClick={() => setFormState((current) => ({ ...current, showPassword: !current.showPassword }))} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--auth-muted)] hover:text-[var(--auth-text)]" aria-label={formState.showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}>{formState.showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
                </div>
                {formState.errors.password && <p className="auth-error"><AlertCircle className="h-4 w-4" />{formState.errors.password}</p>}
              </div>

              <div className="flex flex-col gap-4 border border-[var(--auth-border)] bg-[var(--auth-surface)] p-4 sm:flex-row sm:items-center">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden bg-[var(--auth-soft)] text-[var(--auth-muted)]">
                  {formState.avatarPreview ? <img src={formState.avatarPreview} alt="معاينة الصورة الشخصية" className="h-full w-full object-cover" /> : <User className="h-7 w-7" />}
                </span>
                <div className="min-w-0 flex-1"><strong className="block text-sm">الصورة الشخصية <span className="font-normal text-[var(--auth-muted)]">(اختيارية)</span></strong><p className="mt-1 text-xs text-[var(--auth-muted)]">JPG أو PNG حتى 5MB</p></div>
                <input type="file" id="avatar" accept=".jpg,.jpeg,.png" onChange={handleAvatarChange} className="hidden" />
                <label htmlFor="avatar" className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 border border-[var(--auth-border-strong)] px-4 text-sm font-bold transition hover:bg-[var(--auth-soft)]"><Upload className="h-4 w-4" />اختيار صورة</label>
              </div>
              {formState.errors.avatar && <p className="auth-error"><AlertCircle className="h-4 w-4" />{formState.errors.avatar}</p>}

              {formState.errors.submit && <div className="auth-submit-error"><AlertCircle className="h-5 w-5 shrink-0" /><p>{formState.errors.submit}</p></div>}

              <button type="submit" disabled={formState.loading} className="group flex min-h-14 w-full items-center justify-center gap-3 bg-[var(--auth-accent)] px-7 font-bold text-[var(--auth-ink)] transition hover:bg-[var(--auth-accent-hover)] disabled:cursor-not-allowed disabled:opacity-60">
                {formState.loading ? <><Loader className="h-5 w-5 animate-spin" />جاري إنشاء الحساب...</> : <>إنشاء الحساب <ArrowLeft className="h-5 w-5 transition group-hover:-translate-x-1" /></>}
              </button>
              <p className="text-center text-sm text-[var(--auth-muted)]">لديك حساب بالفعل؟ <Link to="/login" className="font-bold text-[var(--auth-accent)] hover:underline">تسجيل الدخول</Link></p>
            </form>
          </div>
        </main>

        <aside className="auth-aside relative hidden overflow-hidden bg-[var(--auth-deep)] p-12 text-[var(--auth-on-deep)] lg:flex lg:flex-col lg:justify-between">
          <div className="auth-rings absolute inset-0" />
          <div className="relative text-xs text-[var(--auth-on-deep-muted)]" dir="ltr">RUSHD / NEW PATH</div>
          <div className="relative py-16">
            <p className="text-sm font-bold text-[var(--auth-pistachio)]">من أول خطوة</p>
            <h2 className="mt-5 text-5xl font-bold leading-tight">ملفك.<br />فرصتك.<br /><span className="text-[var(--auth-accent)]">مستقبلك.</span></h2>
            <p className="mt-7 max-w-sm leading-8 text-[var(--auth-on-deep-muted)]">حساب واحد يربط استعدادك المهني بالفرصة التي تستحقها.</p>
          </div>
          <div className="relative border-t border-[var(--auth-on-deep-border)] pt-7 text-sm text-[var(--auth-on-deep-muted)]">انضم كباحث عن عمل أو صاحب عمل، واختر المسار الذي يناسبك.</div>
        </aside>
      </div>
    </div>
  );
}

export default SignUp;
