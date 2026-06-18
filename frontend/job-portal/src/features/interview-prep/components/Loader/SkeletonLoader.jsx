export default function SkeletonLoader() {
return (
  <div className="space-y-6">
    <div role="status" className="animate-pulse space-y-4 max-w-3xl">
      <div className="h-4 rounded-md w-1/2 bg-[var(--rushd-card)]"></div>
      <div className="space-y-2">
        <div className="h-3 rounded bg-[var(--rushd-card)] w-full"></div>
        <div className="h-3 rounded bg-[var(--rushd-card)] w-11/12"></div>
        <div className="h-3 rounded bg-[var(--rushd-card)] w-10/12"></div>
        <div className="h-3 rounded bg-[var(--rushd-card)] w-9/12"></div>
      </div>
      <div className="rounded p-4 space-y-2 bg-[var(--rushd-surface-strong)]">
        <div className="h-2.5 rounded w-3/4 bg-[var(--rushd-card)]"></div>
        <div className="h-2.5 rounded w-2/3 bg-[var(--rushd-card)]"></div>
        <div className="h-2.5 rounded w-1/2 bg-[var(--rushd-card)]"></div>
      </div>
    </div>

    <div role="status" className="animate-pulse space-y-4 max-w-3xl">
      <div className="h-6 rounded-md w-1/2 bg-[var(--rushd-card)]"></div>
      <div className="space-y-2">
        <div className="h-3 rounded bg-[var(--rushd-card)] w-full"></div>
        <div className="h-3 rounded bg-[var(--rushd-card)] w-11/12"></div>
        <div className="h-3 rounded bg-[var(--rushd-card)] w-10/12"></div>
        <div className="h-3 rounded bg-[var(--rushd-card)] w-9/12"></div>
      </div>
      <div className="space-y-2">
        <div className="h-3 rounded bg-[var(--rushd-card)] w-full"></div>
        <div className="h-3 rounded bg-[var(--rushd-card)] w-11/12"></div>
        <div className="h-3 rounded bg-[var(--rushd-card)] w-10/12"></div>
        <div className="h-3 rounded bg-[var(--rushd-card)] w-9/12"></div>
      </div>
      <div className="h-6 rounded-md w-1/2 bg-[var(--rushd-card)]"></div>
      <div className="space-y-2">
        <div className="h-3 rounded bg-[var(--rushd-card)] w-full"></div>
        <div className="h-3 rounded bg-[var(--rushd-card)] w-11/12"></div>
        <div className="h-3 rounded bg-[var(--rushd-card)] w-10/12"></div>
        <div className="h-3 rounded bg-[var(--rushd-card)] w-9/12"></div>
      </div>
    </div>
  </div>
);


}
