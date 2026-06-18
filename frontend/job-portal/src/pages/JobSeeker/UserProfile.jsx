import { useState } from "react";
import { Save } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import LuxuryDashboardLayout from "../../components/dashboard/LuxuryDashboardLayout";
import { Card } from "../../components/ui/card";
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
      eyebrow="PROFILE"
      title="ملفي الشخصي"
      description="حدّث بياناتك الأساسية وروابط سيرتك المستخدمة في التقديم."
      maxWidth="max-w-4xl"
    >
      <Card className="p-6">
      <form onSubmit={saveProfile}>
        <div className="mt-6 space-y-4">
          <Input label="الاسم" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} />
          <Input label="رابط الصورة" value={form.avatar} onChange={(value) => setForm((current) => ({ ...current, avatar: value }))} />
          <Input label="رابط السيرة للتقديم" value={form.resume} onChange={(value) => setForm((current) => ({ ...current, resume: value }))} />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 rounded-xl bg-[linear-gradient(145deg,var(--rushd-accent-2),var(--rushd-accent))] px-6 py-3 font-black text-[var(--rushd-ink)] disabled:opacity-60"
        >
          <Save className="ml-2 inline h-5 w-5" />
          حفظ التغييرات
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
      <UiInput
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export default UserProfile;
