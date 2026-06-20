import { ArrowUpLeft, BriefcaseBusiness, Check, FileText, Sparkles, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LuxuryDashboardLayout from "../../components/dashboard/LuxuryDashboardLayout";

const paths = [
  { number: "01", title: "اكتشف الوظائف", description: "ابحث، قارن، واحفظ الفرص المناسبة لمسارك.", icon: BriefcaseBusiness, to: "/find-jobs", action: "استعراض الفرص" },
  { number: "02", title: "ابنِ سيرتك", description: "أنشئ سيرة احترافية وشاركها مباشرة عند التقديم.", icon: FileText, to: "/resume-builder", action: "فتح منشئ السيرة" },
  { number: "03", title: "استعد للمقابلة", description: "تدرّب على أسئلة مخصصة حسب الدور الذي تستهدفه.", icon: Sparkles, to: "/interview-prep", action: "بدء التدريب" },
];

function JobSeekerDashboard() {
  const { user } = useAuth();
  const profileSteps = [
    { label: "الاسم الأساسي", done: Boolean(user?.name) },
    { label: "الصورة الشخصية", done: Boolean(user?.avatar) },
    { label: "السيرة المرفقة", done: Boolean(user?.resume) },
  ];
  const completed = profileSteps.filter((step) => step.done).length;

  return (
    <LuxuryDashboardLayout
      eyebrow="مسارك المهني"
      title={`مرحبًا${user?.name ? `، ${user.name}` : " بك"}`}
      description="اختر خطوتك التالية، وواصل بناء ملفك والوصول إلى الفرصة المناسبة."
      actions={<Link to="/find-jobs" className="inline-flex min-h-12 items-center gap-2 bg-[var(--rushd-accent)] px-5 font-bold text-[var(--rushd-ink)]"><BriefcaseBusiness className="h-5 w-5" /> استكشف الوظائف</Link>}
    >
      <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="grid border-t border-r border-[var(--rushd-border)] md:grid-cols-3">
          {paths.map((path) => {
            const Icon = path.icon;
            return (
              <Link key={path.title} to={path.to} className="group relative min-h-80 border-b border-l border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-6 transition hover:bg-[var(--rushd-card)]">
                <div className="flex items-center justify-between"><span className="text-sm font-bold text-[var(--rushd-muted)]">{path.number}</span><Icon className="h-6 w-6 text-[var(--rushd-accent)]" /></div>
                <h2 className="mt-16 text-2xl font-bold">{path.title}</h2>
                <p className="mt-4 leading-8 text-[var(--rushd-muted)]">{path.description}</p>
                <div className="absolute inset-x-6 bottom-6 flex items-center justify-between border-t border-[var(--rushd-border)] pt-4 text-sm font-bold text-[var(--rushd-accent)]"><span>{path.action}</span><ArrowUpLeft className="h-5 w-5 transition group-hover:-translate-x-1 group-hover:-translate-y-1" /></div>
              </Link>
            );
          })}
        </div>

        <aside className="self-start bg-[var(--rushd-surface)] p-6 shadow-[0_18px_55px_var(--rushd-shadow)]">
          <div className="flex items-center justify-between"><span className="flex h-11 w-11 items-center justify-center bg-[var(--rushd-card)] text-[var(--rushd-accent)]"><UserRound className="h-5 w-5" /></span><strong className="text-3xl text-[var(--rushd-accent)]">{completed}/3</strong></div>
          <h2 className="mt-6 text-xl font-bold">اكتمال الملف الأساسي</h2>
          <p className="mt-2 text-sm leading-7 text-[var(--rushd-muted)]">أكمل بياناتك لتكون جاهزًا عند التقديم.</p>
          <div className="mt-6 border-t border-[var(--rushd-border)] pt-3">
            {profileSteps.map((step) => <div key={step.label} className="flex items-center gap-3 py-3"><span className={`flex h-6 w-6 items-center justify-center border ${step.done ? "border-[var(--rushd-accent)] bg-[var(--rushd-accent)] text-[var(--rushd-ink)]" : "border-[var(--rushd-border)] text-[var(--rushd-muted)]"}`}>{step.done && <Check className="h-4 w-4" />}</span><span className={step.done ? "text-[var(--rushd-text)]" : "text-[var(--rushd-muted)]"}>{step.label}</span></div>)}
          </div>
          <Link to="/profile" className="mt-5 flex min-h-12 items-center justify-center border border-[var(--rushd-border-strong)] font-bold text-[var(--rushd-accent)] hover:bg-[var(--rushd-card)]">تحديث الملف</Link>
        </aside>
      </section>
    </LuxuryDashboardLayout>
  );
}

export default JobSeekerDashboard;
