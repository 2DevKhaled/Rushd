import { Moon, Sun } from "lucide-react";
import ProfileInfoCard from "../Cards/ProfileInfoCard";
import { Link } from "react-router-dom";
import { useTheme } from "../../../../context/ThemeContext";

function Navbar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="sticky top-0 z-30 border-b border-[var(--rushd-border)] bg-[var(--rushd-header)] px-4 py-2.5 backdrop-blur-2xl md:px-0">
      <div className="container mx-auto flex h-14 items-center justify-between gap-5" dir="rtl">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[linear-gradient(145deg,var(--rushd-accent-2),var(--rushd-accent))] text-xl font-black text-[var(--rushd-ink)]">
            ر
          </div>
          <div className="leading-none">
            <h2 className="text-xl font-black text-[var(--rushd-text)]">رُشد</h2>
            <p className="mt-1 text-[10px] font-bold text-[var(--rushd-muted)]">
              تدريب المقابلات
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--rushd-border)] bg-[var(--rushd-card)] text-[var(--rushd-muted)] transition hover:text-[var(--rushd-text)]"
            aria-label="تبديل الثيم"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <ProfileInfoCard />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
