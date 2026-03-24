"use client";

import { useState } from "react";
import { Save, Shuffle, Eraser, X, ChefHat, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBuilderStore, useUIStore } from "@/lib/store";
import { getPresetsForField, getTemplateById } from "@/lib/data";
import { buildPrompt } from "@/lib/prompt-engine";
import type { Template } from "@/types";
import * as promptService from "@/lib/services/prompt-service";
import * as recipeService from "@/lib/services/recipe-service";
import { Button } from "@/components/ui/button";

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
    customColors,
    selectedKeywords,
    negativePrompt,
    selectedGenerator,
    selectedPhrases,
    mockup,
    garmentMode,
    referenceImageUrl,
    variables,
    variations,
    mood,
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
      customColors,
      keywords: selectedKeywords,
      negative: negativePrompt,
      generator: selectedGenerator,
      phrases: selectedPhrases,
      mockup: mockup.enabled
        ? { item: mockup.item, color: mockup.color, display: mockup.display }
        : undefined,
      garmentMode,
      mood,
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
      customColors,
      keywords: selectedKeywords,
      negative: negativePrompt,
      generator: selectedGenerator,
      phrases: selectedPhrases,
      mockup: mockup.enabled
        ? { item: mockup.item, color: mockup.color, display: mockup.display }
        : undefined,
      garmentMode,
      mood,
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
    <div className="space-y-2">
      {/* Primary actions */}
      {lastSaved && (
        <Button
          onClick={handleIterate}
          disabled={!hasFields}
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
        >
          <GitBranch className="w-3.5 h-3.5" />
          Iterate (v{lastSaved.version + 1})
        </Button>
      )}
    </div>
  );
}
