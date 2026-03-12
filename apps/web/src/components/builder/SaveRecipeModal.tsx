"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChefHat } from "lucide-react";
import { clsx } from "clsx";
import { useBuilderStore, useUIStore } from "@/lib/store";
import * as recipeService from "@/lib/services/recipe-service";
import { getTemplateById } from "@/lib/data";
import type { UIStore } from "@/types";

interface SaveRecipeModalProps {
  open: boolean;
  onClose: () => void;
}

export function SaveRecipeModal({ open, onClose }: SaveRecipeModalProps) {
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
  } = useBuilderStore();

  const addToast = useUIStore((s: UIStore) => s.addToast);

  const tmpl = activeTemplateId ? getTemplateById(activeTemplateId) : null;
  const defaultName = tmpl ? `${tmpl.name} Recipe` : "My Recipe";

  const [name, setName] = useState(defaultName);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSave() {
    if (!activeTemplateId || !name.trim()) return;

    recipeService.saveRecipe({
      title: name.trim(),
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
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-bg-1 border border-accent/8 shadow-2xl w-full max-w-md mx-4 p-6"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-mono font-semibold text-text-1 uppercase tracking-wide">Save Recipe</h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close recipe modal"
                className="p-1.5 hover:bg-surface text-text-3 hover:text-text-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs font-mono text-text-3 mb-4">
              Save the entire builder state as a reusable recipe — template, fields, styles, palette, keywords, and more.
            </p>

            <label className="block mb-4">
              <span className="text-[10px] font-mono text-text-3 uppercase tracking-[0.15em] mb-1 block">Recipe Name</span>
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                placeholder="My awesome recipe..."
                className={clsx(
                  "w-full px-3 py-2 text-sm font-mono",
                  "bg-bg-input border border-accent/8 text-text-1",
                  "placeholder:text-text-3 focus:outline-none focus:border-accent/30",
                )}
              />
            </label>

            {/* Preview of what's included */}
            <div className="bg-surface p-3 mb-4 space-y-1.5 border border-accent/8">
              <p className="text-[10px] font-mono text-text-3 uppercase tracking-[0.15em] mb-2">
                Includes
              </p>
              <div className="flex flex-wrap gap-1.5">
                {tmpl && (
                  <span className="text-[10px] px-2 py-0.5 font-mono border border-accent/20 text-accent">
                    {tmpl.name}
                  </span>
                )}
                {selectedStyles.length > 0 && (
                  <span className="text-[10px] px-2 py-0.5 font-mono border border-accent/8 text-text-2">
                    {selectedStyles.length} styles
                  </span>
                )}
                {selectedPalette && (
                  <span className="text-[10px] px-2 py-0.5 font-mono border border-accent/8 text-text-2">
                    Palette
                  </span>
                )}
                {selectedKeywords.length > 0 && (
                  <span className="text-[10px] px-2 py-0.5 font-mono border border-accent/8 text-text-2">
                    {selectedKeywords.length} keywords
                  </span>
                )}
                {negativePrompt && (
                  <span className="text-[10px] px-2 py-0.5 font-mono border border-accent/8 text-text-2">
                    Negative
                  </span>
                )}
                {variations.length > 1 && (
                  <span className="text-[10px] px-2 py-0.5 font-mono border border-accent/8 text-text-2">
                    {variations.length} variations
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2 text-sm font-mono font-medium bg-surface text-text-2 hover:bg-bg-3 transition-colors border border-accent/8"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!name.trim()}
                className={clsx(
                  "flex-1 py-2 text-sm font-mono font-medium transition-colors",
                  name.trim()
                    ? "bg-accent text-black hover:bg-accent/90"
                    : "bg-surface text-text-3 cursor-not-allowed",
                )}
              >
                Save Recipe
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
