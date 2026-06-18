import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

function ProfileInfoCard() {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handelLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/");
  };

  return (
    user && (
      <div dir="rtl" className="flex items-center gap-3">
        <img
          src={user.avatar || user.profileImageUrl}
          alt={user.name || "صورة المستخدم"}
          className="h-10 w-10 rounded-xl border border-[var(--rushd-border)] object-cover"
        />
        <div className="text-right leading-none">
          <div className="text-sm font-black text-[var(--rushd-text)]">{user.name || ""}</div>
          <button
            className="mt-1 text-xs font-bold text-[var(--rushd-accent)] transition hover:text-[var(--rushd-text)]"
            onClick={() => handelLogout()}
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    )
  );
}

export default ProfileInfoCard;
