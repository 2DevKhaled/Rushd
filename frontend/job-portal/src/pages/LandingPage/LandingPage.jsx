import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpLeft,
  BriefcaseBusiness,
  Building2,
  Check,
  CircleCheckBig,
  FileText,
  Gauge,
  MessageSquareText,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import { useTheme } from "../../context/ThemeContext";

const features = [
  {
    number: "01",
    title: "اكتشف فرصتك",
    description: "ابحث بين الوظائف، احفظ المناسب، وقدّم مباشرة من ملفك المهني.",
    icon: Search,
    to: "/find-jobs",
    tone: "mint",
  },
  {
    number: "02",
    title: "ابنِ سيرتك",
    description: "أنشئ سيرة احترافية متوافقة مع ATS وجاهزة للمشاركة في دقائق.",
    icon: FileText,
    to: "/resume-builder",
    tone: "green",
  },
  {
    number: "03",
    title: "تدرّب للمقابلة",
    description: "استعد بأسئلة ذكية مخصصة حسب المسمى والمهارات التي تستهدفها.",
    icon: MessageSquareText,
    to: "/interview-prep",
    tone: "pistachio",
  },
];

const roles = [
  "تطوير البرمجيات",
  "تحليل البيانات",
  "التصميم",
  "التسويق الرقمي",
];
const tickerItems = [
  "وظائف نوعية",
  "سيرة ATS",
  "مطابقة ذكية",
  "تدريب مقابلات",
  "تتبع الطلبات",
  "إدارة المرشحين",
];

function LandingPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [audience, setAudience] = useState("seeker");

  const submitSearch = (event) => {
    event.preventDefault();
    const search = query.trim();
    navigate(
      search ? `/find-jobs?search=${encodeURIComponent(search)}` : "/find-jobs",
    );
  };

  return (
    <div
      dir="rtl"
      className="lp-page min-h-screen overflow-hidden bg-[var(--lp-bg)] text-[var(--lp-text)]"
    >
      <Header mode={theme} onToggleMode={toggleTheme} />

      <main>
        <section className="relative border-b border-[var(--lp-border)] px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-20 lg:pt-32">
          <div className="lp-hero-pattern absolute inset-0 pointer-events-none" />
          <div className="relative mx-auto grid w-full min-w-0 max-w-7xl gap-12 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
            <div className="min-w-0 py-6 lg:py-12">
              <div
                className="mb-9 inline-flex border border-[var(--lp-border)] bg-[var(--lp-surface)] p-1 shadow-[0_10px_40px_var(--lp-shadow)]"
                aria-label="اختر نوع المستخدم"
              >
                <button
                  type="button"
                  onClick={() => setAudience("seeker")}
                  className={`min-h-10 px-5 text-sm font-bold transition ${audience === "seeker" ? "bg-[var(--lp-deep)] text-[var(--lp-on-deep)]" : "text-[var(--lp-muted)]"}`}
                >
                  باحث عن عمل
                </button>
                <button
                  type="button"
                  onClick={() => setAudience("employer")}
                  className={`min-h-10 px-5 text-sm font-bold transition ${audience === "employer" ? "bg-[var(--lp-deep)] text-[var(--lp-on-deep)]" : "text-[var(--lp-muted)]"}`}
                >
                  صاحب عمل
                </button>
              </div>

              <h1 className="max-w-4xl text-5xl font-bold leading-[1.12] tracking-normal sm:text-7xl lg:text-[5.6rem]">
                {audience === "seeker"
                  ? "لا تبحث عن وظيفة فقط."
                  : "لا تجمع سيرًا فقط."}
                <span className="mt-2 block text-[var(--lp-accent)]">
                  {audience === "seeker"
                    ? "ابنِ طريقك إليها."
                    : "اكتشف الشخص المناسب."}
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-9 text-[var(--lp-muted)] sm:text-xl">
                {audience === "seeker"
                  ? "من سيرتك الأولى حتى يوم المقابلة، رُشد يحوّل خطواتك المتفرقة إلى مسار مهني واحد وواضح."
                  : "انشر فرصتك، قابل المرشحين الأنسب، وأدر رحلة التوظيف كاملة من مساحة عمل واحدة."}
              </p>

              {audience === "seeker" ? (
                <>
                  <form
                    onSubmit={submitSearch}
                    className="mt-10 flex max-w-2xl flex-col gap-2 border border-[var(--lp-border-strong)] bg-[var(--lp-surface)] p-2 shadow-[0_24px_70px_var(--lp-shadow)] sm:flex-row"
                  >
                    <label className="flex min-h-14 min-w-0 flex-1 items-center gap-3 px-4">
                      <Search className="h-5 w-5 shrink-0 text-[var(--lp-accent)]" />
                      <span className="sr-only">ابحث عن وظيفة</span>
                      <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="مسمى وظيفي أو مهارة"
                        className="min-w-0 w-full bg-transparent text-base text-[var(--lp-text)] outline-none placeholder:text-[var(--lp-muted)]"
                      />
                    </label>
                    <button
                      type="submit"
                      className="inline-flex min-h-14 items-center justify-center gap-2 bg-[var(--lp-accent)] px-7 font-bold text-[var(--lp-accent-ink)] transition hover:bg-[var(--lp-accent-hover)]"
                    >
                      ابحث الآن <ArrowLeft className="h-5 w-5" />
                    </button>
                  </form>
                  <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-[var(--lp-muted)]">
                    <span>الأكثر بحثًا:</span>
                    {roles.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setQuery(role)}
                        className="border-b border-[var(--lp-border-strong)] pb-0.5 transition hover:text-[var(--lp-accent)]"
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/signup"
                    className="inline-flex min-h-14 items-center justify-center gap-3 bg-[var(--lp-accent)] px-7 font-bold text-[var(--lp-accent-ink)]"
                  >
                    ابدأ التوظيف <ArrowLeft className="h-5 w-5" />
                  </Link>
                  <a
                    href="#employers"
                    className="inline-flex min-h-14 items-center justify-center border border-[var(--lp-border-strong)] bg-[var(--lp-surface)] px-7 font-bold"
                  >
                    اكتشف لوحة الشركات
                  </a>
                </div>
              )}
            </div>

            <div className="lp-visual-shell relative min-h-[540px] min-w-0 max-w-full overflow-hidden bg-[var(--lp-deep)] text-[var(--lp-on-deep)] lg:min-h-[610px]">
              <div className="lp-contours absolute inset-0 opacity-70" />
              <div className="absolute inset-x-6 top-6 flex items-center justify-between border-b border-[var(--lp-on-deep-border)] pb-5 text-xs text-[var(--lp-on-deep-muted)] sm:inset-x-9 sm:top-9">
                <span dir="ltr">RUSHD / LIVE PATH</span>
                <span className="flex items-center gap-2">
                  <span className="lp-pulse h-2 w-2 bg-[var(--lp-accent)]" />{" "}
                  متزامن الآن
                </span>
              </div>

              {audience === "seeker" ? (
                <div className="absolute inset-x-6 top-28 sm:inset-x-9">
                  <div className="flex items-end justify-between border-b border-[var(--lp-on-deep-border)] pb-8">
                    <div>
                      <p className="text-sm text-[var(--lp-on-deep-muted)]">
                        مؤشر الجاهزية المهنية
                      </p>
                      <p
                        className="mt-2 text-6xl font-bold text-[var(--lp-mint)]"
                        dir="ltr"
                      >
                        86<span className="text-2xl">%</span>
                      </p>
                    </div>
                    <Gauge className="h-12 w-12 text-[var(--lp-pistachio)]" />
                  </div>
                  <div className="relative mt-10 grid gap-3">
                    {[
                      [
                        CircleCheckBig,
                        "السيرة الذاتية",
                        "جاهزة للتقديم",
                        "94%",
                      ],
                      [
                        BriefcaseBusiness,
                        "الوظائف المطابقة",
                        "تحديث اليوم",
                        "28",
                      ],
                      [
                        MessageSquareText,
                        "تدريب المقابلة",
                        "جلسة مقترحة",
                        "10",
                      ],
                    ].map(([Icon, title, label, value], index) => (
                      <div
                        key={title}
                        className="lp-path-row relative flex items-center gap-4 border border-[var(--lp-on-deep-border)] bg-[var(--lp-deep-surface)] p-4 backdrop-blur"
                        style={{ marginInlineStart: `${index * 18}px` }}
                      >
                        <span className="flex h-11 w-11 items-center justify-center bg-[var(--lp-node)]">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <strong className="block">{title}</strong>
                          <small className="text-[var(--lp-on-deep-muted)]">
                            {label}
                          </small>
                        </span>
                        <strong className="text-xl text-[var(--lp-mint)]">
                          {value}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="absolute inset-x-6 top-28 sm:inset-x-9">
                  <div className="flex items-end justify-between border-b border-[var(--lp-on-deep-border)] pb-8">
                    <div>
                      <p className="text-sm text-[var(--lp-on-deep-muted)]">
                        مسار التوظيف النشط
                      </p>
                      <p className="mt-2 text-3xl font-bold">
                        مطور واجهات أمامية
                      </p>
                    </div>
                    <Users className="h-12 w-12 text-[var(--lp-pistachio)]" />
                  </div>
                  <div className="mt-9 grid grid-cols-3 gap-2 text-center">
                    {[
                      ["48", "متقدم"],
                      ["12", "مرشح"],
                      ["04", "مقابلات"],
                    ].map(([value, label]) => (
                      <div
                        key={label}
                        className="border border-[var(--lp-on-deep-border)] bg-[var(--lp-deep-surface)] px-2 py-5"
                      >
                        <strong className="block text-3xl text-[var(--lp-mint)]">
                          {value}
                        </strong>
                        <span className="mt-1 block text-xs text-[var(--lp-on-deep-muted)]">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-7 border border-[var(--lp-on-deep-border)] bg-[var(--lp-deep-surface)] p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--lp-on-deep-muted)]">
                        أفضل تطابق اليوم
                      </span>
                      <Sparkles className="h-5 w-5 text-[var(--lp-pistachio)]" />
                    </div>
                    <div className="mt-5 flex items-center gap-4">
                      <span className="flex h-12 w-12 items-center justify-center bg-[var(--lp-node)] font-bold">
                        ن
                      </span>
                      <span className="flex-1">
                        <strong className="block">خالد ناصر </strong>
                        <small className="text-[var(--lp-on-deep-muted)]">
                          React · TypeScript · UI
                        </small>
                      </span>
                      <strong className="text-xl text-[var(--lp-mint)]">
                        92%
                      </strong>
                    </div>
                    <button
                      type="button"
                      className="mt-6 flex min-h-11 w-full items-center justify-center gap-2 bg-[var(--lp-mint)] font-bold text-[var(--lp-deep)]"
                    >
                      نقل إلى المقابلة <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
              <div className="absolute bottom-5 left-6 flex items-center gap-2 text-xs text-[var(--lp-on-deep-muted)] sm:left-9">
                <ShieldCheck className="h-4 w-4 text-[var(--lp-accent)]" />{" "}
                بياناتك المهنية في مكان واحد
              </div>
            </div>
          </div>
        </section>

        <div
          className="lp-ticker overflow-hidden border-b border-[var(--lp-border)] bg-[var(--lp-accent)] py-4 text-[var(--lp-accent-ink)]"
          dir="ltr"
        >
          <div className="lp-ticker-track flex w-max items-center gap-8 whitespace-nowrap font-bold">
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="flex items-center gap-8"
              >
                <span>{item}</span>
                <span className="text-[var(--lp-pistachio)]">✦</span>
              </span>
            ))}
          </div>
        </div>

        <section
          id="platform"
          className="border-b border-[var(--lp-border)] bg-[var(--lp-surface)] px-4 py-7 sm:px-6 lg:px-8"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-[var(--lp-border)] lg:grid-cols-4">
            {[
              ["مسار واحد", "من البحث إلى القبول"],
              ["ATS", "سيرة متوافقة"],
              ["AI", "استعداد أذكى"],
              ["عربي", "تجربة صُممت لك"],
            ].map(([title, label]) => (
              <div
                key={title}
                className="lp-stat bg-[var(--lp-surface)] px-5 py-6 transition lg:px-8"
              >
                <p className="text-2xl font-bold text-[var(--lp-text)]">
                  {title}
                </p>
                <p className="mt-1 text-sm text-[var(--lp-muted)]">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="journey" className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 grid gap-6 lg:grid-cols-2 lg:items-end">
              <div>
                <p className="mb-4 text-sm font-bold text-[var(--lp-accent)]">
                  رحلة مهنية متكاملة
                </p>
                <h2 className="max-w-2xl text-4xl font-bold leading-tight sm:text-6xl">
                  ثلاث خطوات.
                  <br />
                  وجهة واحدة.
                </h2>
              </div>
              <p className="max-w-xl text-lg leading-9 text-[var(--lp-muted)] lg:justify-self-end">
                بدل التنقل بين أدوات متفرقة، يربط رُشد ملفك المهني بالفرص التي
                تناسبك والاستعداد اللازم للوصول إليها.
              </p>
            </div>

            <div className="grid border-y border-[var(--lp-border)] lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Link
                    key={feature.title}
                    to={feature.to}
                    className={`lp-feature lp-feature-${feature.tone} group relative min-h-[390px] border-b border-[var(--lp-border)] p-7 transition lg:border-b-0 lg:border-l last:lg:border-l-0 sm:p-9`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[var(--lp-muted)]">
                        {feature.number}
                      </span>
                      <Icon className="h-7 w-7 text-[var(--lp-accent)]" />
                    </div>
                    <div className="mt-24">
                      <h3 className="text-3xl font-bold">{feature.title}</h3>
                      <p className="mt-5 max-w-sm leading-8 text-[var(--lp-muted)]">
                        {feature.description}
                      </p>
                    </div>
                    <div className="absolute bottom-8 left-8 flex h-11 w-11 items-center justify-center border border-[var(--lp-border-strong)] transition group-hover:bg-[var(--lp-accent)] group-hover:text-[var(--lp-accent-ink)]">
                      <ArrowUpLeft className="h-5 w-5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="employers"
          className="bg-[var(--lp-deep)] px-4 py-24 text-[var(--lp-on-deep)] sm:px-6 lg:px-8 lg:py-28"
        >
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <span className="inline-flex h-12 w-12 items-center justify-center bg-[var(--lp-pistachio)] text-[var(--lp-deep)]">
                <Building2 className="h-6 w-6" />
              </span>
              <h2 className="mt-8 text-4xl font-bold leading-tight sm:text-6xl">
                المواهب المناسبة،
                <br />
                <span className="text-[var(--lp-mint)]">أقرب مما تتوقع.</span>
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-9 text-[var(--lp-on-deep-muted)]">
                انشر الوظائف، راجع المتقدمين، وتابع قرارات التوظيف من لوحة واحدة
                واضحة.
              </p>
              <Link
                to="/signup"
                className="mt-9 inline-flex min-h-14 items-center gap-3 bg-[var(--lp-mint)] px-7 font-bold text-[var(--lp-deep)] transition hover:bg-white"
              >
                أنشئ حساب شركة <ArrowLeft className="h-5 w-5" />
              </Link>
            </div>
            <div className="border border-[var(--lp-on-deep-border)] p-5 sm:p-8">
              {[
                "نشر وإدارة الوظائف",
                "فرز طلبات المتقدمين",
                "متابعة حالة كل مرشح",
                "ملف شركة احترافي",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-5 border-b border-[var(--lp-on-deep-border)] py-5 last:border-0"
                >
                  <span className="text-sm text-[var(--lp-mint)]">
                    0{index + 1}
                  </span>
                  <p className="flex-1 text-xl font-semibold">{item}</p>
                  <Check className="h-5 w-5 text-[var(--lp-pistachio)]" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
          <div className="relative mx-auto max-w-7xl overflow-hidden border border-[var(--lp-border-strong)] bg-[var(--lp-accent)] text-[var(--lp-accent-ink)]">
            <span className="absolute -left-8 -top-16 text-[14rem] font-bold leading-none opacity-[0.07]">
              ر
            </span>
            <div className="relative grid lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="px-6 py-14 sm:px-12 sm:py-16">
                <div className="mb-6 flex items-center gap-3 text-sm font-bold">
                  <ShieldCheck className="h-5 w-5" /> خطوتك الأولى تبدأ هنا
                </div>
                <h2 className="max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
                  حوّل استعدادك
                  <br />
                  إلى فرصة حقيقية.
                </h2>
                <p className="mt-5 max-w-xl text-lg opacity-75">
                  أنشئ ملفك المهني، وابنِ سيرتك، واكتشف الوظائف المناسبة لمسارك.
                </p>
              </div>
              <div className="grid border-t border-[var(--lp-deep)]/20 lg:min-w-64 lg:border-r lg:border-t-0">
                <Link
                  to="/signup"
                  className="group flex min-h-24 items-center justify-between gap-5 border-b border-[var(--lp-deep)]/20 px-7 font-bold transition hover:bg-[var(--lp-deep)] hover:text-white"
                >
                  ابدأ الآن{" "}
                  <ArrowUpLeft className="h-5 w-5 transition group-hover:-translate-x-1 group-hover:-translate-y-1" />
                </Link>
                <Link
                  to="/find-jobs"
                  className="group flex min-h-24 items-center justify-between gap-5 px-7 font-bold transition hover:bg-[var(--lp-deep)] hover:text-white"
                >
                  تصفح الوظائف <Search className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--lp-border)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-[var(--lp-muted)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center bg-[var(--lp-accent)] font-bold text-[var(--lp-accent-ink)]">
              ر
            </span>
            <strong className="text-lg text-[var(--lp-text)]">رُشد</strong>
          </div>
          <p>منصة مهنية عربية للباحثين عن عمل وأصحاب العمل.</p>
          <p dir="ltr">RUSHD © 2026</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
