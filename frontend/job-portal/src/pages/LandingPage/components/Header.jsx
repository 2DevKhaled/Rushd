import { useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

function Header({ dir = "rtl", mode = "dark", onToggleMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { label: "المنصة", href: "#platform" },
    { label: "الأقسام", href: "#modules" },
    { label: "الذكاء الاصطناعي", href: "#ai" },
    { label: "الوظائف", to: "/find-jobs" },
  ];

  const navClass =
    "text-sm font-bold text-[var(--lp-muted)] transition hover:text-[var(--lp-accent)]";

  return (
    <header
      dir={dir}
      className="fixed inset-x-0 top-0 z-50 border-b border-[var(--lp-border)] bg-[var(--lp-header)] backdrop-blur-2xl"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="group flex items-center gap-3"
          >
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-[var(--lp-accent)] text-2xl font-black text-[var(--lp-ink)] shadow-[0_0_40px_var(--lp-glow)]">
              <span className="absolute inset-0 bg-gradient-to-br from-white/70 to-transparent opacity-60" />
              <span className="relative">ر</span>
            </div>
            <div className="text-right leading-none">
              <span className="block text-2xl font-black text-[var(--lp-text)]">رُشد</span>
              <span className="mt-1 block text-[11px] font-bold tracking-wide text-[var(--lp-muted)]">
                CAREER OPERATING SYSTEM
              </span>
            </div>
          </button>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) =>
              link.to ? (
                <NavLink key={link.label} to={link.to} className={navClass}>
                  {link.label}
                </NavLink>
              ) : (
                <a key={link.label} href={link.href} className={navClass}>
                  {link.label}
                </a>
              ),
            )}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={onToggleMode}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--lp-border)] bg-[var(--lp-card)] text-[var(--lp-text)] transition hover:border-[var(--lp-border-strong)]"
              aria-label="تبديل الثيم"
            >
              {mode === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <NavLink
              to="/login"
              className="rounded-2xl border border-[var(--lp-border)] px-5 py-3 text-sm font-black text-[var(--lp-muted)] transition hover:border-[var(--lp-border-strong)] hover:text-[var(--lp-text)]"
            >
              دخول
            </NavLink>
            <NavLink
              to="/signup"
              className="rounded-2xl bg-[var(--lp-accent)] px-5 py-3 text-sm font-black text-[var(--lp-ink)] shadow-[0_0_30px_var(--lp-glow)] transition hover:scale-[1.02]"
            >
              ابدأ الآن
            </NavLink>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={onToggleMode}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--lp-border)] bg-[var(--lp-card)] text-[var(--lp-text)]"
              aria-label="تبديل الثيم"
            >
              {mode === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              type="button"
              className="text-[var(--lp-text)]"
              onClick={() => setIsOpen((value) => !value)}
              aria-label="القائمة"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-[var(--lp-border)] bg-[var(--lp-header)] px-4 py-5 backdrop-blur-2xl md:hidden">
          <div className="grid gap-4">
            {links.map((link) =>
              link.to ? (
                <NavLink
                  key={link.label}
                  to={link.to}
                  className={navClass}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </NavLink>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className={navClass}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ),
            )}
            <NavLink
              to="/signup"
              className="rounded-2xl bg-[var(--lp-accent)] px-5 py-3 text-center text-sm font-black text-[var(--lp-ink)]"
            >
              إنشاء حساب
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
