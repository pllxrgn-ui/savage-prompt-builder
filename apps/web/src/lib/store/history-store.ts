import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SavedPrompt, Recipe, Project } from "@/types";

interface HistoryState {
  savedPrompts: SavedPrompt[];
  recipes: Recipe[];
  projects: Project[];
}

interface HistoryActions {
  savePrompt: (prompt: Omit<SavedPrompt, "id" | "createdAt" | "updatedAt">) => void;
  deletePrompt: (id: string) => void;
  updatePrompt: (id: string, updates: Partial<SavedPrompt>) => void;
  toggleStar: (id: string) => void;
  setScore: (id: string, score: number | null) => void;
  setNote: (id: string, note: string) => void;
  saveRecipe: (recipe: Omit<Recipe, "id" | "createdAt">) => void;
  deleteRecipe: (id: string) => void;
  addProject: (name: string) => void;
  deleteProject: (id: string) => void;
  clearHistory: () => void;
}

export type HistoryStore = HistoryState & HistoryActions;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      savedPrompts: [],
      recipes: [],
      projects: [],

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

      updatePrompt: (id, updates) =>
        set((state) => ({
          savedPrompts: state.savedPrompts.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p,
          ),
        })),

      toggleStar: (id) =>
        set((state) => ({
          savedPrompts: state.savedPrompts.map((p) =>
            p.id === id ? { ...p, starred: !p.starred, updatedAt: new Date().toISOString() } : p,
          ),
        })),

      setScore: (id, score) =>
        set((state) => ({
          savedPrompts: state.savedPrompts.map((p) =>
            p.id === id ? { ...p, score, updatedAt: new Date().toISOString() } : p,
          ),
        })),

      setNote: (id, note) =>
        set((state) => ({
          savedPrompts: state.savedPrompts.map((p) =>
            p.id === id ? { ...p, note, updatedAt: new Date().toISOString() } : p,
          ),
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

      addProject: (name) =>
        set((state) => ({
          projects: [
            ...state.projects,
            { id: generateId(), name, createdAt: new Date().toISOString() },
          ],
        })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          savedPrompts: state.savedPrompts.map((p) =>
            p.projectId === id ? { ...p, projectId: null } : p,
          ),
        })),

      clearHistory: () => set({ savedPrompts: [], recipes: [], projects: [] }),
    }),
    {
      name: "spb-history",
    },
  ),
);
