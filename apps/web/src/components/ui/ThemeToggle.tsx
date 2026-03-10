"use client";

import { Moon, Sun } from "lucide-react";
import { clsx } from "clsx";
import { useSettingsStore } from "@/lib/store";

export function ThemeToggle() {
  const theme = useSettingsStore((s) => s.theme);
  const toggleTheme = useSettingsStore((s) => s.toggleTheme);

  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        "relative flex items-center justify-center w-10 h-10 rounded-lg",
        "bg-surface border border-border",
        "text-text-2 hover:text-text-1 hover:bg-bg-3",
        "transition-all duration-200",
      )}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
    </button>
  );
}
