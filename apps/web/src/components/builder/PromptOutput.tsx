"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Copy, Check, ChevronDown, ChefHat, Share2,
  Star, Save, GitBranch, Shuffle, RotateCw,
  FileText, Sparkles, Loader2, Image as ImageIcon,
  Lightbulb,
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
    <Card className="relative overflow-hidden border-accent/10 bg-bg-1">
      {/* Orange top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-accent" />

      {/* Shimmer glow when output exists */}
      {(result || polishedResult) && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none z-0"
          style={{
            background: polishedResult
              ? "linear-gradient(90deg, transparent 0%, #a855f7 50%, transparent 100%)"
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
      <div className="relative z-10 flex items-center justify-between px-4 py-2.5 border-b border-accent/8">
        <div className="flex items-center gap-2">
          <h3 className="text-[10px] font-mono font-semibold text-text-1 uppercase tracking-[0.15em]">OUTPUT</h3>
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
            <Button variant="outline" size="sm" className="h-7 gap-2 text-[10px] font-mono uppercase tracking-wider border-accent/15">
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
                  <p className="text-[10px] text-text-3 truncate">{gen.description}</p>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Badge row */}
      <div className="relative px-4 py-2 border-b border-accent/8">
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
      <div className="relative px-4 py-3 border-b border-accent/8">
        <p className="text-[9px] font-mono text-text-3 mb-2 uppercase tracking-[0.15em]">
          BOOST PHRASES
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

      {/* Output preview */}
      <div className="relative p-4">
        {!result ? (
          <p className="text-[11px] font-mono text-text-3 text-center py-8 tracking-wider">
            &gt;_ FILL IN FIELDS TO GENERATE OUTPUT
          </p>
        ) : (
          <div className="space-y-3">
            {/* Positive */}
            <div>
              <p className="text-[9px] font-mono text-text-3 mb-1 uppercase tracking-[0.15em]">
                POSITIVE
              </p>
              <div className="bg-bg-input border border-accent/8 p-3">
                <p className="text-xs text-text-1 leading-relaxed break-words whitespace-pre-wrap">
                  {result.positive || <span className="text-text-3 italic">Empty</span>}
                </p>
              </div>
            </div>

            {/* Negative */}
            {result.negative && (
              <div>
                <p className="text-[9px] font-mono text-text-3 mb-1 uppercase tracking-[0.15em]">
                  NEGATIVE
                </p>
                <div className="bg-bg-input border border-accent/8 p-3">
                  <p className="text-xs text-text-2 leading-relaxed break-words whitespace-pre-wrap">
                    {result.negative}
                  </p>
                </div>
              </div>
            )}

            {/* Full formatted output */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[9px] font-mono text-text-3 uppercase tracking-[0.15em]">
                  {polishedResult ? "AI POLISHED OUTPUT" : `FULL OUTPUT // ${activeGen?.name?.toUpperCase() ?? "GENERATOR"}`}
                </p>
                {polishedResult && (
                  <Badge variant="outline" className="text-[10px] text-purple-400 bg-purple-400/10 border-purple-400/30 gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI Optimized
                  </Badge>
                )}
              </div>
              <div className={cn(
                "border p-3 transition-colors",
                polishedResult ? "bg-purple-950/20 border-purple-500/30" : "bg-bg-input border-accent/8"
              )}>
                <pre className={cn(
                  "text-xs leading-relaxed break-words whitespace-pre-wrap font-mono",
                  polishedResult ? "text-purple-300" : "text-accent"
                )}>
                  {currentDisplayPrompt}
                </pre>
              </div>
            </div>

            {/* Word / char count */}
            <div className="flex items-center gap-3 text-[10px]">
              <span className={cn("font-mono", wordCount > 75 ? "text-warn" : "text-text-3")}>
                {wordCount} words
              </span>
              <span className="text-text-3">•</span>
              <span className="text-text-3 font-mono">{charCount} chars</span>
              {wordCount > 75 && (
                <span className="text-warn">⚠ Token limit warning</span>
              )}
            </div>

            {/* Score */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-text-3 uppercase tracking-[0.15em]">SCORE</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                    onClick={() => setPromptScore(promptScore === star ? null : star)}
                    className={cn(
                      "p-0.5 transition-colors",
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
              className="h-7 text-[11px] font-mono bg-bg-input border-accent/8 placeholder:text-text-3/30"
            />

            {/* Actions */}
            <div className="flex flex-col gap-2">
              {/* Row 1: Copy + Generate (hero) */}
              <div className="flex gap-2">
                <Button
                  onClick={handleCopy}
                  className={cn(
                    "flex-1",
                    copied
                    ? "bg-success/15 text-success border border-success/30 hover:bg-success/20 font-mono uppercase tracking-wider text-[11px]"
                    : "bg-accent text-black font-bold hover:bg-accent/90 font-mono uppercase tracking-wider text-[11px]",
                  )}
                >
                  {copied ? (
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Copied!
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Copy className="w-4 h-4" />
                      Copy Prompt
                    </span>
                  )}
                </Button>
                <Button
                  onClick={() => setGenerateOpen(true)}
                  variant="outline"
                  className="flex-1 hover:text-accent hover:border-accent/40 font-mono uppercase tracking-wider text-[11px]"
                >
                  <ImageIcon className="w-4 h-4" />
                  Generate
                </Button>
              </div>

              {/* Row 2: Save + Iterate + Recipe */}
              <div className="flex gap-2">
                <Button
                  onClick={handleSavePrompt}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs hover:text-accent hover:border-accent/40"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save
                </Button>
                <Button
                  onClick={handleIterate}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs hover:text-accent hover:border-accent/40"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  Iterate
                </Button>
                <Button
                  onClick={handleSaveRecipe}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "flex-1 text-xs",
                    saved
                      ? "bg-success/15 text-success border-success/30"
                      : "hover:text-text-1 hover:border-accent/40",
                  )}
                >
                  {saved ? (
                    <span className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      Saved
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <ChefHat className="w-3.5 h-3.5" />
                      Recipe
                    </span>
                  )}
                </Button>
              </div>

              {/* Project selector */}
              {projects.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full h-7 text-xs justify-between">
                      <span className="text-text-3">
                        {selectedProject
                          ? projects.find((p) => p.id === selectedProject)?.name ?? "Project"
                          : "Assign to Project"}
                      </span>
                      <ChevronDown className="w-3 h-3 text-text-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setSelectedProject(null)}>
                      <span className="text-xs text-text-3">None</span>
                    </DropdownMenuItem>
                    {projects.map((proj) => (
                      <DropdownMenuItem
                        key={proj.id}
                        onClick={() => setSelectedProject(proj.id)}
                        className={cn(selectedProject === proj.id && "bg-accent/10")}
                      >
                        <span className="text-xs">{proj.name}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Row 3: AI Tools */}
              <div className="flex gap-2">
                <Button
                  onClick={handlePolish}
                  disabled={isPolishing || !!polishedResult}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "flex-1 text-xs",
                    polishedResult
                      ? "bg-purple-500/10 text-purple-400 border-purple-500/30 opacity-50"
                      : "hover:text-purple-400 hover:border-purple-400/40",
                  )}
                >
                  {isPolishing ? (
                    <Loader2 className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {polishedResult ? "Polished" : "AI Polish"}
                    </span>
                  )}
                </Button>
                <Button
                  onClick={handleVariations}
                  disabled={variationsLoading}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs hover:text-purple-400 hover:border-purple-400/40"
                >
                  {variationsLoading ? (
                    <Loader2 className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Variations
                    </span>
                  )}
                </Button>
                <Button
                  onClick={handleCopyRaw}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs hover:text-text-1 hover:border-accent/40"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Copy Raw
                </Button>
              </div>

              {/* Row 4: Utility */}
              <div className="flex gap-2">
                <Button
                  onClick={handleRandomFill}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs hover:text-text-1 hover:border-accent/40"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  Random
                </Button>
                <Button
                  onClick={handleRemix}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs hover:text-text-1 hover:border-accent/40"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Remix
                </Button>
                <Button
                  onClick={async () => {
                    const { tooLong } = await copyShareUrl();
                    addToast({
                      message: tooLong
                        ? "Share link copied! (URL is long — may not work in all browsers)"
                        : "Share link copied to clipboard!",
                      type: tooLong ? "info" : "success",
                    });
                  }}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs hover:text-text-1 hover:border-accent/40"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share
                </Button>
              </div>
            </div>

            {/* Template tip */}
            {activeTemplateId && (
              <div className="flex items-start gap-2 p-2.5 bg-accent/5 border border-accent/10">
                <Lightbulb className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                <p className="text-[10px] text-text-3 leading-relaxed">
                  Use <span className="text-accent font-medium">AI Polish</span> to optimize for{" "}
                  {activeGen?.name ?? "your generator"}, or try{" "}
                  <span className="text-accent font-medium">Variations</span> for creative alternatives.
                </p>
              </div>
            )}

            {/* AI Results panel */}
            {variationsResult && variationsResult.length > 0 && (
              <div>
                <p className="text-[9px] font-mono text-text-3 mb-1.5 uppercase tracking-[0.15em]">
                  AI VARIATIONS
                </p>
                <div className="space-y-2">
                  {variationsResult.map((v, i) => (
                    <div key={i} className="bg-bg-input border border-accent/8 p-2.5">
                      <pre className="text-[11px] text-text-2 leading-relaxed whitespace-pre-wrap font-mono break-words">
                        {v}
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[10px] mt-1.5 text-text-3 hover:text-accent"
                        onClick={async () => {
                          await navigator.clipboard.writeText(v);
                          addToast({ message: `Variation ${i + 1} copied!`, type: "success" });
                        }}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Generate Modal */}
      <GenerateModal
        open={generateOpen}
        onClose={() => setGenerateOpen(false)}
        initialPrompt={currentDisplayPrompt ?? ""}
      />
    </Card>
  );
}
