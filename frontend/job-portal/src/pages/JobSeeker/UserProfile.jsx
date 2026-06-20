import { useState } from "react";
import { FileText, Save, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import LuxuryDashboardLayout from "../../components/dashboard/LuxuryDashboardLayout";
import { Input as UiInput } from "../../components/ui/input";

function UserProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    avatar: user?.avatar || "",
    resume: user?.resume || "",
  });
  const [saving, setSaving] = useState(false);

  const saveProfile = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, form);
      updateUser({ ...user, ...response.data, token: localStorage.getItem("token") });
      toast.success("تم تحديث الملف الشخصي");
    } catch (error) {
      toast.error(error.response?.data?.message || "تعذر تحديث الملف الشخصي");
    } finally {
      setSaving(false);
    }
  };

  return (
    <LuxuryDashboardLayout
      eyebrow="بياناتك المهنية"
      title="ملفي الشخصي"
      description="حدّث بياناتك الأساسية وروابط سيرتك المستخدمة في التقديم."
      maxWidth="max-w-4xl"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <form onSubmit={saveProfile} className="border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-5 shadow-[0_18px_55px_var(--rushd-shadow)] sm:p-7">
          <div className="mb-6 flex items-center gap-3 border-b border-[var(--rushd-border)] pb-5"><UserRound className="h-6 w-6 text-[var(--rushd-accent)]" /><div><h2 className="text-xl font-bold">المعلومات الأساسية</h2><p className="mt-1 text-sm text-[var(--rushd-muted)]">حافظ على بياناتك محدثة قبل التقديم.</p></div></div>
          <div className="space-y-5">
            <Input label="الاسم" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} />
            <Input label="رابط الصورة" value={form.avatar} onChange={(value) => setForm((current) => ({ ...current, avatar: value }))} />
            <Input label="رابط السيرة للتقديم" value={form.resume} onChange={(value) => setForm((current) => ({ ...current, resume: value }))} />
          </div>
          <button type="submit" disabled={saving} className="mt-6 inline-flex min-h-12 items-center gap-2 bg-[var(--rushd-accent)] px-6 font-bold text-[var(--rushd-ink)] transition hover:bg-[var(--rushd-accent-2)] disabled:opacity-60"><Save className="h-5 w-5" />{saving ? "جاري الحفظ..." : "حفظ التغييرات"}</button>
        </form>

        <aside className="self-start border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-6 text-center lg:sticky lg:top-28">
          <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden bg-[var(--rushd-card)] text-[var(--rushd-accent)]">{form.avatar ? <img src={form.avatar} alt={form.name || "الصورة الشخصية"} className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10" />}</div>
          <h2 className="mt-5 text-2xl font-bold">{form.name || "اسم المستخدم"}</h2>
          <p className="mt-2 text-sm text-[var(--rushd-muted)]">باحث عن عمل</p>
          <div className="mt-6 flex items-center gap-3 border-t border-[var(--rushd-border)] pt-5 text-right"><span className="flex h-10 w-10 items-center justify-center bg-[var(--rushd-card)] text-[var(--rushd-accent)]"><FileText className="h-5 w-5" /></span><span><small className="block text-[var(--rushd-muted)]">السيرة المرتبطة</small><strong>{form.resume ? "مضافة" : "غير مضافة"}</strong></span></div>
        </aside>
      </div>
    </LuxuryDashboardLayout>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[var(--rushd-muted)]">{label}</span>
      <UiInput
        className="rounded-none"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export default UserProfile;
