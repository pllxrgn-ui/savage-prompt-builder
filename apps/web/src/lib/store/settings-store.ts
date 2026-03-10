import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AccentId, GeneratorId } from "@/types";

interface SettingsState {
  accent: AccentId;
  theme: "dark" | "light";
  defaultGenerator: GeneratorId;
}

interface SettingsActions {
  setAccent: (id: AccentId) => void;
  setTheme: (theme: "dark" | "light") => void;
  toggleTheme: () => void;
  setDefaultGenerator: (id: GeneratorId) => void;
}

type SettingsStore = SettingsState & SettingsActions;

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      accent: "rose",
      theme: "dark",
      defaultGenerator: "midjourney",

      setAccent: (id) => {
        document.documentElement.style.setProperty(
          "--accent",
          getAccentColor(id),
        );
        set({ accent: id });
      },

      setTheme: (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        set({ theme });
      },

      toggleTheme: () =>
        set((state) => {
          const next = state.theme === "dark" ? "light" : "dark";
          document.documentElement.setAttribute("data-theme", next);
          return { theme: next };
        }),

      setDefaultGenerator: (id) => set({ defaultGenerator: id }),
    }),
    {
      name: "spb-settings",
    },
  ),
);

/** Resolve accent ID → hex color. Must be kept in sync with accents.ts. */
function getAccentColor(id: AccentId): string {
  const map: Record<AccentId, string> = {
    rose: "#FF4D6D",
    violet: "#A78BFA",
    blue: "#3B82F6",
    cyan: "#22D3EE",
    emerald: "#34D399",
    amber: "#F59E0B",
    orange: "#F97316",
    pink: "#EC4899",
  };
  return map[id];
}
