import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AccentId, GeneratorId } from "@/types";
import { ACCENTS } from "@/lib/data";

export interface CustomPhrase {
  id: string;
  name: string;
  content: string;
}

interface SettingsState {
  accent: AccentId;
  theme: "dark" | "light";
  defaultGenerator: GeneratorId;
  installedStylePacks: string[];
  customPhrases: CustomPhrase[];
}

interface SettingsActions {
  setAccent: (id: AccentId) => void;
  setTheme: (theme: "dark" | "light") => void;
  toggleTheme: () => void;
  setDefaultGenerator: (id: GeneratorId) => void;
  installStylePack: (packId: string) => void;
  uninstallStylePack: (packId: string) => void;
  addCustomPhrase: (phrase: CustomPhrase) => void;
  updateCustomPhrase: (id: string, updates: Partial<Omit<CustomPhrase, "id">>) => void;
  deleteCustomPhrase: (id: string) => void;
}

export type SettingsStore = SettingsState & SettingsActions;

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      accent: "orange",
      theme: "dark",
      defaultGenerator: "midjourney",
      installedStylePacks: [],
      customPhrases: [],

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

      installStylePack: (packId) =>
        set((state) => ({
          installedStylePacks: state.installedStylePacks.includes(packId)
            ? state.installedStylePacks
            : [...state.installedStylePacks, packId],
        })),

      uninstallStylePack: (packId) =>
        set((state) => ({
          installedStylePacks: state.installedStylePacks.filter((id) => id !== packId),
        })),

      addCustomPhrase: (phrase) =>
        set((state) => ({
          customPhrases: [...state.customPhrases, phrase],
        })),

      updateCustomPhrase: (id, updates) =>
        set((state) => ({
          customPhrases: state.customPhrases.map((p) =>
            p.id === id ? { ...p, ...updates } : p,
          ),
        })),

      deleteCustomPhrase: (id) =>
        set((state) => ({
          customPhrases: state.customPhrases.filter((p) => p.id !== id),
        })),
    }),
    {
      name: "spb-settings",
    },
  ),
);

/** Resolve accent ID → hex color. Derives from the single source of truth in accents.ts. */
function getAccentColor(id: AccentId): string {
  return ACCENTS.find((a) => a.id === id)?.color ?? ACCENTS[0].color;
}
