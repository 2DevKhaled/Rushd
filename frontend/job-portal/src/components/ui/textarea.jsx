import { cn } from "@/lib/utils";

function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-36 w-full rounded-xl border border-[var(--rushd-border)] bg-[var(--rushd-card)] px-4 py-3 text-sm text-[var(--rushd-text)] outline-none transition placeholder:text-[var(--rushd-muted)] focus:border-[var(--rushd-border-strong)] focus:ring-4 focus:ring-[var(--rushd-glow)] disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
