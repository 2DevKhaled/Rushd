import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookmarkCheck, BriefcaseBusiness } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import JobCard from "./components/JobCard";
import LuxuryDashboardLayout from "../../components/dashboard/LuxuryDashboardLayout";
import { EmptyState, LoadingPanel } from "../../components/dashboard/DashboardWidgets";

function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.SAVED_JOBS.MY);
      setJobs((response.data || []).filter((item) => item.job).map((item) => ({ ...item.job, isSaved: true })));
    } catch (error) {
      toast.error(error.response?.data?.message || "تعذر تحميل الوظائف المحفوظة");
    } finally {
      setLoading(false);
    }
  };

  const unsaveJob = async (job) => {
    try {
      await axiosInstance.delete(API_PATHS.SAVED_JOBS.UNSAVE(job._id));
      setJobs((current) => current.filter((item) => item._id !== job._id));
    } catch (error) {
      toast.error(error.response?.data?.message || "تعذر إزالة الوظيفة");
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  return (
    <LuxuryDashboardLayout
      eyebrow="قائمتك المختارة"
      title="الوظائف المحفوظة"
      description="قائمة فرصك المختارة للرجوع إليها والتقديم عليها في الوقت المناسب."
      actions={<Link to="/find-jobs" className="inline-flex min-h-12 items-center border border-[var(--rushd-border-strong)] px-4 text-sm font-bold text-[var(--rushd-accent)]">استعراض الوظائف</Link>}
    >
        <section className="mb-6 grid border border-[var(--rushd-border)] bg-[var(--rushd-surface)] md:grid-cols-2">
          <div className="flex items-center gap-4 border-b border-[var(--rushd-border)] p-5 md:border-b-0 md:border-l"><span className="flex h-11 w-11 items-center justify-center bg-[var(--rushd-card)] text-[var(--rushd-accent)]"><BookmarkCheck className="h-5 w-5" /></span><span><small className="text-[var(--rushd-muted)]">المحفوظات</small><strong className="block text-2xl">{loading ? "..." : jobs.length}</strong></span></div>
          <div className="flex items-center gap-4 p-5"><span className="flex h-11 w-11 items-center justify-center bg-[var(--rushd-card)] text-[var(--rushd-accent)]"><BriefcaseBusiness className="h-5 w-5" /></span><span><small className="text-[var(--rushd-muted)]">الخطوة التالية</small><strong className="block text-lg">افتح التفاصيل واختر سيرتك</strong></span></div>
        </section>

        {loading ? (
          <LoadingPanel rows={4} />
        ) : jobs.length === 0 ? (
          <EmptyState icon={BookmarkCheck} title="لا توجد وظائف محفوظة" description="احفظ الوظائف المناسبة وستظهر هنا." action={<Link to="/find-jobs" className="bg-[var(--rushd-accent)] px-5 py-3 font-bold text-[var(--rushd-ink)]">البحث عن وظائف</Link>} />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} onToggleSave={unsaveJob} />
            ))}
          </div>
        )}
    </LuxuryDashboardLayout>
  );
}

export default SavedJobs;
