import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Save } from "lucide-react";
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
      eyebrow={editId ? "EDIT JOB" : "POST JOB"}
      title={editId ? "تعديل وظيفة" : "نشر وظيفة جديدة"}
      description="صمم إعلان وظيفة واضحاً، منظماً، وجاهزاً للعرض على الباحثين عن عمل."
    >
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_420px]">
          <Card className="p-6">
          <form onSubmit={submitJob}>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="المسمى الوظيفي" value={job.title} onChange={(value) => updateJob("title", value)} required />
              <Input label="الموقع" value={job.location} onChange={(value) => updateJob("location", value)} />
              <Input label="التخصص" value={job.category} onChange={(value) => updateJob("category", value)} />
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[var(--rushd-muted)]">نوع الدوام</span>
                <Select value={job.type} onChange={(event) => updateJob("type", event.target.value)}>
                  {["Remote", "Full-Time", "Part-Time", "Internship", "Contract"].map((type) => <option key={type}>{type}</option>)}
                </Select>
              </label>
              <Input label="أقل راتب" type="number" value={job.salaryMin} onChange={(value) => updateJob("salaryMin", value)} />
              <Input label="أعلى راتب" type="number" value={job.salaryMax} onChange={(value) => updateJob("salaryMax", value)} />
            </div>
            <Textarea label="وصف الوظيفة" value={job.description} onChange={(value) => updateJob("description", value)} required />
            <Textarea label="المتطلبات" value={job.requirements} onChange={(value) => updateJob("requirements", value)} required />
            <button disabled={saving} className="mt-5 rounded-xl bg-[linear-gradient(145deg,var(--rushd-accent-2),var(--rushd-accent))] px-6 py-3 font-black text-[var(--rushd-ink)] transition hover:-translate-y-0.5 disabled:opacity-60">
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
      <UiInput {...props} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Textarea({ label, value, onChange, ...props }) {
  return (
    <label className="mt-4 block">
      <span className="mb-2 block text-sm font-bold text-[var(--rushd-muted)]">{label}</span>
      <UiTextarea {...props} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export default JobPostingForm;
