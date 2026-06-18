import { Search, MapPin } from "lucide-react";

function SearchHeader({ filters, onChange, onSubmit }) {
  return (
    <form
      dir="rtl"
      onSubmit={onSubmit}
      className="rounded-2xl border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-4 shadow-2xl shadow-black/25 backdrop-blur"
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_0.8fr_auto]">
        <label className="relative block">
          <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--rushd-muted)]" />
          <input
            value={filters.keyword}
            onChange={(event) => onChange("keyword", event.target.value)}
            placeholder="ابحث بالمسمى الوظيفي أو المهارة"
            className="w-full rounded-xl border border-[var(--rushd-border)] bg-[var(--rushd-card)] py-4 pl-4 pr-12 text-[var(--rushd-text)] outline-none transition placeholder:text-[var(--rushd-muted)] focus:border-[var(--rushd-accent)] focus:ring-4 focus:ring-[var(--rushd-glow)]"
          />
        </label>
        <label className="relative block">
          <MapPin className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--rushd-muted)]" />
          <input
            value={filters.location}
            onChange={(event) => onChange("location", event.target.value)}
            placeholder="المدينة أو نوع الدوام"
            className="w-full rounded-xl border border-[var(--rushd-border)] bg-[var(--rushd-card)] py-4 pl-4 pr-12 text-[var(--rushd-text)] outline-none transition placeholder:text-[var(--rushd-muted)] focus:border-[var(--rushd-accent)] focus:ring-4 focus:ring-[var(--rushd-glow)]"
          />
        </label>
        <button
          type="submit"
          className="rounded-xl bg-[linear-gradient(145deg,var(--rushd-accent-2),var(--rushd-accent))] px-8 py-4 font-black text-[var(--rushd-ink)] transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[var(--rushd-glow)]"
        >
          بحث
        </button>
      </div>
    </form>
  );
}

export default SearchHeader;
