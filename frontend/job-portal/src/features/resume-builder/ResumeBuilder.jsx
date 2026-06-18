import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  Download,
  Eye,
  Loader2,
  Palette,
  Plus,
  Save,
  Share2,
  Sparkles,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../pages/utils/axiosInstance";
import { API_PATHS } from "../../pages/utils/apiPaths";
import ResumePreview from "./ResumePreview";
import { accentColors, emptyResume, resumeTemplates } from "./resumeDefaults";

const sections = [
  { id: "personal", label: "المعلومات الشخصية" },
  { id: "summary", label: "الملخص" },
  { id: "education", label: "التعليم" },
  { id: "experience", label: "الخبرات" },
  { id: "projects", label: "المشاريع" },
  { id: "skills", label: "المهارات" },
  { id: "languages", label: "اللغات" },
];

const blankExperience = {
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  description: "",
  isCurrent: false,
};

const blankProject = {
  name: "",
  type: "",
  description: "",
};

const blankEducation = {
  institution: "",
  degree: "",
  field: "",
  graduationDate: "",
  gpa: "",
};

const blankLanguage = {
  name: "",
  proficiency: "",
};

const proficiencyOptions = ["Native", "Fluent", "Professional", "Intermediate", "Beginner"];

const monthOptions = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const yearOptions = Array.from({ length: 56 }, (_, index) => String(1980 + index));

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const getResumeSnapshot = (resume) =>
  JSON.stringify(resume, (_, value) => {
    if (value instanceof File) {
      return `file:${value.name}:${value.size}:${value.lastModified}`;
    }

    return value;
  });

const Input = ({ label, ...props }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-bold text-[var(--rushd-muted)]">{label}</span>
    <input
      {...props}
      className="w-full rounded-2xl border border-[var(--rushd-border)] bg-[var(--rushd-card)] px-4 py-3 text-[var(--rushd-text)] outline-none transition placeholder:text-[var(--rushd-muted)] focus:border-[var(--rushd-accent)]"
    />
  </label>
);

const Textarea = ({ label, ...props }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-bold text-[var(--rushd-muted)]">{label}</span>
    <textarea
      {...props}
      className="min-h-36 w-full resize-y rounded-2xl border border-[var(--rushd-border)] bg-[var(--rushd-card)] px-4 py-3 text-[var(--rushd-text)] outline-none transition placeholder:text-[var(--rushd-muted)] focus:border-[var(--rushd-accent)]"
    />
  </label>
);

const MonthYearInput = ({ disabled = false, label, onChange, value }) => {
  const [year = "", month = ""] = String(value || "").split("-");

  const updateDate = (nextYear, nextMonth) => {
    if (!nextYear && !nextMonth) {
      onChange("");
      return;
    }

    onChange(`${nextYear || new Date().getFullYear()}-${nextMonth || "01"}`);
  };

  return (
    <div>
      <span className="mb-2 block text-sm font-bold text-[var(--rushd-muted)]">{label}</span>
      <div className="grid grid-cols-2 gap-2">
        <select
          disabled={disabled}
          value={month}
          onChange={(event) => updateDate(year, event.target.value)}
          className="rounded-2xl border border-[var(--rushd-border)] bg-[var(--rushd-surface-strong)] px-4 py-3 text-[var(--rushd-text)] outline-none transition focus:border-[var(--rushd-accent)] disabled:opacity-40"
        >
          <option value="">Month</option>
          {monthOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          disabled={disabled}
          value={year}
          onChange={(event) => updateDate(event.target.value, month)}
          className="rounded-2xl border border-[var(--rushd-border)] bg-[var(--rushd-surface-strong)] px-4 py-3 text-[var(--rushd-text)] outline-none transition focus:border-[var(--rushd-accent)] disabled:opacity-40"
        >
          <option value="">Year</option>
          {yearOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

function ResumeBuilder() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(emptyResume);
  const [activeSection, setActiveSection] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("saved");
  const [enhancing, setEnhancing] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const autoSaveTimerRef = useRef(null);
  const lastSavedSnapshotRef = useRef("");

  const publicUrl = useMemo(
    () => `${window.location.origin}/resume-builder/view/${resumeId}`,
    [resumeId],
  );

  const updateResume = (patch) => {
    setResume((current) => ({ ...current, ...patch }));
  };

  const updatePersonal = (field, value) => {
    setResume((current) => ({
      ...current,
      personalInfo: { ...current.personalInfo, [field]: value },
    }));
  };

  const updateListItem = (key, index, field, value) => {
    setResume((current) => ({
      ...current,
      [key]: (current[key] || []).map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const addListItem = (key, value) => {
    setResume((current) => ({ ...current, [key]: [...(current[key] || []), value] }));
  };

  const removeListItem = (key, index) => {
    setResume((current) => ({
      ...current,
      [key]: (current[key] || []).filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const fetchResume = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.RESUMES.GET_ONE(resumeId));
      const loadedResume = { ...emptyResume, ...response.data.resume };
      setResume(loadedResume);
      lastSavedSnapshotRef.current = getResumeSnapshot(loadedResume);
      setSaveStatus("saved");
    } catch (error) {
      toast.error(getErrorMessage(error, "تعذر تحميل السيرة الذاتية"));
      navigate("/resume-builder");
    } finally {
      setLoading(false);
    }
  }, [navigate, resumeId]);

  const saveResume = useCallback(async (
    nextResume = resume,
    successMessage = "تم حفظ السيرة الذاتية",
    silent = false,
  ) => {
    try {
      setSaving(true);
      setSaveStatus("saving");
      const formData = new FormData();
      const payload = structuredClone(nextResume);

      if (payload.personalInfo?.image instanceof File) {
        formData.append("image", payload.personalInfo.image);
        payload.personalInfo.image = resume.personalInfo.image instanceof File ? "" : resume.personalInfo.image;
      }

      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify(payload));

      const response = await axiosInstance.put(API_PATHS.RESUMES.UPDATE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const savedResume = { ...emptyResume, ...response.data.resume };
      setResume(savedResume);
      lastSavedSnapshotRef.current = getResumeSnapshot(savedResume);
      setSaveStatus("saved");

      if (!silent) {
        toast.success(successMessage);
      }

      return response.data.resume;
    } catch (error) {
      setSaveStatus("error");
      if (!silent) {
        toast.error(getErrorMessage(error, "تعذر حفظ السيرة الذاتية"));
      }
      return null;
    } finally {
      setSaving(false);
    }
  }, [resume, resumeId]);

  const enhanceSummary = async () => {
    try {
      setEnhancing("summary");
      const response = await axiosInstance.post(API_PATHS.RESUME_AI.ENHANCE_PRO_SUMMARY, {
        summary: resume.professionalSummary,
        profession: resume.personalInfo?.profession,
      });
      updateResume({ professionalSummary: response.data.summary });
      toast.success(response.data?.fallback ? "تم إنشاء نص بديل قابل للتعديل" : "تم تحسين الملخص");
    } catch (error) {
      toast.error(getErrorMessage(error, "تعذر تحسين الملخص"));
    } finally {
      setEnhancing("");
    }
  };

  const enhanceExperience = async (index) => {
    const item = resume.experience[index];

    try {
      setEnhancing(`experience-${index}`);
      const response = await axiosInstance.post(API_PATHS.RESUME_AI.ENHANCE_JOB_DESCRIPTION, {
        position: item.position,
        company: item.company,
        description: item.description,
      });
      updateListItem("experience", index, "description", response.data.description);
      toast.success(response.data?.fallback ? "تم إنشاء وصف بديل قابل للتعديل" : "تم تحسين الوصف");
    } catch (error) {
      toast.error(getErrorMessage(error, "تعذر تحسين الوصف"));
    } finally {
      setEnhancing("");
    }
  };

  const addSkill = () => {
    const nextSkill = skillInput.trim();
    if (!nextSkill) return;

    if (resume.skills.includes(nextSkill)) {
      toast.error("المهارة مضافة مسبقاً");
      return;
    }

    updateResume({ skills: [...resume.skills, nextSkill] });
    setSkillInput("");
  };

  const copyPublicUrl = async () => {
    await navigator.clipboard.writeText(publicUrl);
    toast.success("تم نسخ رابط المعاينة");
  };

  const togglePublic = async () => {
    const nextResume = { ...resume, public: !resume.public };
    setResume(nextResume);
    await saveResume(nextResume, nextResume.public ? "تم تفعيل الرابط العام" : "تم إغلاق الرابط العام");
  };

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  useEffect(() => {
    if (loading) return undefined;

    const currentSnapshot = getResumeSnapshot(resume);
    if (!lastSavedSnapshotRef.current || currentSnapshot === lastSavedSnapshotRef.current) {
      return undefined;
    }

    setSaveStatus("pending");
    window.clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = window.setTimeout(() => {
      saveResume(resume, "", true);
    }, 1400);

    return () => window.clearTimeout(autoSaveTimerRef.current);
  }, [loading, resume, saveResume]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--rushd-bg)]">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--rushd-accent)]" />
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[var(--rushd-bg)] text-[var(--rushd-text)]">
      <div className="absolute inset-0 bg-[linear-gradient(var(--rushd-glow)_1px,transparent_1px),linear-gradient(90deg,var(--rushd-glow)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="relative mx-auto max-w-[1600px] px-4 py-5">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[2rem] border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-4">
          <div className="flex items-center gap-3">
            <Link
              to="/resume-builder"
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--rushd-card)] text-[var(--rushd-text)] hover:bg-[var(--rushd-card)]"
            >
              <ArrowRight className="h-5 w-5" />
            </Link>
            <div>
              <input
                value={resume.title}
                onChange={(event) => updateResume({ title: event.target.value })}
                className="w-full bg-transparent text-2xl font-black outline-none"
              />
              <p className="text-sm text-[var(--rushd-muted)]">
                محرر السيرة الذاتية
                <span className="mx-2">•</span>
                {saveStatus === "saving" && "جاري الحفظ..."}
                {saveStatus === "pending" && "سيتم الحفظ تلقائياً"}
                {saveStatus === "saved" && "تم الحفظ"}
                {saveStatus === "error" && "تعذر الحفظ"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={togglePublic}
              className={`rounded-2xl px-4 py-3 font-black ${
                resume.public ? "bg-[var(--rushd-accent)] text-[var(--rushd-ink)]" : "border border-[var(--rushd-border)] text-[var(--rushd-muted)]"
              }`}
            >
              <Eye className="ml-2 inline h-5 w-5" />
              {resume.public ? "عام" : "خاص"}
            </button>
            <button
              type="button"
              onClick={copyPublicUrl}
              disabled={!resume.public}
              className="rounded-2xl border border-[var(--rushd-border)] px-4 py-3 font-black text-[var(--rushd-muted)] disabled:opacity-40"
            >
              <Share2 className="ml-2 inline h-5 w-5" />
              نسخ الرابط
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-2xl border border-[var(--rushd-border)] px-4 py-3 font-black text-[var(--rushd-muted)]"
            >
              <Download className="ml-2 inline h-5 w-5" />
              PDF
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("style")}
              className={`rounded-2xl px-4 py-3 font-black ${
                activeSection === "style"
                  ? "bg-[var(--rushd-accent-2)] text-[var(--rushd-ink)]"
                  : "border border-[var(--rushd-border)] text-[var(--rushd-muted)]"
              }`}
            >
              <Palette className="ml-2 inline h-5 w-5" />
              القالب والثيم
            </button>
            <button
              type="button"
              onClick={() => saveResume()}
              disabled={saving}
              className="rounded-2xl bg-[var(--rushd-accent)] px-5 py-3 font-black text-[var(--rushd-ink)] disabled:opacity-60"
            >
              {saving ? <Loader2 className="ml-2 inline h-5 w-5 animate-spin" /> : <Save className="ml-2 inline h-5 w-5" />}
              حفظ
            </button>
          </div>
        </header>

        <div className="grid gap-5 xl:grid-cols-[520px_1fr]">
          <section className="self-start rounded-[2rem] border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-4 shadow-2xl shadow-black/20">
            <nav className="mb-5 flex gap-2 overflow-x-auto pb-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-black ${
                    activeSection === section.id
                      ? "bg-[var(--rushd-accent)] text-[var(--rushd-ink)]"
                      : "bg-[var(--rushd-card)] text-[var(--rushd-muted)] hover:bg-[var(--rushd-card)]"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>

            {activeSection === "personal" && (
              <div className="space-y-4">
                <Input
                  label="الاسم الكامل"
                  value={resume.personalInfo.fullName}
                  onChange={(event) => updatePersonal("fullName", event.target.value)}
                />
                <Input
                  label="المسمى المهني"
                  value={resume.personalInfo.profession}
                  onChange={(event) => updatePersonal("profession", event.target.value)}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="البريد" value={resume.personalInfo.email} onChange={(event) => updatePersonal("email", event.target.value)} />
                  <Input label="الجوال" value={resume.personalInfo.phone} onChange={(event) => updatePersonal("phone", event.target.value)} />
                </div>
                <Input label="الموقع" value={resume.personalInfo.location} onChange={(event) => updatePersonal("location", event.target.value)} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="LinkedIn" value={resume.personalInfo.linkedin} onChange={(event) => updatePersonal("linkedin", event.target.value)} />
                  <Input label="الموقع الشخصي" value={resume.personalInfo.website} onChange={(event) => updatePersonal("website", event.target.value)} />
                </div>
                <div>
                  <span className="mb-2 block text-sm font-bold text-[var(--rushd-muted)]">الصورة الشخصية</span>
                  <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-dashed border-[var(--rushd-border-strong)] bg-[var(--rushd-card)] px-4 py-4 transition hover:border-[var(--rushd-border-strong)] hover:bg-[var(--rushd-card)]">
                    <span className="truncate text-sm text-[var(--rushd-muted)]">
                      {resume.personalInfo.image instanceof File
                        ? resume.personalInfo.image.name
                        : resume.personalInfo.image
                          ? "صورة محفوظة"
                          : "اختياري: أضف صورة شخصية"}
                    </span>
                    <span className="shrink-0 rounded-xl bg-[var(--rushd-card)] px-4 py-2 text-sm font-black text-[var(--rushd-text)]">
                      اختيار صورة
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => updatePersonal("image", event.target.files?.[0] || resume.personalInfo.image)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}

            {activeSection === "summary" && (
              <div className="space-y-4">
                <Textarea
                  label="الملخص المهني"
                  value={resume.professionalSummary}
                  onChange={(event) => updateResume({ professionalSummary: event.target.value })}
                  placeholder="اكتب نبذة مختصرة عن خبرتك ونقاط قوتك..."
                />
                <button
                  type="button"
                  onClick={enhanceSummary}
                  disabled={enhancing === "summary"}
                  className="rounded-2xl border border-[var(--rushd-border-strong)] px-4 py-3 font-black text-[var(--rushd-accent)] disabled:opacity-60"
                >
                  {enhancing === "summary" ? <Loader2 className="ml-2 inline h-5 w-5 animate-spin" /> : <Sparkles className="ml-2 inline h-5 w-5" />}
                  تحسين بالذكاء الاصطناعي
                </button>
              </div>
            )}

            {activeSection === "experience" && (
              <ListEditor
                items={resume.experience}
                emptyLabel="لا توجد خبرات بعد"
                addLabel="إضافة خبرة"
                onAdd={() => addListItem("experience", blankExperience)}
                onRemove={(index) => removeListItem("experience", index)}
                renderItem={(item, index) => (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input label="الشركة" value={item.company} onChange={(event) => updateListItem("experience", index, "company", event.target.value)} />
                      <Input label="المسمى" value={item.position} onChange={(event) => updateListItem("experience", index, "position", event.target.value)} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <MonthYearInput label="البداية" value={item.startDate || ""} onChange={(value) => updateListItem("experience", index, "startDate", value)} />
                      <MonthYearInput label="النهاية" value={item.endDate || ""} onChange={(value) => updateListItem("experience", index, "endDate", value)} disabled={item.isCurrent} />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-[var(--rushd-muted)]">
                      <input
                        type="checkbox"
                        checked={item.isCurrent}
                        onChange={(event) => updateListItem("experience", index, "isCurrent", event.target.checked)}
                      />
                      أعمل هنا حالياً
                    </label>
                    <Textarea label="الوصف" value={item.description} onChange={(event) => updateListItem("experience", index, "description", event.target.value)} />
                    <button
                      type="button"
                      onClick={() => enhanceExperience(index)}
                      disabled={enhancing === `experience-${index}`}
                      className="rounded-2xl border border-[var(--rushd-border-strong)] px-4 py-3 text-sm font-black text-[var(--rushd-accent)] disabled:opacity-60"
                    >
                      {enhancing === `experience-${index}` ? <Loader2 className="ml-2 inline h-4 w-4 animate-spin" /> : <Sparkles className="ml-2 inline h-4 w-4" />}
                      تحسين الوصف
                    </button>
                  </div>
                )}
              />
            )}

            {activeSection === "projects" && (
              <ListEditor
                items={resume.projects}
                emptyLabel="لا توجد مشاريع بعد"
                addLabel="إضافة مشروع"
                onAdd={() => addListItem("projects", blankProject)}
                onRemove={(index) => removeListItem("projects", index)}
                renderItem={(item, index) => (
                  <div className="space-y-4">
                    <Input label="اسم المشروع" value={item.name} onChange={(event) => updateListItem("projects", index, "name", event.target.value)} />
                    <Input label="النوع أو التقنية" value={item.type} onChange={(event) => updateListItem("projects", index, "type", event.target.value)} />
                    <Textarea label="الوصف" value={item.description} onChange={(event) => updateListItem("projects", index, "description", event.target.value)} />
                  </div>
                )}
              />
            )}

            {activeSection === "education" && (
              <ListEditor
                items={resume.education}
                emptyLabel="لا توجد مؤهلات بعد"
                addLabel="إضافة تعليم"
                onAdd={() => addListItem("education", blankEducation)}
                onRemove={(index) => removeListItem("education", index)}
                renderItem={(item, index) => (
                  <div className="space-y-4">
                    <Input label="الجهة التعليمية" value={item.institution} onChange={(event) => updateListItem("education", index, "institution", event.target.value)} />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input label="الدرجة" value={item.degree} onChange={(event) => updateListItem("education", index, "degree", event.target.value)} />
                      <Input label="التخصص" value={item.field} onChange={(event) => updateListItem("education", index, "field", event.target.value)} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <MonthYearInput label="تاريخ التخرج" value={item.graduationDate || ""} onChange={(value) => updateListItem("education", index, "graduationDate", value)} />
                      <Input label="المعدل" value={item.gpa} onChange={(event) => updateListItem("education", index, "gpa", event.target.value)} />
                    </div>
                  </div>
                )}
              />
            )}

            {activeSection === "skills" && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    value={skillInput}
                    onChange={(event) => setSkillInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="مثال: React"
                    className="flex-1 rounded-2xl border border-[var(--rushd-border)] bg-[var(--rushd-card)] px-4 py-3 text-[var(--rushd-text)] outline-none focus:border-[var(--rushd-accent)]"
                  />
                  <button type="button" onClick={addSkill} className="rounded-2xl bg-[var(--rushd-accent)] px-4 font-black text-[var(--rushd-ink)]">
                    إضافة
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => updateResume({ skills: resume.skills.filter((item) => item !== skill) })}
                      className="rounded-full border border-[var(--rushd-badge-border)] bg-[var(--rushd-badge-bg)] px-4 py-2 text-sm font-black text-[var(--rushd-badge-text)] transition hover:border-red-300/40 hover:bg-red-500/15"
                    >
                      {skill} ×
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "languages" && (
              <ListEditor
                items={resume.languages || []}
                emptyLabel="لا توجد لغات بعد"
                addLabel="إضافة لغة"
                onAdd={() => addListItem("languages", blankLanguage)}
                onRemove={(index) => removeListItem("languages", index)}
                renderItem={(item, index) => (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="اللغة"
                      value={item.name}
                      placeholder="English"
                      onChange={(event) => updateListItem("languages", index, "name", event.target.value)}
                    />
                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-[var(--rushd-muted)]">المستوى</span>
                      <select
                        value={item.proficiency}
                        onChange={(event) => updateListItem("languages", index, "proficiency", event.target.value)}
                        className="w-full rounded-2xl border border-[var(--rushd-border)] bg-[var(--rushd-surface-strong)] px-4 py-3 text-[var(--rushd-text)] outline-none transition focus:border-[var(--rushd-accent)]"
                      >
                        <option value="">Select level</option>
                        {proficiencyOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                )}
              />
            )}

            {activeSection === "style" && (
              <div className="space-y-6">
                <div>
                  <p className="mb-3 text-sm font-bold text-[var(--rushd-muted)]">القالب</p>
                  <div className="grid grid-cols-3 gap-3">
                    {resumeTemplates.map((template) => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() =>
                          updateResume({
                            template: template.id,
                            ...(template.id === "classic" ? { accentColor: "#111827" } : {}),
                          })
                        }
                        className={`rounded-2xl border p-4 font-black ${
                          resume.template === template.id
                            ? "border-[var(--rushd-accent)] bg-[var(--rushd-accent)] text-[var(--rushd-ink)]"
                            : "border-[var(--rushd-border)] bg-[var(--rushd-card)] text-[var(--rushd-muted)]"
                        }`}
                      >
                        {template.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-sm font-bold text-[var(--rushd-muted)]">لون التمييز</p>
                  <div className="flex flex-wrap gap-3">
                    {accentColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => updateResume({ accentColor: color })}
                        className={`h-11 w-11 rounded-full border-4 ${
                          resume.accentColor === color ? "border-white" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="overflow-auto rounded-[2rem] border border-[var(--rushd-border)] bg-[var(--rushd-card)] p-4">
            <ResumePreview resume={resume} />
          </section>
        </div>
      </div>
    </main>
  );
}

function ListEditor({ items, emptyLabel, addLabel, onAdd, onRemove, renderItem }) {
  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--rushd-border)] p-6 text-center text-[var(--rushd-muted)]">
          {emptyLabel}
        </div>
      ) : (
        items.map((item, index) => (
          <article key={index} className="rounded-2xl border border-[var(--rushd-border)] bg-[var(--rushd-card)] p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-black">#{index + 1}</p>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="rounded-xl p-2 text-[var(--rushd-muted)] hover:bg-red-500/10 hover:text-red-300"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            {renderItem(item, index)}
          </article>
        ))
      )}

      <button
        type="button"
        onClick={onAdd}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--rushd-border-strong)] px-4 py-3 font-black text-[var(--rushd-accent)]"
      >
        <Plus className="h-5 w-5" />
        {addLabel}
      </button>
    </div>
  );
}

export default ResumeBuilder;
