import { Link } from "react-router-dom";
import {
  ArrowUpLeft,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  FilePlus2,
  Users,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import LuxuryDashboardLayout from "../../components/dashboard/LuxuryDashboardLayout";

const workspaceActions = [
  { number: "01", title: "نشر وظيفة", description: "أنشئ إعلانًا واضحًا وحدد المتطلبات ونوع الدوام.", icon: FilePlus2, to: "/post-job" },
  { number: "02", title: "إدارة الوظائف", description: "راجع الفرص المنشورة وعدّل حالتها وتفاصيلها.", icon: BriefcaseBusiness, to: "/manage-jobs" },
  { number: "03", title: "مراجعة المتقدمين", description: "انتقل بين الطلبات وحدّث مرحلة كل مرشح.", icon: Users, to: "/applicants" },
  { number: "04", title: "ملف الشركة", description: "حدّث الهوية التي يراها الباحثون عن عمل.", icon: Building2, to: "/company-profile" },
];

function EmployerDashboard() {
  const { user } = useAuth();
  const companyName = user?.companyName || user?.name || "شركتك";

  return (
    <LuxuryDashboardLayout
      role="employer"
      eyebrow="مساحة العمل"
      title={`مرحبًا، ${companyName}`}
      description="كل ما تحتاجه لنشر الفرص وإدارة المرشحين وبناء حضور شركتك في مكان واحد."
      actions={<Link to="/post-job" className="inline-flex min-h-12 items-center gap-2 bg-[var(--rushd-accent)] px-5 font-bold text-[var(--rushd-ink)]"><FilePlus2 className="h-5 w-5" /> نشر وظيفة</Link>}
    >
      <section className="mb-6 grid border border-[var(--rushd-border)] bg-[var(--rushd-surface)] sm:grid-cols-3">
        {[
          [BriefcaseBusiness, "الوظائف", "نشر وإدارة"],
          [Users, "المرشحون", "فرز ومتابعة"],
          [CheckCircle2, "سير العمل", "واضح ومترابط"],
        ].map(([Icon, title, detail], index) => (
          <div key={title} className={`flex items-center gap-4 p-5 ${index < 2 ? "border-b border-[var(--rushd-border)] sm:border-b-0 sm:border-l" : ""}`}>
            <span className="flex h-12 w-12 items-center justify-center bg-[var(--rushd-card)] text-[var(--rushd-accent)]"><Icon className="h-6 w-6" /></span>
            <span><strong className="block text-lg">{title}</strong><small className="text-[var(--rushd-muted)]">{detail}</small></span>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="grid border-t border-r border-[var(--rushd-border)] md:grid-cols-2">
          {workspaceActions.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} to={item.to} className="group relative min-h-64 border-b border-l border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-6 transition hover:bg-[var(--rushd-card)] sm:p-7">
                <div className="flex items-center justify-between"><span className="text-sm font-bold text-[var(--rushd-muted)]">{item.number}</span><Icon className="h-6 w-6 text-[var(--rushd-accent)]" /></div>
                <h2 className="mt-14 text-2xl font-bold">{item.title}</h2>
                <p className="mt-3 max-w-sm leading-7 text-[var(--rushd-muted)]">{item.description}</p>
                <ArrowUpLeft className="absolute bottom-6 left-6 h-5 w-5 transition group-hover:-translate-x-1 group-hover:-translate-y-1" />
              </Link>
            );
          })}
        </div>

        <aside className="bg-[var(--rushd-surface)] p-6 shadow-[0_18px_55px_var(--rushd-shadow)]">
          <p className="text-sm font-bold text-[var(--rushd-accent)]">ابدأ من هنا</p>
          <h2 className="mt-3 text-2xl font-bold">رحلة توظيف مرتبة</h2>
          <div className="mt-7">
            {["أكمل هوية الشركة", "انشر تفاصيل الفرصة", "راجع الطلبات الواردة", "حدّث حالة المرشحين"].map((step, index) => (
              <div key={step} className="flex gap-4 border-b border-[var(--rushd-border)] py-4 last:border-0">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-[var(--rushd-card)] text-xs font-bold text-[var(--rushd-accent)]">{index + 1}</span>
                <p className="font-semibold">{step}</p>
              </div>
            ))}
          </div>
          <Link to="/company-profile" className="mt-7 flex min-h-12 items-center justify-center border border-[var(--rushd-border-strong)] font-bold text-[var(--rushd-accent)] transition hover:bg-[var(--rushd-card)]">مراجعة ملف الشركة</Link>
        </aside>
      </section>
    </LuxuryDashboardLayout>
  );
}

export default EmployerDashboard;
