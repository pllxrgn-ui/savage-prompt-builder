"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Copy,
  Trash2,
  Calendar,
  Star,
  StickyNote,
  GitBranch,
  ChevronDown,
  ChevronUp,
  Upload,
  Columns2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBuilderStore, useUIStore } from "@/lib/store";
import * as promptService from "@/lib/services/prompt-service";
import { GENERATORS, getTemplateById } from "@/lib/data";
import { LucideIcon } from "@/components/ui/LucideIcon";
import type { SavedPrompt, UIStore } from "@/types";

interface PromptCardProps {
  prompt: SavedPrompt;
  onSelectDiff?: (id: string) => void;
  isDiffSelected?: boolean;
}

export function PromptCard({ prompt, onSelectDiff, isDiffSelected }: PromptCardProps) {
  const addToast = useUIStore((s: UIStore) => s.addToast);
  const loadRecipe = useBuilderStore((s) => s.loadRecipe);

  const [expanded, setExpanded] = useState(false);

  const generator = GENERATORS.find((g) => g.id === prompt.generatorId);
  const tmpl = getTemplateById(prompt.templateId);

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt.content);
    addToast({ message: "Prompt copied!", type: "success" });
  }

  function handleLoad() {
    loadRecipe({
      templateId: prompt.templateId,
      fieldData: prompt.fieldData,
      styles: prompt.styles,
      palette: prompt.palette,
      keywords: prompt.keywords,
      negative: prompt.negative,
      generatorId: prompt.generatorId,
      customColors: prompt.customColors,
      phrases: prompt.phrases,
      garmentMode: prompt.garmentMode,
      referenceImageUrl: prompt.referenceImageUrl,
      variables: prompt.variables,
      variations: prompt.variations,
      mockup: prompt.mockup,
    });
    addToast({ message: "Prompt loaded into builder", type: "info" });
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "group bg-bg-2 border p-4 transition-colors rounded-[var(--radius-lg)]",
        isDiffSelected
          ? "border-accent ring-2 ring-accent/20"
          : "border-accent/8 hover:border-accent/30",
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 border border-accent/20 shrink-0 rounded-[var(--radius-sm)]">
            {generator && (
              <LucideIcon name={generator.icon} className="w-4 h-4 text-accent" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-text-1 truncate">
              {prompt.title || "Untitled Prompt"}
            </h3>
            <div className="flex items-center gap-2 text-[10px] text-text-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(prompt.createdAt).toLocaleDateString()}
              </span>
              {tmpl && <span className="truncate">{tmpl.name}</span>}
            </div>
          </div>
        </div>

        {/* Star toggle */}
        <button
          onClick={() => promptService.toggleStar(prompt.id)}
          className={cn(
            "p-1 transition-colors shrink-0",
            prompt.starred
              ? "text-amber-400 hover:text-amber-500"
              : "text-text-3 hover:text-amber-400",
          )}
          title={prompt.starred ? "Unstar" : "Star"}
        >
          <Star className="w-4 h-4" fill={prompt.starred ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Version badge */}
      {prompt.version > 1 && (
        <div className="flex items-center gap-1 mb-2">
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-accent/10 text-accent border border-accent/20 rounded-full">
            <GitBranch className="w-3 h-3" />
            v{prompt.version}
          </span>
        </div>
      )}

      {/* Prompt text — expandable */}
      <button
        type="button"
        className={cn(
          "w-full text-left bg-bg-input p-3 mb-2 relative transition-all rounded-[var(--radius-md)]",
          expanded ? "" : "h-20 overflow-hidden",
        )}
        onClick={() => setExpanded(!expanded)}
      >
        <p
          className={cn(
            "text-[11px] font-mono text-text-2 leading-relaxed break-words whitespace-pre-wrap",
            !expanded && "line-clamp-3",
          )}
        >
          {prompt.content}
        </p>
        {!expanded && (
          <span className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-bg-input to-transparent" />
        )}
      </button>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-[10px] text-text-2 hover:text-accent mb-2 transition-colors"
      >
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {expanded ? "Collapse" : "Expand"}
      </button>

      {/* Note */}
      {prompt.note && (
        <div className="flex items-start gap-1.5 mb-2 text-[10px] text-text-2">
          <StickyNote className="w-3 h-3 mt-0.5 shrink-0 text-amber-400" />
          <span className="line-clamp-2">{prompt.note}</span>
        </div>
      )}

      {/* Score */}
      {prompt.score !== null && (
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              className={cn(
                "w-3 h-3",
                n <= (prompt.score ?? 0) ? "text-amber-400" : "text-text-3/30",
              )}
              fill={n <= (prompt.score ?? 0) ? "currentColor" : "none"}
            />
          ))}
        </div>
      )}

      {/* Tags row */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {prompt.styles.slice(0, 2).map((style) => (
          <span
            key={style}
            className="px-2 py-0.5 bg-accent/5 border border-accent/10 text-[10px] text-accent/80 rounded-full"
          >
            {style}
          </span>
        ))}
        {prompt.styles.length > 2 && (
          <span className="px-2 py-0.5 bg-surface border border-accent/8 text-[10px] text-text-2 rounded-full">
            +{prompt.styles.length - 2}
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 pt-2 border-t border-accent/8">
        <button
          onClick={handleCopy}
          className="p-1.5 text-text-3 hover:text-accent hover:bg-accent/10 transition-colors"
          title="Copy"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleLoad}
          className="p-1.5 text-text-3 hover:text-accent hover:bg-accent/10 transition-colors"
          title="Load in Builder"
        >
          <Upload className="w-3.5 h-3.5" />
        </button>
        {onSelectDiff && (
          <button
            onClick={() => onSelectDiff(prompt.id)}
            className={cn(
              "p-1.5 transition-colors",
              isDiffSelected
                ? "text-accent bg-accent/10"
                : "text-text-3 hover:text-accent hover:bg-accent/10",
            )}
            title="Select for compare"
          >
            <Columns2 className="w-3.5 h-3.5" />
          </button>
        )}
        <div className="flex-1" />
        <button
          onClick={() => promptService.deletePrompt(prompt.id)}
          className="p-1.5 text-text-3 hover:text-red-500 hover:bg-red-500/10 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
