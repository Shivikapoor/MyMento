import { useTheme } from "../context/ThemeContext";

function ThemeToggle({ className = "" }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={`theme-segmented ${className}`.trim()}
      role="radiogroup"
      aria-label="Theme mode"
    >
      <button
        type="button"
        role="radio"
        aria-checked={theme === "light"}
        className={`theme-segment ${theme === "light" ? "active" : ""}`}
        onClick={() => setTheme("light")}
      >
        Light
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={theme === "dark"}
        className={`theme-segment ${theme === "dark" ? "active" : ""}`}
        onClick={() => setTheme("dark")}
      >
        Dark
      </button>
    </div>
  );
}

export default ThemeToggle;
