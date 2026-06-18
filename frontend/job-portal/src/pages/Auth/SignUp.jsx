import { useState } from "react";
import {
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
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  normalizeApiError,
  validateAvatar,
  validateEmail,
  validatePassword,
} from "../utils/helper";
import uploadImage from "../utils/uploadImage";
function SignUp() {
  const { register } = useAuth();
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
  if (formState.success) {
    return (
      <div
        dir="rtl"
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--rushd-bg)] px-4 text-[var(--rushd-text)]"
      >
        <div className="landing-grid absolute inset-0 opacity-[0.18] [background-image:linear-gradient(var(--rushd-glow)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.11)_1px,transparent_1px)] [background-size:92px_92px]" />
        <div className="relative w-full max-w-sm rounded-2xl border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-7 text-center shadow-2xl shadow-black/50 backdrop-blur">
          <CheckCircle className="mx-auto mb-5 h-14 w-14 text-[var(--rushd-accent)]" />
          <h2 className="text-2xl font-black">اهلاً بك في رُشد </h2>
          <p className="mt-3 text-[var(--rushd-muted)]">تم إنشاء حساب بنجاح.</p>
          <div className="mx-auto mt-6 h-7 w-7 animate-spin rounded-full border-2 border-[var(--rushd-accent)] border-t-transparent" />
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
      className="relative min-h-screen overflow-hidden bg-[var(--rushd-bg)] px-4 py-8 text-[var(--rushd-text)]"
    >
      <div className="landing-grid absolute inset-0 opacity-[0.2] [background-image:linear-gradient(var(--rushd-glow)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.11)_1px,transparent_1px)] [background-size:92px_92px]" />
      <div className="absolute left-1/2 top-24 h-[520px] w-[900px] -translate-x-1/2 rounded-[2rem] border border-[var(--rushd-border)] bg-[var(--rushd-surface)] shadow-2xl shadow-black/50" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-[var(--rushd-border)] bg-[var(--rushd-surface)] shadow-2xl shadow-black/50 backdrop-blur lg:grid-cols-[0.85fr_1.15fr]">
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

            <div className="mt-12">
              <div className="mb-4 inline-flex items-center gap-2 rounded-xl border border-[var(--rushd-border-strong)] bg-[var(--rushd-card)] px-3.5 py-2 text-xs font-bold text-[var(--rushd-accent)]">
                <UserCheck className="h-4 w-4" />
                بوابتك للانضمام إلى رُشد
              </div>
              <h1 className="text-4xl font-black leading-tight">
                أنشئ حسابك
                <span className="block text-[var(--rushd-accent)]">وابدأ مسارك المهني</span>
              </h1>
              <p className="mt-5 max-w-sm leading-8 text-[var(--rushd-muted)]">
                اختر دورك، أضف بياناتك الأساسية، وانضم إلى منصة رُشد للجاهزية
                المهنية.
              </p>
            </div>

            <div className="mt-10 grid gap-2.5">
              {[
                "ملف مهني واضح",
                "فرص وتقديمات منظمة",
                "تجربة عربية موجهة للطلاب والشركات",
              ].map((item) => (
                <div
                  key={item}
                  className="border border-[var(--rushd-border)] bg-[var(--rushd-card)] px-3.5 py-2.5 text-sm font-semibold text-[var(--rushd-muted)]"
                >
                  <span className="ml-3 inline-block h-2 w-2 bg-[var(--rushd-accent)]" />
                  {item}
                </div>
              ))}
            </div>
          </aside>

          <main className="p-5 sm:p-8">
            <div className="mb-7 text-right">
              <Link to="/" className="mb-6 inline-flex items-center gap-3 lg:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--rushd-accent)] text-xl font-black text-[var(--rushd-ink)]">
                  ر
                </div>
                <span className="text-xl font-black">رُشد</span>
              </Link>

              <p className="font-mono text-sm font-bold text-[var(--rushd-accent)]">
                SIGN_UP
              </p>
              <h2 className="mt-3 text-3xl font-black">إنشاء حساب</h2>
              <p className="mt-3 leading-7 text-[var(--rushd-muted)]">
                أدخل بياناتك لاستخدام رُشد كطالب أو صاحب عمل.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-[var(--rushd-text)]">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <User className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--rushd-muted)]" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-[var(--rushd-border)] bg-[var(--rushd-surface-strong)] py-3.5 pl-4 pr-12 text-right text-[var(--rushd-text)] outline-none transition placeholder:text-[var(--rushd-muted)] focus:border-[var(--rushd-border-strong)]"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>
                {formState.errors.fullName && (
                  <p className="mt-2 flex items-center gap-2 text-sm text-red-300">
                    <AlertCircle className="h-4 w-4" />
                    {formState.errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[var(--rushd-text)]">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--rushd-muted)]" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-[var(--rushd-border)] bg-[var(--rushd-surface-strong)] py-3.5 pl-4 pr-12 text-right text-[var(--rushd-text)] outline-none transition placeholder:text-[var(--rushd-muted)] focus:border-[var(--rushd-border-strong)]"
                    placeholder="example@email.com"
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
                    className="w-full rounded-xl border border-[var(--rushd-border)] bg-[var(--rushd-surface-strong)] py-3.5 pl-12 pr-12 text-right text-[var(--rushd-text)] outline-none transition placeholder:text-[var(--rushd-muted)] focus:border-[var(--rushd-border-strong)]"
                    placeholder="أنشئ كلمة مرور قوية"
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

              <div>
                <label className="mb-2 block text-sm font-bold text-[var(--rushd-text)]">
                  الصورة الشخصية
                </label>
                <div className="flex items-center gap-4 rounded-2xl border border-[var(--rushd-border)] bg-[var(--rushd-surface-strong)] p-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--rushd-border)] bg-[var(--rushd-surface-strong)]">
                    {formState.avatarPreview ? (
                      <img
                        src={formState.avatarPreview}
                        alt="Avatar Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-[var(--rushd-muted)]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      id="avatar"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="avatar"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--rushd-accent)] px-4 py-2.5 text-sm font-black text-[var(--rushd-ink)] transition hover:bg-[var(--rushd-accent-2)]"
                    >
                      <Upload className="h-4 w-4" />
                      <span>رفع صورة</span>
                    </label>
                    <p className="mt-2 text-xs font-semibold text-[var(--rushd-muted)]">
                      JPG أو PNG حتى 5MB
                    </p>
                  </div>
                </div>
                {formState.errors.avatar && (
                  <p className="mt-2 flex items-center gap-2 text-sm text-red-300">
                    <AlertCircle className="h-4 w-4" />
                    {formState.errors.avatar}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[var(--rushd-text)]">
                  نوع الحساب
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => handleRoleChange("jobseeker")}
                    className={`rounded-2xl border p-4 text-right transition hover:-translate-y-0.5 ${
                      formData.role === "jobseeker"
                        ? "border-[var(--rushd-border-strong)] bg-[var(--rushd-card)]"
                        : "border-[var(--rushd-border)] bg-[var(--rushd-surface-strong)] hover:border-[var(--rushd-border-strong)]"
                    }`}
                  >
                    <UserCheck className="mb-3 h-6 w-6 text-[var(--rushd-accent)]" />
                    <div className="font-black text-[var(--rushd-text)]">باحث عن عمل</div>
                    <div className="mt-1 text-sm text-[var(--rushd-muted)]">
                      أبحث عن فرص مهنية
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleChange("employer")}
                    className={`rounded-2xl border p-4 text-right transition hover:-translate-y-0.5 ${
                      formData.role === "employer"
                        ? "border-[var(--rushd-border-strong)] bg-[var(--rushd-card)]"
                        : "border-[var(--rushd-border)] bg-[var(--rushd-surface-strong)] hover:border-[var(--rushd-border-strong)]"
                    }`}
                  >
                    <Building2 className="mb-3 h-6 w-6 text-[var(--rushd-accent)]" />
                    <div className="font-black text-[var(--rushd-text)]">صاحب عمل</div>
                    <div className="mt-1 text-sm text-[var(--rushd-muted)]">
                      أبحث عن المواهب
                    </div>
                  </button>
                </div>
                {formState.errors.role && (
                  <p className="mt-2 flex items-center gap-2 text-sm text-red-300">
                    <AlertCircle className="h-4 w-4" />
                    {formState.errors.role}
                  </p>
                )}
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
                    <span>جاري إنشاء الحساب...</span>
                  </>
                ) : (
                  <span>إنشاء الحساب</span>
                )}
              </button>

              <div className="pt-2 text-center text-sm text-[var(--rushd-muted)]">
                لديك حساب بالفعل؟{" "}
                <Link
                  to="/login"
                  className="font-bold text-[var(--rushd-accent)] transition hover:text-[var(--rushd-text)]"
                >
                  تسجيل الدخول
                </Link>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
