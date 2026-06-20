import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Briefcase, CheckCircle2, Clock3, ExternalLink, FileText, Search, UserRound, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { BASE_URL } from "../utils/apiPaths";
import LuxuryDashboardLayout from "../../components/dashboard/LuxuryDashboardLayout";
import { EmptyState, LoadingPanel } from "../../components/dashboard/DashboardWidgets";
import { Badge } from "../../components/ui/badge";
import { Select } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

const statuses = ["Applied", "In Review", "Accepted", "Rejected"];

const statusMeta = {
  Applied: {
    label: "تم التقديم",
    className: "border-[var(--rushd-info-border)] bg-[var(--rushd-info-bg)] text-[var(--rushd-info-text)]",
    icon: Clock3,
  },
  "In Review": {
    label: "قيد المراجعة",
    className: "border-[var(--rushd-warning-border)] bg-[var(--rushd-warning-bg)] text-[var(--rushd-warning-text)]",
    icon: Briefcase,
  },
  Accepted: {
    label: "مقبول",
    className: "border-[var(--rushd-success-border)] bg-[var(--rushd-success-bg)] text-[var(--rushd-success-text)]",
    icon: CheckCircle2,
  },
  Rejected: {
    label: "مرفوض",
    className: "border-[var(--rushd-danger-border)] bg-[var(--rushd-danger-bg)] text-[var(--rushd-danger-text)]",
    icon: XCircle,
  },
};

function ApplicationsViewer() {
  const [searchParams] = useSearchParams();
  const initialJobId = searchParams.get("jobId") || "";
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const selectedJob = jobs.find((job) => job._id === selectedJobId);
  const stats = useMemo(
    () =>
      statuses.map((status) => ({
        status,
        count: applications.filter((application) => application.status === status).length,
      })),
    [applications],
  );
  const filteredApplications = useMemo(() => {
    const value = search.trim().toLowerCase();
    return applications.filter((application) => {
      const applicant = application.applicant || {};
      const matchesSearch = !value || [applicant.name, applicant.email, application.resumeId?.title]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(value));
      const matchesStatus = statusFilter === "All" || application.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  const fetchEmployerJobs = useCallback(async () => {
    const response = await axiosInstance.get(API_PATHS.JOBS.EMPLOYER_JOBS);
    setJobs(response.data || []);
    if (!selectedJobId && response.data?.[0]?._id) {
      setSelectedJobId(response.data[0]._id);
    }
  }, [selectedJobId]);

  const fetchApplications = async (jobId) => {
    if (!jobId) {
      setApplications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.APPLICATIONS.FOR_JOB(jobId));
      setApplications(response.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "تعذر تحميل المتقدمين");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      const response = await axiosInstance.put(API_PATHS.APPLICATIONS.UPDATE_STATUS(applicationId), { status });
      setApplications((current) =>
        current.map((item) => (item._id === applicationId ? response.data : item)),
      );
      toast.success("تم تحديث الحالة");
    } catch (error) {
      toast.error(error.response?.data?.message || "تعذر تحديث الحالة");
    }
  };

  const getResumePreviewUrl = (application) => {
    if (application.resumeId?._id) {
      return `${window.location.origin}/resume-builder/view/${application.resumeId._id}`;
    }

    if (application.resume?.startsWith("/api/")) {
      return `${BASE_URL}${application.resume}`;
    }

    return application.resume || application.applicant?.resume || "";
  };

  useEffect(() => {
    fetchEmployerJobs().catch((error) => {
      toast.error(error.response?.data?.message || "تعذر تحميل الوظائف");
      setLoading(false);
    });
  }, [fetchEmployerJobs]);

  useEffect(() => {
    fetchApplications(selectedJobId);
  }, [selectedJobId]);

  return (
    <LuxuryDashboardLayout
      role="employer"
      eyebrow="إدارة المرشحين"
      title="طلبات التقديم"
      description="راجع المتقدمين لكل وظيفة، افتح السيرة الذاتية، وحدّث حالة الطلب من مكان واحد."
      actions={
            <label className="block w-full lg:max-w-xl">
              <span className="mb-2 block text-sm font-bold text-[var(--rushd-muted)]">اختر الوظيفة</span>
              <Select
                value={selectedJobId}
                onChange={(event) => setSelectedJobId(event.target.value)}
                className="min-w-72 rounded-none"
              >
                <option value="">اختر وظيفة لعرض المتقدمين</option>
                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title}
                  </option>
                ))}
              </Select>
            </label>
      }
    >

        <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ status, count }) => {
            const meta = statusMeta[status];
            const Icon = meta.icon;
            return (
              <div
                key={status}
                className={`border p-5 shadow-[0_18px_50px_var(--rushd-shadow)] transition ${meta.className}`}
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center border border-current/25 bg-[color-mix(in_oklab,currentColor_10%,transparent)]">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-3xl font-black">{count}</p>
                <p className="mt-1 text-sm font-black opacity-90">{meta.label}</p>
              </div>
            );
          })}
        </section>

        {selectedJob && (
          <div className="mb-6 border border-[var(--rushd-border)] border-r-4 border-r-[var(--rushd-accent)] bg-[var(--rushd-surface)] p-5">
            <p className="text-sm font-bold text-[var(--rushd-muted)]">الوظيفة الحالية</p>
            <h2 className="mt-1 text-2xl font-black">{selectedJob.title}</h2>
            <p className="mt-2 text-[var(--rushd-muted)]">
              {selectedJob.location || "غير محدد"} • {selectedJob.type} • {applications.length} متقدم
            </p>
          </div>
        )}

        {loading ? (
          <LoadingPanel rows={5} />
        ) : applications.length === 0 ? (
          <EmptyState icon={UserRound} title="لا توجد طلبات حتى الآن" description="عند وصول متقدمين لهذه الوظيفة سيظهرون هنا." />
        ) : (
          <div className="border border-[var(--rushd-border)] bg-[var(--rushd-surface)] shadow-[0_16px_45px_var(--rushd-shadow)]">
            <div className="grid gap-3 border-b border-[var(--rushd-border)] p-4 md:grid-cols-[1fr_220px_auto] md:items-center">
              <div className="relative"><Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--rushd-muted)]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث بالاسم أو البريد" className="h-11 w-full border border-[var(--rushd-border)] bg-[var(--rushd-card)] pr-10 pl-4 text-sm outline-none focus:border-[var(--rushd-border-strong)]" /></div>
              <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-none"><option value="All">كل الحالات</option>{statuses.map((status) => <option key={status} value={status}>{statusMeta[status].label}</option>)}</Select>
              <p className="text-sm text-[var(--rushd-muted)]">{filteredApplications.length} متقدم</p>
            </div>
            <Table className="min-w-[980px]">
              <TableHeader><TableRow className="bg-[var(--rushd-card)] hover:bg-[var(--rushd-card)]"><TableHead>المتقدم</TableHead><TableHead>البريد الإلكتروني</TableHead><TableHead>تاريخ التقديم</TableHead><TableHead>السيرة الذاتية</TableHead><TableHead>الحالة</TableHead><TableHead className="text-left">فتح</TableHead></TableRow></TableHeader>
              <TableBody>
            {filteredApplications.map((application) => {
              const applicant = application.applicant || {};
              const meta = statusMeta[application.status] || statusMeta.Applied;
              const StatusIcon = meta.icon;
              const resumeUrl = getResumePreviewUrl(application);

              return (
                <TableRow key={application._id}>
                  <TableCell><div className="flex items-center gap-3"><img src={applicant.avatar || "/favicon.svg"} alt={applicant.name || "متقدم"} className="h-10 w-10 border border-[var(--rushd-border)] object-cover" /><div><strong className="block">{applicant.name || "متقدم بدون اسم"}</strong><small className="text-[var(--rushd-muted)]">{application.resumeId?.title || "طلب توظيف"}</small></div></div></TableCell>
                  <TableCell className="text-[var(--rushd-muted)]" dir="ltr">{applicant.email || "لا يوجد بريد"}</TableCell>
                  <TableCell>{new Date(application.createdAt).toLocaleDateString("ar")}</TableCell>
                  <TableCell>{resumeUrl ? <a href={resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-bold text-[var(--rushd-accent)]"><FileText className="h-4 w-4" />عرض السيرة</a> : <span className="text-[var(--rushd-muted)]">غير مرفقة</span>}</TableCell>
                  <TableCell><div className="flex items-center gap-2"><Badge className={meta.className}><StatusIcon className="h-4 w-4" />{meta.label}</Badge><Select value={application.status} onChange={(event) => updateStatus(application._id, event.target.value)} className="h-9 w-36 rounded-none">{statuses.map((status) => <option key={status} value={status}>{statusMeta[status].label}</option>)}</Select></div></TableCell>
                  <TableCell>{resumeUrl ? <a href={resumeUrl} target="_blank" rel="noreferrer" className="employer-table-action mr-auto" aria-label="فتح السيرة" title="فتح السيرة"><ExternalLink className="h-4 w-4" /></a> : <span className="block h-9 w-9" />}</TableCell>
                </TableRow>
              );
            })}
              </TableBody>
            </Table>
            {filteredApplications.length === 0 && <div className="border-t border-[var(--rushd-border)] px-4 py-10 text-center text-sm text-[var(--rushd-muted)]">لا توجد نتائج تطابق البحث والفلتر.</div>}
          </div>
        )}
    </LuxuryDashboardLayout>
  );
}

export default ApplicationsViewer;
