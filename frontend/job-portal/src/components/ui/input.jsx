import { cn } from "@/lib/utils";

function Input({ className, type = "text", ...props }) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(
        "h-12 w-full rounded-xl border border-[var(--rushd-border)] bg-[var(--rushd-card)] px-4 text-sm text-[var(--rushd-text)] outline-none transition placeholder:text-[var(--rushd-muted)] focus:border-[var(--rushd-border-strong)] focus:ring-4 focus:ring-[var(--rushd-glow)] disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
