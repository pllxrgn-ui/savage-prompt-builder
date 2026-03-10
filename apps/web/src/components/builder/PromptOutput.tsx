"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, ChevronDown, ChefHat, Share2 } from "lucide-react";
import { clsx } from "clsx";
import { useBuilderStore, useUIStore } from "@/lib/store";
import * as promptService from "@/lib/services/prompt-service";
import * as recipeServiceMod from "@/lib/services/recipe-service";
import { GENERATORS, PHRASES, getTemplateById } from "@/lib/data";
import { buildPrompt } from "@/lib/prompt-engine";
import { LucideIcon } from "@/components/ui/LucideIcon";
import { Sparkles, Loader2, Image as ImageIcon } from "lucide-react";
import type { GeneratorId, UIStore } from "@/types";
import { GenerateModal } from "@/components/generate/GenerateModal";
import { copyShareUrl } from "@/lib/services/share-service";

export function PromptOutput() {
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
    setGenerator,
    togglePhrase,
  } = useBuilderStore();

  const addToast = useUIStore((s: UIStore) => s.addToast);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [polishedResult, setPolishedResult] = useState<string | null>(null);
  const [showGenerators, setShowGenerators] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const genDropdownRef = useRef<HTMLDivElement>(null);

  const closeDropdown = useCallback(() => setShowGenerators(false), []);

  useEffect(() => {
    if (!showGenerators) return;
    function handleClickOutside(e: MouseEvent) {
      if (genDropdownRef.current && !genDropdownRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") closeDropdown();
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showGenerators, closeDropdown]);

  const result = useMemo(() => {
    if (!activeTemplateId) return null;
    const raw = buildPrompt({
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
      referenceImageUrl,
    });

    // Apply variable token replacement
    const varEntries = Object.entries(variables);
    if (varEntries.length === 0) return raw;

    let full = raw.full;
    let positive = raw.positive;
    let negative = raw.negative;
    for (const [key, value] of varEntries) {
      const token = `{${key}}`;
      full = full.replaceAll(token, value);
      positive = positive.replaceAll(token, value);
      negative = negative.replaceAll(token, value);
    }
    return { ...raw, full, positive, negative };
  }, [
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
  ]);

  // Clear polished result when the source prompt changes
  useEffect(() => {
    setPolishedResult(null);
  }, [result?.full]);

  const activeGen = GENERATORS.find((g) => g.id === selectedGenerator);

  async function handleCopy() {
    if (!result || !activeTemplateId) return;

    await navigator.clipboard.writeText(result.full);
    setCopied(true);

    // Generate title from template name + first field
    const tmpl = getTemplateById(activeTemplateId);
    const firstFieldValue = Object.values(templateFields).find((v) => v.trim() !== "");
    const title = tmpl
      ? tmpl.name + (firstFieldValue ? ` — ${firstFieldValue}` : "")
      : activeTemplateId.charAt(0).toUpperCase() + activeTemplateId.slice(1).replace(/-/g, " ");

    // Auto-save to history
    promptService.savePrompt({
      title,
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

    addToast({ message: "Prompt copied and saved to history!", type: "success" });
    setTimeout(() => setCopied(false), 2000);
  }

  const handleSaveRecipe = () => {
    if (!activeTemplateId) return;

    const tmpl = getTemplateById(activeTemplateId);
    recipeServiceMod.saveRecipe({
      title: `${tmpl?.name ?? activeTemplateId} Recipe`,
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

    setSaved(true);
    addToast({ message: "Recipe saved to your library!", type: "success" });
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePolish = async () => {
    if (!result || !activeTemplateId || !activeGen) return;

    setIsPolishing(true);
    try {
      const response = await fetch("/api/ai/polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: result.full,
          generator: activeGen.name,
          templateId: activeTemplateId,
        }),
      });

      if (!response.ok) throw new Error("Failed to polish prompt");

      const data = await response.json();
      setPolishedResult(data.result);
      addToast({ message: "Prompt polished successfully!", type: "success" });
    } catch (error) {
      console.error(error);
      addToast({ message: "Failed to connect to AI Agent. Check API key.", type: "error" });
    } finally {
      setIsPolishing(false);
    }
  };

  const currentDisplayPrompt = polishedResult || result?.full;

  return (
    <div className="relative rounded-xl border border-border bg-bg-2 overflow-hidden">
      {/* Shimmer glow when output exists */}
      {(result || polishedResult) && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none z-0"
          style={{
            background: polishedResult
              ? "linear-gradient(90deg, transparent 0%, #a855f7 50%, transparent 100%)" // Purple glow for AI
              : "linear-gradient(90deg, transparent 0%, var(--color-accent) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            opacity: 0.08,
            filter: "blur(12px)",
          }}
          animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      )}
      {/* Header with generator selector */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-text-1">Output</h3>
        <div className="relative" ref={genDropdownRef}>
          <button
            onClick={() => setShowGenerators(!showGenerators)}
            className={clsx(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium",
              "bg-surface border border-border hover:bg-bg-3 transition-all duration-150",
            )}
          >
            {activeGen && (
              <LucideIcon name={activeGen.icon} className="w-3.5 h-3.5 text-accent" />
            )}
            <span className="text-text-2">{activeGen?.name ?? "Generator"}</span>
            <ChevronDown className="w-3 h-3 text-text-3" />
          </button>

          {showGenerators && (
            <div
              className={clsx(
                "absolute right-0 top-full mt-1 z-50 w-56",
                "bg-bg-1 border border-border rounded-xl shadow-lg",
                "py-1 max-h-64 overflow-y-auto",
              )}
            >
              {GENERATORS.map((gen) => (
                <button
                  key={gen.id}
                  onClick={() => {
                    setGenerator(gen.id as GeneratorId);
                    setShowGenerators(false);
                  }}
                  className={clsx(
                    "w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-surface transition-colors",
                    selectedGenerator === gen.id && "bg-accent/10",
                  )}
                >
                  <LucideIcon name={gen.icon} className="w-4 h-4 text-text-3" />
                  <div className="flex-1 min-w-0">
                    <p
                      className={clsx(
                        "text-xs font-medium",
                        selectedGenerator === gen.id
                          ? "text-accent"
                          : "text-text-1",
                      )}
                    >
                      {gen.name}
                    </p>
                    <p className="text-[10px] text-text-3 truncate">
                      {gen.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Phrases */}
      <div className="relative px-4 py-3 border-b border-border">
        <p className="text-[10px] text-text-3 mb-2 uppercase tracking-wider font-medium">
          Boost Phrases
        </p>
        <div className="flex flex-wrap gap-1.5">
          {PHRASES.map((phrase) => {
            const isSelected = selectedPhrases.includes(phrase.content);
            return (
              <button
                key={phrase.id}
                onClick={() => togglePhrase(phrase.content)}
                className={clsx(
                  "px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-150",
                  "border cursor-pointer",
                  isSelected
                    ? "bg-accent/15 text-accent border-accent/30"
                    : "bg-surface text-text-3 border-transparent hover:text-text-2 hover:bg-bg-3",
                )}
              >
                {phrase.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Output preview */}
      <div className="relative p-4">
        {!result ? (
          <p className="text-xs text-text-3 text-center py-6">
            Fill in template fields to see your prompt.
          </p>
        ) : (
          <div className="space-y-3">
            {/* Positive */}
            <div>
              <p className="text-[10px] text-text-3 mb-1 uppercase tracking-wider font-medium">
                Positive
              </p>
              <div className="bg-bg-input border border-border rounded-lg p-3">
                <p className="text-xs text-text-1 leading-relaxed break-words whitespace-pre-wrap">
                  {result.positive || <span className="text-text-3 italic">Empty</span>}
                </p>
              </div>
            </div>

            {/* Negative */}
            {result.negative && (
              <div>
                <p className="text-[10px] text-text-3 mb-1 uppercase tracking-wider font-medium">
                  Negative
                </p>
                <div className="bg-bg-input border border-border rounded-lg p-3">
                  <p className="text-xs text-text-2 leading-relaxed break-words whitespace-pre-wrap">
                    {result.negative}
                  </p>
                </div>
              </div>
            )}

            {/* Full formatted output */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] text-text-3 uppercase tracking-wider font-medium">
                  {polishedResult ? "AI Polished Output" : `Full Output (${activeGen?.name})`}
                </p>
                {polishedResult && (
                  <span className="text-[10px] text-purple-400 bg-purple-400/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI Optimized
                  </span>
                )}
              </div>
              <div className={clsx(
                "border rounded-lg p-3 transition-colors",
                polishedResult ? "bg-purple-950/20 border-purple-500/30" : "bg-bg-input border-border"
              )}>
                <pre className={clsx(
                  "text-xs leading-relaxed break-words whitespace-pre-wrap font-mono",
                  polishedResult ? "text-purple-300" : "text-accent"
                )}>
                  {currentDisplayPrompt}
                </pre>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5">
              <div className="flex gap-2.5">
                {/* AI Polish Button */}
                <motion.button
                  onClick={handlePolish}
                  disabled={isPolishing || !!polishedResult}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  className={clsx(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium",
                    "transition-all duration-200 border",
                    polishedResult
                      ? "bg-purple-500/10 text-purple-400 border-purple-500/30 opacity-50 cursor-not-allowed"
                      : "bg-bg-3 text-text-2 border-border hover:bg-surface hover:text-purple-400 hover:border-purple-400/40"
                  )}
                >
                  {isPolishing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="flex items-center justify-center"
                    >
                      <Loader2 className="w-4 h-4 text-purple-400" />
                    </motion.div>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {polishedResult ? "Polished" : "AI Polish"}
                    </span>
                  )}
                </motion.button>
              </div>

              <div className="flex gap-2.5">
                {/* Copy prompt button */}
                <motion.button
                  onClick={handleCopy}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  className={clsx(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium",
                    "transition-[background-color,color,border-color] duration-200",
                    copied
                      ? "bg-success/15 text-success border border-success/30"
                      : "bg-accent text-white hover:bg-accent/90",
                  )}
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.span
                        key="copied"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Copied!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Prompt
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Save recipe button */}
                <motion.button
                  onClick={handleSaveRecipe}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  className={clsx(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium",
                    "transition-all duration-200 border",
                    saved
                      ? "bg-success/15 text-success border-success/30"
                      : "bg-bg-3 text-text-2 border-border hover:bg-surface hover:text-text-1 hover:border-accent/40",
                  )}
                >
                  <AnimatePresence mode="wait">
                    {saved ? (
                      <motion.span
                        key="saved"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Saved!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="save"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-2"
                      >
                        <ChefHat className="w-4 h-4" />
                        Save Recipe
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>

              {/* Generate Image button */}
              <motion.button
                onClick={() => setGenerateOpen(true)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium bg-bg-3 text-text-2 border border-border hover:bg-surface hover:text-accent hover:border-accent/40 transition-all duration-200"
              >
                <ImageIcon className="w-4 h-4" />
                Generate Image
              </motion.button>

              {/* Share button */}
              <motion.button
                onClick={async () => {
                  const { tooLong } = await copyShareUrl();
                  addToast({
                    message: tooLong
                      ? "Share link copied! (URL is long — may not work in all browsers)"
                      : "Share link copied to clipboard!",
                    type: tooLong ? "info" : "success",
                  });
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium bg-bg-3 text-text-2 border border-border hover:bg-surface hover:text-text-1 hover:border-accent/40 transition-all duration-200"
              >
                <Share2 className="w-4 h-4" />
                Share Prompt
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {/* Generate Modal */}
      <GenerateModal
        open={generateOpen}
        onClose={() => setGenerateOpen(false)}
        initialPrompt={currentDisplayPrompt ?? ""}
      />
    </div>
  );
}
