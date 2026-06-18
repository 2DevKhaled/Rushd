
function RoleInfoHeader({
  role,
  topicsToFocus,
  topicsToFoucs,
  experience,
  questions,
  description,
  lastUpdated,
}) {
  const focusText = topicsToFocus || topicsToFoucs || "";

  return (
    <section dir="rtl" className="relative border-b border-[var(--rushd-border)] py-8">
      <div className="rushd-grid absolute inset-0 opacity-[0.12] [background-image:linear-gradient(var(--rushd-grid)_1px,transparent_1px),linear-gradient(90deg,var(--rushd-grid-2)_1px,transparent_1px)] [background-size:92px_92px]" />
      <div className="container relative mx-auto px-4 md:px-0">
        <div className="overflow-hidden rounded-3xl border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-6 shadow-2xl backdrop-blur md:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="font-mono text-sm font-bold text-[var(--rushd-accent)]">
                INTERVIEW_SESSION
              </p>
              <h1 className="mt-3 text-3xl font-black text-[var(--rushd-text)] md:text-5xl">
                {role || "جلسة مقابلة"}
              </h1>
              {focusText && (
                <p className="mt-3 text-lg font-semibold text-[var(--rushd-muted)]">
                  {focusText}
                </p>
              )}
              {description && (
                <p className="mt-4 max-w-2xl leading-8 text-[var(--rushd-muted)]">
                  {description}
                </p>
              )}
            </div>

            <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--rushd-border)] bg-[var(--rushd-border)] text-right sm:grid-cols-3 lg:min-w-[520px]">
              <div className="bg-[var(--rushd-surface-strong)] p-4">
                <div className="text-xs font-bold text-[var(--rushd-muted)]">الخبرة</div>
                <div className="mt-2 text-xl font-black text-[var(--rushd-text)]">
                  {experience || 0} {Number(experience) === 1 ? "سنة" : "سنوات"}
                </div>
              </div>
              <div className="bg-[var(--rushd-surface-strong)] p-4">
                <div className="text-xs font-bold text-[var(--rushd-muted)]">الأسئلة</div>
                <div className="mt-2 text-xl font-black text-[var(--rushd-accent)]">
                  {questions || 0} سؤال
                </div>
              </div>
              <div className="bg-[var(--rushd-surface-strong)] p-4">
                <div className="text-xs font-bold text-[var(--rushd-muted)]">آخر تحديث</div>
                <div className="mt-2 text-sm font-black text-[var(--rushd-text)]">
                  {lastUpdated || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RoleInfoHeader;
