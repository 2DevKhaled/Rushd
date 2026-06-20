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
      className="group relative cursor-pointer overflow-hidden border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-5 shadow-[0_16px_45px_var(--rushd-shadow)] transition duration-300 hover:border-[var(--rushd-border-strong)]"
    >
      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[var(--rushd-accent)] text-lg font-bold text-[var(--rushd-ink)]">
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
        className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center border border-[var(--rushd-danger-border)] text-[var(--rushd-danger-text)] transition hover:bg-[var(--rushd-danger-bg)]"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 className="h-4 w-4" /><span className="sr-only">حذف الجلسة</span>
      </button>

      <div className="flex flex-wrap gap-2">
        <span className="border border-[var(--rushd-border)] bg-[var(--rushd-card)] px-3 py-1.5 text-xs font-bold text-[var(--rushd-text)]">
          الخبرة: {experience} {experience === 1 ? "سنة" : "سنوات"}
        </span>
        <span className="border border-[var(--rushd-border)] bg-[var(--rushd-card)] px-3 py-1.5 text-xs font-bold text-[var(--rushd-text)]">
          آخر تحديث: {lastUpdated}
        </span>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-7 text-[var(--rushd-muted)]">
        {description || "جلسة تدريب مقابلة مخصصة ضمن رُشد."}
      </p>
    </div>
  );
};

export default SummaryCard;
