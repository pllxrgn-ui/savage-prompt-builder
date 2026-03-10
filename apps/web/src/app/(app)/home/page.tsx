"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, FileText, Star, BarChart3, ChefHat } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { LucideIcon } from "@/components/ui/LucideIcon";
import { TemplateCard } from "@/components/builder/TemplateCard";
import { PageTransition, StaggerContainer, FadeUpItem } from "@/components/ui/AnimatedLayout";
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

    // Most-used template
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
    // Set freestyle template with subject field
    const store = useBuilderStore.getState();
    store.setTemplate("freestyle");
    store.setField("subject", value);
    router.push("/builder");
  }

  return (
    <PageTransition className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/15">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-text-1">
            Welcome Back
          </h1>
        </div>
        <p className="text-text-2 text-sm">
          Build precise, beautiful AI image prompts with templates.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        {[
          { label: "Total Prompts", value: stats.totalPrompts, icon: FileText, color: "text-accent" },
          { label: "Favorites", value: stats.favorites, icon: Star, color: "text-yellow-400" },
          { label: "Recipes", value: stats.totalRecipes, icon: ChefHat, color: "text-emerald-400" },
          { label: "Top Template", value: stats.topTemplate, icon: BarChart3, color: "text-purple-400" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -2 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-bg-2 border border-border"
          >
            <div className={clsx("flex items-center justify-center w-9 h-9 rounded-lg bg-surface", stat.color)}>
              <stat.icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-text-1 truncate">
                {typeof stat.value === "number" ? stat.value : stat.value}
              </p>
              <p className="text-[11px] text-text-3">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {/* Quick prompt input */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-bg-2 border border-border col-span-1 sm:col-span-2">
          <Sparkles className="w-4 h-4 text-accent shrink-0" />
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleQuickGo(); }}
            placeholder="Describe anything — jump straight to builder..."
            className="flex-1 bg-transparent text-sm text-text-1 placeholder:text-text-3 outline-none"
          />
          <button
            onClick={handleQuickGo}
            disabled={!quickInput.trim()}
            className={clsx(
              "px-4 py-1.5 rounded-lg text-xs font-semibold transition-all",
              quickInput.trim()
                ? "bg-accent text-white hover:bg-accent/90"
                : "bg-surface text-text-3 cursor-not-allowed",
            )}
          >
            Go
          </button>
        </div>

        <Link
          href="/builder"
          className="group flex items-center gap-4 p-5 rounded-xl bg-bg-2 border border-border hover:border-accent/30 hover:bg-bg-3 transition-all duration-200"
        >
          <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-text-1 text-sm">New Prompt</h3>
            <p className="text-text-3 text-xs mt-0.5">Start from a template</p>
          </div>
          <ArrowRight className="w-4 h-4 text-text-3 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href="/library"
          className="group flex items-center gap-4 p-5 rounded-xl bg-bg-2 border border-border hover:border-accent/30 hover:bg-bg-3 transition-all duration-200"
        >
          <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
            <FileText className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-text-1 text-sm">Library</h3>
            <p className="text-text-3 text-xs mt-0.5">View saved prompts &amp; recipes</p>
          </div>
          <ArrowRight className="w-4 h-4 text-text-3 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>

      {/* Group Filter Tabs */}
      <div className="mb-6">
        <h2 className="text-lg font-heading font-semibold text-text-1 mb-4">
          Templates
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveGroup(null)}
            className={clsx(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
              activeGroup === null
                ? "bg-accent/15 text-accent border border-accent/30"
                : "bg-surface text-text-2 border border-transparent hover:text-text-1 hover:bg-bg-3",
            )}
          >
            All
          </button>
          {TEMPLATE_GROUPS.map((group) => (
            <button
              key={group.id}
              onClick={() =>
                setActiveGroup(activeGroup === group.id ? null : group.id)
              }
              className={clsx(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                activeGroup === group.id
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "bg-surface text-text-2 border border-transparent hover:text-text-1 hover:bg-bg-3",
              )}
            >
              <LucideIcon name={group.icon} className="w-3.5 h-3.5" />
              {group.label}
            </button>
          ))}
        </div>
      </div>

      {/* Template Groups + Cards */}
      <StaggerContainer className="space-y-8">
        {displayedGroups.map((group) => {
          const templates = getTemplatesByGroup(group.id);
          return (
            <FadeUpItem key={group.id}>
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <LucideIcon
                    name={group.icon}
                    className="w-4 h-4 text-text-3"
                  />
                  <h3 className="text-sm font-semibold text-text-2">
                    {group.label}
                  </h3>
                  <span className="text-xs text-text-3">
                    {templates.length} templates
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {templates.map((template) => (
                    <TemplateCard key={template.id} template={template} />
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
