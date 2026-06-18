
import {
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  FileText,
  Sparkles,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LuxuryDashboardLayout from "../../components/dashboard/LuxuryDashboardLayout";
import { MiniBarChart, StatCard } from "../../components/dashboard/DashboardWidgets";
import { Card } from "../../components/ui/card";

function JobSeekerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const sections = [
    {
      title: "الوظائف",
      eyebrow: "JOBS",
      description:
        "استكشف الفرص المتاحة، راجع تفاصيل الوظائف، واحفظ الفرص المناسبة لمسارك.",
      icon: BriefcaseBusiness,
      action: "استعراض الوظائف",
      onClick: () => navigate("/find-jobs"),
      enabled: true,
    },
    {
      title: "التحضير للمقابلات الوظيفية",
      eyebrow: "INTERVIEW_PREP",
      description:
        "أنشئ جلسات تدريب ذكية، راجع الأسئلة، واستعد للمقابلة بثقة.",
      icon: Sparkles,
      action: "ابدأ التحضير",
      onClick: () => navigate("/interview-prep"),
      enabled: true,
    },
    {
      title: "السيرة الذاتية",
      eyebrow: "RESUME",
      description:
        "أنشئ سيرتك الذاتية، عدّل أقسامها، وشارك نسخة عامة عند الحاجة.",
      icon: FileText,
      action: "بناء السيرة",
      onClick: () => navigate("/resume-builder"),
      enabled: true,
    },
  ];

  return (
    <LuxuryDashboardLayout
      title={`أهلاً ${user?.name ? `، ${user.name}` : "بك"} في لوحة رُشد`}
      eyebrow="JOB SEEKER"
      description="مساحة واحدة لمسارك المهني: استكشف الفرص، جهز سيرتك، واستعد للمقابلات بثقة."
    >
      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard icon={BriefcaseBusiness} label="مسارات نشطة" value="3" hint="وظائف، سيرة، مقابلات" />
        <StatCard icon={Sparkles} label="تحضير ذكي" value="AI" hint="جلسات مقابلات مخصصة" tone="green" />
        <StatCard icon={Target} label="هدف اليوم" value="جاهزية" hint="خطوات عملية للتقديم" tone="blue" />
      </section>

      <section className="mb-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="overflow-hidden p-6">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-xl border border-[var(--rushd-border-strong)] bg-[var(--rushd-card)] px-4 py-2 text-sm font-bold text-[var(--rushd-accent)]">
                <BadgeCheck className="h-4 w-4" />
                تجربة جاهزة للعرض والمناقشة
              </div>
              <h2 className="max-w-3xl text-3xl font-black leading-tight md:text-5xl">
                منصة مهنية فاخرة تجمع أهم أدوات الباحث عن عمل.
              </h2>
              <p className="mt-5 max-w-2xl leading-8 text-[var(--rushd-muted)]">
                اختر القسم الذي تريد العمل عليه اليوم. كل مسار يحافظ على بياناتك الحالية ويقودك مباشرة إلى الوظيفة أو السيرة أو التدريب.
              </p>
            </div>
          </div>
        </Card>
        <MiniBarChart
          items={[
            { label: "الوظائف", value: 3 },
            { label: "التحضير", value: 2 },
            { label: "السيرة", value: 1 },
          ]}
        />
      </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <button
                key={section.title}
                type="button"
                disabled={!section.enabled}
                onClick={section.onClick}
                className={`group relative min-h-72 overflow-hidden rounded-2xl border p-6 text-right shadow-2xl shadow-black/20 transition ${
                  section.enabled
                    ? "border-[var(--rushd-border)] bg-[var(--rushd-surface)] hover:-translate-y-1 hover:border-[var(--rushd-border-strong)] hover:shadow-[0_22px_80px_var(--rushd-glow)]"
                    : "cursor-not-allowed border-white/8 bg-[var(--rushd-surface)] opacity-70"
                }`}
              >
                <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(var(--rushd-glow)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:28px_28px]" />
                <div className="relative flex h-full flex-col">
                  <div className="mb-8 flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,var(--rushd-accent-2),#9b6b24)] text-[var(--rushd-ink)]">
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="font-mono text-xs font-bold text-[var(--rushd-accent)]">
                      {section.eyebrow}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-[var(--rushd-text)]">
                    {section.title}
                  </h3>
                  <p className="mt-4 flex-1 leading-8 text-[var(--rushd-muted)]">
                    {section.description}
                  </p>

                  <div
                    className={`mt-8 inline-flex items-center gap-2 text-sm font-black ${
                      section.enabled ? "text-[var(--rushd-accent)]" : "text-[var(--rushd-muted)]"
                    }`}
                  >
                    {section.action}
                    {section.enabled && (
                      <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </section>
    </LuxuryDashboardLayout>
  );
}

export default JobSeekerDashboard;
