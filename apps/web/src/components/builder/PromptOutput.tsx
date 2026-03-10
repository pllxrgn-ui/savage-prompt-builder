"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import { useBuilderStore, useUIStore } from "@/lib/store";
import { GENERATORS, PHRASES } from "@/lib/data";
import { buildPrompt } from "@/lib/prompt-engine";
import { LucideIcon } from "@/components/ui/LucideIcon";
import type { GeneratorId } from "@/types";

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
    setGenerator,
    togglePhrase,
  } = useBuilderStore();

  const addToast = useUIStore((s) => s.addToast);
  const [copied, setCopied] = useState(false);
  const [showGenerators, setShowGenerators] = useState(false);

  const result = useMemo(() => {
    if (!activeTemplateId) return null;
    return buildPrompt({
      templateId: activeTemplateId,
      fields: templateFields,
      styles: selectedStyles,
      palette: selectedPalette,
      keywords: selectedKeywords,
      negative: negativePrompt,
      generator: selectedGenerator,
      phrases: selectedPhrases,
    });
  }, [
    activeTemplateId,
    templateFields,
    selectedStyles,
    selectedPalette,
    selectedKeywords,
    negativePrompt,
    selectedGenerator,
    selectedPhrases,
  ]);

  const activeGen = GENERATORS.find((g) => g.id === selectedGenerator);

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result.full);
    setCopied(true);
    addToast({ message: "Prompt copied to clipboard!", type: "success" });
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative rounded-xl border border-border bg-bg-2 overflow-hidden">
      {/* Shimmer glow when output exists */}
      {result && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none z-0"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, var(--color-accent) 50%, transparent 100%)",
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
        <div className="relative">
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
      <div className="relative z-10 px-4 py-3 border-b border-border">
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
      <div className="relative z-10 p-4">
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
              <p className="text-[10px] text-text-3 mb-1 uppercase tracking-wider font-medium">
                Full Output ({activeGen?.name})
              </p>
              <div className="bg-bg-input border border-border rounded-lg p-3">
                <pre className="text-xs text-accent leading-relaxed break-words whitespace-pre-wrap font-mono">
                  {result.full}
                </pre>
              </div>
            </div>

            {/* Copy button */}
            <motion.button
              onClick={handleCopy}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              className={clsx(
                "w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium",
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
          </div>
        )}
      </div>
    </div>
  );
}
