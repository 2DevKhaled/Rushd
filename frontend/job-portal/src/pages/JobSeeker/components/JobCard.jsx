import { Bookmark, BookmarkCheck, Briefcase, MapPin, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

const formatSalary = (job) => {
  if (!job?.salaryMin && !job?.salaryMax) return "غير محدد";
  if (job.salaryMin && job.salaryMax) return `${job.salaryMin} - ${job.salaryMax}`;
  return job.salaryMin ? `من ${job.salaryMin}` : `حتى ${job.salaryMax}`;
};

const applicationStatusClass = {
  Applied: "border-[var(--rushd-info-border)] bg-[var(--rushd-info-bg)] text-[var(--rushd-info-text)]",
  "In Review": "border-[var(--rushd-warning-border)] bg-[var(--rushd-warning-bg)] text-[var(--rushd-warning-text)]",
  Accepted: "border-[var(--rushd-success-border)] bg-[var(--rushd-success-bg)] text-[var(--rushd-success-text)]",
  Rejected: "border-[var(--rushd-danger-border)] bg-[var(--rushd-danger-bg)] text-[var(--rushd-danger-text)]",
};

function JobCard({ job, onToggleSave }) {
  const navigate = useNavigate();
  const companyName = job.company?.companyName || job.company?.name || "شركة";
  const statusClass = job.applicationStatus
    ? applicationStatusClass[job.applicationStatus] || "border-[var(--rushd-badge-border)] bg-[var(--rushd-badge-bg)] text-[var(--rushd-badge-text)]"
    : "border-[var(--rushd-badge-border)] bg-[var(--rushd-badge-bg)] text-[var(--rushd-badge-text)]";

  return (
    <article className="group rounded-2xl border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-5 text-right shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-[var(--rushd-border-strong)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={job.company?.companyLogo || "/favicon.svg"}
            alt={companyName}
            className="h-12 w-12 rounded-xl border border-[var(--rushd-border)] object-cover"
          />
          <div>
            <p className="text-sm font-bold text-[var(--rushd-muted)]">{companyName}</p>
            <h3 className="mt-1 text-xl font-black text-[var(--rushd-text)]">{job.title}</h3>
          </div>
        </div>
        {onToggleSave && (
          <button
            type="button"
            onClick={() => onToggleSave(job)}
            className="rounded-xl border border-[var(--rushd-border)] p-3 text-[var(--rushd-accent)] transition hover:bg-[var(--rushd-accent)] hover:text-[var(--rushd-ink)]"
            aria-label={job.isSaved ? "إزالة من المحفوظات" : "حفظ الوظيفة"}
          >
            {job.isSaved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
          </button>
        )}
      </div>

      <p className="line-clamp-3 min-h-16 leading-7 text-[var(--rushd-muted)]">{job.description}</p>

      <div className="mt-5 grid gap-2 text-sm text-[var(--rushd-muted)]">
        <span className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[var(--rushd-accent)]" />
          {job.location || "غير محدد"}
        </span>
        <span className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-[var(--rushd-accent)]" />
          {job.type} {job.category && `• ${job.category}`}
        </span>
        <span className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-[var(--rushd-accent)]" />
          {formatSalary(job)}
        </span>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <span className={`rounded-full border px-3.5 py-1.5 text-xs font-black ${statusClass}`}>
          {job.applicationStatus ? `حالة التقديم: ${job.applicationStatus}` : "متاح للتقديم"}
        </span>
        <button
          type="button"
          onClick={() => navigate(`/job/${job._id}`)}
          className="rounded-xl bg-[var(--rushd-accent-2)] px-5 py-3 text-sm font-black text-[var(--rushd-ink)] transition group-hover:bg-[var(--rushd-accent-2)]"
        >
          التفاصيل
        </button>
      </div>
    </article>
  );
}

export default JobCard;
