import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function Input({ value, onChange, label, placeholder, type }) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div dir="rtl">
      <label className="mb-2 block text-sm font-bold text-[var(--rushd-text)]">
        {label}
      </label>
      <div className="flex items-center border border-[var(--rushd-border)] bg-[var(--rushd-card)] px-4 py-3 transition-all duration-200 focus-within:border-[var(--rushd-accent)]">
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          className="w-full bg-transparent text-right text-[var(--rushd-text)] outline-none placeholder:text-[var(--rushd-muted)]"
          value={value}
          onChange={(e) => onChange(e)}
        />
        {type === "password" && (
          <>
            {showPassword ? (
              <Eye
                className="h-5 w-5 cursor-pointer text-[var(--rushd-muted)] transition hover:text-[var(--rushd-text)]"
                onClick={toggleShowPassword}
              />
            ) : (
              <EyeOff
                className="h-5 w-5 cursor-pointer text-[var(--rushd-muted)] transition hover:text-[var(--rushd-text)]"
                onClick={toggleShowPassword}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Input;
