import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { ArrowRight, CircleAlert, ListCollapse, LoaderCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import DashoardLayout from "../../components/Layouts/DashoardLayout";
import RoleInfoHeader from "./components/RoleInfoHeader";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import QuestionCard from "../../components/Cards/QuestionCard";
import AiResponsePreview from "./components/AiResponsePreview";
import Drawer from "../../components/Drawer";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";

function InterviewPrep() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [sessionError, setSessionError] = useState("");
  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoader, setIsupdateLoader] = useState(false);

  const fetchSessionDetailsById = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.SESSION.GET_ONE(sessionId)
      );
      if (response.data && response.data.session) {
        setSessionData(response.data && response.data.session);
        setSessionError("");
      }
    } catch (error) {
      console.error("Error", error);
      setSessionError(
        error.response?.data?.message || "تعذر تحميل جلسة المقابلة.",
      );
    }
  }, [sessionId]);

  const generateConceptExplanation = async (question) => {
    try {
      setErrorMsg("");
      setExplanation(null);
      setIsLoading(true);
      setOpenLearnMoreDrawer(true);
      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_EXPLANATION,
        { question }
      );
      if (response.data) {
        console.log("AI response:", response.data);
        setExplanation(response.data);
      }
    } catch (error) {
      setExplanation(null);
      setErrorMsg("تعذر توليد الشرح. حاول مرة أخرى لاحقًا.");
      console.error("Erorr", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleQuestionPinStatus = async (questionId) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.QUESTION.PIN(questionId)
      );
      console.log(response);
      if (response.data && response.data.question) {
        fetchSessionDetailsById();
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const uploadMoreQuestions = async () => {
    try {
      setIsupdateLoader(true);
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role: sessionData?.role,
          experience: sessionData?.experience,
          topicsToFocus: sessionData?.topicsToFocus || sessionData?.topicsToFoucs,
          numberOfQuestions: 3,
        }
      );
      const generatedQuestions = aiResponse.data;
      const response = await axiosInstance.post(
        API_PATHS.QUESTION.ADD_TO_SESSION,
        {
          sessionId,
          questions: generatedQuestions,
        }
      );
      if (response.data) {
        toast.success("تمت إضافة أسئلة جديدة");
        fetchSessionDetailsById();
      }
    } catch (error) {
      console.log(
        "❌ UploadMore Error:",
        error.response?.data || error.message
      );
      if (error.response && error.response.data.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("حدث خطأ غير متوقع. حاول مرة أخرى.");
      }
    } finally {
      setIsupdateLoader(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailsById();
    }
  }, [fetchSessionDetailsById, sessionId]);

  return (
    <DashoardLayout>
      <div dir="rtl" className="container mx-auto px-4 pt-6 md:px-0">
        <button
          type="button"
          onClick={() => navigate("/interview-prep", { replace: true })}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--rushd-border)] bg-[var(--rushd-card)] px-4 py-2 text-sm font-bold text-[var(--rushd-text)] transition hover:border-[var(--rushd-border-strong)]"
        >
          <ArrowRight className="h-4 w-4" />
          الرجوع إلى جلسات المقابلات
        </button>
      </div>

      {sessionError ? (
        <main
          dir="rtl"
          className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 md:px-0"
        >
          <div className="max-w-xl rounded-3xl border border-[var(--rushd-border)] bg-[var(--rushd-surface)] p-8 text-center shadow-2xl">
            <h1 className="text-2xl font-black text-[var(--rushd-text)]">
              لم نتمكن من فتح الجلسة
            </h1>
            <p className="mt-3 leading-8 text-[var(--rushd-muted)]">{sessionError}</p>
            <button
              type="button"
              onClick={() => navigate("/interview-prep", { replace: true })}
              className="mt-6 rounded-xl bg-[linear-gradient(145deg,var(--rushd-accent-2),var(--rushd-accent))] px-5 py-3 text-sm font-black text-[var(--rushd-ink)] transition"
            >
              العودة إلى جلساتي
            </button>
          </div>
        </main>
      ) : (
        <>
      <RoleInfoHeader
        role={sessionData?.role || ""}
        topicsToFoucs={sessionData?.topicsToFocus || sessionData?.topicsToFoucs || ""}
        questions={sessionData?.questions?.length || ""}
        experience={sessionData?.experience}
        description={sessionData?.description}
        lastUpdated={
          sessionData?.updatedAt
            ? moment(sessionData.updatedAt).format("Do MMM YYYY")
            : ""
        }
      />

      <main dir="rtl" className="container mx-auto min-h-screen px-4 pb-16 pt-6 md:px-0">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="font-mono text-sm font-bold text-[var(--rushd-accent)]">Q_AND_A</p>
            <h2 className="mt-2 text-2xl font-black text-[var(--rushd-text)]">
              أسئلة وأجوبة المقابلة
            </h2>
          </div>
          <div className="rounded-xl border border-[var(--rushd-border)] bg-[var(--rushd-card)] px-4 py-3 text-sm font-bold text-[var(--rushd-muted)]">
            اضغط على السؤال لعرض الإجابة
          </div>
        </div>

        <div className="grid grid-cols-12 gap-5">
          <div
            className={`col-span-12 ${
              openLearnMoreDrawer ? "md:col-span-7" : "md:col-span-8"
            }`}
          >
            {sessionData?.questions?.map((data, index) => (
                <div key={data._id || index}>
                  <QuestionCard
                    question={data?.question}
                    answer={data?.answer}
                    isPinned={data?.isPinned}
                    onLearnMore={() => generateConceptExplanation(data.question)}
                    onTogglePin={() => toggleQuestionPinStatus(data._id)}
                  />
                  {!isLoading &&
                    sessionData?.questions?.length === index + 1 && (
                      <div className="mt-6 flex items-center justify-center">
                        <button
                          disabled={isLoading || isUpdateLoader}
                          onClick={uploadMoreQuestions}
                          className="flex items-center gap-3 rounded-xl bg-[linear-gradient(145deg,var(--rushd-accent-2),var(--rushd-accent))] px-5 py-3 text-sm font-black text-[var(--rushd-ink)] shadow-[0_22px_80px_var(--rushd-glow)] transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isUpdateLoader ? (
                            <LoaderCircle className="h-5 w-5 animate-spin" />
                          ) : (
                            <ListCollapse className="h-5 w-5" />
                          )}
                          إضافة أسئلة
                        </button>
                      </div>
                    )}
                </div>
              ))}
          </div>
        </div>

        <Drawer
          isOpen={openLearnMoreDrawer}
          onClose={() => setOpenLearnMoreDrawer(false)}
          title={!isLoading && explanation?.title}
        >
          {errorMsg && (
            <p className="flex gap-2 rounded-xl border border-red-300/20 bg-red-400/10 p-4 text-sm font-bold text-red-200">
              <CircleAlert className="mt-1 h-5 w-5" />
              {errorMsg}
            </p>
          )}
          {isLoading && <SkeletonLoader />}
          {!isLoading && explanation && (
            <AiResponsePreview content={explanation?.explanation} />
          )}
        </Drawer>
      </main>
        </>
      )}
    </DashoardLayout>
  );
}

export default InterviewPrep;
