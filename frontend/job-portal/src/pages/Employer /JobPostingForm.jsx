import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Banknote, BriefcaseBusiness, FileText, Save } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import JobPostingPreview from "./JobPostingPreview";
import LuxuryDashboardLayout from "../../components/dashboard/LuxuryDashboardLayout";
import { Card } from "../../components/ui/card";
import { Input as UiInput } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { Textarea as UiTextarea } from "../../components/ui/textarea";

const emptyJob = {
  title: "",
  description: "",
  requirements: "",
  location: "",
  category: "",
  type: "Full-Time",
  salaryMin: "",
  salaryMax: "",
};

function JobPostingForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const [job, setJob] = useState(emptyJob);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editId) return;

    const fetchJob = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.JOBS.GET_ONE(editId));
        setJob({
          title: response.data.title || "",
          description: response.data.description || "",
          requirements: response.data.requirements || "",
          location: response.data.location || "",
          category: response.data.category || "",
          type: response.data.type || "Full-Time",
          salaryMin: response.data.salaryMin || "",
          salaryMax: response.data.salaryMax || "",
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "تعذر تحميل الوظيفة");
      }
    };

    fetchJob();
  }, [editId]);

  const updateJob = (key, value) => {
    setJob((current) => ({ ...current, [key]: value }));
  };

  const submitJob = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      const payload = {
        ...job,
        salaryMin: job.salaryMin ? Number(job.salaryMin) : undefined,
        salaryMax: job.salaryMax ? Number(job.salaryMax) : undefined,
      };

      if (editId) {
        await axiosInstance.put(API_PATHS.JOBS.UPDATE(editId), payload);
        toast.success("تم تحديث الوظيفة");
      } else {
        await axiosInstance.post(API_PATHS.JOBS.CREATE, payload);
        toast.success("تم نشر الوظيفة");
      }
      navigate("/manage-jobs");
    } catch (error) {
      toast.error(error.response?.data?.message || "تعذر حفظ الوظيفة");
    } finally {
      setSaving(false);
    }
  };

  return (
    <LuxuryDashboardLayout
      role="employer"
      eyebrow={editId ? "تعديل الإعلان" : "إعلان جديد"}
      title={editId ? "تعديل وظيفة" : "نشر وظيفة جديدة"}
      description="صمم إعلان وظيفة واضحاً، منظماً، وجاهزاً للعرض على الباحثين عن عمل."
    >
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
          <Card className="rounded-none p-5 sm:p-7">
          <form onSubmit={submitJob}>
            <div className="mb-5 flex items-center gap-3 border-b border-[var(--rushd-border)] pb-4"><BriefcaseBusiness className="h-5 w-5 text-[var(--rushd-accent)]" /><div><h2 className="font-bold">المعلومات الأساسية</h2><p className="text-sm text-[var(--rushd-muted)]">عرّف المرشح بالفرصة ومكانها.</p></div></div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="المسمى الوظيفي" value={job.title} onChange={(value) => updateJob("title", value)} required />
              <Input label="الموقع" value={job.location} onChange={(value) => updateJob("location", value)} />
              <Input label="التخصص" value={job.category} onChange={(value) => updateJob("category", value)} />
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[var(--rushd-muted)]">نوع الدوام</span>
                <Select className="rounded-none" value={job.type} onChange={(event) => updateJob("type", event.target.value)}>
                  {["Remote", "Full-Time", "Part-Time", "Internship", "Contract"].map((type) => <option key={type}>{type}</option>)}
                </Select>
              </label>
            </div>
            <div className="mb-5 mt-8 flex items-center gap-3 border-b border-[var(--rushd-border)] pb-4"><Banknote className="h-5 w-5 text-[var(--rushd-accent)]" /><div><h2 className="font-bold">نطاق الراتب</h2><p className="text-sm text-[var(--rushd-muted)]">اختياري، ويمكن تركه فارغًا.</p></div></div>
            <div className="grid gap-4 md:grid-cols-2"><Input label="أقل راتب" type="number" value={job.salaryMin} onChange={(value) => updateJob("salaryMin", value)} /><Input label="أعلى راتب" type="number" value={job.salaryMax} onChange={(value) => updateJob("salaryMax", value)} /></div>
            <div className="mb-1 mt-8 flex items-center gap-3 border-b border-[var(--rushd-border)] pb-4"><FileText className="h-5 w-5 text-[var(--rushd-accent)]" /><div><h2 className="font-bold">تفاصيل الإعلان</h2><p className="text-sm text-[var(--rushd-muted)]">اكتب محتوى واضحًا وقابلًا للمسح السريع.</p></div></div>
            <Textarea label="وصف الوظيفة" value={job.description} onChange={(value) => updateJob("description", value)} required />
            <Textarea label="المتطلبات" value={job.requirements} onChange={(value) => updateJob("requirements", value)} required />
            <button disabled={saving} className="mt-6 min-h-12 bg-[var(--rushd-accent)] px-6 font-bold text-[var(--rushd-ink)] transition hover:bg-[var(--rushd-accent-2)] disabled:opacity-60">
              <Save className="ml-2 inline h-5 w-5" />
              {editId ? "حفظ التعديل" : "نشر الوظيفة"}
            </button>
          </form>
          </Card>
          <JobPostingPreview job={job} />
        </div>
    </LuxuryDashboardLayout>
  );
}

function Input({ label, value, onChange, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[var(--rushd-muted)]">{label}</span>
      <UiInput className="rounded-none" {...props} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Textarea({ label, value, onChange, ...props }) {
  return (
    <label className="mt-4 block">
      <span className="mb-2 block text-sm font-bold text-[var(--rushd-muted)]">{label}</span>
      <UiTextarea className="rounded-none" {...props} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export default JobPostingForm;
