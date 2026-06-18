import { useEffect, useRef, useState } from "react";
import { ChevronDown, Pin, PinOff, Sparkles } from "lucide-react";
import AiResponsePreview from "../../pages/InterviewPrep/components/AiResponsePreview";

function QuestionCard({
  question,
  answer,
  isPinned,
  onLearnMore,
  onTogglePin,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const contnetRef = useRef(null);

  useEffect(() => {
    if (isExpanded) {
      const contentHeight = contnetRef.current.scrollHeight;
      setHeight(contentHeight + 12);
    } else {
      setHeight(0);
    }
  }, [isExpanded]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      dir="rtl"
      className="group mb-4 overflow-hidden rounded-2xl border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-5 shadow-2xl transition duration-300 hover:border-[var(--rushd-border-strong)]"
    >
      <div className="flex items-start justify-between gap-4">
        <button
          type="button"
          className="flex flex-1 items-start gap-4 text-right"
          onClick={toggleExpand}
        >
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--rushd-accent)] font-mono text-sm font-black text-[var(--rushd-ink)]">
            Q
          </span>
          <h3 className="leading-8 text-[var(--rushd-text)] md:text-[15px]">{question}</h3>
        </button>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition ${
              isPinned
                ? "border-[var(--rushd-badge-border)] bg-[var(--rushd-badge-bg)] text-[var(--rushd-badge-text)]"
                : "border-[var(--rushd-border)] bg-[var(--rushd-card)] text-[var(--rushd-muted)] hover:border-[var(--rushd-border-strong)] hover:text-[var(--rushd-text)]"
            }`}
            onClick={onTogglePin}
          >
            {isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-[var(--rushd-badge-border)] bg-[var(--rushd-badge-bg)] px-3 py-2 text-xs font-black text-[var(--rushd-badge-text)] transition hover:bg-[var(--rushd-accent)] hover:text-[var(--rushd-ink)]"
            onClick={() => onLearnMore()}
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden md:block">شرح أعمق</span>
          </button>
          <button
            type="button"
            className="text-[var(--rushd-muted)] transition hover:text-[var(--rushd-text)]"
            onClick={toggleExpand}
          >
            <ChevronDown
              className={`h-5 w-5 transform transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: `${height}px` }}
      >
        <div
          ref={contnetRef}
          className="mt-4 rounded-2xl border border-[var(--rushd-border)] bg-[var(--rushd-surface-strong)] px-5 py-4 text-[var(--rushd-text)]"
        >
          <AiResponsePreview content={answer} />
        </div>
      </div>
    </div>
  );
}

export default QuestionCard;
