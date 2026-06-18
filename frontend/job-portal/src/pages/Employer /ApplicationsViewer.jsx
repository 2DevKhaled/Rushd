import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Briefcase, CheckCircle2, Clock3, FileText, Mail, UserRound, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { BASE_URL } from "../utils/apiPaths";
import LuxuryDashboardLayout from "../../components/dashboard/LuxuryDashboardLayout";
import { EmptyState, LoadingPanel } from "../../components/dashboard/DashboardWidgets";
import { Badge } from "../../components/ui/badge";
import { Select } from "../../components/ui/select";

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

  const selectedJob = jobs.find((job) => job._id === selectedJobId);
  const stats = useMemo(
    () =>
      statuses.map((status) => ({
        status,
        count: applications.filter((application) => application.status === status).length,
      })),
    [applications],
  );

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
      eyebrow="APPLICATIONS"
      title="طلبات التقديم"
      description="راجع المتقدمين لكل وظيفة، افتح السيرة الذاتية، وحدّث حالة الطلب من مكان واحد."
      actions={
            <label className="block w-full lg:max-w-xl">
              <span className="mb-2 block text-sm font-bold text-[var(--rushd-muted)]">اختر الوظيفة</span>
              <Select
                value={selectedJobId}
                onChange={(event) => setSelectedJobId(event.target.value)}
                className="min-w-72"
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
                className={`rounded-2xl border p-5 shadow-[0_18px_50px_var(--rushd-shadow)] backdrop-blur transition hover:-translate-y-0.5 ${meta.className}`}
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-current/25 bg-[color-mix(in_oklab,currentColor_10%,transparent)]">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-3xl font-black">{count}</p>
                <p className="mt-1 text-sm font-black opacity-90">{meta.label}</p>
              </div>
            );
          })}
        </section>

        {selectedJob && (
          <div className="mb-6 rounded-2xl border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-5">
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
          <div className="grid gap-4">
            {applications.map((application) => {
              const applicant = application.applicant || {};
              const meta = statusMeta[application.status] || statusMeta.Applied;
              const StatusIcon = meta.icon;
              const resumeUrl = getResumePreviewUrl(application);

              return (
                <article
                  key={application._id}
                  className="rounded-2xl border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-5 shadow-2xl shadow-black/20"
                >
                  <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div className="flex min-w-0 items-center gap-4">
                      <img
                        src={applicant.avatar || "/favicon.svg"}
                        alt={applicant.name || "Applicant"}
                        className="h-16 w-16 rounded-xl border border-[var(--rushd-border)] object-cover"
                      />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-2xl font-black">
                            {applicant.name || "متقدم بدون اسم"}
                          </h3>
                          <Badge className={meta.className}>
                            <StatusIcon className="h-4 w-4" />
                            {meta.label}
                          </Badge>
                        </div>
                        <p className="mt-2 flex items-center gap-2 text-sm text-[var(--rushd-muted)]">
                          <Mail className="h-4 w-4 text-[var(--rushd-accent)]" />
                          {applicant.email || "لا يوجد بريد"}
                        </p>
                        <p className="mt-1 text-sm text-[var(--rushd-muted)]">
                          تاريخ التقديم: {new Date(application.createdAt).toLocaleDateString("ar")}
                        </p>
                        {application.resumeId?.title && (
                          <p className="mt-1 text-sm font-bold text-[var(--rushd-accent)]">
                            السيرة المختارة: {application.resumeId.title}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {resumeUrl ? (
                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl border border-[var(--rushd-border-strong)] px-4 py-3 text-sm font-black text-[var(--rushd-accent)] transition hover:bg-[var(--rushd-accent)] hover:text-[var(--rushd-ink)]"
                        >
                          <FileText className="ml-2 inline h-5 w-5" />
                          عرض السيرة
                        </a>
                      ) : (
                        <span className="rounded-xl border border-[var(--rushd-border)] px-4 py-3 text-sm font-bold text-[var(--rushd-muted)]">
                          لا توجد سيرة
                        </span>
                      )}
                      <Select
                        value={application.status}
                        onChange={(event) => updateStatus(application._id, event.target.value)}
                        className="w-auto"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
    </LuxuryDashboardLayout>
  );
}

export default ApplicationsViewer;
