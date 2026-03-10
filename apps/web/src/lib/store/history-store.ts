import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SavedPrompt, Recipe } from "@/types";

interface HistoryState {
  savedPrompts: SavedPrompt[];
  recipes: Recipe[];
}

interface HistoryActions {
  savePrompt: (prompt: Omit<SavedPrompt, "id" | "createdAt" | "updatedAt">) => void;
  deletePrompt: (id: string) => void;
  saveRecipe: (recipe: Omit<Recipe, "id" | "createdAt">) => void;
  deleteRecipe: (id: string) => void;
  clearHistory: () => void;
}

type HistoryStore = HistoryState & HistoryActions;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      savedPrompts: [],
      recipes: [],

      savePrompt: (promptData) =>
        set((state) => {
          const now = new Date().toISOString();
          const prompt: SavedPrompt = {
            ...promptData,
            id: generateId(),
            createdAt: now,
            updatedAt: now,
          };
          return { savedPrompts: [prompt, ...state.savedPrompts] };
        }),

      deletePrompt: (id) =>
        set((state) => ({
          savedPrompts: state.savedPrompts.filter((p) => p.id !== id),
        })),

      saveRecipe: (recipeData) =>
        set((state) => {
          const recipe: Recipe = {
            ...recipeData,
            id: generateId(),
            createdAt: new Date().toISOString(),
          };
          return { recipes: [recipe, ...state.recipes] };
        }),

      deleteRecipe: (id) =>
        set((state) => ({
          recipes: state.recipes.filter((r) => r.id !== id),
        })),

      clearHistory: () => set({ savedPrompts: [], recipes: [] }),
    }),
    {
      name: "spb-history",
    },
  ),
);
