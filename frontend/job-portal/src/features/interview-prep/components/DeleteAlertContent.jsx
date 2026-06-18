import { Trash2 } from "lucide-react";

const DeleteAlertContent = ({ content, onDelete }) => {
  return (
    <div dir="rtl" className="w-full bg-[var(--rushd-surface)] p-6 text-right">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-red-300/20 bg-red-400/10 text-red-200">
        <Trash2 className="h-6 w-6" />
      </div>

      <h3 className="text-xl font-black text-[var(--rushd-text)]">تأكيد الحذف</h3>
      <p className="mt-3 leading-7 text-[var(--rushd-muted)]">{content}</p>

      <div className="mt-7 flex justify-start">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-red-300/20 bg-red-400/10 px-5 py-3 text-sm font-black text-red-200 transition hover:-translate-y-0.5 hover:bg-red-400/20"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
          حذف الجلسة
        </button>
      </div>
    </div>
  );
};

export default DeleteAlertContent;
