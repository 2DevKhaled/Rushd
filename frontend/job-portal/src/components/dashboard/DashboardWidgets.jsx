import { cn } from "../../lib/utils";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

function StatCard({ icon: Icon, label, value, hint, tone = "gold" }) {
  const tones = {
    gold: "text-[var(--rushd-accent)] bg-[var(--rushd-card)] border-[var(--rushd-border-strong)]",
    green: "text-[var(--rushd-accent)] bg-[var(--rushd-card)] border-[var(--rushd-border-strong)]",
    blue: "text-[var(--rushd-accent)] bg-[var(--rushd-card)] border-[var(--rushd-border-strong)]",
    red: "text-[var(--rushd-muted)] bg-[var(--rushd-card)] border-[var(--rushd-border)]",
  };

  return (
    <Card className="group overflow-hidden p-5 transition hover:-translate-y-0.5 hover:border-[var(--rushd-border-strong)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[var(--rushd-muted)]">{label}</p>
          <p className="mt-3 text-3xl font-black text-[var(--rushd-text)]">{value}</p>
          {hint && <p className="mt-2 text-xs font-bold text-[var(--rushd-muted)]">{hint}</p>}
        </div>
        {Icon && (
          <div className={cn("rounded-xl border p-3", tones[tone])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </Card>
  );
}

function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-10 text-center">
      {Icon && (
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--rushd-badge-border)] bg-[var(--rushd-badge-bg)] text-[var(--rushd-badge-text)]">
          <Icon className="h-7 w-7" />
        </div>
      )}
      <h3 className="text-2xl font-black text-[var(--rushd-text)]">{title}</h3>
      {description && <p className="mx-auto mt-3 max-w-md leading-7 text-[var(--rushd-muted)]">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

function LoadingPanel({ rows = 3 }) {
  return (
    <Card className="p-5">
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function MiniBarChart({ items }) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <Card className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl font-black text-[var(--rushd-text)]">ملخص بصري</h3>
        <span className="text-xs font-black text-[var(--rushd-muted)]">LIVE</span>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-bold text-[var(--rushd-muted)]">{item.label}</span>
              <span className="font-black text-[var(--rushd-accent)]">{item.value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--rushd-card)]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#9b6b24,var(--rushd-accent-2))]"
                style={{ width: `${Math.max((item.value / max) * 100, item.value ? 8 : 0)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export { EmptyState, LoadingPanel, MiniBarChart, StatCard };
