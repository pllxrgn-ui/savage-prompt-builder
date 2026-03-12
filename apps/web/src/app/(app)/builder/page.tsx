"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, ArrowLeft, Paintbrush, Palette, Tags, Ban, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/lib/store";
import {
  getTemplateById,
  getStylesForTemplate,
  TEMPLATE_GROUPS,
  getTemplatesByGroup,
} from "@/lib/data";
import { LucideIcon } from "@/components/ui/LucideIcon";
import { StaggerContainer, FadeUpItem, PageTransition } from "@/components/ui/AnimatedLayout";
import { TemplateCard } from "@/components/builder/TemplateCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

type BuilderTab = "styles" | "palettes" | "keywords" | "negative" | "mockup";

const BUILDER_TABS: { id: BuilderTab; label: string; icon: React.ReactNode }[] = [
  { id: "styles", label: "STYLES", icon: <Paintbrush className="w-3.5 h-3.5" /> },
  { id: "palettes", label: "PALETTES", icon: <Palette className="w-3.5 h-3.5" /> },
  { id: "keywords", label: "KEYWORDS", icon: <Tags className="w-3.5 h-3.5" /> },
  { id: "negative", label: "NEGATIVE", icon: <Ban className="w-3.5 h-3.5" /> },
  { id: "mockup", label: "MOCKUP", icon: <Layers className="w-3.5 h-3.5" /> },
];

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
  const setNegative = useBuilderStore((s) => s.setNegative);
  const setMockup = useBuilderStore((s) => s.setMockup);
  const [activeTab, setActiveTab] = useState<BuilderTab>("styles");
  const [recipeModalOpen, setRecipeModalOpen] = useState(false);
  const searchParams = useSearchParams();

  // Hydrate builder from share URL
  useEffect(() => {
    const share = searchParams.get("share");
    if (share) {
      decodeBuilderState(share);
      // Clean up URL without reload
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

  // Load default negative when template changes
  useEffect(() => {
    if (template?.defaultNegative) {
      setNegative(template.defaultNegative);
    }
  }, [template?.defaultNegative, setNegative]);

  // Template picker view (no template selected)
  if (!template) {
    return (
      <PageTransition className="p-5 md:p-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-9 h-9 border border-accent/30">
            <Wand2 className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h1 className="text-lg font-heading font-bold text-text-1 uppercase tracking-wide">Builder</h1>
            <p className="text-text-3 text-[11px] font-mono tracking-wider">SELECT A TEMPLATE TO BEGIN</p>
          </div>
        </div>

        <StaggerContainer className="space-y-10">
          {TEMPLATE_GROUPS.map((group) => {
            const templates = getTemplatesByGroup(group.id);
            return (
              <FadeUpItem key={group.id}>
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <LucideIcon name={group.icon} className="w-3.5 h-3.5 text-accent/60" />
                    <h3 className="text-[10px] font-mono font-semibold text-text-3 uppercase tracking-[0.15em]">{group.label}</h3>
                    <div className="flex-1 h-px bg-accent/8" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {templates.map((t) => (
                      <TemplateCard key={t.id} template={t} />
                    ))}
                  </div>
                </section>
              </FadeUpItem>
            );
          })}
        </StaggerContainer>
      </PageTransition>
    );
  }

  // Builder workspace (template selected)
  return (
    <PageTransition className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Button
          variant="ghost"
          size="icon"
          onClick={resetBuilder}
          aria-label="Back to templates"
          className="h-7 w-7 text-text-3 hover:text-accent hover:bg-accent/8 border border-accent/10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </Button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 border border-accent/20">
            <LucideIcon name={template.icon} className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h1 className="text-sm font-heading font-bold text-text-1 uppercase tracking-wide">{template.name}</h1>
            <p className="text-text-3 text-[10px] font-mono tracking-wider">{template.description?.toUpperCase()}</p>
          </div>
        </div>
        <UndoRedo />
      </div>

      {/* Variation tabs */}
      <div className="mb-4">
        <VariationTabs />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5">
        {/* Left — Fields + Panels */}
        <div className="space-y-5">
          {/* Template fields */}
          <Card className="border-accent/8 bg-bg-1">
            <CardContent className="p-4 space-y-4">
            <h3 className="text-[10px] font-mono font-semibold uppercase tracking-[0.15em] text-text-3">FIELDS</h3>
            {template.fields.map((field) => {
              if (template.id === "social" && field.id === "subject") {
                return <PlatformDropdown key={field.id} />;
              }
              return (
                <FieldInput
                  key={field.id}
                  field={field}
                  templateId={template.id}
                />
              );
            })}
            </CardContent>
          </Card>

          {/* Garment selector — only for clothing/collection */}
          {(template.id === "clothing" || template.id === "collection") && (
            <GarmentSelector />
          )}

          {/* Action buttons */}
          <BuilderActions template={template} onRecipe={() => setRecipeModalOpen(true)} />

          {/* Reference image */}
          <ReferenceImage />

          {/* Variables — collapsible token replacement */}
          <VariablesPanel />

          {/* Panel tabs */}
          <div className="flex flex-wrap gap-1">
            {BUILDER_TABS.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "h-7 text-[10px] font-mono tracking-wider uppercase",
                  activeTab === tab.id && "shadow-none bg-accent text-black",
                  activeTab !== tab.id && "text-text-3 hover:text-accent hover:bg-accent/8",
                )}
              >
                {tab.icon}
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Active panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {activeTab === "styles" && (
                <div className="space-y-4">
                  <StylesDrawer templateId={template.id} styles={styles} />
                  <AIStyleGenerator />
                </div>
              )}
              {activeTab === "palettes" && <PalettePanel />}
              {activeTab === "keywords" && <KeywordsPanel />}
              {activeTab === "negative" && <NegativePanel />}
              {activeTab === "mockup" && (
                <MockupPanel
                  templateId={template.id}
                  onMockupChange={setMockup}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right — Output */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <PromptOutput />
        </div>
      </div>
      <SaveRecipeModal
        open={recipeModalOpen}
        onClose={() => setRecipeModalOpen(false)}
      />
    </PageTransition>
  );
}
