import {
  ArrowLeft,
  BadgeCheck,
  Bot,
  BriefcaseBusiness,
  Check,
  ChevronLeft,
  FileText,
  GraduationCap,
  Layers3,
  MessageSquareText,
  Sparkles,
  UserRoundCheck,
  Zap,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import { useTheme } from "../../context/ThemeContext";

const modules = [
  {
    title: "الوظائف",
    subtitle: "Find Jobs",
    description: "بحث، حفظ، تقديم بسيرة ذاتية، وتتبع حالة الطلب.",
    icon: BriefcaseBusiness,
    to: "/find-jobs",
  },
  {
    title: "السيرة الذاتية",
    subtitle: "ATS Resume",
    description: "قالب احترافي، حفظ تلقائي، ومعاينة عامة للتقديم.",
    icon: FileText,
    to: "/resume-builder",
  },
  {
    title: "المقابلات",
    subtitle: "AI Interview Prep",
    description: "جلسات تدريب وأسئلة مخصصة حسب الدور والمهارات.",
    icon: MessageSquareText,
    to: "/interview-prep",
  },
];

const proof = [
  "منصة واحدة بدل ثلاث أدوات منفصلة",
  "تقديم على الوظائف بسيرة من داخل النظام",
  "لوحة صاحب عمل لإدارة الوظائف والمتقدمين",
  "تجربة عربية RTL بثيم رشد",
];

function LandingPage() {
  const navigate = useNavigate();
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <div
      dir="rtl"
      className="min-h-screen overflow-hidden bg-[var(--lp-bg)] text-[var(--lp-text)] transition-colors duration-500"
    >
      <Header
        mode={theme}
        onToggleMode={toggleTheme}
      />

      <section className="relative isolate px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: isDark
              ? "radial-gradient(circle at 50% 0%, rgba(214,168,79,.24), transparent 34%), radial-gradient(circle at 10% 25%, rgba(155,107,36,.16), transparent 28%), linear-gradient(180deg, var(--lp-bg) 0%, var(--lp-bg-2) 60%, var(--lp-bg) 100%)"
              : "radial-gradient(circle at 50% 0%, rgba(214,168,79,.24), transparent 34%), radial-gradient(circle at 12% 24%, rgba(155,107,36,.14), transparent 30%), linear-gradient(180deg, var(--lp-bg) 0%, var(--lp-bg-2) 62%, var(--lp-bg) 100%)",
          }}
        />
        <div className="landing-grid absolute inset-0 -z-10 opacity-[0.18] [background-image:linear-gradient(var(--lp-grid)_1px,transparent_1px),linear-gradient(90deg,var(--lp-grid-2)_1px,transparent_1px)] [background-size:90px_90px]" />
        <div className="absolute left-1/2 top-24 -z-10 h-[620px] w-[620px] -translate-x-1/2 rounded-full border border-[var(--lp-border-strong)] bg-[var(--lp-accent)]/10 blur-3xl" />

        <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.88fr]">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--rushd-badge-border)] bg-[var(--rushd-badge-bg)] px-4 py-2 text-sm font-black text-[var(--rushd-badge-text)] shadow-sm">
              <Zap className="h-4 w-4" />
              منصة تخرج جاهزة للعرض
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl">
              رُشد
              <span className="block bg-gradient-to-l from-[var(--lp-accent)] via-[var(--lp-text)] to-[var(--lp-accent-2)] bg-clip-text text-transparent">
                نظام مهني متكامل
              </span>
              للطالب وصاحب العمل
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-9 text-[var(--lp-muted)] sm:text-xl">
              وظائف، سيرة ذاتية ATS، وتحضير مقابلات بالذكاء الاصطناعي داخل منصة
              واحدة مصممة لتقليل التشتت وتحويل الطالب إلى مرشح جاهز.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[var(--lp-accent)] px-7 font-black text-[var(--lp-ink)] shadow-[0_0_44px_var(--lp-glow)] transition hover:-translate-y-1"
              >
                ابدأ التجربة
                <ArrowLeft className="h-5 w-5 transition group-hover:-translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => navigate("/find-jobs")}
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-[var(--lp-border)] bg-[var(--lp-card)] px-7 font-black text-[var(--lp-text)] backdrop-blur transition hover:-translate-y-1 hover:border-[var(--lp-border-strong)]"
              >
                تصفح الوظائف
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {proof.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-[var(--lp-border)] bg-[var(--lp-card)] px-4 py-3 text-sm font-bold text-[var(--lp-muted)]"
                >
                  <Check className="h-5 w-5 text-[var(--lp-accent)]" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-[var(--lp-accent)]/12 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-[var(--lp-border)] bg-[var(--lp-surface)] p-4 shadow-2xl backdrop-blur-2xl" style={{ boxShadow: "0 32px 80px var(--lp-shadow)" }}>
              <div className="mb-4 flex items-center justify-between rounded-3xl border border-[var(--lp-border)] bg-[var(--lp-card)] p-4">
                <div>
                  <p className="font-mono text-xs font-black text-[var(--lp-accent)]">RUSHD_DASHBOARD</p>
                  <h2 className="mt-2 text-2xl font-black">جاهزية الباحث</h2>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--lp-accent)] text-[var(--lp-ink)]">
                  <BadgeCheck className="h-7 w-7" />
                </div>
              </div>

              <div className="grid gap-3">
                {[
                  ["Resume ATS", "94%", FileText],
                  ["Job Match", "28 فرصة", BriefcaseBusiness],
                  ["Interview Prep", "10 أسئلة", Bot],
                ].map(([label, value, Icon]) => (
                  <div
                    key={label}
                    className="rounded-3xl border border-[var(--lp-border)] bg-[var(--lp-card)] p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--lp-accent)]/12 text-[var(--lp-accent)]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="font-black text-[var(--lp-text)]">{label}</span>
                      </div>
                      <span className="font-black text-[var(--lp-accent)]">{value}</span>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--lp-card)]">
                      <div className="h-full w-[82%] rounded-full bg-gradient-to-l from-[var(--lp-accent)] to-[var(--lp-accent-2)]" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-3xl border border-[var(--lp-border-strong)] bg-[var(--lp-accent)]/10 p-4">
                <p className="text-sm font-black text-[var(--lp-accent)]">Next Best Action</p>
                <p className="mt-2 leading-7 text-[var(--lp-muted)]">
                  قدّم على وظيفة Frontend Developer باستخدام سيرة Ahmed ATS.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="border-y border-[var(--lp-border)] bg-[var(--lp-surface)] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-4">
          {[
            ["3", "أنظمة مترابطة"],
            ["ATS", "سيرة احترافية"],
            ["AI", "مقابلات ذكية"],
            ["RTL", "تجربة عربية"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-[2rem] border border-[var(--lp-border)] bg-[var(--lp-card)] p-7">
              <p className="text-5xl font-black text-[var(--lp-accent)]">{value}</p>
              <p className="mt-3 font-bold text-[var(--lp-muted)]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="modules" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="font-mono text-sm font-black text-[var(--lp-accent)]">THREE_MODULES</p>
              <h2 className="mt-3 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
                كل شيء يحتاجه الطالب قبل أول فرصة
              </h2>
            </div>
            <p className="max-w-md leading-8 text-[var(--lp-muted)]">
              الفكرة ليست صفحات كثيرة، بل رحلة واحدة: بناء ملف، العثور على وظيفة،
              ثم الاستعداد للمقابلة.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Link
                  key={module.title}
                  to={module.to}
                  className="group relative min-h-96 overflow-hidden rounded-[2rem] border border-[var(--lp-border)] bg-[var(--lp-surface-strong)] p-7 shadow-2xl transition hover:-translate-y-2 hover:border-[var(--lp-border-strong)]"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,var(--lp-glow),transparent_34%)] opacity-0 transition group-hover:opacity-100" />
                  <div className="relative">
                    <div className="mb-16 flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--lp-accent)] text-[var(--lp-ink)]">
                      <Icon className="h-8 w-8" />
                    </div>
                    <p className="font-mono text-xs font-black text-[var(--lp-accent)]">{module.subtitle}</p>
                    <h3 className="mt-3 text-3xl font-black">{module.title}</h3>
                    <p className="mt-5 leading-8 text-[var(--lp-muted)]">{module.description}</p>
                    <div className="mt-10 inline-flex items-center gap-2 font-black text-[var(--lp-accent)]">
                      فتح القسم
                      <ArrowLeft className="h-5 w-5 transition group-hover:-translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="ai" className="relative overflow-hidden border-y border-[var(--lp-border)] bg-[var(--lp-accent)] px-4 py-24 text-[var(--lp-ink)] sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(var(--lp-ink)_1px,transparent_1px),linear-gradient(90deg,var(--lp-ink)_1px,transparent_1px)] [background-size:80px_80px]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="font-mono text-sm font-black">AI_LAYER</p>
            <h2 className="mt-3 text-4xl font-black leading-tight sm:text-6xl">
              الذكاء الاصطناعي يخدم القرار، لا يزاحم المستخدم
            </h2>
            <p className="mt-6 text-lg leading-9 opacity-75">
              يساعد في صياغة السيرة، توليد أسئلة مقابلة، وربط جاهزية الطالب
              بالوظيفة التي يستهدفها.
            </p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-[2rem] border border-[var(--lp-ink)]/15 bg-[var(--lp-ink)]/15 sm:grid-cols-2">
            {[
              [Sparkles, "صياغة مهنية للسيرة"],
              [BriefcaseBusiness, "تقديم مرتبط بالـ CV"],
              [MessageSquareText, "أسئلة مقابلة مخصصة"],
              [Layers3, "منصة واحدة متصلة"],
            ].map(([Icon, label]) => (
              <div key={label} className="bg-[var(--lp-accent)] p-8">
                <Icon className="mb-10 h-8 w-8" />
                <p className="text-2xl font-black">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-24 text-center sm:px-6 lg:px-8">
        <GraduationCap className="mx-auto mb-7 h-12 w-12 text-[var(--lp-accent)]" />
        <h2 className="mx-auto max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
          جاهز نشوف الرحلة كاملة؟
        </h2>
        <p className="mx-auto mt-5 max-w-2xl leading-8 text-[var(--lp-muted)]">
          جرّب إنشاء حساب، بناء سيرة، التقديم على وظيفة، ثم مراجعة الطلب من لوحة صاحب العمل.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/signup"
            className="rounded-2xl bg-[var(--lp-accent)] px-7 py-4 font-black text-[var(--lp-ink)] transition hover:scale-[1.02]"
          >
            إنشاء حساب
          </Link>
          <Link
            to="/login"
            className="rounded-2xl border border-[var(--lp-border)] px-7 py-4 font-black text-[var(--lp-muted)] transition hover:border-[var(--lp-border-strong)] hover:text-[var(--lp-text)]"
          >
            تسجيل الدخول
          </Link>
        </div>
        <UserRoundCheck className="mx-auto mt-14 h-8 w-8 text-[var(--lp-muted)] opacity-40" />
      </section>
    </div>
  );
}

export default LandingPage;
