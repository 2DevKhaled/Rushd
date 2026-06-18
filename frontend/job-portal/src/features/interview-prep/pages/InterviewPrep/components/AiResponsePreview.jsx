import { useState } from "react";
import { Copy, CopyCheck } from "lucide-react";

const AiResponsePreview = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div dir="rtl" className="mx-auto max-w-4xl">
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--rushd-border)] bg-[var(--rushd-card)] px-3 py-2 text-xs font-bold text-[var(--rushd-muted)] transition hover:text-[var(--rushd-text)]"
        >
          {copied ? (
            <CopyCheck className="h-4 w-4 text-[var(--rushd-accent)]" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? "تم النسخ" : "نسخ الشرح"}
        </button>
      </div>
      <div className="whitespace-pre-wrap text-[14px] leading-8 text-[var(--rushd-text)]">
        {content}
      </div>
    </div>
  );
};

export default AiResponsePreview;
