import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";

function DashoardLayout({ children }) {
  const { user } = useContext(UserContext);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--rushd-bg)] text-[var(--rushd-text)]">
      <div className="rushd-grid pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(var(--rushd-grid)_1px,transparent_1px),linear-gradient(90deg,var(--rushd-grid-2)_1px,transparent_1px)] [background-size:92px_92px]" />
      <div className="pointer-events-none absolute left-1/2 top-24 h-[520px] w-[980px] -translate-x-1/2 rounded-[2rem] border border-[var(--rushd-border)] bg-[var(--rushd-surface)] shadow-2xl" />
      <div className="relative">
        <Navbar />
        {user && <div>{children}</div>}
      </div>
    </div>
  );
}

export default DashoardLayout;
