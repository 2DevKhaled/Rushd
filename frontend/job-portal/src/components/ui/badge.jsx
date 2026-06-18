import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-black shadow-sm transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-[var(--rushd-badge-border)] bg-[var(--rushd-badge-bg)] text-[var(--rushd-badge-text)]",
        secondary:
          "border-[var(--rushd-border)] bg-[var(--rushd-surface-strong)] text-[var(--rushd-text)]",
        success:
          "border-[var(--rushd-success-border)] bg-[var(--rushd-success-bg)] text-[var(--rushd-success-text)]",
        warning:
          "border-[var(--rushd-warning-border)] bg-[var(--rushd-warning-bg)] text-[var(--rushd-warning-text)]",
        destructive:
          "border-[var(--rushd-danger-border)] bg-[var(--rushd-danger-bg)] text-[var(--rushd-danger-text)]",
        outline:
          "border-[var(--rushd-badge-border)] bg-transparent text-[var(--rushd-badge-text)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({ className, variant, ...props }) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
