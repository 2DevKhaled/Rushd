import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Loader2, Plus, Trash2, Upload } from "lucide-react";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";
import axiosInstance from "../../pages/utils/axiosInstance";
import { API_PATHS } from "../../pages/utils/apiPaths";
import LuxuryDashboardLayout from "../../components/dashboard/LuxuryDashboardLayout";
import { EmptyState, LoadingPanel } from "../../components/dashboard/DashboardWidgets";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

function ResumeDashboard() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [title, setTitle] = useState("سيرة ذاتية جديدة");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [importing, setImporting] = useState(false);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.RESUMES.GET_MY);
      setResumes(response.data?.resumes || []);
    } catch (error) {
      toast.error(getErrorMessage(error, "تعذر تحميل السير الذاتية"));
    } finally {
      setLoading(false);
    }
  };

  const createResume = async (event) => {
    event.preventDefault();

    try {
      setCreating(true);
      const response = await axiosInstance.post(API_PATHS.RESUMES.CREATE, {
        title: title.trim() || "سيرة ذاتية جديدة",
      });
      toast.success("تم إنشاء السيرة الذاتية");
      navigate(`/resume-builder/${response.data.resume._id}`);
    } catch (error) {
      toast.error(getErrorMessage(error, "تعذر إنشاء السيرة الذاتية"));
    } finally {
      setCreating(false);
    }
  };

  const importResume = async (event) => {
    event.preventDefault();

    if (!resumeFile) {
      toast.error("اختر ملف PDF أولاً");
      return;
    }

    try {
      setImporting(true);
      const resumeText = await pdfToText(resumeFile);
      const response = await axiosInstance.post(API_PATHS.RESUME_AI.UPLOAD_RESUME, {
        title: title.trim() || resumeFile.name.replace(/\.pdf$/i, ""),
        resumeText,
      });

      toast.success(response.data?.fallback ? "تم إنشاء سيرة قابلة للتعديل" : "تم استيراد السيرة الذاتية");
      navigate(`/resume-builder/${response.data.resume._id}`);
    } catch (error) {
      toast.error(getErrorMessage(error, "تعذر استيراد ملف السيرة"));
    } finally {
      setImporting(false);
    }
  };

  const deleteResume = async (resumeId) => {
    const confirmed = window.confirm("هل تريد حذف هذه السيرة الذاتية؟");
    if (!confirmed) return;

    try {
      await axiosInstance.delete(API_PATHS.RESUMES.DELETE(resumeId));
      setResumes((current) => current.filter((resume) => resume._id !== resumeId));
      toast.success("تم حذف السيرة الذاتية");
    } catch (error) {
      toast.error(getErrorMessage(error, "تعذر حذف السيرة الذاتية"));
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  return (
    <LuxuryDashboardLayout
      eyebrow="مساحة السير الذاتية"
      title="ابنِ سيرة ذاتية جاهزة للتقديم"
      description="أنشئ نسخة منظمة، عدّل الأقسام، غيّر القالب واللون، وشارك رابط معاينة عام عند الحاجة."
    >
        <section className="mb-6 grid border border-[var(--rushd-border)] bg-[var(--rushd-surface)] md:grid-cols-3">
          {[[FileText, "السير المحفوظة", loading ? "..." : resumes.length], [Upload, "استيراد PDF", "متاح"], [Plus, "إنشاء جديد", "فوري"]].map(([Icon, label, value], index) => <div key={label} className={`flex items-center gap-4 p-5 ${index < 2 ? "border-b border-[var(--rushd-border)] md:border-b-0 md:border-l" : ""}`}><span className="flex h-11 w-11 items-center justify-center bg-[var(--rushd-card)] text-[var(--rushd-accent)]"><Icon className="h-5 w-5" /></span><span><small className="block text-[var(--rushd-muted)]">{label}</small><strong className="mt-1 block text-2xl">{value}</strong></span></div>)}
        </section>

        <section className="mb-8 grid gap-5 lg:grid-cols-2">
            <Card className="rounded-none p-5">
            <div className="mb-5 border-b border-[var(--rushd-border)] pb-4"><h2 className="text-xl font-bold">إنشاء سيرة</h2><p className="mt-1 text-sm text-[var(--rushd-muted)]">ابدأ بقالب منظم وأضف بياناتك.</p></div>
            <form onSubmit={createResume}>
              <label className="mb-2 block text-sm font-bold text-[var(--rushd-muted)]">اسم السيرة</label>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mb-4 rounded-none"
              />
              <button
                type="submit"
                disabled={creating}
                className="flex w-full items-center justify-center gap-2 bg-[var(--rushd-accent)] px-5 py-3 font-bold text-[var(--rushd-ink)] disabled:opacity-60"
              >
                {creating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                إنشاء سيرة جديدة
              </button>
            </form>
            </Card>

            <Card className="rounded-none p-5">
            <div className="mb-5 border-b border-[var(--rushd-border)] pb-4"><h2 className="text-xl font-bold">استيراد سيرة</h2><p className="mt-1 text-sm text-[var(--rushd-muted)]">حوّل ملف PDF إلى نسخة قابلة للتعديل.</p></div>
            <form onSubmit={importResume}>
              <label className="mb-2 block text-sm font-bold text-[var(--rushd-muted)]">استيراد PDF اختياري</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
                className="mb-4 w-full border border-dashed border-[var(--rushd-border)] bg-[var(--rushd-card)] px-4 py-3 text-sm text-[var(--rushd-muted)] file:ml-4 file:border-0 file:bg-[var(--rushd-surface)] file:px-3 file:py-2 file:text-[var(--rushd-text)]"
              />
              <button
                type="submit"
                disabled={importing}
                className="flex w-full items-center justify-center gap-2 border border-[var(--rushd-border-strong)] px-5 py-3 font-bold text-[var(--rushd-accent)] disabled:opacity-60"
              >
                {importing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                استيراد وبناء السيرة
              </button>
            </form>
            </Card>
        </section>

        <section className="border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black">سيرك الذاتية</h2>
            <span className="border border-[var(--rushd-badge-border)] bg-[var(--rushd-badge-bg)] px-3.5 py-1.5 text-sm font-bold text-[var(--rushd-badge-text)]">
              {resumes.length} سيرة
            </span>
          </div>

          {loading ? (
            <LoadingPanel rows={4} />
          ) : resumes.length === 0 ? (
            <EmptyState icon={FileText} title="لا توجد سير ذاتية بعد" description="ابدأ بسيرة جديدة أو استورد ملف PDF." />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resumes.map((resume) => (
                <article
                  key={resume._id}
                  className="group border border-[var(--rushd-border)] bg-[var(--rushd-surface-strong)] p-5 transition hover:border-[var(--rushd-border-strong)]"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black">{resume.title}</h3>
                      <p className="mt-1 text-sm text-[var(--rushd-muted)]">
                        {resume.public ? "رابط عام مفعل" : "خاص"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteResume(resume._id)}
                      className="flex h-9 w-9 items-center justify-center border border-[var(--rushd-danger-border)] text-[var(--rushd-danger-text)] transition hover:bg-[var(--rushd-danger-bg)]"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/resume-builder/${resume._id}`)}
                      className="w-full bg-[var(--rushd-accent)] px-4 py-3 font-bold text-[var(--rushd-ink)] transition hover:bg-[var(--rushd-accent-2)]"
                  >
                    فتح وتعديل
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
    </LuxuryDashboardLayout>
  );
}

export default ResumeDashboard;
