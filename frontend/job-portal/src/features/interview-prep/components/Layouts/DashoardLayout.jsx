import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";

function DashoardLayout({ children }) {
  const { user } = useContext(UserContext);

  return (
    <div className="interview-shell relative min-h-screen w-full max-w-[100vw] overflow-x-clip bg-[var(--rushd-bg)] text-[var(--rushd-text)]">
      <div className="relative">
        <Navbar />
        {user && <div>{children}</div>}
      </div>
    </div>
  );
}

export default DashoardLayout;
