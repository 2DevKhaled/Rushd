import { useEffect, useState } from "react";
import DashoardLayout from "../../components/Layouts/DashoardLayout";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import SummaryCard from "../../components/Cards/SummaryCard";
import Modal from "../../components/Modal";
import CreateSessionForm from "./CreateSessionForm";
import DeleteAlertContent from "../../components/DeleteAlertContent";

function Dashboard() {
  const navigate = useNavigate();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  const fetchAllSessions = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(response.data.sessions || []);
    } catch (error) {
      console.error("Error fetching session data", error);
    }
  };

  const deleteSession = async (sessionData) => {
    try {
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionData?._id));
      toast.success("تم حذف الجلسة بنجاح");
      setOpenDeleteAlert({
        open: false,
        data: null,
      });
      fetchAllSessions();
    } catch {
      console.error("Error Deleteing Session Data");
    }
  };

  useEffect(() => {
    fetchAllSessions();
  }, []);

  return (
    <DashoardLayout>
      <main dir="rtl" className="container mx-auto px-4 pb-24 pt-8 md:px-0">
        <section className="mb-8 overflow-hidden border border-[var(--rushd-border)] border-r-4 border-r-[var(--rushd-accent)] bg-[var(--rushd-surface)] p-6 shadow-[0_18px_55px_var(--rushd-shadow)] md:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold text-[var(--rushd-accent)]">مساحة التدريب الذكي</p>
              <h1 className="mt-3 text-3xl font-black text-[var(--rushd-text)] md:text-5xl">
                تدريب المقابلات داخل رُشد
              </h1>
              <p className="mt-4 max-w-2xl leading-8 text-[var(--rushd-muted)]">
                أنشئ جلسات تدريب ذكية، راجع أسئلتك السابقة، واستعد للمقابلة
                القادمة بثقة ووضوح.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:items-end">
            <div className="grid grid-cols-2 gap-px overflow-hidden border border-[var(--rushd-border)] bg-[var(--rushd-border)] text-center md:w-64">
              <div className="bg-[var(--rushd-surface-strong)] p-4">
                <div className="text-3xl font-black text-[var(--rushd-text)]">
                  {sessions.length}
                </div>
                <div className="mt-1 text-xs font-bold text-[var(--rushd-muted)]">
                  جلسة
                </div>
              </div>
              <div className="bg-[var(--rushd-surface-strong)] p-4">
                <div className="text-3xl font-black text-[var(--rushd-accent)]">AI</div>
                <div className="mt-1 text-xs font-bold text-[var(--rushd-muted)]">
                  أسئلة ذكية
                </div>
              </div>
            </div>
            <button className="flex min-h-14 items-center justify-center gap-2 bg-[var(--rushd-accent)] px-6 text-sm font-bold text-[var(--rushd-ink)] transition hover:bg-[var(--rushd-accent-2)]" onClick={() => setOpenCreateModal(true)}><Plus className="h-5 w-5" />جلسة جديدة</button>
            </div>
          </div>
        </section>

        {sessions?.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 pb-6 md:grid-cols-2 lg:grid-cols-3">
            {sessions?.map((data) => (
              <SummaryCard
                key={data?._id}
                role={data?.role || ""}
                topicsToFoucs={data?.topicsToFocus || data?.topicsToFoucs || ""}
                experience={data?.experience}
                description={data?.description}
                lastUpdated={
                  data?.updatedAt
                    ? moment(data.updatedAt).format("Do MMM YYYY")
                    : ""
                }
                onSelect={() => navigate(`/interview-prep/${data?._id}`)}
                onDelete={() => setOpenDeleteAlert({ open: true, data })}
              />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-[var(--rushd-border-strong)] bg-[var(--rushd-surface)] p-10 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center bg-[var(--rushd-card)] text-[var(--rushd-accent)]"><Plus className="h-7 w-7" /></div>
            <h2 className="text-2xl font-black text-[var(--rushd-text)]">
              لا توجد جلسات تدريب بعد
            </h2>
            <p className="mx-auto mt-3 max-w-lg leading-8 text-[var(--rushd-muted)]">
              ابدأ أول جلسة مقابلة ذكية واختر الدور والمهارات التي تريد التركيز
              عليها.
            </p>
          </div>
        )}

      </main>

      <Modal
        isOpen={openCreateModal}
        onClose={() => {
          setOpenCreateModal(false);
        }}
        hideHeader
      >
        <CreateSessionForm />
      </Modal>

      <Modal
        isOpen={openDeleteAlert?.open}
        onClose={() => setOpenDeleteAlert({ open: false, data: null })}
        title={"حذف الجلسة"}
      >
        <div className="w-[90vw] md:w-[30vw]">
          <DeleteAlertContent
            content="هل أنت متأكد من حذف تفاصيل هذه الجلسة؟"
            onDelete={() => deleteSession(openDeleteAlert.data)}
          />
        </div>
      </Modal>
    </DashoardLayout>
  );
}

export default Dashboard;
