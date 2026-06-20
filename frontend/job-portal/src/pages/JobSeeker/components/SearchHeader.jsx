import { Search, MapPin } from "lucide-react";

function SearchHeader({ filters, onChange, onSubmit }) {
  return (
    <form
      dir="rtl"
      onSubmit={onSubmit}
      className="border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-3 shadow-[0_16px_45px_var(--rushd-shadow)]"
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_0.8fr_auto]">
        <label className="relative block">
          <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--rushd-muted)]" />
          <input
            value={filters.keyword}
            onChange={(event) => onChange("keyword", event.target.value)}
            placeholder="ابحث بالمسمى الوظيفي أو المهارة"
            className="w-full border border-[var(--rushd-border)] bg-[var(--rushd-card)] py-4 pl-4 pr-12 text-[var(--rushd-text)] outline-none transition placeholder:text-[var(--rushd-muted)] focus:border-[var(--rushd-accent)]"
          />
        </label>
        <label className="relative block">
          <MapPin className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--rushd-muted)]" />
          <input
            value={filters.location}
            onChange={(event) => onChange("location", event.target.value)}
            placeholder="المدينة أو نوع الدوام"
            className="w-full border border-[var(--rushd-border)] bg-[var(--rushd-card)] py-4 pl-4 pr-12 text-[var(--rushd-text)] outline-none transition placeholder:text-[var(--rushd-muted)] focus:border-[var(--rushd-accent)]"
          />
        </label>
        <button
          type="submit"
          className="bg-[var(--rushd-accent)] px-8 py-4 font-bold text-[var(--rushd-ink)] transition hover:bg-[var(--rushd-accent-2)]"
        >
          بحث
        </button>
      </div>
    </form>
  );
}

export default SearchHeader;
