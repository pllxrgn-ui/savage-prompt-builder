"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, ArrowLeft, Paintbrush, Palette, Tags, Ban, Layers } from "lucide-react";
import { clsx } from "clsx";
import { useBuilderStore, useUIStore } from "@/lib/store";
import {
  getTemplateById,
  getStylesForTemplate,
  TEMPLATE_GROUPS,
  getTemplatesByGroup,
} from "@/lib/data";
import { LucideIcon } from "@/components/ui/LucideIcon";
import { StaggerContainer, FadeUpItem, PageTransition } from "@/components/ui/AnimatedLayout";
import { TemplateCard } from "@/components/builder/TemplateCard";
import { FieldInput } from "@/components/builder/FieldInput";
import { StylesDrawer } from "@/components/builder/StylesDrawer";
import { PalettePanel } from "@/components/builder/PalettePanel";
import { KeywordsPanel } from "@/components/builder/KeywordsPanel";
import { NegativePanel } from "@/components/builder/NegativePanel";
import { MockupPanel } from "@/components/builder/MockupPanel";
import { PromptOutput } from "@/components/builder/PromptOutput";

type BuilderTab = "styles" | "palettes" | "keywords" | "negative" | "mockup";

const BUILDER_TABS: { id: BuilderTab; label: string; icon: React.ReactNode }[] = [
  { id: "styles", label: "Styles", icon: <Paintbrush className="w-3.5 h-3.5" /> },
  { id: "palettes", label: "Palettes", icon: <Palette className="w-3.5 h-3.5" /> },
  { id: "keywords", label: "Keywords", icon: <Tags className="w-3.5 h-3.5" /> },
  { id: "negative", label: "Negative", icon: <Ban className="w-3.5 h-3.5" /> },
  { id: "mockup", label: "Mockup", icon: <Layers className="w-3.5 h-3.5" /> },
];

export default function BuilderPage() {
  const activeTemplateId = useBuilderStore((s) => s.activeTemplateId);
  const resetBuilder = useBuilderStore((s) => s.resetBuilder);
  const setNegative = useBuilderStore((s) => s.setNegative);
  const setMockup = useBuilderStore((s) => s.setMockup);
  const [activeTab, setActiveTab] = useState<BuilderTab>("styles");

  const template = useMemo(
    () => (activeTemplateId ? getTemplateById(activeTemplateId) : null),
    [activeTemplateId],
  );

  const styles = useMemo(
    () => (activeTemplateId ? (getStylesForTemplate(activeTemplateId) ?? []) : []),
    [activeTemplateId],
  );

  // Load default negative when template changes
  useMemo(() => {
    if (template?.defaultNegative) {
      setNegative(template.defaultNegative);
    }
  }, [template?.id]);

  // Template picker view (no template selected)
  if (!template) {
    return (
      <PageTransition className="p-6 md:p-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/15">
            <Wand2 className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-text-1">Builder</h1>
            <p className="text-text-2 text-sm">Select a template to start building your prompt.</p>
          </div>
        </div>

        <StaggerContainer className="space-y-8">
          {TEMPLATE_GROUPS.map((group) => {
            const templates = getTemplatesByGroup(group.id);
            return (
              <FadeUpItem key={group.id}>
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <LucideIcon name={group.icon} className="w-4 h-4 text-text-3" />
                    <h3 className="text-sm font-semibold text-text-2">{group.label}</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={resetBuilder}
          aria-label="Back to templates"
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface hover:bg-bg-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-text-2" />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent/10">
            <LucideIcon name={template.icon} className="w-4.5 h-4.5 text-accent" />
          </div>
          <div>
            <h1 className="text-lg font-heading font-bold text-text-1">{template.name}</h1>
            <p className="text-text-3 text-xs">{template.description}</p>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Left — Fields + Panels */}
        <div className="space-y-6">
          {/* Template fields */}
          <div className="rounded-xl border border-border bg-bg-2 p-4 space-y-4">
            <h3 className="text-sm font-semibold text-text-1">Fields</h3>
            {template.fields.map((field) => (
              <FieldInput
                key={field.id}
                field={field}
                templateId={template.id}
              />
            ))}
          </div>

          {/* Panel tabs */}
          <div className="flex flex-wrap gap-1.5">
            {BUILDER_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-accent/15 text-accent border border-accent/30"
                    : "bg-surface text-text-2 border border-transparent hover:text-text-1 hover:bg-bg-3",
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
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
                <StylesDrawer templateId={template.id} styles={styles} />
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
    </PageTransition>
  );
}
