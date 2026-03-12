"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChefHat, Trash2, Upload, Calendar, Paintbrush, Tags, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBuilderStore, useUIStore } from "@/lib/store";
import * as recipeService from "@/lib/services/recipe-service";
import { GENERATORS, getTemplateById } from "@/lib/data";
import { LucideIcon } from "@/components/ui/LucideIcon";
import type { Recipe, UIStore } from "@/types";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const loadRecipe = useBuilderStore((s) => s.loadRecipe);
  const addToast = useUIStore((s: UIStore) => s.addToast);

  const [confirmDelete, setConfirmDelete] = useState(false);

  const generator = GENERATORS.find((g) => g.id === recipe.generatorId);
  const tmpl = getTemplateById(recipe.templateId);

  const fieldEntries = Object.entries(recipe.fieldData).filter(([, v]) => v.trim());

  function handleLoad() {
    loadRecipe({
      templateId: recipe.templateId,
      fieldData: recipe.fieldData,
      styles: recipe.styles,
      palette: recipe.palette,
      keywords: recipe.keywords,
      negative: recipe.negative,
      generatorId: recipe.generatorId,
      phrases: recipe.phrases,
      garmentMode: recipe.garmentMode,
      referenceImageUrl: recipe.referenceImageUrl,
      variables: recipe.variables,
      variations: recipe.variations,
      mockup: recipe.mockup,
    });
    addToast({ message: "Recipe loaded into builder!", type: "success" });
  }

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    recipeService.deleteRecipe(recipe.id);
    addToast({ message: "Recipe deleted", type: "info" });
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-bg-2 border border-accent/8 p-4 hover:border-accent/30 transition-colors rounded-[var(--radius-lg)]"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 border border-accent/20 shrink-0 rounded-[var(--radius-sm)]">
            <ChefHat className="w-4 h-4 text-accent" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-text-1 truncate">
              {recipe.title}
            </h3>
            <div className="flex items-center gap-2 text-[10px] text-text-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(recipe.createdAt).toLocaleDateString()}
              </span>
              {tmpl && <span className="truncate">{tmpl.name}</span>}
            </div>
          </div>
        </div>

        {generator && (
          <div className="p-1.5 border border-accent/20 shrink-0 rounded-[var(--radius-sm)]">
            <LucideIcon name={generator.icon} className="w-3.5 h-3.5 text-text-3" />
          </div>
        )}
      </div>

      {/* Field preview — first 3 fields */}
      {fieldEntries.length > 0 && (
        <div className="bg-bg-input p-3 mb-3 space-y-1 rounded-[var(--radius-md)]">
          {fieldEntries.slice(0, 3).map(([key, value]) => (
            <div key={key} className="flex items-baseline gap-2 text-[11px]">
              <span className="text-text-2 capitalize shrink-0">{key}:</span>
              <span className="text-text-2 truncate">{value}</span>
            </div>
          ))}
          {fieldEntries.length > 3 && (
            <p className="text-[10px] text-text-2">+{fieldEntries.length - 3} more fields</p>
          )}
        </div>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {recipe.styles.length > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/5 border border-accent/10 text-[10px] text-accent/80 rounded-full">
            <Paintbrush className="w-2.5 h-2.5" />
            {recipe.styles.length} styles
          </span>
        )}
        {recipe.keywords.length > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/5 border border-accent/10 text-[10px] text-accent/80 rounded-full">
            <Tags className="w-2.5 h-2.5" />
            {recipe.keywords.length} keywords
          </span>
        )}
        {recipe.palette && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/5 border border-accent/10 text-[10px] text-accent/80 rounded-full">
            <Palette className="w-2.5 h-2.5" />
            Palette
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-accent/8">
        <button
          onClick={handleLoad}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-accent text-black hover:bg-accent/90 transition-colors rounded-[var(--radius-md)]"
        >
          <Upload className="w-3.5 h-3.5" />
          Load in Builder
        </button>
        <div className="flex-1" />
        <button
          onClick={handleDelete}
          onBlur={() => setConfirmDelete(false)}
          className={cn(
            "p-1.5 transition-colors text-xs",
            confirmDelete
              ? "text-red-500 bg-red-500/10 font-medium px-2 rounded-[var(--radius-md)]"
              : "text-text-3 hover:text-red-500 hover:bg-red-500/10",
          )}
          title="Delete recipe"
        >
          {confirmDelete ? "Confirm?" : <Trash2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </motion.div>
  );
}
