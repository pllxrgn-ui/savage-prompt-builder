"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy, Check, ChevronDown, Share2,
  Star, Save, Sparkles, Loader2, Image as ImageIcon,
  Lightbulb, AlertTriangle, ThumbsUp, ThumbsDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBuilderStore, useUIStore, useHistoryStore } from "@/lib/store";
import * as promptService from "@/lib/services/prompt-service";
import * as recipeServiceMod from "@/lib/services/recipe-service";
import { GENERATORS, PHRASES, getTemplateById, getPresetsForField } from "@/lib/data";
import { buildPrompt } from "@/lib/prompt-engine";
import { LucideIcon } from "@/components/ui/LucideIcon";
import type { GeneratorId, UIStore } from "@/types";
import { GenerateModal } from "@/components/generate/GenerateModal";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";

export function PromptOutput() {
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
    setGenerator,
    togglePhrase,
  } = useBuilderStore();

  const addToast = useUIStore((s: UIStore) => s.addToast);
  const projects = useHistoryStore((s) => s.projects);
  const savedPrompts = useHistoryStore((s) => s.savedPrompts);

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [polishedResult, setPolishedResult] = useState<string | null>(null);
  const [generateOpen, setGenerateOpen] = useState(false);

  // Rewards system state
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);

  // Pre-save metadata
  const [promptStarred, setPromptStarred] = useState(false);
  const [promptScore, setPromptScore] = useState<number | null>(null);
  const [promptNote, setPromptNote] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  // Polish feedback
  const [polishRating, setPolishRating] = useState<"up" | "down" | null>(null);

  // AI variations state
  const [variationsLoading, setVariationsLoading] = useState(false);
  const [variationsResult, setVariationsResult] = useState<string[] | null>(null);

  const result = useMemo(() => {
    if (!activeTemplateId) return null;
    const raw = buildPrompt({
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
      referenceImageUrl,
      mood,
    });

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
    customColors,
    selectedKeywords,
    negativePrompt,
    selectedGenerator,
    selectedPhrases,
    mockup,
    garmentMode,
    referenceImageUrl,
    variables,
    mood,
  ]);

  useEffect(() => {
    setPolishedResult(null);
    setCurrentJobId(null);
    setRewardMessage(null);
  }, [result?.full]);

  const activeGen = GENERATORS.find((g) => g.id === selectedGenerator);

  async function handleCopy() {
    if (!result || !activeTemplateId) return;
    await navigator.clipboard.writeText(polishedResult || result.full);
    setCopied(true);
    addToast({ message: "Prompt copied!", type: "success" });
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSaveVary() {
    if (!result || !activeTemplateId) return;
    const template = getTemplateById(activeTemplateId);
    promptService.savePrompt({
      title: (template?.name ?? "Prompt") + (templateFields.subject ? ` — ${templateFields.subject}` : ""),
      content: polishedResult || result.full,
      templateId: activeTemplateId,
      generatorId: selectedGenerator,
      fieldData: templateFields,
      styles: selectedStyles,
      palette: selectedPalette,
      keywords: selectedKeywords,
      negative: negativePrompt,
      starred: promptStarred,
      score: promptScore,
      note: promptNote,
      parentId: null,
      version: 1,
      projectId: selectedProject,
      variations,
    });
    setSaved(true);
    addToast({ message: "Saved to history!", type: "success" });
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleShare() {
    if (!result || !activeTemplateId) return;
    setIsSharing(true);
    try {
      const payload = JSON.stringify({
        content: polishedResult || result.full,
        templateId: activeTemplateId,
        generatorId: selectedGenerator,
      });
      const { id } = await api.share.create(payload);
      const shareUrl = `${window.location.origin}/s/${id}`;
      await navigator.clipboard.writeText(shareUrl);
      setShared(true);
      addToast({ message: "Share link copied to clipboard!", type: "success" });
      setTimeout(() => setShared(false), 3000);
    } catch (err: any) {
      console.error(err);
      addToast({ message: "Failed to create share link.", type: "error" });
    } finally {
      setIsSharing(false);
    }
  }

  const handlePolish = async () => {
    if (!result || !activeTemplateId || !activeGen) return;

    setIsPolishing(true);
    setRewardMessage(null);
    try {
      const { jobId } = await api.ai.polish({
        prompt: result.full,
        generator: activeGen.name,
        templateId: activeTemplateId,
      });

      setCurrentJobId(jobId);

      // Wait for async completion
      const results = await api.generate.waitForCompletion(jobId);
      
      if (results && results.length > 0) {
        setPolishedResult(results[0]);
        setPolishRating(null);
        addToast({ message: "Prompt polished successfully!", type: "success" });
      }
    } catch (error: any) {
      console.error(error);
      const msg = error.message?.includes('credits') 
        ? "Insufficient credits to polish." 
        : "Failed to connect to AI Agent. Check API key.";
      addToast({ message: msg, type: "error" });
    } finally {
      setIsPolishing(false);
    }
  };

  const handleFeedback = async (isPositive: boolean) => {
    if (!currentJobId) return;
    setPolishRating(isPositive ? "up" : "down");
    try {
      const data = await api.generate.feedback(currentJobId, isPositive);
      if (data.rewarded) {
        setRewardMessage(data.message);
        addToast({ message: data.message, type: "success" });
      }
    } catch (err) {
      console.error("Feedback error", err);
    }
    if (!isPositive) {
      setTimeout(() => {
        setPolishedResult(null);
        setPolishRating(null);
        handlePolish();
      }, 800);
    }
  };

  const currentDisplayPrompt = polishedResult || result?.full;
  const wordCount = result ? result.full.split(/\s+/).filter(Boolean).length : 0;
  const charCount = result ? result.full.length : 0;

  return (
    <div className="relative flex flex-col h-full overflow-hidden bg-bg-1">
      {/* Subtle pulse glow when output exists */}
      {(result || polishedResult) && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none z-0"
          style={{
            background: polishedResult
              ? "radial-gradient(ellipse at 50% 40%, var(--color-accent2) 0%, transparent 70%)"
              : "radial-gradient(ellipse at 50% 40%, var(--color-accent) 0%, transparent 70%)",
            filter: "blur(20px)",
            animation: "pulse-glow-bg 3s ease-in-out infinite",
          }}
        />
      )}

      {/* Header with generator selector */}
      <div className="relative z-10 flex items-center justify-between px-5 py-3 border-b border-glass-border">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-heading font-semibold text-text-1">Output</h3>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-7 w-7",
              promptStarred ? "text-warn" : "text-text-3 hover:text-warn",
            )}
            onClick={() => setPromptStarred(!promptStarred)}
          >
            <Star className={cn("w-4 h-4", promptStarred && "fill-current")} />
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-2 text-xs rounded-full border-glass-border">
              {activeGen && (
                <LucideIcon name={activeGen.icon} className="w-3.5 h-3.5 text-accent" />
              )}
              <span className="text-text-2">{activeGen?.name ?? "Generator"}</span>
              <ChevronDown className="w-3 h-3 text-text-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 max-h-64 overflow-y-auto">
            {GENERATORS.map((gen) => (
              <DropdownMenuItem
                key={gen.id}
                onClick={() => setGenerator(gen.id as GeneratorId)}
                className={cn(
                  "flex items-center gap-3 py-2",
                  selectedGenerator === gen.id && "bg-accent/10",
                )}
              >
                <LucideIcon name={gen.icon} className="w-4 h-4 text-text-3" />
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-xs font-medium",
                      selectedGenerator === gen.id ? "text-accent" : "text-text-1",
                    )}
                  >
                    {gen.name}
                  </p>
                  <p className="text-[10px] text-text-2 truncate">{gen.description}</p>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Scrollable output content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-5">
          {!result ? (
            <p className="text-sm text-text-3 text-center py-10">
              Fill in fields to generate output
            </p>
          ) : (
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-medium text-text-2">
                    {polishedResult ? "AI Polished" : `Full Output — ${activeGen?.name ?? "Generator"}`}
                  </p>
                  {polishedResult && (
                    <Badge variant="outline" className="text-[10px] text-accent-gold bg-accent-gold/10 border-accent-gold/30 gap-1">
                      <Sparkles className="w-3 h-3" />AI Optimized
                    </Badge>
                  )}
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={polishedResult ? "polished" : "raw"}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={cn(
                      "relative border rounded-[var(--radius-lg)] p-3.5",
                      polishedResult ? "bg-bg-input border-accent-gold/25" : "bg-bg-input border-glass-border"
                    )}
                  >
                    <pre className={cn(
                      "text-sm leading-relaxed break-words whitespace-pre-wrap font-mono",
                      polishedResult ? "text-accent-gold" : "text-accent"
                    )}>
                      {currentDisplayPrompt}
                    </pre>
                    {polishedResult && (
                      <BorderBeam color="var(--color-accent-gold)" size={60} duration={4} />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Polish feedback / Reward UI */}
                <AnimatePresence>
                  {polishedResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-2 mt-3 p-3 rounded-lg bg-bg-2 border border-glass-border"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-text-2 font-medium">
                          {rewardMessage ? rewardMessage : "Did this prompt get you the correct results?"}
                        </span>
                        {!polishRating && (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleFeedback(true)}
                              className="h-7 px-2 text-[10px] text-success hover:bg-success/10 gap-1.5"
                            >
                              <ThumbsUp className="w-3 h-3" /> YES
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleFeedback(false)}
                              className="h-7 px-2 text-[10px] text-error hover:bg-error/10 gap-1.5"
                            >
                              <ThumbsDown className="w-3 h-3" /> NO
                            </Button>
                          </div>
                        )}
                        {polishRating && !rewardMessage && (
                          <Loader2 className="w-3 h-3 animate-spin text-text-3" />
                        )}
                      </div>
                      
                      {rewardMessage && (
                        <div className="flex items-center gap-2 text-[10px] text-success">
                          <Check className="w-3 h-3" />
                          <span>Goal: Optimized prompt training complete.</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 text-[10px]">
                <span className={cn("text-[10px]", wordCount > 75 ? "text-warn" : "text-text-3")}>
                  {wordCount} words
                </span>
                <span className="text-text-2 text-[10px]">{charCount} chars</span>
                {wordCount > 75 && <span className="text-warn flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />Limit</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Sticky action footer ── */}
      <div className="shrink-0 relative z-10 border-t border-glass-border bg-bg-1 p-4 space-y-2">
        <div className="flex gap-2">
          <Button
            onClick={handlePolish}
            disabled={!result || isPolishing || !!polishedResult}
            className={cn(
              "flex-1 rounded-full font-semibold text-xs cursor-pointer",
              polishedResult ? "bg-accent-gold/15 text-accent-gold border border-accent-gold/30" : "bg-accent text-white",
            )}
          >
            {isPolishing ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
            {isPolishing ? "Polishing…" : polishedResult ? "Polished ✓" : "Polish Prompt"}
          </Button>
          <Button
            onClick={() => setGenerateOpen(true)}
            disabled={!result}
            variant="outline"
            className="flex-1 rounded-full text-xs hover:text-accent hover:border-accent/40 cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5 mr-1.5" />Generate
          </Button>
        </div>

        {/* Save Vary + Share row */}
        <div className="flex gap-2">
          <Button
            onClick={handleSaveVary}
            disabled={!result}
            variant="outline"
            className={cn(
              "flex-1 rounded-full text-xs cursor-pointer",
              saved
                ? "bg-success/15 text-success border-success/30"
                : "hover:text-accent hover:border-accent/40",
            )}
          >
            {saved ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
            {saved ? "Saved!" : "Save Vary"}
          </Button>
          <Button
            onClick={handleShare}
            disabled={!result || isSharing}
            variant="outline"
            className={cn(
              "flex-1 rounded-full text-xs cursor-pointer",
              shared
                ? "bg-accent/15 text-accent border-accent/30"
                : "hover:text-accent hover:border-accent/40",
            )}
          >
            {isSharing ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : shared ? (
              <Check className="w-3.5 h-3.5 mr-1.5" />
            ) : (
              <Share2 className="w-3.5 h-3.5 mr-1.5" />
            )}
            {isSharing ? "Sharing…" : shared ? "Link Copied!" : "Share"}
          </Button>
        </div>
      </div>

      <GenerateModal
        open={generateOpen}
        onClose={() => setGenerateOpen(false)}
        initialPrompt={polishedResult || result?.full || ""}
      />
    </div>
  );
}
