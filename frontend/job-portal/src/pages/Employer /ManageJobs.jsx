import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, Edit, FilePlus2, Power, Search, Trash2, Users } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import LuxuryDashboardLayout from "../../components/dashboard/LuxuryDashboardLayout";
import { EmptyState, LoadingPanel } from "../../components/dashboard/DashboardWidgets";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

function ManageJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const filteredJobs = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return jobs;
    return jobs.filter((job) =>
      [job.title, job.location, job.type, job.category]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(value)),
    );
  }, [jobs, search]);

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
      actions={<Link to="/post-job" className="inline-flex min-h-12 items-center gap-2 bg-[var(--rushd-accent)] px-5 font-bold text-[var(--rushd-ink)]"><FilePlus2 className="h-5 w-5" /> نشر وظيفة</Link>}
    >
        <section className="mb-6 grid border border-[var(--rushd-border)] bg-[var(--rushd-surface)] md:grid-cols-3">
          {[
            [BriefcaseBusiness, "إجمالي الوظائف", loading ? "..." : jobs.length, "منشورة بواسطة حسابك"],
            [Power, "الوظائف المفتوحة", jobs.filter((job) => !job.isClosed).length, "تستقبل طلبات حاليًا"],
            [Users, "إجمالي المتقدمين", jobs.reduce((sum, job) => sum + (job.applicationCount || 0), 0), "عبر جميع الوظائف"],
          ].map(([Icon, label, value, hint], index) => (
            <div key={label} className={`flex items-center gap-4 p-5 ${index < 2 ? "border-b border-[var(--rushd-border)] md:border-b-0 md:border-l" : ""}`}>
              <span className="flex h-12 w-12 items-center justify-center bg-[var(--rushd-card)] text-[var(--rushd-accent)]"><Icon className="h-6 w-6" /></span>
              <span><small className="block font-bold text-[var(--rushd-muted)]">{label}</small><strong className="mt-1 block text-3xl">{value}</strong><small className="text-[var(--rushd-muted)]">{hint}</small></span>
            </div>
          ))}
        </section>

        {loading ? (
          <LoadingPanel rows={5} />
        ) : jobs.length === 0 ? (
          <EmptyState icon={FilePlus2} title="لا توجد وظائف منشورة" description="ابدأ بنشر أول وظيفة لتظهر هنا مع إحصاءات المتقدمين." action={<Link to="/post-job" className="bg-[var(--rushd-accent)] px-5 py-3 font-bold text-[var(--rushd-ink)]">نشر وظيفة</Link>} />
        ) : (
          <div className="border border-[var(--rushd-border)] bg-[var(--rushd-surface)] shadow-[0_16px_45px_var(--rushd-shadow)]">
            <div className="flex flex-col gap-3 border-b border-[var(--rushd-border)] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-sm"><Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--rushd-muted)]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث بالمسمى أو الموقع" className="h-11 w-full border border-[var(--rushd-border)] bg-[var(--rushd-card)] pr-10 pl-4 text-sm outline-none focus:border-[var(--rushd-border-strong)]" /></div>
              <p className="text-sm text-[var(--rushd-muted)]">{filteredJobs.length} من {jobs.length} وظيفة</p>
            </div>
            <Table className="min-w-[820px]">
              <TableHeader><TableRow className="bg-[var(--rushd-card)] hover:bg-[var(--rushd-card)]"><TableHead>الوظيفة</TableHead><TableHead>التفاصيل</TableHead><TableHead>الحالة</TableHead><TableHead>المتقدمون</TableHead><TableHead className="text-left">الإجراءات</TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job._id}>
                    <TableCell><strong className="block text-[var(--rushd-text)]">{job.title}</strong><small className="mt-1 block text-[var(--rushd-muted)]">{job.category || "بدون تصنيف"}</small></TableCell>
                    <TableCell><span className="block">{job.location || "غير محدد"}</span><small className="mt-1 block text-[var(--rushd-muted)]">{job.type}</small></TableCell>
                    <TableCell><Badge variant={job.isClosed ? "destructive" : "success"}>{job.isClosed ? "مغلقة" : "مفتوحة"}</Badge></TableCell>
                    <TableCell><button onClick={() => navigate(`/applicants?jobId=${job._id}`)} className="inline-flex items-center gap-2 font-bold text-[var(--rushd-accent)]"><Users className="h-4 w-4" />{job.applicationCount || 0}</button></TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <button onClick={() => navigate(`/applicants?jobId=${job._id}`)} className="employer-table-action" aria-label="عرض المتقدمين" title="عرض المتقدمين"><Users className="h-4 w-4" /></button>
                        <button onClick={() => navigate(`/post-job?edit=${job._id}`)} className="employer-table-action" aria-label="تعديل الوظيفة" title="تعديل الوظيفة"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => toggleClose(job._id)} className="employer-table-action text-[var(--rushd-accent)]" aria-label={job.isClosed ? "فتح الوظيفة" : "إغلاق الوظيفة"} title={job.isClosed ? "فتح الوظيفة" : "إغلاق الوظيفة"}><Power className="h-4 w-4" /></button>
                        <button onClick={() => deleteJob(job._id)} className="employer-table-action text-[var(--rushd-danger-text)]" aria-label="حذف الوظيفة" title="حذف الوظيفة"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredJobs.length === 0 && <div className="border-t border-[var(--rushd-border)] px-4 py-10 text-center text-sm text-[var(--rushd-muted)]">لا توجد وظائف تطابق البحث.</div>}
          </div>
        )}
    </LuxuryDashboardLayout>
  );
}

export default ManageJobs;
