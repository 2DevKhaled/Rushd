import { X } from "lucide-react";

const Drawer = ({ isOpen, onClose, title, children }) => {
  return (
    <div
      dir="rtl"
      className={`fixed left-0 top-[76px] z-40 h-[calc(100dvh-76px)] w-full overflow-y-auto border-r border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-5 shadow-2xl transition-transform md:w-[42vw] ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      tabIndex="-1"
      aria-label="drawer-left-label"
    >
      <div className="mb-5 flex items-center justify-between gap-4 border-b border-[var(--rushd-border)] pb-4">
        <h5
          className="text-lg font-black text-[var(--rushd-text)]"
          id="drawer-left-label"
        >
          {title || "شرح رُشد"}
        </h5>

        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center border border-[var(--rushd-border)] text-[var(--rushd-muted)] transition hover:bg-[var(--rushd-card)] hover:text-[var(--rushd-text)]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="text-sm leading-8 text-[var(--rushd-muted)]">{children}</div>
    </div>
  );
};

export default Drawer;
