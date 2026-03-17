"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Copy, Check, ChevronDown, ChefHat, Share2,
  Star, Save, GitBranch, Shuffle, RotateCw,
  FileText, Sparkles, Loader2, Image as ImageIcon,
  Lightbulb, AlertTriangle,
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
import { copyShareUrl } from "@/lib/services/share-service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [isPolishing, setIsPolishing] = useState(false);
  const [polishedResult, setPolishedResult] = useState<string | null>(null);
  const [generateOpen, setGenerateOpen] = useState(false);

  // Pre-save metadata (matches prototype: set before saving)
  const [promptStarred, setPromptStarred] = useState(false);
  const [promptScore, setPromptScore] = useState<number | null>(null);
  const [promptNote, setPromptNote] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

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
      starred: promptStarred,
      score: promptScore,
      note: promptNote,
      parentId: null,
      version: 1,
      projectId: selectedProject,
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
  const wordCount = result ? result.full.split(/\s+/).filter(Boolean).length : 0;
  const charCount = result ? result.full.length : 0;

  const handleSavePrompt = () => {
    if (!result || !activeTemplateId) return;
    const tmpl = getTemplateById(activeTemplateId);
    const firstFieldValue = Object.values(templateFields).find((v) => v.trim() !== "");
    const title = tmpl
      ? tmpl.name + (firstFieldValue ? ` — ${firstFieldValue}` : "")
      : activeTemplateId;

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
      starred: promptStarred,
      score: promptScore,
      note: promptNote,
      parentId: null,
      version: 1,
      projectId: selectedProject,
      variations,
    });
    addToast({ message: "Prompt saved!", type: "success" });
  };

  const handleIterate = () => {
    if (!result || !activeTemplateId) return;
    const lastSaved = savedPrompts.find((p) => p.templateId === activeTemplateId);
    if (!lastSaved) {
      handleSavePrompt();
      return;
    }
    const tmpl = getTemplateById(activeTemplateId);
    promptService.iteratePrompt(lastSaved.id, {
      title: (tmpl?.name ?? activeTemplateId) + ` v${lastSaved.version + 1}`,
      content: result.full,
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
      projectId: selectedProject,
      variations,
    });
    addToast({ message: `Iteration v${lastSaved.version + 1} saved!`, type: "success" });
  };

  const handleVariations = async () => {
    if (!result || !activeGen) return;
    setVariationsLoading(true);
    try {
      const response = await fetch("/api/ai/variations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: result.full,
          generator: activeGen.name,
          count: 3,
        }),
      });
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setVariationsResult(data.variations ?? []);
      addToast({ message: "Variations generated!", type: "success" });
    } catch {
      addToast({ message: "Failed to generate variations.", type: "error" });
    } finally {
      setVariationsLoading(false);
    }
  };

  const handleCopyRaw = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.positive);
    addToast({ message: "Raw prompt copied!", type: "success" });
  };

  const handleRandomFill = () => {
    if (!activeTemplateId) return;
    const tmpl = getTemplateById(activeTemplateId);
    if (!tmpl) return;
    const { setField } = useBuilderStore.getState();
    for (const field of tmpl.fields) {
      if (field.id === "avoid") continue;
      const presets = getPresetsForField(tmpl.id, field.id);
      if (presets.length > 0) {
        setField(field.id, presets[Math.floor(Math.random() * presets.length)]);
      }
    }
    addToast({ message: "Fields randomized!", type: "success" });
  };

  const handleRemix = () => {
    if (!activeTemplateId) return;
    const tmpl = getTemplateById(activeTemplateId);
    if (!tmpl) return;
    const { setField } = useBuilderStore.getState();
    for (const field of tmpl.fields) {
      if (field.id === "subject" || field.id === "avoid") continue;
      const presets = getPresetsForField(tmpl.id, field.id);
      if (presets.length > 0) {
        setField(field.id, presets[Math.floor(Math.random() * presets.length)]);
      }
    }
    addToast({ message: "Prompt remixed!", type: "success" });
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden bg-bg-1">

      {/* Shimmer glow when output exists */}
      {(result || polishedResult) && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none z-0"
          style={{
            background: polishedResult
              ? "linear-gradient(90deg, transparent 0%, var(--color-accent2) 50%, transparent 100%)"
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

      {/* Badge row */}
      <div className="relative px-5 py-2.5 border-b border-glass-border">
        <div className="flex flex-wrap gap-1.5">
          {activeTemplateId && (
            <Badge variant="outline" className="text-[10px] text-accent border-accent/30">
              {getTemplateById(activeTemplateId)?.name}
            </Badge>
          )}
          {activeGen && (
            <Badge variant="outline" className="text-[10px] text-text-2">
              {activeGen.name}
            </Badge>
          )}
          {selectedStyles.length > 0 && (
            <Badge variant="outline" className="text-[10px] text-accent2 border-accent2/30">
              {selectedStyles.length} style{selectedStyles.length !== 1 && "s"}
            </Badge>
          )}
          {selectedKeywords.length > 0 && (
            <Badge variant="outline" className="text-[10px] text-info border-info/30">
              {selectedKeywords.length} keyword{selectedKeywords.length !== 1 && "s"}
            </Badge>
          )}
          {selectedPalette && (
            <Badge variant="outline" className="text-[10px] text-text-2">
              Palette
            </Badge>
          )}
          {mockup.enabled && (
            <Badge variant="outline" className="text-[10px] text-mockup border-mockup/30">
              Mockup
            </Badge>
          )}
        </div>
      </div>

      {/* Phrases */}
      <div className="relative px-5 py-3.5 border-b border-glass-border">
        <p className="text-xs font-medium text-text-2 mb-2">
          Boost Phrases
        </p>
        <div className="flex flex-wrap gap-1.5">
          {PHRASES.map((phrase) => {
            const isSelected = selectedPhrases.includes(phrase.content);
            return (
              <Badge
                key={phrase.id}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "cursor-pointer text-[11px] font-medium transition-all duration-150",
                  isSelected
                    ? "bg-accent/15 text-accent border-accent/30 hover:bg-accent/20"
                    : "text-text-3 hover:text-text-2 hover:bg-bg-3",
                )}
                onClick={() => togglePhrase(phrase.content)}
              >
                {phrase.label}
              </Badge>
            );
          })}
        </div>
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
              {/* Positive */}
              <div>
                <p className="text-xs font-medium text-text-2 mb-1.5">Positive</p>
                <div className="bg-bg-input border border-glass-border rounded-[var(--radius-md)] p-3.5">
                  <p className="text-xs text-text-1 leading-relaxed break-words whitespace-pre-wrap">
                    {result.positive || <span className="text-text-3 italic">Empty</span>}
                  </p>
                </div>
              </div>

              {/* Negative */}
              {result.negative && (
                <div>
                  <p className="text-xs font-medium text-text-2 mb-1.5">Negative</p>
                <div className="bg-bg-input border border-glass-border rounded-[var(--radius-md)] p-3.5">
                    <p className="text-xs text-text-2 leading-relaxed break-words whitespace-pre-wrap">
                      {result.negative}
                    </p>
                  </div>
                </div>
              )}

              {/* Full formatted output */}
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
                <div className={cn(
                  "border rounded-[var(--radius-lg)] p-3.5 transition-colors",
                  polishedResult ? "bg-accent-gold/5 border-accent-gold/25" : "bg-bg-input border-glass-border"
                )}>
                  <pre className={cn(
                    "text-sm leading-relaxed break-words whitespace-pre-wrap font-mono",
                    polishedResult ? "text-accent-gold" : "text-accent"
                  )}>
                    {currentDisplayPrompt}
                  </pre>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 text-[10px]">
                <span className={cn("text-[10px]", wordCount > 75 ? "text-warn" : "text-text-3")}>
                  {wordCount} words
                </span>
                <span className="text-text-2">•</span>
                <span className="text-text-2 text-[10px]">{charCount} chars</span>
                {wordCount > 75 && <span className="text-warn flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />Token limit</span>}
              </div>

              {/* Score */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-text-2 uppercase tracking-wider">SCORE</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                      onClick={() => setPromptScore(promptScore === star ? null : star)}
                      className={cn(
                        "p-0.5 transition-colors cursor-pointer",
                        (promptScore ?? 0) >= star ? "text-warn" : "text-text-3/30 hover:text-warn/50",
                      )}
                    >
                      <Star className={cn("w-3.5 h-3.5", (promptScore ?? 0) >= star && "fill-current")} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <Input
                placeholder=">_ Add a note..."
                value={promptNote}
                onChange={(e) => setPromptNote(e.target.value)}
                className="h-7 text-[11px] bg-bg-input border-glass-border placeholder:text-text-3/30"
              />

              {/* AI tip */}
              {activeTemplateId && (
                <div className="flex items-start gap-2 p-2.5 rounded-[var(--radius-md)] bg-accent/5 border border-accent/10">
                  <Lightbulb className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                  <p className="text-[10px] text-text-3 leading-relaxed">
                    Use <span className="text-accent font-medium">Polish</span> to optimize for{" "}
                    {activeGen?.name ?? "your generator"}, or{" "}
                    <span className="text-accent font-medium">Vary</span> for alternatives.
                  </p>
                </div>
              )}

              {/* AI Variations results */}
              {variationsResult && variationsResult.length > 0 && (
                <div>
                  <p className="text-[9px] font-medium text-text-3 mb-1.5 uppercase tracking-wider">AI VARIATIONS</p>
                  <div className="space-y-2">
                    {variationsResult.map((v, i) => (
                      <div key={i} className="bg-bg-input border border-glass-border rounded-[var(--radius-md)] p-2.5">
                        <pre className="text-[11px] text-text-2 leading-relaxed whitespace-pre-wrap font-mono break-words">{v}</pre>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[10px] mt-1.5 text-text-3 hover:text-accent cursor-pointer"
                          onClick={async () => {
                            await navigator.clipboard.writeText(v);
                            addToast({ message: `Variation ${i + 1} copied!`, type: "success" });
                          }}
                        >
                          <Copy className="w-3 h-3 mr-1" />Copy
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Sticky action footer ── */}
      <div className="shrink-0 relative z-10 border-t border-glass-border bg-bg-1 p-4 space-y-2">
        {/* Row 1: Copy + Generate — primary CTAs */}
        <div className="flex gap-2">
          <Button
            onClick={handleCopy}
            disabled={!result}
            className={cn(
              "flex-1 rounded-full font-semibold text-xs cursor-pointer transition-colors duration-150 disabled:opacity-50",
              copied
                ? "bg-success/15 text-success border border-success/30 hover:bg-success/20"
                : "bg-accent text-white hover:bg-accent-hover",
            )}
          >
            {copied ? (
              <><Check className="w-3.5 h-3.5 mr-1.5" />Copied!</>
            ) : (
              <><Copy className="w-3.5 h-3.5 mr-1.5" />Copy Prompt</>
            )}
          </Button>
          <Button
            onClick={() => setGenerateOpen(true)}
            disabled={!result}
            variant="outline"
            className="flex-1 rounded-full text-xs hover:text-accent hover:border-accent/40 cursor-pointer transition-colors duration-150 disabled:opacity-50"
          >
            <ImageIcon className="w-3.5 h-3.5 mr-1.5" />Generate
          </Button>
        </div>

        {/* Row 2: Polish — featured full-width premium CTA */}
        <button
          onClick={handlePolish}
          disabled={!result || isPolishing || !!polishedResult}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed",
            polishedResult
              ? "bg-accent-gold/15 text-accent-gold border border-accent-gold/30"
              : "bg-gradient-to-r from-accent-gold/20 to-accent-gold/10 text-accent-gold border border-accent-gold/35 hover:from-accent-gold/30 hover:to-accent-gold/18 hover:border-accent-gold/50 shadow-[0_0_12px_rgba(245,200,66,0.12)] hover:shadow-[0_0_18px_rgba(245,200,66,0.22)]",
          )}
        >
          {isPolishing ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Polishing…</>
          ) : polishedResult ? (
            <><Sparkles className="w-4 h-4" />Polished ✓</>
          ) : (
            <><Sparkles className="w-4 h-4" />Polish with AI</>
          )}
        </button>

        {/* Row 3: Save · Vary · Share — utility actions */}
        <div className="flex gap-1.5">
          <Button
            onClick={handleSavePrompt}
            disabled={!result}
            variant="outline"
            size="sm"
            className="flex-1 text-xs rounded-full hover:text-accent hover:border-accent/40 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />Save
          </Button>
          <Button
            onClick={handleVariations}
            disabled={!result || variationsLoading}
            variant="outline"
            size="sm"
            className="flex-1 text-xs rounded-full hover:text-accent2 hover:border-accent2/40 cursor-pointer disabled:opacity-50"
          >
            {variationsLoading
              ? <Loader2 className="w-3.5 h-3.5 text-accent2 animate-spin" />
              : <><Sparkles className="w-3.5 h-3.5" />Vary</>
            }
          </Button>
          <Button
            onClick={async () => {
              const { tooLong } = await copyShareUrl();
              addToast({
                message: tooLong ? "Share link copied! (URL long)" : "Share link copied!",
                type: tooLong ? "info" : "success",
              });
            }}
            variant="outline"
            size="sm"
            className="flex-1 text-xs rounded-full hover:text-accent hover:border-accent/40 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />Share
          </Button>
        </div>
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
