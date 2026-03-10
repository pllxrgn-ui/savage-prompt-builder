"use client";

import { useState } from "react";
import { Save, Shuffle, Eraser, X, ChefHat, GitBranch } from "lucide-react";
import { clsx } from "clsx";
import { useBuilderStore, useUIStore } from "@/lib/store";
import { getPresetsForField, getTemplateById } from "@/lib/data";
import { buildPrompt } from "@/lib/prompt-engine";
import type { Template } from "@/types";
import * as promptService from "@/lib/services/prompt-service";
import * as recipeService from "@/lib/services/recipe-service";

interface BuilderActionsProps {
  template: Template;
  onRecipe?: () => void;
}

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function BuilderActions({ template, onRecipe }: BuilderActionsProps) {
  const {
    activeTemplateId,
    templateFields,
    selectedStyles,
    selectedPalette,
    selectedKeywords,
    negativePrompt,
    selectedGenerator,
    selectedPhrases,
    mockup,
    garmentMode,
    referenceImageUrl,
    variables,
    variations,
    setField,
    setStyles,
  } = useBuilderStore();

  const addToast = useUIStore((s) => s.addToast);

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const hasFields = Object.values(templateFields).some((v) => v.trim() !== "");
  const savedPrompts = promptService.getPrompts();
  const lastSaved = savedPrompts.find((p) => p.templateId === activeTemplateId);

  function handleSave() {
    if (!activeTemplateId) return;

    const result = buildPrompt({
      templateId: activeTemplateId,
      fields: templateFields,
      styles: selectedStyles,
      palette: selectedPalette,
      keywords: selectedKeywords,
      negative: negativePrompt,
      generator: selectedGenerator,
      phrases: selectedPhrases,
      mockup: mockup.enabled
        ? { item: mockup.item, color: mockup.color, display: mockup.display }
        : undefined,
      garmentMode,
    });

    promptService.savePrompt({
      title: template.name + (templateFields.subject ? ` — ${templateFields.subject}` : ""),
      content: result.full,
      templateId: activeTemplateId,
      generatorId: selectedGenerator,
      fieldData: templateFields,
      styles: selectedStyles,
      palette: selectedPalette,
      keywords: selectedKeywords,
      negative: negativePrompt,
      starred: false,
      score: null,
      note: "",
      parentId: null,
      version: 1,
      projectId: null,
      variations,
    });

    addToast({ message: "Saved to history!", type: "success" });
  }

  function handleSaveRecipe() {
    if (!activeTemplateId) return;

    recipeService.saveRecipe({
      title: `${template.name} Recipe`,
      templateId: activeTemplateId,
      generatorId: selectedGenerator,
      fieldData: templateFields,
      styles: selectedStyles,
      palette: selectedPalette,
      keywords: selectedKeywords,
      negative: negativePrompt,
      phrases: selectedPhrases,
      garmentMode: garmentMode ?? null,
      referenceImageUrl: referenceImageUrl ?? null,
      variables,
      variations,
      mockup: mockup.enabled ? mockup : null,
    });

    addToast({ message: "Recipe saved!", type: "success" });
  }

  function handleIterate() {
    if (!activeTemplateId || !lastSaved) return;

    const result = buildPrompt({
      templateId: activeTemplateId,
      fields: templateFields,
      styles: selectedStyles,
      palette: selectedPalette,
      keywords: selectedKeywords,
      negative: negativePrompt,
      generator: selectedGenerator,
      phrases: selectedPhrases,
      mockup: mockup.enabled
        ? { item: mockup.item, color: mockup.color, display: mockup.display }
        : undefined,
      garmentMode,
    });

    promptService.iteratePrompt(lastSaved.id, {
      title: template.name + (templateFields.subject ? ` — ${templateFields.subject}` : ""),
      content: result.full,
      templateId: activeTemplateId,
      generatorId: selectedGenerator,
      fieldData: templateFields,
      styles: selectedStyles,
      palette: selectedPalette,
      keywords: selectedKeywords,
      negative: negativePrompt,
      starred: false,
      score: null,
      note: "",
      projectId: lastSaved.projectId,
      variations,
    });

    addToast({ message: `Saved as v${lastSaved.version + 1}`, type: "success" });
  }

  function handleClearFields() {
    if (!showClearConfirm) {
      setShowClearConfirm(true);
      return;
    }
    template.fields.forEach((f) => setField(f.id, ""));
    setShowClearConfirm(false);
    addToast({ message: "Fields cleared", type: "info" });
  }

  function handleClearStyles() {
    setStyles([]);
    addToast({ message: "Styles cleared", type: "info" });
  }

  function handleRandomFill() {
    template.fields.forEach((field) => {
      if (field.id === "avoid") return; // Don't randomize avoid field
      const presets = getPresetsForField(template.id, field.id);
      if (presets.length > 0) {
        setField(field.id, pickRandom(presets));
      }
    });
    addToast({ message: "Fields randomized!", type: "success" });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={handleSave}
        disabled={!hasFields}
        className={clsx(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
          "border transition-all duration-150",
          hasFields
            ? "bg-accent/10 text-accent border-accent/30 hover:bg-accent/20"
            : "bg-surface text-text-3 border-transparent cursor-not-allowed opacity-50",
        )}
      >
        <Save className="w-3.5 h-3.5" />
        Save
      </button>

      <button
        onClick={onRecipe ?? handleSaveRecipe}
        disabled={!hasFields}
        className={clsx(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
          "border transition-all duration-150",
          hasFields
            ? "bg-surface text-text-2 border-transparent hover:bg-bg-3 hover:text-text-1"
            : "bg-surface text-text-3 border-transparent cursor-not-allowed opacity-50",
        )}
      >
        <ChefHat className="w-3.5 h-3.5" />
        Recipe
      </button>

      {lastSaved && (
        <button
          onClick={handleIterate}
          disabled={!hasFields}
          className={clsx(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
            "border transition-all duration-150",
            hasFields
              ? "bg-surface text-text-2 border-transparent hover:bg-bg-3 hover:text-text-1"
              : "bg-surface text-text-3 border-transparent cursor-not-allowed opacity-50",
          )}
        >
          <GitBranch className="w-3.5 h-3.5" />
          Iterate (v{lastSaved.version + 1})
        </button>
      )}

      <button
        onClick={handleRandomFill}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface text-text-2 border border-transparent hover:bg-bg-3 hover:text-text-1 transition-all duration-150"
      >
        <Shuffle className="w-3.5 h-3.5" />
        Random Fill
      </button>

      <button
        onClick={handleClearFields}
        className={clsx(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
          "border transition-all duration-150",
          showClearConfirm
            ? "bg-red-500/10 text-red-400 border-red-400/30 hover:bg-red-500/20"
            : "bg-surface text-text-3 border-transparent hover:text-text-2 hover:bg-bg-3",
        )}
      >
        <Eraser className="w-3.5 h-3.5" />
        {showClearConfirm ? "Confirm Clear?" : "Clear Fields"}
      </button>

      <button
        onClick={handleClearStyles}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface text-text-3 border border-transparent hover:text-text-2 hover:bg-bg-3 transition-all duration-150"
      >
        <X className="w-3.5 h-3.5" />
        Clear Styles
      </button>
    </div>
  );
}
