const jobTypes = ["Remote", "Full-Time", "Part-Time", "Internship", "Contract"];
const categories = ["Frontend", "Backend", "Full Stack", "UI/UX", "Data", "DevOps", "Mobile"];

function FilterContent({ filters, onChange, onReset }) {
  return (
    <aside
      dir="rtl"
      className="self-start rounded-2xl border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-5 shadow-2xl shadow-black/20"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-black text-[var(--rushd-text)]">الفلاتر</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-bold text-[var(--rushd-accent)] hover:text-[var(--rushd-text)]"
        >
          مسح
        </button>
      </div>

      <div className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[var(--rushd-muted)]">نوع الوظيفة</span>
          <select
            value={filters.type}
            onChange={(event) => onChange("type", event.target.value)}
            className="w-full rounded-xl border border-[var(--rushd-border)] bg-[var(--rushd-bg)] px-4 py-3 text-[var(--rushd-text)] outline-none transition focus:border-[var(--rushd-accent)] focus:ring-4 focus:ring-[var(--rushd-glow)]"
          >
            <option value="">كل الأنواع</option>
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[var(--rushd-muted)]">التخصص</span>
          <select
            value={filters.category}
            onChange={(event) => onChange("category", event.target.value)}
            className="w-full rounded-xl border border-[var(--rushd-border)] bg-[var(--rushd-bg)] px-4 py-3 text-[var(--rushd-text)] outline-none transition focus:border-[var(--rushd-accent)] focus:ring-4 focus:ring-[var(--rushd-glow)]"
          >
            <option value="">كل التخصصات</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[var(--rushd-muted)]">أقل راتب</span>
            <input
              type="number"
              min="0"
              value={filters.minSalary}
              onChange={(event) => onChange("minSalary", event.target.value)}
              className="w-full rounded-xl border border-[var(--rushd-border)] bg-[var(--rushd-bg)] px-4 py-3 text-[var(--rushd-text)] outline-none transition focus:border-[var(--rushd-accent)] focus:ring-4 focus:ring-[var(--rushd-glow)]"
              placeholder="0"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[var(--rushd-muted)]">أعلى راتب</span>
            <input
              type="number"
              min="0"
              value={filters.maxSalary}
              onChange={(event) => onChange("maxSalary", event.target.value)}
              className="w-full rounded-xl border border-[var(--rushd-border)] bg-[var(--rushd-bg)] px-4 py-3 text-[var(--rushd-text)] outline-none transition focus:border-[var(--rushd-accent)] focus:ring-4 focus:ring-[var(--rushd-glow)]"
              placeholder="20000"
            />
          </label>
        </div>
      </div>
    </aside>
  );
}

export default FilterContent;
