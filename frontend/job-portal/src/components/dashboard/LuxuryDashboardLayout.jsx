import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  BookmarkCheck,
  BriefcaseBusiness,
  Building2,
  FilePlus2,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Search,
  Sparkles,
  Sun,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { useTheme } from "../../context/ThemeContext";
import axiosInstance from "../../pages/utils/axiosInstance";
import { API_PATHS } from "../../pages/utils/apiPaths";

const seekerNav = [
  { label: "الرئيسية", to: "/dashboard", icon: LayoutDashboard },
  { label: "الوظائف", to: "/find-jobs", icon: BriefcaseBusiness },
  { label: "المحفوظات", to: "/saved-jobs", icon: BookmarkCheck },
  { label: "السيرة الذاتية", to: "/resume-builder", icon: FileText },
  { label: "المقابلات", to: "/interview-prep", icon: Sparkles },
  { label: "الملف الشخصي", to: "/profile", icon: UserRound },
];

const employerNav = [
  { label: "الرئيسية", to: "/employer-dashboard", icon: LayoutDashboard },
  { label: "نشر وظيفة", to: "/post-job", icon: FilePlus2 },
  { label: "إدارة الوظائف", to: "/manage-jobs", icon: BriefcaseBusiness },
  { label: "المتقدمون", to: "/applicants", icon: Users },
  { label: "ملف الشركة", to: "/company-profile", icon: Building2 },
];

const publicNav = [
  { label: "الرئيسية", to: "/", icon: Home },
  { label: "الوظائف", to: "/find-jobs", icon: BriefcaseBusiness },
];

const routeTitles = {
  "/dashboard": "لوحة الباحث",
  "/find-jobs": "استكشاف الوظائف",
  "/saved-jobs": "الوظائف المحفوظة",
  "/profile": "الملف الشخصي",
  "/resume-builder": "منشئ السيرة",
  "/interview-prep": "التحضير للمقابلات",
  "/employer-dashboard": "لوحة صاحب العمل",
  "/post-job": "نشر وظيفة",
  "/manage-jobs": "إدارة الوظائف",
  "/applicants": "طلبات التقديم",
  "/company-profile": "ملف الشركة",
};

function LuxuryDashboardLayout({
  children,
  eyebrow = "RUSHD",
  title,
  description,
  actions,
  role,
  showSearch = true,
  maxWidth = "max-w-7xl",
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const navItems = role === "employer" ? employerNav : role === "public" ? publicNav : seekerNav;
  const currentTitle = title || routeTitles[location.pathname] || "رُشد";
  const displayName = user?.companyName || user?.name || "زائر";

  const breadcrumbs = useMemo(() => {
    const home = role === "employer" ? "لوحة صاحب العمل" : "لوحة الباحث";
    return [home, currentTitle].filter((item, index, list) => index === 0 || item !== list[index - 1]);
  }, [currentTitle, role]);

  const logout = () => {
    clearUser();
    navigate("/", { replace: true });
  };

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      setNotificationsLoading(true);
      const response = await axiosInstance.get(API_PATHS.NOTIFICATIONS.MY);
      setNotifications(response.data?.notifications || []);
      setUnreadCount(response.data?.unreadCount || 0);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setNotificationsLoading(false);
    }
  }, [user]);

  const markAllNotificationsAsRead = async () => {
    if (!user || unreadCount === 0) return;

    setUnreadCount(0);
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        readAt: notification.readAt || new Date().toISOString(),
      })),
    );
    try {
      await axiosInstance.put(API_PATHS.NOTIFICATIONS.MARK_ALL_READ);
    } catch {
      fetchNotifications();
    }
  };

  const openNotification = async (notification) => {
    if (!notification.readAt) {
      setUnreadCount((count) => Math.max(count - 1, 0));
      setNotifications((current) =>
        current.map((item) =>
          item._id === notification._id
            ? { ...item, readAt: new Date().toISOString() }
            : item,
        ),
      );
      axiosInstance.put(API_PATHS.NOTIFICATIONS.MARK_READ(notification._id)).catch(() => {
        fetchNotifications();
      });
    }

    setNotificationsOpen(false);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications, user?._id]);

  useEffect(() => {
    if (!user) return undefined;
    const interval = window.setInterval(fetchNotifications, 60000);
    return () => window.clearInterval(interval);
  }, [fetchNotifications, user]);

  return (
    <div dir="rtl" className="min-h-screen overflow-hidden bg-[var(--rushd-bg)] text-[var(--rushd-text)]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,var(--rushd-glow),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_22%),linear-gradient(180deg,var(--rushd-bg),var(--rushd-bg-2)_62%,var(--rushd-bg))]" />
      <div className="landing-grid pointer-events-none fixed inset-0 opacity-[0.12] [background-image:linear-gradient(var(--rushd-glow)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:88px_88px]" />

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-40 flex w-72 translate-x-full flex-col border-l border-[var(--rushd-border)] bg-[var(--rushd-surface)] shadow-2xl backdrop-blur-2xl transition lg:translate-x-0",
          open && "translate-x-0",
        )}
      >
        <div className="flex h-20 items-center justify-between border-b border-[var(--rushd-border)] px-5">
          <Link to={role === "employer" ? "/employer-dashboard" : "/dashboard"} className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--rushd-border-strong)] bg-[linear-gradient(145deg,var(--rushd-accent-2),#9b6b24)] text-2xl font-black text-[var(--rushd-ink)] shadow-lg shadow-[var(--rushd-glow)]">
              ر
            </div>
            <div className="leading-none">
              <p className="text-2xl font-black text-[var(--rushd-text)]">رُشد</p>
              <p className="mt-1 text-xs font-bold text-[var(--rushd-muted)]">بوابة الجاهزية المهنية</p>
            </div>
          </Link>
          <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-[var(--rushd-muted)] hover:bg-[var(--rushd-card)] lg:hidden" aria-label="إغلاق القائمة">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-black transition",
                    isActive
                      ? "border-[var(--rushd-badge-border)] bg-[var(--rushd-badge-bg)] text-[var(--rushd-badge-text)] shadow-[inset_0_1px_0_rgba(255,255,255,.08)]"
                      : "border-transparent text-[var(--rushd-muted)] hover:border-[var(--rushd-border)] hover:bg-[var(--rushd-card)] hover:text-[var(--rushd-text)]",
                  )
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-[var(--rushd-border)] p-4">
          <div className="rounded-2xl border border-[var(--rushd-border)] bg-[var(--rushd-card)] p-4">
            <div className="flex items-center gap-3">
              <img src={user?.avatar || user?.companyLogo || "/favicon.svg"} alt={displayName} className="h-11 w-11 rounded-xl border border-[var(--rushd-border)] object-cover" />
              <div className="min-w-0">
                <p className="truncate font-black text-[var(--rushd-text)]">{displayName}</p>
                <p className="text-xs font-bold text-[var(--rushd-muted)]">{role === "employer" ? "صاحب عمل" : user ? "باحث عن عمل" : "تصفح عام"}</p>
              </div>
            </div>
            {user && (
              <button type="button" onClick={logout} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--rushd-border)] px-4 py-2.5 text-sm font-black text-[var(--rushd-muted)] transition hover:border-[var(--rushd-danger-border)] hover:bg-[var(--rushd-danger-bg)] hover:text-[var(--rushd-danger-text)]">
                <LogOut className="h-4 w-4" />
                تسجيل الخروج
              </button>
            )}
          </div>
        </div>
      </aside>

      {open && <button type="button" className="fixed inset-0 z-30 bg-[var(--rushd-bg)]/60 lg:hidden" onClick={() => setOpen(false)} aria-label="إغلاق القائمة" />}

      <div className="relative z-10 lg:mr-72">
        <header className="sticky top-0 z-20 border-b border-[var(--rushd-border)] bg-[var(--rushd-header)] backdrop-blur-2xl">
          <div className="flex min-h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button type="button" onClick={() => setOpen(true)} className="rounded-xl border border-[var(--rushd-border)] p-2.5 text-[var(--rushd-muted)] hover:bg-[var(--rushd-card)] lg:hidden" aria-label="فتح القائمة">
              <Menu className="h-5 w-5" />
            </button>

            {showSearch && (
              <div className="hidden min-w-0 flex-1 md:block">
                <div className="relative max-w-xl">
                  <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--rushd-muted)]" />
                  <input
                    readOnly
                    value=""
                    placeholder="ابحث داخل لوحة رُشد"
                    className="h-11 w-full rounded-xl border border-[var(--rushd-border)] bg-[var(--rushd-card)] px-11 text-sm text-[var(--rushd-text)] outline-none placeholder:text-[var(--rushd-muted)]"
                  />
                </div>
              </div>
            )}

            <div className="mr-auto flex items-center gap-2">
              <button type="button" onClick={toggleTheme} className="rounded-xl border border-[var(--rushd-border)] p-2.5 text-[var(--rushd-muted)] transition hover:bg-[var(--rushd-card)] hover:text-[var(--rushd-text)]" aria-label="تبديل الثيم">
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              {user && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen((current) => !current)}
                    className="relative rounded-xl border border-[var(--rushd-border)] p-2.5 text-[var(--rushd-muted)] transition hover:bg-[var(--rushd-card)] hover:text-[var(--rushd-text)]"
                    aria-label="الإشعارات"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -left-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border border-[var(--rushd-surface)] bg-[var(--rushd-danger-text)] px-1 text-[10px] font-black text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="absolute left-0 top-14 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[var(--rushd-border)] bg-[var(--rushd-surface-strong)] text-right shadow-2xl shadow-[var(--rushd-shadow)]">
                      <div className="flex items-center justify-between border-b border-[var(--rushd-border)] px-4 py-3">
                        <div>
                          <p className="font-black text-[var(--rushd-text)]">الإشعارات</p>
                          <p className="mt-1 text-xs font-bold text-[var(--rushd-muted)]">
                            {unreadCount} غير مقروء
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={markAllNotificationsAsRead}
                          className="rounded-lg border border-[var(--rushd-border)] px-3 py-2 text-xs font-black text-[var(--rushd-muted)] transition hover:bg-[var(--rushd-card)] hover:text-[var(--rushd-text)] disabled:opacity-40"
                          disabled={unreadCount === 0}
                        >
                          قراءة الكل
                        </button>
                      </div>

                      <div className="max-h-96 overflow-y-auto p-2">
                        {notificationsLoading ? (
                          <div className="space-y-2 p-2">
                            {[0, 1, 2].map((item) => (
                              <div key={item} className="h-16 rounded-xl bg-[var(--rushd-card)]" />
                            ))}
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center">
                            <p className="font-black text-[var(--rushd-text)]">لا توجد إشعارات</p>
                            <p className="mt-2 text-sm text-[var(--rushd-muted)]">كل شيء هادئ الآن.</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <button
                              key={notification._id}
                              type="button"
                              onClick={() => openNotification(notification)}
                              className={cn(
                                "mb-2 w-full rounded-xl border p-3 text-right transition hover:-translate-y-0.5 hover:border-[var(--rushd-border-strong)]",
                                notification.readAt
                                  ? "border-[var(--rushd-border)] bg-transparent"
                                  : "border-[var(--rushd-badge-border)] bg-[var(--rushd-badge-bg)]",
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <span
                                  className={cn(
                                    "mt-2 h-2.5 w-2.5 shrink-0 rounded-full",
                                    notification.readAt
                                      ? "bg-[var(--rushd-border-strong)]"
                                      : "bg-[var(--rushd-accent)]",
                                  )}
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="truncate font-black text-[var(--rushd-text)]">
                                    {notification.title}
                                  </p>
                                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--rushd-muted)]">
                                    {notification.message}
                                  </p>
                                  <p className="mt-2 text-xs font-bold text-[var(--rushd-accent)]">
                                    {new Date(notification.createdAt).toLocaleDateString("ar")}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="hidden items-center gap-3 rounded-xl border border-[var(--rushd-border)] bg-[var(--rushd-card)] px-3 py-2 sm:flex">
                <img src={user?.avatar || user?.companyLogo || "/favicon.svg"} alt={displayName} className="h-8 w-8 rounded-lg object-cover" />
                <div className="leading-none">
                  <p className="max-w-32 truncate text-sm font-black text-[var(--rushd-text)]">{displayName}</p>
                  <p className="mt-1 text-[11px] font-bold text-[var(--rushd-muted)]">متصل الآن</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className={cn("mx-auto px-4 py-6 sm:px-6 lg:px-8", maxWidth)}>
          <section className="mb-6 rounded-2xl border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-5 shadow-2xl backdrop-blur-xl sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-black text-[var(--rushd-muted)]">
                  {breadcrumbs.map((crumb, index) => (
                    <span key={`${crumb}-${index}`} className="flex items-center gap-2">
                      {index > 0 && <span className="text-[var(--rushd-muted)]">/</span>}
                      {crumb}
                    </span>
                  ))}
                </div>
                <Badge>{eyebrow}</Badge>
                <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">{currentTitle}</h1>
                {description && <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--rushd-muted)] sm:text-base">{description}</p>}
              </div>
              {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
            </div>
          </section>

          {children}
        </main>
      </div>
    </div>
  );
}

export default LuxuryDashboardLayout;
