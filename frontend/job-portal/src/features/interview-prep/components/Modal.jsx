import { X } from "lucide-react";

function Modal({ children, isOpen, onClose, title, hideHeader }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-[var(--rushd-bg)]/60 px-4 backdrop-blur-sm">
      <div
        dir="rtl"
        className="relative flex max-h-[90vh] max-w-[94vw] flex-col overflow-hidden border border-[var(--rushd-border)] bg-[var(--rushd-surface)] shadow-2xl"
      >
        {!hideHeader && (
          <div className="border-b border-[var(--rushd-border)] px-6 py-4 pl-14">
            <h1 className="text-lg font-black text-[var(--rushd-text)]">{title}</h1>
          </div>
        )}

        <button
          type="button"
          className="absolute left-3.5 top-3.5 flex h-9 w-9 cursor-pointer items-center justify-center border border-[var(--rushd-border)] text-[var(--rushd-muted)] transition hover:bg-[var(--rushd-card)] hover:text-[var(--rushd-text)]"
          onClick={onClose}
          aria-label="إغلاق النافذة"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex-1 overflow-auto custom-scrollbar">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
