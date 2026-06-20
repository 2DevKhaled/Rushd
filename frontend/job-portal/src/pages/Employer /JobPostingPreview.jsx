function JobPostingPreview({ job }) {
  return (
    <aside className="self-start border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-5 shadow-[0_18px_55px_var(--rushd-shadow)] xl:sticky xl:top-28">
      <div className="flex items-center justify-between border-b border-[var(--rushd-border)] pb-4"><p className="text-xs font-bold text-[var(--rushd-accent)]">معاينة الإعلان</p><span className="h-2 w-2 bg-[var(--rushd-accent)]" /></div>
      <h2 className="mt-6 text-2xl font-bold">{job.title || "المسمى الوظيفي"}</h2>
      <p className="mt-2 text-sm text-[var(--rushd-muted)]">
        {job.location || "الموقع"} • {job.type || "نوع الدوام"} {job.category && `• ${job.category}`}
      </p>
      <div className="mt-6 border-t border-[var(--rushd-border)] pt-5">
        <h3 className="font-bold">عن الوظيفة</h3>
        <p className="mt-2 whitespace-pre-line leading-7 text-[var(--rushd-muted)]">
          {job.description || "اكتب وصف الوظيفة هنا..."}
        </p>
      </div>
      <div className="mt-5 border-t border-[var(--rushd-border)] pt-5">
        <h3 className="font-bold">المتطلبات</h3>
        <p className="mt-2 whitespace-pre-line leading-7 text-[var(--rushd-muted)]">
          {job.requirements || "اكتب المتطلبات هنا..."}
        </p>
      </div>
      <p className="mt-6 bg-[var(--rushd-card)] px-4 py-3 text-sm font-bold text-[var(--rushd-accent)]">
        الراتب: {job.salaryMin || "-"} - {job.salaryMax || "-"}
      </p>
    </aside>
  );
}

export default JobPostingPreview;
