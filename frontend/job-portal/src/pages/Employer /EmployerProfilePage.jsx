import { useState } from "react";
import { Building2, Save, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import LuxuryDashboardLayout from "../../components/dashboard/LuxuryDashboardLayout";
import { Input as UiInput } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";

function EmployerProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    avatar: user?.avatar || "",
    companyName: user?.companyName || "",
    companyDescription: user?.companyDescription || "",
    companyLogo: user?.companyLogo || "",
  });
  const [saving, setSaving] = useState(false);

  const saveProfile = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, form);
      updateUser({ ...user, ...response.data, token: localStorage.getItem("token") });
      toast.success("تم تحديث ملف الشركة");
    } catch (error) {
      toast.error(error.response?.data?.message || "تعذر تحديث ملف الشركة");
    } finally {
      setSaving(false);
    }
  };

  return (
    <LuxuryDashboardLayout
      role="employer"
      eyebrow="هوية الشركة"
      title="ملف الشركة"
      description="حدّث هوية الشركة التي تظهر للباحثين عن عمل داخل منصة رُشد."
      maxWidth="max-w-5xl"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <form onSubmit={saveProfile} className="border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-5 shadow-[0_18px_55px_var(--rushd-shadow)] sm:p-7">
          <div className="mb-6 flex items-center gap-3 border-b border-[var(--rushd-border)] pb-5"><Building2 className="h-6 w-6 text-[var(--rushd-accent)]" /><div><h2 className="text-xl font-bold">بيانات الشركة</h2><p className="mt-1 text-sm text-[var(--rushd-muted)]">تظهر هذه المعلومات للباحثين عن عمل.</p></div></div>
          <div className="grid gap-5 md:grid-cols-2">
            <Input label="اسم المسؤول" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} />
            <Input label="اسم الشركة" value={form.companyName} onChange={(value) => setForm((current) => ({ ...current, companyName: value }))} />
            <Input label="رابط صورة الحساب" value={form.avatar} onChange={(value) => setForm((current) => ({ ...current, avatar: value }))} />
            <Input label="رابط شعار الشركة" value={form.companyLogo} onChange={(value) => setForm((current) => ({ ...current, companyLogo: value }))} />
          </div>
          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-bold text-[var(--rushd-muted)]">وصف الشركة</span>
            <Textarea className="min-h-44 rounded-none" value={form.companyDescription} onChange={(event) => setForm((current) => ({ ...current, companyDescription: event.target.value }))} placeholder="عرّف المرشحين بالشركة وثقافتها ومجال عملها..." />
          </label>
          <button disabled={saving} className="mt-6 inline-flex min-h-12 items-center gap-2 bg-[var(--rushd-accent)] px-6 font-bold text-[var(--rushd-ink)] transition hover:bg-[var(--rushd-accent-2)] disabled:opacity-60">
            <Save className="h-5 w-5" />{saving ? "جاري الحفظ..." : "حفظ ملف الشركة"}
          </button>
        </form>

        <aside className="self-start border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-6 lg:sticky lg:top-28">
          <p className="text-xs font-bold text-[var(--rushd-accent)]">المعاينة العامة</p>
          <div className="mt-6 flex h-20 w-20 items-center justify-center overflow-hidden bg-[var(--rushd-card)] text-[var(--rushd-accent)]">
            {form.companyLogo ? <img src={form.companyLogo} alt="شعار الشركة" className="h-full w-full object-cover" /> : <Building2 className="h-9 w-9" />}
          </div>
          <h2 className="mt-5 text-2xl font-bold">{form.companyName || "اسم الشركة"}</h2>
          <p className="mt-3 whitespace-pre-line leading-7 text-[var(--rushd-muted)]">{form.companyDescription || "سيظهر وصف الشركة هنا للباحثين عن عمل."}</p>
          <div className="mt-6 flex items-center gap-3 border-t border-[var(--rushd-border)] pt-5">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden bg-[var(--rushd-card)]">{form.avatar ? <img src={form.avatar} alt="صورة المسؤول" className="h-full w-full object-cover" /> : <UserRound className="h-5 w-5 text-[var(--rushd-muted)]" />}</span>
            <span><small className="block text-[var(--rushd-muted)]">مسؤول التوظيف</small><strong>{form.name || "اسم المسؤول"}</strong></span>
          </div>
        </aside>
      </div>
    </LuxuryDashboardLayout>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[var(--rushd-muted)]">{label}</span>
      <UiInput className="rounded-none" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export default EmployerProfilePage;
