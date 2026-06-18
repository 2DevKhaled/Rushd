import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bookmark, BookmarkCheck, Briefcase, FileText, Loader2, MapPin, Send, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import LuxuryDashboardLayout from "../../components/dashboard/LuxuryDashboardLayout";
import { LoadingPanel } from "../../components/dashboard/DashboardWidgets";
import { Card } from "../../components/ui/card";
import { Select } from "../../components/ui/select";

const formatSalary = (job) => {
  if (!job?.salaryMin && !job?.salaryMax) return "غير محدد";
  if (job.salaryMin && job.salaryMax) return `${job.salaryMin} - ${job.salaryMax}`;
  return job.salaryMin ? `من ${job.salaryMin}` : `حتى ${job.salaryMax}`;
};

function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");

  const fetchJob = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_ONE(jobId), {
        params: user?._id ? { userId: user._id } : {},
      });
      setJob(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "تعذر تحميل تفاصيل الوظيفة");
      navigate("/find-jobs");
    } finally {
      setLoading(false);
    }
  }, [jobId, navigate, user]);

  const toggleSave = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setSaving(true);
      if (job.isSaved) {
        await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(job._id));
      } else {
        await axiosInstance.post(API_PATHS.JOBS.SAVE_JOB(job._id));
      }
      setJob((current) => ({ ...current, isSaved: !current.isSaved }));
    } catch (error) {
      toast.error(error.response?.data?.message || "تعذر تحديث المحفوظات");
    } finally {
      setSaving(false);
    }
  };

  const applyToJob = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "jobseeker") {
      toast.error("التقديم متاح لحساب الباحث عن عمل فقط");
      return;
    }

    if (!selectedResumeId) {
      toast.error("اختر سيرة ذاتية للتقديم");
      return;
    }

    try {
      setApplying(true);
      const response = await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY(job._id), {
        resumeId: selectedResumeId,
      });
      setJob((current) => ({ ...current, applicationStatus: response.data.status || "Applied" }));
      toast.success("تم التقديم على الوظيفة");
    } catch (error) {
      toast.error(error.response?.data?.message || "تعذر التقديم على الوظيفة");
    } finally {
      setApplying(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  useEffect(() => {
    if (!user || user.role !== "jobseeker") return;

    const fetchResumes = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.RESUMES.GET_MY);
        const myResumes = response.data?.resumes || [];
        setResumes(myResumes);
        setSelectedResumeId((current) => current || myResumes[0]?._id || "");
      } catch (error) {
        toast.error(error.response?.data?.message || "تعذر تحميل السير الذاتية");
      }
    };

    fetchResumes();
  }, [user]);

  if (loading) {
    return (
      <LuxuryDashboardLayout role={user ? undefined : "public"} title="تفاصيل الوظيفة" eyebrow="LOADING">
        <LoadingPanel rows={5} />
      </LuxuryDashboardLayout>
    );
  }

  const companyName = job.company?.companyName || job.company?.name || "شركة";

  return (
    <LuxuryDashboardLayout
      role={user ? undefined : "public"}
      eyebrow="JOB DETAILS"
      title={job.title}
      description={`${companyName} • ${job.location || "غير محدد"} • ${job.type || "نوع غير محدد"}`}
      actions={<button type="button" onClick={() => navigate("/find-jobs")} className="rounded-xl border border-[var(--rushd-border)] px-4 py-3 text-sm font-black text-[var(--rushd-muted)]">العودة للوظائف</button>}
      maxWidth="max-w-6xl"
    >
        <section className="rounded-2xl border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-6 shadow-2xl shadow-black/30">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
            <div className="flex gap-4">
              <img
                src={job.company?.companyLogo || "/favicon.svg"}
                alt={companyName}
                className="h-16 w-16 rounded-xl border border-[var(--rushd-border)] object-cover"
              />
              <div>
                <p className="font-bold text-[var(--rushd-muted)]">{companyName}</p>
                <h1 className="mt-2 text-4xl font-black">{job.title}</h1>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={toggleSave}
                disabled={saving}
                className="rounded-xl border border-[var(--rushd-border-strong)] px-5 py-3 font-black text-[var(--rushd-accent)] transition hover:bg-[var(--rushd-card)]"
              >
                {job.isSaved ? <BookmarkCheck className="ml-2 inline h-5 w-5" /> : <Bookmark className="ml-2 inline h-5 w-5" />}
                {job.isSaved ? "محفوظة" : "حفظ"}
              </button>
              <button
                type="button"
                onClick={applyToJob}
                disabled={applying || Boolean(job.applicationStatus) || resumes.length === 0}
                className="rounded-xl bg-[linear-gradient(145deg,var(--rushd-accent-2),var(--rushd-accent))] px-6 py-3 font-black text-[var(--rushd-ink)] transition hover:-translate-y-0.5 disabled:opacity-55"
              >
                {applying ? <Loader2 className="ml-2 inline h-5 w-5 animate-spin" /> : <Send className="ml-2 inline h-5 w-5" />}
                {job.applicationStatus ? `تم التقديم: ${job.applicationStatus}` : "تقديم الآن"}
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <Info icon={MapPin} label="الموقع" value={job.location || "غير محدد"} />
            <Info icon={Briefcase} label="النوع" value={`${job.type}${job.category ? ` • ${job.category}` : ""}`} />
            <Info icon={Wallet} label="الراتب" value={formatSalary(job)} />
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card className="p-6 leading-8 text-[var(--rushd-text)]">
            <h2 className="mb-4 text-2xl font-black text-[var(--rushd-text)]">وصف الوظيفة</h2>
            <p className="whitespace-pre-line">{job.description}</p>

            <h2 className="mb-4 mt-8 text-2xl font-black text-[var(--rushd-text)]">المتطلبات</h2>
            <p className="whitespace-pre-line">{job.requirements}</p>
          </Card>

          <aside className="self-start rounded-2xl border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-6">
            <h2 className="text-xl font-black">عن الشركة</h2>
            <p className="mt-3 font-bold text-[var(--rushd-accent)]">{companyName}</p>
            <p className="mt-3 leading-7 text-[var(--rushd-muted)]">
              {job.company?.companyDescription || "لم تضف الشركة وصفاً بعد."}
            </p>

            {user?.role === "jobseeker" && !job.applicationStatus && (
              <div className="mt-6 rounded-xl border border-[var(--rushd-border-strong)] bg-[var(--rushd-card)] p-4">
                <h3 className="flex items-center gap-2 font-black text-[var(--rushd-accent)]">
                  <FileText className="h-5 w-5" />
                  السيرة المستخدمة للتقديم
                </h3>
                {resumes.length === 0 ? (
                  <div>
                    <p className="mt-3 text-sm leading-7 text-[var(--rushd-muted)]">
                      تحتاج إنشاء سيرة ذاتية قبل التقديم على الوظائف.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate("/resume-builder")}
                      className="mt-4 rounded-xl bg-[var(--rushd-accent-2)] px-4 py-3 text-sm font-black text-[var(--rushd-ink)]"
                    >
                      إنشاء سيرة الآن
                    </button>
                  </div>
                ) : (
                  <Select
                    value={selectedResumeId}
                    onChange={(event) => setSelectedResumeId(event.target.value)}
                    className="mt-3"
                  >
                    {resumes.map((resume) => (
                      <option key={resume._id} value={resume._id}>
                        {resume.title}
                      </option>
                    ))}
                  </Select>
                )}
                <p className="mt-3 text-xs leading-6 text-[var(--rushd-muted)]">
                  سيتم مشاركة رابط معاينة السيرة المختارة مع صاحب العمل.
                </p>
              </div>
            )}
          </aside>
        </section>
    </LuxuryDashboardLayout>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-[var(--rushd-border)] bg-[var(--rushd-card)] p-4">
      <Icon className="mb-3 h-5 w-5 text-[var(--rushd-accent)]" />
      <p className="text-xs font-bold text-[var(--rushd-muted)]">{label}</p>
      <p className="mt-1 font-black">{value}</p>
    </div>
  );
}

export default JobDetails;
