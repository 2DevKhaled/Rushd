import { useState } from "react";
import { Save } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import LuxuryDashboardLayout from "../../components/dashboard/LuxuryDashboardLayout";
import { Card } from "../../components/ui/card";
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
      eyebrow="COMPANY"
      title="ملف الشركة"
      description="حدّث هوية الشركة التي تظهر للباحثين عن عمل داخل منصة رُشد."
      maxWidth="max-w-5xl"
    >
      <Card className="p-6">
      <form onSubmit={saveProfile}>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input label="اسم المسؤول" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} />
          <Input label="صورة الحساب" value={form.avatar} onChange={(value) => setForm((current) => ({ ...current, avatar: value }))} />
          <Input label="اسم الشركة" value={form.companyName} onChange={(value) => setForm((current) => ({ ...current, companyName: value }))} />
          <Input label="شعار الشركة" value={form.companyLogo} onChange={(value) => setForm((current) => ({ ...current, companyLogo: value }))} />
        </div>
        <label className="mt-4 block">
          <span className="mb-2 block text-sm font-bold text-[var(--rushd-muted)]">وصف الشركة</span>
          <Textarea value={form.companyDescription} onChange={(event) => setForm((current) => ({ ...current, companyDescription: event.target.value }))} />
        </label>
        <button disabled={saving} className="mt-6 rounded-xl bg-[linear-gradient(145deg,var(--rushd-accent-2),var(--rushd-accent))] px-6 py-3 font-black text-[var(--rushd-ink)] disabled:opacity-60">
          <Save className="ml-2 inline h-5 w-5" />
          حفظ ملف الشركة
        </button>
      </form>
      </Card>
    </LuxuryDashboardLayout>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[var(--rushd-muted)]">{label}</span>
      <UiInput value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export default EmployerProfilePage;
