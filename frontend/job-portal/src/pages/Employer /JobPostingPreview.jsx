function JobPostingPreview({ job }) {
  return (
    <aside className="self-start rounded-2xl border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-5 shadow-2xl shadow-black/20">
      <p className="font-mono text-xs font-black text-[var(--rushd-accent)]">PREVIEW</p>
      <h2 className="mt-3 text-2xl font-black">{job.title || "Job Title"}</h2>
      <p className="mt-2 text-sm text-[var(--rushd-muted)]">
        {job.location || "Location"} • {job.type || "Type"} {job.category && `• ${job.category}`}
      </p>
      <div className="mt-5 rounded-xl border border-[var(--rushd-border)] bg-[var(--rushd-card)] p-4">
        <h3 className="font-black">الوصف</h3>
        <p className="mt-2 whitespace-pre-line leading-7 text-[var(--rushd-muted)]">
          {job.description || "اكتب وصف الوظيفة هنا..."}
        </p>
      </div>
      <div className="mt-4 rounded-xl border border-[var(--rushd-border)] bg-[var(--rushd-card)] p-4">
        <h3 className="font-black">المتطلبات</h3>
        <p className="mt-2 whitespace-pre-line leading-7 text-[var(--rushd-muted)]">
          {job.requirements || "اكتب المتطلبات هنا..."}
        </p>
      </div>
      <p className="mt-4 text-sm font-bold text-[var(--rushd-accent)]">
        الراتب: {job.salaryMin || "-"} - {job.salaryMax || "-"}
      </p>
    </aside>
  );
}

export default JobPostingPreview;
