import { useHistoryStore } from "@/lib/store";
import type { Recipe } from "@/types";

// BACKEND: Replace with fetch('/api/recipes', ...) + auth header

export function saveRecipe(data: Omit<Recipe, "id" | "createdAt">): Recipe {
  const store = useHistoryStore.getState();
  store.saveRecipe(data);
  return store.recipes[0]!;
}

export function getRecipes(): Recipe[] {
  return useHistoryStore.getState().recipes;
}

export function deleteRecipe(id: string): void {
  useHistoryStore.getState().deleteRecipe(id);
}

export function loadRecipe(recipeId: string): Recipe | undefined {
  return useHistoryStore.getState().recipes.find((r) => r.id === recipeId);
}
