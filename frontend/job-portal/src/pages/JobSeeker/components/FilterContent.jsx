const jobTypes = ["Remote", "Full-Time", "Part-Time", "Internship", "Contract"];
const categories = ["Frontend", "Backend", "Full Stack", "UI/UX", "Data", "DevOps", "Mobile"];

function FilterContent({ filters, onChange, onReset }) {
  return (
    <aside
      dir="rtl"
      className="self-start border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-5 shadow-[0_16px_45px_var(--rushd-shadow)] lg:sticky lg:top-28"
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
            className="w-full border border-[var(--rushd-border)] bg-[var(--rushd-card)] px-4 py-3 text-[var(--rushd-text)] outline-none transition focus:border-[var(--rushd-accent)]"
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
            className="w-full border border-[var(--rushd-border)] bg-[var(--rushd-card)] px-4 py-3 text-[var(--rushd-text)] outline-none transition focus:border-[var(--rushd-accent)]"
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
              className="w-full border border-[var(--rushd-border)] bg-[var(--rushd-card)] px-4 py-3 text-[var(--rushd-text)] outline-none transition focus:border-[var(--rushd-accent)]"
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
              className="w-full border border-[var(--rushd-border)] bg-[var(--rushd-card)] px-4 py-3 text-[var(--rushd-text)] outline-none transition focus:border-[var(--rushd-accent)]"
              placeholder="20000"
            />
          </label>
        </div>
      </div>
    </aside>
  );
}

export default FilterContent;
