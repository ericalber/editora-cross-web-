"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { UI_FLAGS } from "@/src/ui/ui.flags";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isReady: boolean;
}

const STORAGE_KEY = "editora-cross:theme";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const allowToggle = UI_FLAGS.darkModeToggle;
  const [theme, setTheme] = useState<Theme>("light");
  const [isReady, setIsReady] = useState(!allowToggle);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (!allowToggle) {
      return;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      setIsReady(true);
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
    setIsReady(true);
  }, [allowToggle]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const root = window.document.documentElement;
    if (!allowToggle) {
      root.classList.remove("dark");
      return;
    }
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, allowToggle]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme((prev) => (prev === "light" ? "dark" : "light")),
      isReady,
    }),
    [theme, isReady],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
