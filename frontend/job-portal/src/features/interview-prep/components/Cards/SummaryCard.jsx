import { Trash2 } from "lucide-react";
import { getInitials } from "../../utils/helper";

const SummaryCard = ({
  role,
  topicsToFoucs,
  experience,
  description,
  lastUpdated,
  onSelect,
  onDelete,
}) => {
  return (
    <div
      dir="rtl"
      onClick={onSelect}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-5 shadow-2xl transition duration-300 hover:-translate-y-1 hover:border-[var(--rushd-border-strong)] hover:shadow-[0_22px_80px_var(--rushd-glow)]"
    >
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(var(--rushd-grid)_1px,transparent_1px),linear-gradient(90deg,var(--rushd-grid-2)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative mb-5 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(145deg,var(--rushd-accent-2),var(--rushd-accent))] text-lg font-black text-[var(--rushd-ink)] shadow-inner">
          {getInitials(role)}
        </div>
        <div className="min-w-0 flex-grow">
          <h2 className="truncate text-lg font-black text-[var(--rushd-text)]">{role}</h2>
          <p className="mt-1 line-clamp-1 text-sm text-[var(--rushd-muted)]">
            {topicsToFoucs}
          </p>
        </div>
      </div>

      <button
        className="absolute left-4 top-4 hidden items-center gap-2 rounded-lg border border-red-300/20 bg-red-400/10 px-3 py-2 text-sm font-bold text-red-200 transition hover:bg-red-400/20 group-hover:flex"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <div className="relative flex flex-wrap gap-2">
        <span className="border border-[var(--rushd-border)] bg-[var(--rushd-card)] px-3 py-1.5 text-xs font-bold text-[var(--rushd-text)]">
          الخبرة: {experience} {experience === 1 ? "سنة" : "سنوات"}
        </span>
        <span className="border border-[var(--rushd-border)] bg-[var(--rushd-card)] px-3 py-1.5 text-xs font-bold text-[var(--rushd-text)]">
          آخر تحديث: {lastUpdated}
        </span>
      </div>

      <p className="relative mt-4 line-clamp-2 text-sm leading-7 text-[var(--rushd-muted)]">
        {description || "جلسة تدريب مقابلة مخصصة ضمن رُشد."}
      </p>
    </div>
  );
};

export default SummaryCard;
