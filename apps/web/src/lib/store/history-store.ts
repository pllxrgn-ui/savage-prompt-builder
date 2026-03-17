import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SavedPrompt, Recipe, Project } from "@/types";
import { api } from "@/lib/api";
import { useAuthStore } from "./auth-store";

interface HistoryState {
  savedPrompts: SavedPrompt[];
  recipes: Recipe[];
  projects: Project[];
  isLoading: boolean;
}

interface HistoryActions {
  syncLocalToCloud: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  savePrompt: (prompt: Omit<SavedPrompt, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>;
  updatePrompt: (id: string, updates: Partial<SavedPrompt>) => Promise<void>;
  toggleStar: (id: string) => Promise<void>;
  setScore: (id: string, score: number | null) => Promise<void>;
  setNote: (id: string, note: string) => Promise<void>;
  saveRecipe: (recipe: Omit<Recipe, "id" | "createdAt">) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
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
    (set, get) => ({
      savedPrompts: [],
      recipes: [],
      projects: [],
      isLoading: false,

      syncLocalToCloud: async () => {
        const { savedPrompts, recipes } = get();
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return;

        // Push local-only prompts (IDs with a dash)
        const localPrompts = savedPrompts.filter(p => typeof p.id === 'string' && p.id.includes('-'));
        for (const p of localPrompts) {
          try {
            await api.prompts.save({
              templateId: p.templateId,
              generator: p.generatorId,
              promptText: p.content,
              fieldData: p.fieldData,
              styles: p.styles,
              negative: p.negative,
              projectId: p.projectId,
              note: p.note,
              parentId: p.parentId,
            });
          } catch (e) {
            console.error('[Sync Local Prompt Error]', e);
          }
        }

        // Push local-only recipes
        const localRecipes = recipes.filter(r => typeof r.id === 'string' && r.id.includes('-'));
        for (const r of localRecipes) {
          try {
            await api.recipes.save({
              name: r.title,
              templateId: r.templateId,
              fieldData: r.fieldData,
              styles: r.styles,
              generatorId: r.generatorId,
              negative: r.negative,
            });
          } catch (e) {
            console.error('[Sync Local Recipe Error]', e);
          }
        }
      },

      fetchHistory: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return;

        set({ isLoading: true });
        
        // Push local data first ("Push first before pull")
        await get().syncLocalToCloud();

        try {
          const promptsData = await api.prompts.list();
          const recipesData = await api.recipes.list();
          
          const mappedPrompts: SavedPrompt[] = promptsData.map((p: any) => ({
            id: p.id,
            title: p.templateId,
            content: p.promptText,
            templateId: p.templateId,
            generatorId: p.generator as any,
            fieldData: p.fieldData || {},
            styles: p.styles || [],
            palette: p.palettes?.[0] || null,
            keywords: p.keywords || [],
            negative: p.negative || "",
            starred: p.starred || false,
            score: p.rating,
            note: p.note || "",
            parentId: p.parentId,
            version: 1,
            projectId: p.projectId,
            variations: [],
            createdAt: p.createdAt,
            updatedAt: p.createdAt,
          }));

          const mappedRecipes: Recipe[] = recipesData.map((r: any) => ({
            id: r.id,
            title: r.name,
            templateId: r.templateId,
            fieldData: r.fieldData || {},
            styles: r.styles || [],
            palette: r.palettes?.[0] || null,
            keywords: r.keywords || [],
            negative: r.negative || "",
            generatorId: r.generatorId as any,
            phrases: [],
            garmentMode: null,
            referenceImageUrl: null,
            variables: {},
            variations: [],
            mockup: null,
            createdAt: r.createdAt,
          }));

          set({ 
            savedPrompts: mappedPrompts, 
            recipes: mappedRecipes, 
            isLoading: false 
          });
        } catch (error) {
          console.error('[History Sync Error]', error);
          set({ isLoading: false });
        }
      },

      savePrompt: async (promptData) => {
        const { isAuthenticated } = useAuthStore.getState();
        const now = new Date().toISOString();
        const tempId = generateId();

        const localPrompt: SavedPrompt = {
          ...promptData,
          id: tempId,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ savedPrompts: [localPrompt, ...state.savedPrompts] }));

        if (isAuthenticated) {
          try {
            const cloudPrompt = await api.prompts.save({
              templateId: promptData.templateId,
              generator: promptData.generatorId,
              promptText: promptData.content,
              fieldData: promptData.fieldData,
              styles: promptData.styles,
              negative: promptData.negative,
              projectId: promptData.projectId,
              note: promptData.note,
              parentId: promptData.parentId,
            });
            
            set((state) => ({
              savedPrompts: state.savedPrompts.map(p => p.id === tempId ? { ...p, id: cloudPrompt.id } : p)
            }));
          } catch (error) {
            console.error('[Save Prompt Cloud Error]', error);
          }
        }
      },

      deletePrompt: async (id) => {
        const { isAuthenticated } = useAuthStore.getState();
        set((state) => ({
          savedPrompts: state.savedPrompts.filter((p) => p.id !== id),
        }));

        if (isAuthenticated && !id.includes('-')) {
          try {
            await api.prompts.delete(id);
          } catch (error) {
            console.error('[Delete Prompt Cloud Error]', error);
          }
        }
      },

      updatePrompt: async (id, updates) => {
        set((state) => ({
          savedPrompts: state.savedPrompts.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p,
          ),
        }));
      },

      toggleStar: async (id) => {
        set((state) => ({
          savedPrompts: state.savedPrompts.map((p) =>
            p.id === id ? { ...p, starred: !p.starred, updatedAt: new Date().toISOString() } : p,
          ),
        }));
      },

      setScore: async (id, score) => {
        set((state) => ({
          savedPrompts: state.savedPrompts.map((p) =>
            p.id === id ? { ...p, score, updatedAt: new Date().toISOString() } : p,
          ),
        }));
      },

      setNote: async (id, note) => {
        set((state) => ({
          savedPrompts: state.savedPrompts.map((p) =>
            p.id === id ? { ...p, note, updatedAt: new Date().toISOString() } : p,
          ),
        }));
      },

      saveRecipe: async (recipeData) => {
        const { isAuthenticated } = useAuthStore.getState();
        const tempId = generateId();

        const localRecipe: Recipe = {
          ...recipeData,
          id: tempId,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ recipes: [localRecipe, ...state.recipes] }));

        if (isAuthenticated) {
          try {
            const cloudRecipe = await api.recipes.save({
              name: recipeData.title,
              templateId: recipeData.templateId,
              fieldData: recipeData.fieldData,
              styles: recipeData.styles,
              generatorId: recipeData.generatorId,
              negative: recipeData.negative,
            });
            set((state) => ({
              recipes: state.recipes.map(r => r.id === tempId ? { ...r, id: cloudRecipe.id } : r)
            }));
          } catch (error) {
            console.error('[Save Recipe Cloud Error]', error);
          }
        }
      },

      deleteRecipe: async (id) => {
        const { isAuthenticated } = useAuthStore.getState();
        set((state) => ({
          recipes: state.recipes.filter((r) => r.id !== id),
        }));

        if (isAuthenticated && !id.includes('-')) {
          try {
            await api.recipes.delete(id);
          } catch (error) {
            console.error('[Delete Recipe Cloud Error]', error);
          }
        }
      },

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
