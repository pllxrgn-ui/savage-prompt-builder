"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wand2, ArrowLeft, Paintbrush, Palette, Tags, Ban, Layers,
  ImageIcon, FileText, Sparkles, ChevronRight, ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/lib/store";
import {
  getTemplateById,
  getStylesForTemplate,
  TEMPLATE_GROUPS,
  getTemplatesByGroup,
} from "@/lib/data";
import { LucideIcon } from "@/components/ui/LucideIcon";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { TemplateCard } from "@/components/builder/TemplateCard";
import { FieldInput } from "@/components/builder/FieldInput";
import { StylesDrawer } from "@/components/builder/StylesDrawer";
import { AIStyleGenerator } from "@/components/builder/AIStyleGenerator";
import { PalettePanel } from "@/components/builder/PalettePanel";
import { KeywordsPanel } from "@/components/builder/KeywordsPanel";
import { NegativePanel } from "@/components/builder/NegativePanel";
import { MockupPanel } from "@/components/builder/MockupPanel";
import { GarmentSelector } from "@/components/builder/GarmentSelector";
import { PlatformDropdown } from "@/components/builder/PlatformDropdown";
import { BuilderActions } from "@/components/builder/BuilderActions";
import { UndoRedo } from "@/components/builder/UndoRedo";
import { ReferenceImage } from "@/components/builder/ReferenceImage";
import { VariablesPanel } from "@/components/builder/VariablesPanel";
import { VariationTabs } from "@/components/builder/VariationTabs";
import { SaveRecipeModal } from "@/components/builder/SaveRecipeModal";
import { PromptOutput } from "@/components/builder/PromptOutput";
import { decodeBuilderState } from "@/lib/services/share-service";
import { useSearchParams } from "next/navigation";

type StepId = "mood" | "fields" | "styles" | "colors" | "keywords" | "negative" | "mockup";

interface WorkflowStep {
  id: StepId;
  label: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  { id: "mood",     label: "Mood & Reference", description: "Set visual direction",  Icon: ImageIcon  },
  { id: "fields",   label: "Fields",           description: "Core prompt details",   Icon: FileText   },
  { id: "styles",   label: "Styles",           description: "Aesthetic modifiers",   Icon: Paintbrush },
  { id: "colors",   label: "Colors",           description: "Color palette",         Icon: Palette    },
  { id: "keywords", label: "Keywords",         description: "Extra descriptors",     Icon: Tags       },
  { id: "negative", label: "Negative",         description: "What to exclude",       Icon: Ban        },
  { id: "mockup",   label: "Mockup",           description: "Visualization",         Icon: Layers     },
];

/* ── Step section wrapper — numbered timeline row ── */
function StepSection({
  step,
  index,
  isLast = false,
  children,
}: {
  step: WorkflowStep;
  index: number;
  isLast?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="relative"
    >
      {/* Timeline connector */}
      {!isLast && (
        <div className="absolute left-[17px] top-12 bottom-0 w-px bg-glass-border" />
      )}

      {/* Step header */}
      <div className="flex items-center gap-3 mb-3 relative">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-bg-3 border border-glass-border flex items-center justify-center z-10">
          <span className="text-[11px] font-bold text-accent">{index + 1}</span>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text-1">{step.label}</h3>
          <p className="text-[11px] text-text-3">{step.description}</p>
        </div>
      </div>

      {/* Step content — indented under timeline */}
      <div className="ml-12 pb-8">
        {children}
      </div>
    </motion.div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={null}>
      <BuilderPageInner />
    </Suspense>
  );
}

function BuilderPageInner() {
  const activeTemplateId = useBuilderStore((s) => s.activeTemplateId);
  const resetBuilder = useBuilderStore((s) => s.resetBuilder);
  const setMockup = useBuilderStore((s) => s.setMockup);
  const [recipeModalOpen, setRecipeModalOpen] = useState(false);
  const [activeStepId, setActiveStepId] = useState<StepId>("mood");
  const searchParams = useSearchParams();

  // Hydrate builder from share URL
  useEffect(() => {
    const share = searchParams.get("share");
    if (share) {
      decodeBuilderState(share);
      window.history.replaceState(null, "", "/builder");
    }
  }, [searchParams]);

  const template = useMemo(
    () => (activeTemplateId ? getTemplateById(activeTemplateId) : null),
    [activeTemplateId],
  );

  const styles = useMemo(
    () => (activeTemplateId ? (getStylesForTemplate(activeTemplateId) ?? []) : []),
    [activeTemplateId],
  );

  const activeIndex = WORKFLOW_STEPS.findIndex((s) => s.id === activeStepId);
  const activeStep = WORKFLOW_STEPS[activeIndex] ?? WORKFLOW_STEPS[0];

  function scrollToStep(id: StepId) {
    setActiveStepId(id);
  }

  // ── Template picker (no template selected) ────────────────────────────────
  const [activeGroupId, setActiveGroupId] = useState(TEMPLATE_GROUPS[0].id);
  const activeGroup = TEMPLATE_GROUPS.find((g) => g.id === activeGroupId) ?? TEMPLATE_GROUPS[0];
  const visibleTemplates = getTemplatesByGroup(activeGroupId);

  const GROUP_ACCENTS: Record<string, string> = {
    "design-print": "text-accent bg-accent/10 border-accent/20",
    "branding":     "text-violet-400 bg-violet-500/10 border-violet-500/20",
    "art":          "text-rose-400 bg-rose-500/10 border-rose-500/20",
    "product":      "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    "other":        "text-sky-400 bg-sky-500/10 border-sky-500/20",
  };

  // Per-group card accent colors passed to TemplateCard
  const GROUP_CARD_ACCENTS: Record<string, { text: string; bg: string; bgHover: string; border: string; titleHover: string }> = {
    "design-print": { text: "text-accent",       bg: "bg-accent/10",       bgHover: "group-hover:bg-accent/15",       border: "hover:border-accent/30",       titleHover: "group-hover:text-accent" },
    "branding":     { text: "text-violet-400",   bg: "bg-violet-500/10",   bgHover: "group-hover:bg-violet-500/15",   border: "hover:border-violet-400/30", titleHover: "group-hover:text-violet-400" },
    "art":          { text: "text-rose-400",     bg: "bg-rose-500/10",     bgHover: "group-hover:bg-rose-500/15",     border: "hover:border-rose-400/30",   titleHover: "group-hover:text-rose-400" },
    "product":      { text: "text-emerald-400",  bg: "bg-emerald-500/10",  bgHover: "group-hover:bg-emerald-500/15",  border: "hover:border-emerald-400/30",titleHover: "group-hover:text-emerald-400" },
    "other":        { text: "text-sky-400",      bg: "bg-sky-500/10",      bgHover: "group-hover:bg-sky-500/15",      border: "hover:border-sky-400/30",    titleHover: "group-hover:text-sky-400" },
  };

  if (!template) {
    return (
      <div className="flex h-[calc(100dvh-64px)] overflow-hidden">

        {/* ── Left: Category rail ── */}
        <aside className="flex flex-col w-64 shrink-0 border-r border-glass-border bg-bg-1 py-8 px-5 gap-1.5 overflow-y-auto">
          {/* Heading */}
          <div className="mb-6">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <Wand2 className="w-3.5 h-3.5 text-accent" />
              </div>
              <h1 className="text-sm font-heading font-bold text-text-1">Choose Canvas</h1>
            </div>
            <p className="text-[11px] text-text-3 pl-[38px] leading-snug">Pick a template to start building your prompt</p>
          </div>

          {/* Group pills */}
          {TEMPLATE_GROUPS.map((group) => {
            const isActive = group.id === activeGroupId;
            const count = getTemplatesByGroup(group.id).length;
            const accentClass = GROUP_ACCENTS[group.id] ?? GROUP_ACCENTS["other"];
            return (
              <button
                key={group.id}
                onClick={() => setActiveGroupId(group.id)}
                className={cn(
                  "flex items-center gap-3 w-full px-3.5 py-3 rounded-[var(--radius-lg)] border text-left transition-all duration-150 cursor-pointer group",
                  isActive
                    ? accentClass
                    : "border-transparent text-text-3 hover:text-text-1 hover:bg-glass",
                )}
              >
                <div className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                  isActive ? "bg-white/10" : "bg-bg-3 group-hover:bg-bg-2",
                )}>
                  <LucideIcon
                    name={group.icon}
                    className={cn("w-3.5 h-3.5", isActive ? "" : "text-text-3 group-hover:text-text-2")}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-xs font-semibold leading-tight", isActive ? "" : "text-text-2 group-hover:text-text-1")}>
                    {group.label}
                  </p>
                  <p className={cn("text-[10px] mt-0.5", isActive ? "opacity-70" : "text-text-3")}>
                    {count} template{count !== 1 ? "s" : ""}
                  </p>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />}
              </button>
            );
          })}

          {/* Bottom: total count */}
          <div className="mt-auto pt-6 border-t border-glass-border">
            <p className="text-[10px] text-text-3 text-center">
              {TEMPLATE_GROUPS.reduce((n, g) => n + getTemplatesByGroup(g.id).length, 0)} total templates
            </p>
          </div>
        </aside>

        {/* ── Right: Template grid ── */}
        <main className="flex-1 overflow-y-auto relative bg-bg-base">
          {/* Category header */}
          <div className="sticky top-0 z-10 px-8 py-4 border-b border-glass-border bg-bg-base/90 backdrop-blur-sm flex items-center gap-3">
            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center border", GROUP_ACCENTS[activeGroupId] ?? GROUP_ACCENTS["other"])}>
              <LucideIcon name={activeGroup.icon} className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-1 leading-tight">{activeGroup.label}</h2>
              <p className="text-[11px] text-text-3">{visibleTemplates.length} template{visibleTemplates.length !== 1 ? "s" : ""}</p>
            </div>
          </div>

          {/* Animated template grid */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeGroupId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {visibleTemplates.map((t, i) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.18, delay: i * 0.04, ease: "easeOut" }}
                  >
                    <TemplateCard template={t} accent={GROUP_CARD_ACCENTS[activeGroupId] ?? GROUP_CARD_ACCENTS["other"]} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    );
  }

  // ── Builder workspace (template selected) ────────────────────────────────
  return (
    <>
      {/* Full-height three-panel workspace */}
      <div className="flex flex-col h-[calc(100dvh-64px)]">

        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 md:px-6 py-3 border-b border-glass-border bg-bg-1/80 backdrop-blur-sm shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={resetBuilder}
            aria-label="Back to templates"
            className="h-8 w-8 rounded-lg text-text-3 hover:text-accent hover:bg-accent/8 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10 shrink-0">
              <LucideIcon name={template.icon} className="w-4 h-4 text-accent" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-heading font-bold text-text-1 leading-tight">
                {template.name}
              </h1>
              <p className="text-[11px] text-text-3 truncate">{template.description}</p>
            </div>
          </div>
          <UndoRedo />
        </div>

        {/* Three-panel body */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── Left: Workflow step navigator (XL screens only) ── */}
          <aside className="hidden xl:flex flex-col w-52 shrink-0 border-r border-glass-border bg-bg-1 py-4 px-3 gap-0.5">
            <p className="label-section px-3 pb-3">Workflow</p>
            {WORKFLOW_STEPS.map((step, i) => {
              const isActive = activeStepId === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => scrollToStep(step.id)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-left transition-all duration-150 cursor-pointer group",
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "text-text-3 hover:text-text-1 hover:bg-glass",
                  )}
                >
                  <span
                    className={cn(
                      "flex-shrink-0 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center border transition-colors duration-150",
                      isActive
                        ? "bg-accent text-white border-accent"
                        : "border-border-strong text-text-3 group-hover:border-text-2",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium leading-tight",
                      isActive ? "text-accent" : "text-text-2 group-hover:text-text-1",
                    )}
                  >
                    {step.label}
                  </span>
                </button>
              );
            })}

            <div className="mt-auto pt-4 border-t border-glass-border px-3">
              <p className="text-[10px] text-text-3 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-accent2" />
                Variations enabled
              </p>
            </div>
          </aside>

          {/* ── Center: Single active workflow step ── */}
          <main className="flex-1 flex flex-col overflow-hidden">
            {/* Variation tabs strip */}
            <div className="shrink-0 px-5 py-2 border-b border-glass-border">
              <VariationTabs />
            </div>

            {/* Step content — scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 md:px-8 pt-6 pb-4 max-w-2xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStepId}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    {/* Step header */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-accent">{activeIndex + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-heading font-semibold text-text-1">{activeStep.label}</h3>
                        <p className="text-xs text-text-3">{activeStep.description}</p>
                      </div>
                    </div>

                    {/* Step content */}
                    <div className="ml-11">
                      {activeStepId === "mood" && <ReferenceImage />}

                      {activeStepId === "fields" && (
                        <div className="space-y-4">
                          <div className="bg-bg-1 border border-glass-border rounded-[var(--radius-lg)] p-4 space-y-4">
                            {template.fields.map((field) => {
                              if (template.id === "social" && field.id === "subject") {
                                return <PlatformDropdown key={field.id} />;
                              }
                              return <FieldInput key={field.id} field={field} templateId={template.id} />;
                            })}
                          </div>
                          {(template.id === "clothing" || template.id === "collection") && (
                            <GarmentSelector />
                          )}
                        </div>
                      )}

                      {activeStepId === "styles" && (
                        <div className="space-y-3">
                          <StylesDrawer templateId={template.id} styles={styles} />
                          <AIStyleGenerator />
                        </div>
                      )}

                      {activeStepId === "colors" && <PalettePanel />}
                      {activeStepId === "keywords" && <KeywordsPanel />}
                      {activeStepId === "negative" && <NegativePanel />}

                      {activeStepId === "mockup" && (
                        <div className="space-y-5">
                          <MockupPanel templateId={template.id} onMockupChange={setMockup} />
                          <div className="pt-4 border-t border-glass-border space-y-3">
                            <BuilderActions template={template} onRecipe={() => setRecipeModalOpen(true)} />
                            <VariablesPanel />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Step navigation footer */}
            <div className="shrink-0 flex items-center justify-between px-5 py-2.5 border-t border-glass-border bg-bg-1">
              <Button
                variant="ghost"
                size="sm"
                disabled={activeIndex === 0}
                onClick={() => setActiveStepId(WORKFLOW_STEPS[activeIndex - 1].id)}
                className="gap-1.5 text-xs text-text-3 hover:text-text-1 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />Prev
              </Button>
              {/* Step dots */}
              <div className="flex items-center gap-1.5">
                {WORKFLOW_STEPS.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveStepId(s.id)}
                    aria-label={`Go to ${s.label}`}
                    className={cn(
                      "rounded-full transition-all duration-150 cursor-pointer",
                      i === activeIndex ? "w-4 h-1.5 bg-accent" : "w-1.5 h-1.5 bg-glass-border hover:bg-text-3",
                    )}
                  />
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                disabled={activeIndex === WORKFLOW_STEPS.length - 1}
                onClick={() => setActiveStepId(WORKFLOW_STEPS[activeIndex + 1].id)}
                className="gap-1.5 text-xs text-text-3 hover:text-text-1 disabled:opacity-30 cursor-pointer"
              >
                Next<ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Mobile: inline prompt output */}
            <div className="lg:hidden border-t border-glass-border">
              <PromptOutput />
            </div>
          </main>

          {/* ── Right: Sticky output panel (LG+ only) ── */}
          <aside className="hidden lg:flex flex-col w-[380px] shrink-0 border-l border-glass-border bg-bg-1 overflow-hidden">
            <PromptOutput />
          </aside>
        </div>
      </div>

      <SaveRecipeModal
        open={recipeModalOpen}
        onClose={() => setRecipeModalOpen(false)}
      />
    </>
  );
}

