"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { UI_FLAGS } from "@/src/ui/ui.flags";

export function ThemeToggle() {
  const { theme, toggleTheme, isReady } = useTheme();
  if (!UI_FLAGS.darkModeToggle) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle"
      aria-pressed={isDark}
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      disabled={!isReady}
    >
      <span className="sr-only">Alternar tema</span>
      <Sun className={`theme-toggle-icon ${isDark ? "theme-toggle-icon--inactive" : ""}`} />
      <Moon className={`theme-toggle-icon ${isDark ? "" : "theme-toggle-icon--inactive"}`} />
    </button>
  );
}
