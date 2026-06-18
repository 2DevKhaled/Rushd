import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { LoaderCircle } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

function CreateSessionForm() {
  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    topicsToFocus: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    const { role, experience, topicsToFocus } = formData;
    if (!role || !experience || !topicsToFocus) {
      setError("أكمل الحقول المطلوبة قبل إنشاء الجلسة.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role,
          experience,
          topicsToFocus,
          numberOfQuestions: 10,
        }
      );
      const generatedQuestions = aiResponse.data;
      const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
        ...formData,
        questions: generatedQuestions,
      });
      if (response.data?.session?._id) {
        navigate(`/interview-prep/${response.data?.session?._id}`);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("حدث خطأ غير متوقع. حاول مرة أخرى.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="w-[92vw] rounded-3xl border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-6 text-[var(--rushd-text)] shadow-2xl md:w-[38vw] md:p-7"
    >
      <div className="mb-6">
        <p className="font-mono text-xs font-bold text-[var(--rushd-accent)]">
          NEW_SESSION
        </p>
        <h3 className="mt-2 text-2xl font-black text-[var(--rushd-text)]">
          إنشاء جلسة مقابلة
        </h3>
        <p className="mt-2 text-sm leading-7 text-[var(--rushd-muted)]">
          أدخل تفاصيل الدور والمهارات، وسيولّد رُشد أسئلة مقابلة مناسبة لك.
        </p>
      </div>

      <form onSubmit={handleCreateSession} className="flex flex-col gap-4">
        <Input
          value={formData.role}
          onChange={({ target }) => handleChange("role", target.value)}
          label={"الدور المستهدف"}
          placeholder={"مثال: Frontend Developer أو UI/UX Designer"}
          type={"text"}
        />
        <Input
          value={formData.experience}
          onChange={({ target }) => handleChange("experience", target.value)}
          label={"سنوات الخبرة"}
          placeholder={"مثال: 1 أو 2 أو 5"}
          type={"number"}
        />
        <Input
          value={formData.topicsToFocus}
          onChange={({ target }) => handleChange("topicsToFocus", target.value)}
          label={"المواضيع المراد التركيز عليها"}
          placeholder={"مثال: React, Node.js, APIs"}
          type={"text"}
        />
        <Input
          value={formData.description}
          onChange={({ target }) => handleChange("description", target.value)}
          label={"ملاحظات إضافية"}
          placeholder={"أي هدف أو تفاصيل تريد إضافتها للجلسة"}
          type={"text"}
        />

        {error && (
          <p className="rounded-xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-[linear-gradient(145deg,var(--rushd-accent-2),var(--rushd-accent))] font-black text-[var(--rushd-ink)] transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isLoading}
        >
          {isLoading ? (
            <LoaderCircle className="h-5 w-5 animate-spin" />
          ) : (
            "إنشاء الجلسة"
          )}
        </button>
      </form>
    </div>
  );
}

export default CreateSessionForm;
