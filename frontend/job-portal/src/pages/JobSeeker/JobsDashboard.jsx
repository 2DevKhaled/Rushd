import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookmarkCheck, BriefcaseBusiness, Filter, Loader2, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import SearchHeader from "./components/SearchHeader";
import FilterContent from "./components/FilterContent";
import JobCard from "./components/JobCard";
import LuxuryDashboardLayout from "../../components/dashboard/LuxuryDashboardLayout";
import { EmptyState, LoadingPanel, StatCard } from "../../components/dashboard/DashboardWidgets";
import { Badge } from "../../components/ui/badge";

const defaultFilters = {
  keyword: "",
  location: "",
  category: "",
  type: "",
  minSalary: "",
  maxSalary: "",
};

function JobsDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filters, setFilters] = useState(defaultFilters);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== ""),
      );

      if (user?._id) {
        params.userId = user._id;
      }

      const response = await axiosInstance.get(API_PATHS.JOBS.GET_ALL, {
        params,
      });
      setJobs(response.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "تعذر تحميل الوظائف");
    } finally {
      setLoading(false);
    }
  }, [filters, user]);

  const toggleSave = async (job) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      if (job.isSaved) {
        await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(job._id));
      } else {
        await axiosInstance.post(API_PATHS.JOBS.SAVE_JOB(job._id));
      }

      setJobs((current) =>
        current.map((item) =>
          item._id === job._id ? { ...item, isSaved: !item.isSaved } : item,
        ),
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "تعذر تحديث المحفوظات");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <LuxuryDashboardLayout
      role={user ? undefined : "public"}
      eyebrow="JOBS"
      title="ابحث عن فرصتك القادمة"
      description="استعرض الوظائف المتاحة، احفظ الفرص المناسبة، وقدّم مباشرة من منصة رُشد."
      actions={
        <Link
          to="/saved-jobs"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--rushd-border-strong)] px-4 py-3 text-sm font-black text-[var(--rushd-accent)] transition hover:bg-[var(--rushd-card)]"
        >
          <BookmarkCheck className="h-5 w-5" />
          المحفوظات
        </Link>
      }
    >
        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <StatCard icon={BriefcaseBusiness} label="نتائج البحث" value={loading ? "..." : jobs.length} hint="وظيفة مطابقة للفلاتر" />
          <StatCard icon={Filter} label="الفلاتر النشطة" value={Object.values(filters).filter(Boolean).length} hint="يمكن تعديلها فوراً" tone="blue" />
          <StatCard icon={MapPin} label="نطاق البحث" value={filters.location || "كل المواقع"} hint="حسب المدينة أو نوع الدوام" tone="green" />
        </section>
        <SearchHeader
          filters={filters}
          onChange={updateFilter}
          onSubmit={(event) => {
            event.preventDefault();
            fetchJobs();
          }}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
          <FilterContent
            filters={filters}
            onChange={updateFilter}
            onReset={() => setFilters(defaultFilters)}
          />

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black">الوظائف المتاحة</h2>
              <Badge variant="secondary">
                {jobs.length} وظيفة
              </Badge>
            </div>

            {loading ? (
              <LoadingPanel rows={5} />
            ) : jobs.length === 0 ? (
              <EmptyState icon={Loader2} title="لا توجد وظائف مطابقة" description="جرّب تغيير كلمات البحث أو الفلاتر للعثور على فرص أقرب." />
            ) : (
              <div className="grid gap-5 xl:grid-cols-2">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} onToggleSave={toggleSave} />
                ))}
              </div>
            )}
          </section>
        </div>
    </LuxuryDashboardLayout>
  );
}

export default JobsDashboard;
