import { Link } from "react-router-dom";
import { BriefcaseBusiness, FilePlus2, Users, Building2, Crown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import LuxuryDashboardLayout from "../../components/dashboard/LuxuryDashboardLayout";
import { MiniBarChart, StatCard } from "../../components/dashboard/DashboardWidgets";

function EmployerDashboard() {
  const { user } = useAuth();

  const cards = [
    {
      title: "نشر وظيفة",
      description: "أنشئ إعلان وظيفة واضح مع المتطلبات والراتب ونوع الدوام.",
      icon: FilePlus2,
      to: "/post-job",
    },
    {
      title: "إدارة الوظائف",
      description: "راجع وظائفك المنشورة، أغلق الفرص، أو عدّل التفاصيل.",
      icon: BriefcaseBusiness,
      to: "/manage-jobs",
    },
    {
      title: "المتقدمون",
      description: "تابع طلبات التقديم وغيّر حالة المرشحين.",
      icon: Users,
      to: "/applicants",
    },
    {
      title: "ملف الشركة",
      description: "حدّث اسم الشركة والوصف والشعار الذي يظهر للباحثين.",
      icon: Building2,
      to: "/company-profile",
    },
  ];

  return (
    <LuxuryDashboardLayout
      role="employer"
      eyebrow="EMPLOYER"
      title={`أهلاً ${user?.companyName || user?.name || "بك"}`}
      description="إدارة راقية لإعلانات الوظائف، المتقدمين، وهوية الشركة داخل منصة رُشد الموحدة."
    >
      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard icon={BriefcaseBusiness} label="مركز الوظائف" value="نشط" hint="نشر وإدارة وتحديث" />
        <StatCard icon={Users} label="المتقدمون" value="متابعة" hint="حالات واضحة لكل طلب" tone="blue" />
        <StatCard icon={Crown} label="هوية الشركة" value="Premium" hint="عرض احترافي للباحثين" tone="green" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-5 md:grid-cols-2">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                to={card.to}
                className="group rounded-2xl border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-6 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-[var(--rushd-border-strong)]"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,var(--rushd-accent-2),#9b6b24)] text-[var(--rushd-ink)]">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-black">{card.title}</h3>
                <p className="mt-3 leading-8 text-[var(--rushd-muted)]">{card.description}</p>
              </Link>
            );
          })}
        </div>
        <MiniBarChart
          items={[
            { label: "نشر وظيفة", value: 4 },
            { label: "إدارة", value: 3 },
            { label: "متقدمون", value: 2 },
            { label: "ملف الشركة", value: 1 },
          ]}
        />
      </section>
    </LuxuryDashboardLayout>
  );
}

export default EmployerDashboard;
