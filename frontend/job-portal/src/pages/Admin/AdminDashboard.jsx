import { useCallback, useEffect, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  UserX,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import LuxuryDashboardLayout from "../../components/dashboard/LuxuryDashboardLayout";
import { EmptyState, LoadingPanel, StatCard } from "../../components/dashboard/DashboardWidgets";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const statusMeta = {
  pending: { label: "بانتظار الموافقة", variant: "warning" },
  active: { label: "نشط", variant: "success" },
  suspended: { label: "موقوف", variant: "destructive" },
};

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("ar-SA", { dateStyle: "medium" }).format(new Date(value))
    : "—";

function AdminDashboard() {
  const [data, setData] = useState({ employers: [], total: 0, counts: {} });
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [pendingAction, setPendingAction] = useState(null);

  const loadEmployers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.GET_EMPLOYERS, {
        params: { status: status || undefined, search: search || undefined, page },
      });
      setData(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "تعذر تحميل الحسابات");
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    const timer = setTimeout(loadEmployers, 300);
    return () => clearTimeout(timer);
  }, [loadEmployers]);

  useEffect(() => {
    if (!pendingAction) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape" && !updatingId) setPendingAction(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [pendingAction, updatingId]);

  const confirmStatusChange = async () => {
    if (!pendingAction) return;
    const { employer, nextStatus } = pendingAction;
    setUpdatingId(employer._id);
    try {
      const response = await axiosInstance.patch(
        API_PATHS.ADMIN.UPDATE_EMPLOYER_STATUS(employer._id),
        { status: nextStatus },
      );
      toast.success(response.data.message);
      setPendingAction(null);
      await loadEmployers();
    } catch (error) {
      toast.error(error.response?.data?.message || "تعذر تحديث الحساب");
    } finally {
      setUpdatingId("");
    }
  };

  const cards = [
    { label: "بانتظار الموافقة", value: data.counts?.pending || 0, hint: "طلبات تحتاج قرارك", icon: ShieldCheck, tone: "gold" },
    { label: "الحسابات النشطة", value: data.counts?.active || 0, hint: "يمكنها إدارة الوظائف", icon: CheckCircle2, tone: "green" },
    { label: "الحسابات الموقوفة", value: data.counts?.suspended || 0, hint: "لا يمكنها تسجيل الدخول", icon: UserX, tone: "red" },
  ];

  const modalIsSuspension = pendingAction?.nextStatus === "suspended";
  const modalAccountName = pendingAction?.employer.companyName || pendingAction?.employer.name;

  return (
    <LuxuryDashboardLayout
      role="admin"
      eyebrow="ADMIN CONTROL"
      title="إدارة أصحاب العمل"
      description="راجع الحسابات الجديدة، اعتمد الجهات الموثوقة، وأوقف أي حساب يحتاج إلى مراجعة."
      showSearch={false}
    >
      <section className="mb-6 grid gap-4 md:grid-cols-3">
        {cards.map((card) => <StatCard key={card.label} {...card} />)}
      </section>

      <section className="border border-[var(--rushd-border)] bg-[var(--rushd-surface)] shadow-[0_16px_45px_var(--rushd-shadow)]">
        <div className="flex flex-col gap-3 border-b border-[var(--rushd-border)] p-4 sm:flex-row sm:items-center">
          <label className="relative flex-1 sm:max-w-md">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--rushd-muted)]" />
            <input
              value={search}
              onChange={(event) => { setSearch(event.target.value); setPage(1); }}
              placeholder="ابحث بالاسم أو البريد أو الشركة"
              className="h-11 w-full border border-[var(--rushd-border)] bg-[var(--rushd-card)] pr-10 pl-4 text-sm outline-none transition focus:border-[var(--rushd-border-strong)]"
            />
          </label>
          <select
            value={status}
            onChange={(event) => { setStatus(event.target.value); setPage(1); }}
            className="h-11 border border-[var(--rushd-border)] bg-[var(--rushd-card)] px-4 text-sm font-bold outline-none focus:border-[var(--rushd-border-strong)]"
          >
            <option value="">كل الحالات</option>
            <option value="pending">بانتظار الموافقة</option>
            <option value="active">نشط</option>
            <option value="suspended">موقوف</option>
          </select>
          <button type="button" onClick={loadEmployers} aria-label="تحديث الحسابات" className="flex h-11 items-center justify-center gap-2 border border-[var(--rushd-border)] bg-[var(--rushd-card)] px-4 text-sm font-black text-[var(--rushd-muted)] transition hover:border-[var(--rushd-border-strong)] hover:text-[var(--rushd-text)]">
            <RefreshCw className="h-4 w-4" /> تحديث
          </button>
          <p className="text-sm font-bold text-[var(--rushd-muted)] sm:mr-auto">{data.total} حساب</p>
        </div>

        {loading ? (
          <div className="p-5"><LoadingPanel rows={5} /></div>
        ) : data.employers.length === 0 ? (
          <div className="p-5"><EmptyState icon={Building2} title="لا توجد حسابات مطابقة" description="جرّب تغيير البحث أو فلتر الحالة." /></div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[820px]">
              <TableHeader>
                <TableRow className="bg-[var(--rushd-card)] hover:bg-[var(--rushd-card)]">
                  <TableHead>صاحب العمل</TableHead><TableHead>الشركة</TableHead><TableHead>تاريخ التسجيل</TableHead><TableHead>الحالة</TableHead><TableHead className="text-left">الإجراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.employers.map((employer) => {
                  const currentStatus = employer.accountStatus || "active";
                  const meta = statusMeta[currentStatus];
                  return (
                    <TableRow key={employer._id}>
                      <TableCell><strong className="block text-[var(--rushd-text)]">{employer.name}</strong><small dir="ltr" className="mt-1 block w-fit text-[var(--rushd-muted)]">{employer.email}</small></TableCell>
                      <TableCell>{employer.companyName || <span className="text-[var(--rushd-muted)]">لم تُضف بعد</span>}</TableCell>
                      <TableCell className="text-[var(--rushd-muted)]">{formatDate(employer.createdAt)}</TableCell>
                      <TableCell><Badge variant={meta.variant}>{meta.label}</Badge></TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          {currentStatus === "active" ? (
                            <button type="button" onClick={() => setPendingAction({ employer, nextStatus: "suspended" })} className="inline-flex min-h-10 items-center gap-2 border border-[var(--rushd-danger-border)] bg-[var(--rushd-danger-bg)] px-4 text-sm font-black text-[var(--rushd-danger-text)] transition hover:-translate-y-0.5"><UserX className="h-4 w-4" /> إيقاف الحساب</button>
                          ) : (
                            <button type="button" onClick={() => setPendingAction({ employer, nextStatus: "active" })} className="inline-flex min-h-10 items-center gap-2 bg-[var(--rushd-accent)] px-4 text-sm font-black text-[var(--rushd-ink)] transition hover:-translate-y-0.5"><CheckCircle2 className="h-4 w-4" /> {currentStatus === "pending" ? "اعتماد الحساب" : "إعادة التفعيل"}</button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {!loading && data.pages > 1 && (
          <div className="flex items-center justify-between border-t border-[var(--rushd-border)] p-4 text-sm">
            <span className="font-bold text-[var(--rushd-muted)]">صفحة {data.page} من {data.pages}</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="border border-[var(--rushd-border)] bg-[var(--rushd-card)] px-4 py-2 font-black disabled:opacity-40">السابق</button>
              <button disabled={page >= data.pages} onClick={() => setPage((value) => value + 1)} className="border border-[var(--rushd-border)] bg-[var(--rushd-card)] px-4 py-2 font-black disabled:opacity-40">التالي</button>
            </div>
          </div>
        )}
      </section>

      {pendingAction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="admin-confirm-title">
          <button type="button" aria-label="إغلاق نافذة التأكيد" onClick={() => !updatingId && setPendingAction(null)} className="absolute inset-0 bg-[#021512]/75 backdrop-blur-sm" />
          <div className="relative w-full max-w-md border border-[var(--rushd-border-strong)] bg-[var(--rushd-surface-strong)] p-6 shadow-[0_30px_100px_rgba(0,0,0,.4)] sm:p-7">
            <button type="button" disabled={Boolean(updatingId)} onClick={() => setPendingAction(null)} className="absolute left-4 top-4 p-2 text-[var(--rushd-muted)] transition hover:bg-[var(--rushd-card)] hover:text-[var(--rushd-text)] disabled:opacity-40" aria-label="إغلاق"><X className="h-5 w-5" /></button>
            <span className={`flex h-14 w-14 items-center justify-center border ${modalIsSuspension ? "border-[var(--rushd-danger-border)] bg-[var(--rushd-danger-bg)] text-[var(--rushd-danger-text)]" : "border-[var(--rushd-success-border)] bg-[var(--rushd-success-bg)] text-[var(--rushd-success-text)]"}`}>
              {modalIsSuspension ? <UserX className="h-7 w-7" /> : <ShieldCheck className="h-7 w-7" />}
            </span>
            <p className="mt-5 text-xs font-black tracking-widest text-[var(--rushd-accent)]">تأكيد الإجراء</p>
            <h2 id="admin-confirm-title" className="mt-2 text-2xl font-black text-[var(--rushd-text)]">{modalIsSuspension ? "إيقاف حساب صاحب العمل؟" : pendingAction.employer.accountStatus === "pending" ? "اعتماد حساب صاحب العمل؟" : "إعادة تفعيل الحساب؟"}</h2>
            <p className="mt-3 leading-7 text-[var(--rushd-muted)]">
              {modalIsSuspension
                ? <>لن يتمكن <strong className="text-[var(--rushd-text)]">{modalAccountName}</strong> من تسجيل الدخول أو إدارة وظائفه حتى تعيد تفعيل الحساب.</>
                : <>سيتمكن <strong className="text-[var(--rushd-text)]">{modalAccountName}</strong> من تسجيل الدخول ونشر الوظائف وإدارتها.</>}
            </p>
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" disabled={Boolean(updatingId)} onClick={() => setPendingAction(null)} className="min-h-11 border border-[var(--rushd-border)] px-5 font-black text-[var(--rushd-muted)] transition hover:bg-[var(--rushd-card)] hover:text-[var(--rushd-text)] disabled:opacity-40">تراجع</button>
              <button type="button" disabled={Boolean(updatingId)} onClick={confirmStatusChange} className={`inline-flex min-h-11 items-center justify-center gap-2 px-5 font-black disabled:opacity-60 ${modalIsSuspension ? "bg-[var(--rushd-danger-text)] text-white" : "bg-[var(--rushd-accent)] text-[var(--rushd-ink)]"}`}>
                {updatingId && <Loader2 className="h-4 w-4 animate-spin" />}
                {updatingId ? "جاري التنفيذ..." : modalIsSuspension ? "نعم، أوقف الحساب" : "تأكيد التفعيل"}
              </button>
            </div>
          </div>
        </div>
      )}
    </LuxuryDashboardLayout>
  );
}

export default AdminDashboard;
