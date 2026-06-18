import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import axiosInstance from "../../pages/utils/axiosInstance";
import { API_PATHS } from "../../pages/utils/apiPaths";
import ResumePreview from "./ResumePreview";

function ResumePublicPreview() {
  const { resumeId } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.RESUMES.GET_PUBLIC(resumeId));
        setResume(response.data.resume);
      } catch (error) {
        console.error("Public resume could not be loaded", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId]);

  return (
    <main dir="rtl" className="min-h-screen bg-[var(--rushd-bg)] px-5 py-8 text-[var(--rushd-text)]">
      <div className="mx-auto mb-6 flex max-w-5xl items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--rushd-accent)] text-xl font-black text-[var(--rushd-ink)]">
            ر
          </div>
          <div>
            <p className="font-black">رُشد</p>
            <p className="text-xs text-[var(--rushd-muted)]">معاينة السيرة الذاتية</p>
          </div>
        </Link>
        {resume && (
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-2xl bg-[var(--rushd-accent)] px-5 py-3 font-black text-[var(--rushd-ink)]"
          >
            تحميل PDF
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-9 w-9 animate-spin text-[var(--rushd-accent)]" />
        </div>
      ) : resume ? (
        <ResumePreview resume={resume} />
      ) : (
        <div className="mx-auto max-w-xl rounded-[2rem] border border-[var(--rushd-border)] bg-[var(--rushd-card)] p-10 text-center">
          <h1 className="text-2xl font-black">السيرة غير متاحة</h1>
          <p className="mt-3 text-[var(--rushd-muted)]">قد تكون السيرة خاصة أو تم حذفها.</p>
        </div>
      )}
    </main>
  );
}

export default ResumePublicPreview;
