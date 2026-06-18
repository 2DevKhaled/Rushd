import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, Edit, FilePlus2, Power, Trash2, Users } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import LuxuryDashboardLayout from "../../components/dashboard/LuxuryDashboardLayout";
import { EmptyState, LoadingPanel, StatCard } from "../../components/dashboard/DashboardWidgets";
import { Badge } from "../../components/ui/badge";

function ManageJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.JOBS.EMPLOYER_JOBS);
      setJobs(response.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "تعذر تحميل وظائفك");
    } finally {
      setLoading(false);
    }
  };

  const toggleClose = async (jobId) => {
    try {
      await axiosInstance.put(API_PATHS.JOBS.TOGGLE_CLOSE(jobId));
      fetchJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || "تعذر تحديث حالة الوظيفة");
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm("هل تريد حذف الوظيفة؟")) return;
    try {
      await axiosInstance.delete(API_PATHS.JOBS.DELETE(jobId));
      setJobs((current) => current.filter((job) => job._id !== jobId));
      toast.success("تم حذف الوظيفة");
    } catch (error) {
      toast.error(error.response?.data?.message || "تعذر حذف الوظيفة");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <LuxuryDashboardLayout
      role="employer"
      eyebrow="JOBS CONTROL"
      title="إدارة الوظائف"
      description="راجع وظائفك المنشورة، افتح أو أغلق الفرص، وانتقل للمتقدمين من جدول واضح."
      actions={<Link to="/post-job" className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(145deg,var(--rushd-accent-2),var(--rushd-accent))] px-5 py-3 font-black text-[var(--rushd-ink)]"><FilePlus2 className="h-5 w-5" /> نشر وظيفة</Link>}
    >
        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <StatCard icon={BriefcaseBusiness} label="إجمالي الوظائف" value={loading ? "..." : jobs.length} hint="منشورة بواسطة حسابك" />
          <StatCard icon={Power} label="المفتوحة" value={jobs.filter((job) => !job.isClosed).length} hint="تستقبل طلبات حالياً" tone="green" />
          <StatCard icon={Users} label="إجمالي المتقدمين" value={jobs.reduce((sum, job) => sum + (job.applicationCount || 0), 0)} hint="عبر كل الوظائف" tone="blue" />
        </section>

        {loading ? (
          <LoadingPanel rows={5} />
        ) : jobs.length === 0 ? (
          <EmptyState icon={FilePlus2} title="لا توجد وظائف منشورة" description="ابدأ بنشر أول وظيفة لتظهر هنا مع إحصاءات المتقدمين." action={<Link to="/post-job" className="rounded-xl bg-[var(--rushd-accent-2)] px-5 py-3 font-black text-[var(--rushd-ink)]">نشر وظيفة</Link>} />
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <article key={job._id} className="rounded-2xl border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-5 shadow-2xl shadow-black/20">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-black">{job.title}</h2>
                      <Badge variant={job.isClosed ? "destructive" : "success"}>
                        {job.isClosed ? "مغلقة" : "مفتوحة"}
                      </Badge>
                    </div>
                    <p className="mt-2 text-[var(--rushd-muted)]">{job.location || "غير محدد"} • {job.type} • {job.applicationCount || 0} متقدم</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => navigate(`/applicants?jobId=${job._id}`)} className="rounded-xl border border-[var(--rushd-border)] px-4 py-3 text-sm font-black text-[var(--rushd-muted)] transition hover:bg-[var(--rushd-card)]">
                      <Users className="ml-2 inline h-5 w-5" />
                      المتقدمون
                    </button>
                    <button onClick={() => navigate(`/post-job?edit=${job._id}`)} className="rounded-xl border border-[var(--rushd-border)] px-4 py-3 text-sm font-black text-[var(--rushd-muted)] transition hover:bg-[var(--rushd-card)]">
                      <Edit className="ml-2 inline h-5 w-5" />
                      تعديل
                    </button>
                    <button onClick={() => toggleClose(job._id)} className="rounded-xl border border-[var(--rushd-border-strong)] px-4 py-3 text-sm font-black text-[var(--rushd-accent)] transition hover:bg-[var(--rushd-card)]">
                      <Power className="ml-2 inline h-5 w-5" />
                      {job.isClosed ? "فتح" : "إغلاق"}
                    </button>
                    <button onClick={() => deleteJob(job._id)} className="rounded-xl border border-red-300/20 px-4 py-3 text-sm font-black text-red-200 transition hover:bg-red-500/10">
                      <Trash2 className="ml-2 inline h-5 w-5" />
                      حذف
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
    </LuxuryDashboardLayout>
  );
}

export default ManageJobs;
