import { cn } from "@/lib/utils";

function Select({ className, ...props }) {
  return (
    <select
      data-slot="select"
      className={cn(
        "h-12 w-full rounded-xl border border-[var(--rushd-border)] bg-[var(--rushd-surface-strong)] px-4 text-sm text-[var(--rushd-text)] outline-none transition focus:border-[var(--rushd-border-strong)] focus:ring-4 focus:ring-[var(--rushd-glow)] disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}

export { Select };
