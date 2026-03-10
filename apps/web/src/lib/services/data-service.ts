/**
 * Data service — export, import, and clear all user data.
 * BACKEND: Replace with fetch('/api/data/...') for cloud sync.
 */
import { useHistoryStore, useBuilderStore, useSettingsStore } from "@/lib/store";

interface ExportedData {
  version: number;
  exportedAt: string;
  history: ReturnType<typeof useHistoryStore.getState>;
  settings: ReturnType<typeof useSettingsStore.getState>;
  builder: {
    customStyles: ReturnType<typeof useBuilderStore.getState>["customStyles"];
  };
}

// BACKEND: GET /api/data/export
export function exportData(): ExportedData {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    history: useHistoryStore.getState(),
    settings: useSettingsStore.getState(),
    builder: {
      customStyles: useBuilderStore.getState().customStyles,
    },
  };
}

// BACKEND: POST /api/data/import
export function importData(data: ExportedData): { imported: number } {
  const historyStore = useHistoryStore.getState();
  const settingsStore = useSettingsStore.getState();
  const builderStore = useBuilderStore.getState();

  let imported = 0;

  // Import history — deduplicate by id
  if (data.history?.savedPrompts) {
    const existingIds = new Set(historyStore.savedPrompts.map((p) => p.id));
    for (const prompt of data.history.savedPrompts) {
      if (!existingIds.has(prompt.id)) {
        historyStore.savePrompt(prompt);
        imported++;
      }
    }
  }

  if (data.history?.recipes) {
    const existingIds = new Set(historyStore.recipes.map((r) => r.id));
    for (const recipe of data.history.recipes) {
      if (!existingIds.has(recipe.id)) {
        historyStore.saveRecipe(recipe);
        imported++;
      }
    }
  }

  // Import custom styles
  if (data.builder?.customStyles) {
    const existingIds = new Set(builderStore.customStyles.map((s) => s.id));
    for (const style of data.builder.customStyles) {
      if (!existingIds.has(style.id)) {
        builderStore.addCustomStyle(style);
        imported++;
      }
    }
  }

  // Import settings (accent + theme)
  if (data.settings?.accent) settingsStore.setAccent(data.settings.accent);
  if (data.settings?.theme) settingsStore.setTheme(data.settings.theme);

  return { imported };
}

// BACKEND: DELETE /api/data/clear
export function clearData(): void {
  // Clear localStorage stores
  localStorage.removeItem("spb-builder");
  localStorage.removeItem("spb-history");
  localStorage.removeItem("spb-settings");
  localStorage.removeItem("spb-media");
  // Reload to reset in-memory zustand state
  window.location.reload();
}
