import { useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

function Header({ mode = "dark", onToggleMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const links = [
    { label: "عن رُشد", href: "#platform" },
    { label: "رحلتك", href: "#journey" },
    { label: "لأصحاب العمل", href: "#employers" },
    { label: "الوظائف", to: "/find-jobs" },
  ];
  const navClass = "text-sm font-semibold text-[var(--lp-muted)] transition hover:text-[var(--lp-accent)]";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--lp-border)] bg-[var(--lp-header)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center bg-[var(--lp-accent)] text-xl font-bold text-[var(--lp-accent-ink)]">ر</span>
          <span>
            <strong className="block text-xl leading-none text-[var(--lp-text)]">رُشد</strong>
            <small className="mt-1 block text-[10px] font-semibold text-[var(--lp-muted)]" dir="ltr">CAREER PLATFORM</small>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => link.to ? <NavLink key={link.label} to={link.to} className={navClass}>{link.label}</NavLink> : <a key={link.label} href={link.href} className={navClass}>{link.label}</a>)}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button type="button" onClick={onToggleMode} className="flex h-11 w-11 items-center justify-center border border-[var(--lp-border)] text-[var(--lp-text)] transition hover:border-[var(--lp-border-strong)]" aria-label="تبديل المظهر" title="تبديل المظهر">
            {mode === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Link to="/login" className="px-5 py-3 text-sm font-bold text-[var(--lp-text)]">تسجيل الدخول</Link>
          <Link to="/signup" className="bg-[var(--lp-accent)] px-5 py-3 text-sm font-bold text-[var(--lp-accent-ink)]">إنشاء حساب</Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button type="button" onClick={onToggleMode} className="flex h-10 w-10 items-center justify-center border border-[var(--lp-border)]" aria-label="تبديل المظهر">{mode === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</button>
          <button type="button" onClick={() => setIsOpen((open) => !open)} className="flex h-10 w-10 items-center justify-center" aria-label="القائمة">{isOpen ? <X /> : <Menu />}</button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-[var(--lp-border)] bg-[var(--lp-bg)] px-4 py-5 md:hidden">
          <div className="grid gap-5">
            {links.map((link) => link.to ? <NavLink key={link.label} to={link.to} className={navClass} onClick={() => setIsOpen(false)}>{link.label}</NavLink> : <a key={link.label} href={link.href} className={navClass} onClick={() => setIsOpen(false)}>{link.label}</a>)}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link to="/login" className="border border-[var(--lp-border)] px-4 py-3 text-center text-sm font-bold">دخول</Link>
              <Link to="/signup" className="bg-[var(--lp-accent)] px-4 py-3 text-center text-sm font-bold text-[var(--lp-accent-ink)]">إنشاء حساب</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
