import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookmarkCheck, BriefcaseBusiness } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import JobCard from "./components/JobCard";
import LuxuryDashboardLayout from "../../components/dashboard/LuxuryDashboardLayout";
import { EmptyState, LoadingPanel, StatCard } from "../../components/dashboard/DashboardWidgets";

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
      eyebrow="SAVED"
      title="الوظائف المحفوظة"
      description="قائمة فرصك المختارة للرجوع إليها والتقديم عليها في الوقت المناسب."
      actions={<Link to="/find-jobs" className="rounded-xl border border-[var(--rushd-border-strong)] px-4 py-3 text-sm font-black text-[var(--rushd-accent)]">استعراض الوظائف</Link>}
    >
        <section className="mb-6 grid gap-4 md:grid-cols-2">
          <StatCard icon={BookmarkCheck} label="المحفوظات" value={loading ? "..." : jobs.length} hint="وظائف محفوظة في حسابك" />
          <StatCard icon={BriefcaseBusiness} label="الإجراء التالي" value="تقديم" hint="افتح التفاصيل واختر سيرتك" tone="blue" />
        </section>

        {loading ? (
          <LoadingPanel rows={4} />
        ) : jobs.length === 0 ? (
          <EmptyState icon={BookmarkCheck} title="لا توجد وظائف محفوظة" description="احفظ الوظائف المناسبة وستظهر هنا." action={<Link to="/find-jobs" className="rounded-xl bg-[var(--rushd-accent-2)] px-5 py-3 font-black text-[var(--rushd-ink)]">البحث عن وظائف</Link>} />
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
