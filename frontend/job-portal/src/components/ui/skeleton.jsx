import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-xl bg-[var(--rushd-card)]", className)}
      {...props}
    />
  );
}

export { Skeleton };
