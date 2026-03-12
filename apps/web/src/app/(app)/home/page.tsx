"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  FileText,
  Star,
  BarChart3,
  ChefHat,
  Zap,
  Wand2,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon } from "@/components/ui/LucideIcon";
import { TemplateCard } from "@/components/builder/TemplateCard";
import { PageTransition, StaggerContainer, FadeUpItem } from "@/components/ui/AnimatedLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TEMPLATE_GROUPS, getTemplatesByGroup, getTemplateById } from "@/lib/data";
import { useHistoryStore } from "@/lib/store";
import { useBuilderStore } from "@/lib/store";

function useStats() {
  const prompts = useHistoryStore((s) => s.savedPrompts);
  const recipes = useHistoryStore((s) => s.recipes);

  return useMemo(() => {
    const totalPrompts = prompts.length;
    const favorites = prompts.filter((p) => p.starred).length;
    const totalRecipes = recipes.length;

    const templateCounts: Record<string, number> = {};
    for (const p of prompts) {
      templateCounts[p.templateId] = (templateCounts[p.templateId] ?? 0) + 1;
    }
    const topTemplateId = Object.entries(templateCounts).sort(
      (a, b) => b[1] - a[1],
    )[0]?.[0];
    const topTemplate = topTemplateId
      ? getTemplateById(topTemplateId)?.name ?? "—"
      : "—";

    return { totalPrompts, favorites, totalRecipes, topTemplate };
  }, [prompts, recipes]);
}

const STATS_CONFIG = [
  { key: "totalPrompts", label: "TOTAL PROMPTS", icon: FileText, color: "text-accent" },
  { key: "favorites", label: "FAVORITES", icon: Star, color: "text-accent" },
  { key: "totalRecipes", label: "RECIPES", icon: ChefHat, color: "text-accent" },
  { key: "topTemplate", label: "TOP TEMPLATE", icon: BarChart3, color: "text-accent" },
] as const;

export default function HomePage() {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [quickInput, setQuickInput] = useState("");
  const router = useRouter();
  const stats = useStats();

  const displayedGroups = activeGroup
    ? TEMPLATE_GROUPS.filter((g) => g.id === activeGroup)
    : TEMPLATE_GROUPS;

  function handleQuickGo() {
    const value = quickInput.trim();
    if (!value) return;
    const store = useBuilderStore.getState();
    store.setTemplate("freestyle");
    store.setField("subject", value);
    router.push("/builder");
  }

  return (
    <PageTransition className="p-5 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Hero Card — terminal style */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative border border-accent/10 overflow-hidden"
      >
        {/* Solid accent top bar */}
        <div className="h-1 bg-accent" />
        <div className="relative bg-bg-2 p-6 md:p-8 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--accent)_0%,transparent_60%)] opacity-[0.04]" />
          <div className="relative flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center gap-1.5 text-[9px] font-mono text-accent uppercase tracking-[0.2em] mb-3">
                <Sparkles className="w-3 h-3" />
                PROMPT BUILDER [v1.0]
              </span>
              <h1 className="text-xl md:text-2xl font-mono font-bold text-text-1 uppercase tracking-wide mb-2">
                Welcome Back
              </h1>
              <p className="text-text-2 text-xs font-mono leading-relaxed max-w-lg">
                Build precise, beautiful AI image prompts with templates, styles, and one-click generation.
              </p>

              {/* Onboarding steps */}
              <div className="flex items-center gap-3 mt-5">
                {[
                  { icon: Wand2, label: "TEMPLATE" },
                  { icon: Zap, label: "BUILD" },
                  { icon: Sparkles, label: "GENERATE" },
                ].map((step, i) => (
                  <div key={step.label} className="flex items-center gap-1.5 text-[10px] font-mono text-text-2 uppercase tracking-wider">
                    {i > 0 && <ArrowRight className="w-3 h-3 text-accent/30" />}
                    <step.icon className="w-3 h-3 text-accent/70" />
                    <span>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button asChild size="lg" className="shrink-0 px-6 font-mono uppercase tracking-wider shadow-[0_0_20px_rgba(255,107,0,0.25)] hover:shadow-[0_0_30px_rgba(255,107,0,0.35)] transition-shadow">
              <Link href="/builder">
                Start Building
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS_CONFIG.map((stat, i) => {
          const value = stats[stat.key];
          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
              whileHover={{ y: -2 }}
            >
              <div className="border border-accent/8 bg-bg-2 hover:border-accent/20 transition-colors">
                <div className="flex items-center gap-3 p-4">
                  <div className="flex items-center justify-center w-8 h-8 border border-accent/20">
                    <stat.icon className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-mono font-bold text-text-1 tabular-nums truncate">
                      {value}
                    </p>
                    <p className="text-[10px] font-mono text-text-2 uppercase tracking-[0.15em]">{stat.label}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Prompt Bar */}
      <div className="border border-accent/8 bg-bg-2 overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-1.5 border-b border-accent/8">
          <span className="text-[10px] font-mono text-text-2 uppercase tracking-[0.15em]">QUICK PROMPT</span>
        </div>
        <div
          className={cn(
            "flex items-center gap-3 p-3",
            "focus-within:shadow-[0_0_12px_rgba(255,107,0,0.08)]",
            "transition-all duration-200",
          )}
        >
          <span className="text-accent font-mono text-sm shrink-0 ml-1">&gt;_</span>
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleQuickGo(); }}
            placeholder="describe anything — jump straight to builder..."
            className="flex-1 bg-transparent text-sm font-mono text-text-1 placeholder:text-text-2 placeholder:font-mono outline-none"
          />
          <Button
            onClick={handleQuickGo}
            disabled={!quickInput.trim()}
            size="sm"
            className="shrink-0 font-mono uppercase tracking-wider text-xs"
          >
            Build
            <Send className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link href="/builder" className="group">
          <div className="flex items-center gap-4 p-4 border border-accent/8 bg-bg-2 hover:border-accent/25 transition-colors">
            <div className="flex items-center justify-center w-9 h-9 border border-accent/20 group-hover:border-accent/40 transition-colors">
              <Sparkles className="w-4 h-4 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-mono font-semibold text-text-1 text-[11px] uppercase tracking-wide">New Prompt</h3>
              <p className="text-text-2 font-mono text-[10px] mt-0.5">Start from a template</p>
            </div>
            <ArrowRight className="w-4 h-4 text-text-3/40 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        <Link href="/library" className="group">
          <div className="flex items-center gap-4 p-4 border border-accent/8 bg-bg-2 hover:border-accent/25 transition-colors">
            <div className="flex items-center justify-center w-9 h-9 border border-accent/20 group-hover:border-accent/40 transition-colors">
              <FileText className="w-4 h-4 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-mono font-semibold text-text-1 text-[11px] uppercase tracking-wide">Library</h3>
              <p className="text-text-2 font-mono text-[10px] mt-0.5">View saved prompts &amp; recipes</p>
            </div>
            <ArrowRight className="w-4 h-4 text-text-3/40 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>
      </div>

      {/* Templates Section */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-mono text-text-2 uppercase tracking-[0.15em]">TEMPLATES</span>
          <div className="flex-1 h-px bg-accent/8" />
          <span className="text-[10px] font-mono text-text-3 uppercase tracking-[0.15em]">
            [{TEMPLATE_GROUPS.reduce((n, g) => n + getTemplatesByGroup(g.id).length, 0)}]
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          <button
            className={cn(
              "h-7 px-3 font-mono text-[10px] uppercase tracking-wider border transition-colors",
              activeGroup === null
                ? "bg-accent text-black border-accent"
                : "bg-transparent text-text-2 border-accent/10 hover:border-accent/30",
            )}
            onClick={() => setActiveGroup(null)}
          >
            ALL
          </button>
          {TEMPLATE_GROUPS.map((group) => (
            <button
              key={group.id}
              className={cn(
                "h-7 px-3 font-mono text-[10px] uppercase tracking-wider border transition-colors flex items-center gap-1.5",
                activeGroup === group.id
                  ? "bg-accent text-black border-accent"
                  : "bg-transparent text-text-2 border-accent/10 hover:border-accent/30",
              )}
              onClick={() =>
                setActiveGroup(activeGroup === group.id ? null : group.id)
              }
            >
              <LucideIcon name={group.icon} className="w-3 h-3" />
              {group.label}
            </button>
          ))}
        </div>

        {/* Template Groups + Cards */}
        <StaggerContainer className="space-y-8">
          {displayedGroups.map((group) => {
            const templates = getTemplatesByGroup(group.id);
            return (
              <FadeUpItem key={group.id}>
                <section>
                  <div className="flex items-center gap-3 mb-3">
                    <LucideIcon
                      name={group.icon}
                      className="w-3.5 h-3.5 text-accent/60"
                    />
                    <h3 className="text-[11px] font-mono font-semibold text-text-2 uppercase tracking-[0.15em]">
                      {group.label}
                    </h3>
                    <div className="flex-1 h-px bg-accent/8" />
                    <span className="text-[10px] font-mono text-text-3">
                      [{templates.length}]
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {templates.map((template) => (
                      <TemplateCard key={template.id} template={template} />
                    ))}
                  </div>
                </section>
              </FadeUpItem>
            );
          })}
        </StaggerContainer>
      </div>
    </PageTransition>
  );
}
