import {
  ArrowLeft,
  Building2,
  FileText,
  Mic,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  const liveItems = [
    { icon: FileText, label: "سيرة محسّنة", value: "92%" },
    { icon: Search, label: "وظائف مطابقة", value: "18" },
    { icon: Mic, label: "أسئلة مقابلة", value: "10" },
    { icon: ShieldCheck, label: "شركة موثقة", value: "نشط" },
  ];

  return (
    <section
      dir="rtl"
      className="relative isolate min-h-screen overflow-hidden bg-[var(--rushd-bg)] pt-20 text-[var(--rushd-text)]"
    >
      <div className="landing-grid absolute inset-0 -z-10 opacity-[0.22] [background-image:linear-gradient(var(--rushd-grid)_1px,transparent_1px),linear-gradient(90deg,var(--rushd-grid-2)_1px,transparent_1px)] [background-size:120px_120px]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-[var(--rushd-border)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-px bg-[var(--rushd-border)]" />
      <div className="absolute right-[14%] top-[18%] -z-10 h-28 w-px bg-[var(--rushd-border)]" />
      <div className="absolute bottom-[12%] left-[18%] -z-10 h-px w-32 bg-[var(--rushd-border)]" />
      <div className="scan-line absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-transparent via-[var(--rushd-glow)] to-transparent" />

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col items-center justify-center px-4 py-14 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-md border border-[var(--rushd-border)] bg-[var(--rushd-card)] px-4 py-2 text-sm font-semibold text-[var(--rushd-muted)] backdrop-blur transition hover:border-[var(--rushd-border-strong)]">
          <span className="h-2 w-2 bg-[var(--rushd-accent)]" />
          منصة التوظيف الذكية لطلاب الجامعة والخريجين
        </div>

        <h1 className="mt-16 max-w-6xl text-5xl font-bold leading-[1.08] tracking-normal text-[var(--rushd-text)] sm:text-7xl lg:text-8xl">
          بوابتك الذكية
          <span className="block text-[var(--rushd-accent)]">نحو أول فرصة مهنية</span>
        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-9 text-[var(--rushd-muted)] sm:text-xl">
          ابنِ سيرتك الذاتية، استكشف الوظائف المناسبة، تابع تقديماتك، وتدرّب
          على المقابلات في منصة عربية واحدة مصممة للطلاب والشركات.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/find-jobs")}
            className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-md bg-[var(--rushd-accent)] px-7 text-base font-bold text-[var(--rushd-ink)] transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--rushd-accent-2)] hover:shadow-[0_18px_60px_var(--rushd-glow)]"
          >
            <Search className="h-5 w-5" />
            <span>استكشف الوظائف</span>
            <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
          </button>

          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-md border border-[var(--rushd-border)] bg-[var(--rushd-card)] px-7 text-base font-bold text-[var(--rushd-text)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[var(--rushd-border-strong)]"
          >
            <Building2 className="h-5 w-5" />
            <span>انضم كشركة</span>
          </button>
        </div>

        <div className="mt-7 flex items-center gap-3 rounded-md border border-[var(--rushd-border)] bg-[var(--rushd-surface)] px-5 py-3 font-mono text-sm text-[var(--rushd-muted)] shadow-2xl">
          <span className="text-[var(--rushd-accent)]">▲</span>
          <span>~ smart-career-hub start</span>
          <span className="h-4 w-2 animate-pulse bg-[var(--rushd-accent)]" />
        </div>

        <div className="float-soft mt-8 w-full max-w-4xl overflow-hidden rounded-lg border border-[var(--rushd-border)] bg-[var(--rushd-surface)] text-right shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between border-b border-[var(--rushd-border)] px-5 py-4">
            <div>
              <p className="font-mono text-xs text-[var(--rushd-muted)]">LIVE_PREVIEW</p>
              <h2 className="mt-1 font-bold text-[var(--rushd-text)]">لوحة الجاهزية المهنية</h2>
            </div>
            <div className="font-mono text-xs text-[var(--rushd-muted)]">SYNCING...</div>
          </div>
          <div className="grid gap-px bg-[var(--rushd-border)] sm:grid-cols-4">
            {liveItems.map((item) => (
              <div key={item.label} className="group bg-[var(--rushd-surface-strong)] px-5 py-5">
                <item.icon className="mb-6 h-5 w-5 text-[var(--rushd-muted)] transition group-hover:text-[var(--rushd-accent)]" />
                <div className="text-2xl font-bold text-[var(--rushd-text)]">{item.value}</div>
                <div className="mt-1 text-sm text-[var(--rushd-muted)]">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
