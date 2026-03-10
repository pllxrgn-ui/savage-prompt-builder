"use client";

import { useEffect, useCallback } from "react";
import { useBuilderStore, useUIStore } from "@/lib/store";
import * as promptService from "@/lib/services/prompt-service";
import { buildPrompt } from "@/lib/prompt-engine";
import { getTemplateById } from "@/lib/data";

function isInputFocused(): boolean {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    (el as HTMLElement).isContentEditable
  );
}

export function useKeyboardShortcuts() {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;

      // Escape — close modals/drawers
      if (e.key === "Escape") {
        useUIStore.getState().setDrawer(null);
        return;
      }

      // Don't capture shortcuts when typing in inputs
      if (isInputFocused()) {
        // Only intercept Ctrl+S even in inputs (prevent browser save)
        if (mod && e.key === "s") {
          e.preventDefault();
          handleSave();
        }
        return;
      }

      // Ctrl+Shift+C — Copy prompt
      if (mod && e.shiftKey && e.key === "C") {
        e.preventDefault();
        handleCopyPrompt();
        return;
      }

      // Ctrl+S — Save to history
      if (mod && e.key === "s") {
        e.preventDefault();
        handleSave();
        return;
      }

      // Ctrl+Z — Undo
      if (mod && !e.shiftKey && e.key === "z") {
        e.preventDefault();
        useBuilderStore.getState().undo();
        return;
      }

      // Ctrl+Shift+Z — Redo
      if (mod && e.shiftKey && (e.key === "Z" || e.key === "z")) {
        e.preventDefault();
        useBuilderStore.getState().redo();
        return;
      }
    },
    [],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

function handleCopyPrompt() {
  const state = useBuilderStore.getState();
  if (!state.activeTemplateId) return;

  const result = buildPrompt({
    templateId: state.activeTemplateId,
    fields: state.templateFields,
    styles: state.selectedStyles,
    palette: state.selectedPalette,
    keywords: state.selectedKeywords,
    negative: state.negativePrompt,
    generator: state.selectedGenerator,
    phrases: state.selectedPhrases,
    mockup: state.mockup.enabled
      ? {
          item: state.mockup.item,
          color: state.mockup.color,
          display: state.mockup.display,
        }
      : undefined,
    garmentMode: state.garmentMode,
  });

  navigator.clipboard.writeText(result.full);
  useUIStore
    .getState()
    .addToast({ message: "Prompt copied! (⌘⇧C)", type: "success" });
}

function handleSave() {
  const state = useBuilderStore.getState();
  if (!state.activeTemplateId) return;

  const result = buildPrompt({
    templateId: state.activeTemplateId,
    fields: state.templateFields,
    styles: state.selectedStyles,
    palette: state.selectedPalette,
    keywords: state.selectedKeywords,
    negative: state.negativePrompt,
    generator: state.selectedGenerator,
    phrases: state.selectedPhrases,
    mockup: state.mockup.enabled
      ? {
          item: state.mockup.item,
          color: state.mockup.color,
          display: state.mockup.display,
        }
      : undefined,
    garmentMode: state.garmentMode,
  });

  const tmpl = getTemplateById(state.activeTemplateId);
  const firstField = Object.values(state.templateFields).find(
    (v) => v.trim() !== "",
  );

  promptService.savePrompt({
    title: tmpl
      ? tmpl.name + (firstField ? ` — ${firstField}` : "")
      : state.activeTemplateId,
    content: result.full,
    templateId: state.activeTemplateId,
    generatorId: state.selectedGenerator,
    fieldData: state.templateFields,
    styles: state.selectedStyles,
    palette: state.selectedPalette,
    keywords: state.selectedKeywords,
    negative: state.negativePrompt,
    starred: false,
    score: null,
    note: "",
    parentId: null,
    version: 1,
    projectId: null,
    variations: state.variations,
  });

  useUIStore
    .getState()
    .addToast({ message: "Saved to history! (⌘S)", type: "success" });
}
