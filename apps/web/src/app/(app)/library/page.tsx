"use client";

import { useState, useMemo } from "react";
import {
  BookOpen,
  Search,
  Trash2,
  History,
  ChefHat,
  Image as ImageIcon,
  LayoutGrid,
  List,
  Star,
  Columns2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { clsx } from "clsx";
import { useHistoryStore } from "@/lib/store";
import { getTemplateById } from "@/lib/data";
import { PromptCard } from "@/components/library/PromptCard";
import { RecipeCard } from "@/components/library/RecipeCard";
import { DiffModal } from "@/components/library/DiffModal";

type TabType = "prompts" | "recipes" | "media";

export default function LibraryPage() {
  const savedPrompts = useHistoryStore((s) => s.savedPrompts);
  const recipes = useHistoryStore((s) => s.recipes);
  const projects = useHistoryStore((s) => s.projects);
  const clearHistory = useHistoryStore((s) => s.clearHistory);

  const [activeTab, setActiveTab] = useState<TabType>("prompts");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [starFilter, setStarFilter] = useState(false);
  const [templateFilter, setTemplateFilter] = useState<string | "">("");
  const [projectFilter, setProjectFilter] = useState<string | "">("");

  // Diff selection
  const [diffIds, setDiffIds] = useState<string[]>([]);
  const [diffOpen, setDiffOpen] = useState(false);

  function handleSelectDiff(id: string) {
    setDiffIds((prev) => {
      if (prev.includes(id)) return prev.filter((d) => d !== id);
      if (prev.length >= 2) return [prev[1]!, id];
      return [...prev, id];
    });
  }

  // Derived: unique template IDs in saved prompts
  const usedTemplateIds = useMemo(
    () => [...new Set(savedPrompts.map((p) => p.templateId))],
    [savedPrompts],
  );

  // Filter prompts
  const filteredPrompts = useMemo(() => {
    let list = savedPrompts;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          (p.note && p.note.toLowerCase().includes(q)),
      );
    }
    if (starFilter) list = list.filter((p) => p.starred);
    if (templateFilter) list = list.filter((p) => p.templateId === templateFilter);
    if (projectFilter) list = list.filter((p) => p.projectId === projectFilter);
    return list;
  }, [savedPrompts, searchQuery, starFilter, templateFilter, projectFilter]);

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    if (!searchQuery) return recipes;
    const q = searchQuery.toLowerCase();
    return recipes.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.templateId.toLowerCase().includes(q),
    );
  }, [recipes, searchQuery]);

  const tabs = [
    { id: "prompts" as const, label: "Prompts", icon: History, count: savedPrompts.length },
    { id: "recipes" as const, label: "Recipes", icon: ChefHat, count: recipes.length },
    { id: "media" as const, label: "Gallery", icon: ImageIcon, count: 0 },
  ];

  const diffPromptA = diffIds[0] ? savedPrompts.find((p) => p.id === diffIds[0]) ?? null : null;
  const diffPromptB = diffIds[1] ? savedPrompts.find((p) => p.id === diffIds[1]) ?? null : null;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-accent/15">
            <BookOpen className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-text-1">Library</h1>
            <p className="text-text-2 text-sm">Organize your creative workflow and history.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Diff compare button */}
          {diffIds.length === 2 && (
            <button
              onClick={() => setDiffOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-accent text-white hover:bg-accent/90 transition-all"
            >
              <Columns2 className="w-4 h-4" />
              Compare ({diffIds.length})
            </button>
          )}
          {diffIds.length > 0 && diffIds.length < 2 && (
            <span className="text-xs text-text-3 px-3 py-2">
              Select 1 more to compare
            </span>
          )}
          <button
            onClick={() => {
              if (confirm("Are you sure you want to clear your entire history?")) {
                clearHistory();
              }
            }}
            disabled={savedPrompts.length === 0 && recipes.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-text-3 hover:text-red-500 hover:bg-red-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg-2 border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm text-text-1 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 bg-bg-2 p-1 rounded-xl border border-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all relative",
                  isActive ? "text-accent bg-accent/10" : "text-text-3 hover:text-text-2",
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={clsx(
                      "ml-1 text-[10px] px-1.5 py-0.5 rounded-full",
                      isActive ? "bg-accent/20 text-accent" : "bg-bg-3 text-text-3",
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-1 bg-bg-2 p-1 rounded-xl border border-border">
          <button
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
            className={clsx(
              "p-2 rounded-lg",
              viewMode === "grid" ? "bg-bg-3 text-text-1" : "text-text-3 hover:text-text-2",
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            aria-label="List view"
            className={clsx(
              "p-2 rounded-lg",
              viewMode === "list" ? "bg-bg-3 text-text-1" : "text-text-3 hover:text-text-2",
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters row (prompts tab only) */}
      {activeTab === "prompts" && (
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {/* Project pills */}
          {projects.map((proj) => (
            <button
              key={proj.id}
              onClick={() => setProjectFilter(projectFilter === proj.id ? "" : proj.id)}
              className={clsx(
                "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                projectFilter === proj.id
                  ? "bg-accent/10 text-accent border-accent/30"
                  : "bg-bg-2 text-text-3 border-border hover:text-text-2",
              )}
            >
              {proj.name}
            </button>
          ))}

          {/* Template filter */}
          {usedTemplateIds.length > 1 && (
            <select
              value={templateFilter}
              onChange={(e) => setTemplateFilter(e.target.value)}
              aria-label="Filter by template"
              className="px-3 py-1 rounded-lg text-xs bg-bg-2 text-text-2 border border-border focus:outline-none focus:ring-2 focus:ring-accent/20"
            >
              <option value="">All templates</option>
              {usedTemplateIds.map((tid) => {
                const t = getTemplateById(tid);
                return (
                  <option key={tid} value={tid}>
                    {t?.name ?? tid}
                  </option>
                );
              })}
            </select>
          )}

          {/* Star filter */}
          <button
            onClick={() => setStarFilter(!starFilter)}
            className={clsx(
              "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-colors",
              starFilter
                ? "bg-amber-400/10 text-amber-400 border-amber-400/30"
                : "bg-bg-2 text-text-3 border-border hover:text-text-2",
            )}
          >
            <Star className="w-3 h-3" fill={starFilter ? "currentColor" : "none"} />
            Favs Only
          </button>
        </div>
      )}

      {/* Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === "prompts" && (
            <motion.div
              key="prompts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {filteredPrompts.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-4">
                    <History className="w-8 h-8 text-text-3" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-1 mb-1">No prompts found</h3>
                  <p className="text-text-3 text-sm max-w-[280px]">
                    {searchQuery
                      ? "Try adjusting your search terms."
                      : "Build and copy a prompt to see it here in your history."}
                  </p>
                </div>
              ) : (
                <div
                  className={clsx(
                    "grid gap-6",
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1",
                  )}
                >
                  {filteredPrompts.map((prompt) => (
                    <PromptCard
                      key={prompt.id}
                      prompt={prompt}
                      onSelectDiff={handleSelectDiff}
                      isDiffSelected={diffIds.includes(prompt.id)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "recipes" && (
            <motion.div
              key="recipes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {filteredRecipes.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-4">
                    <ChefHat className="w-8 h-8 text-text-3" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-1 mb-1">No recipes yet</h3>
                  <p className="text-text-3 text-sm max-w-[280px]">
                    Save one from the Builder to see it here!
                  </p>
                </div>
              ) : (
                <div
                  className={clsx(
                    "grid gap-6",
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1",
                  )}
                >
                  {filteredRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "media" && (
            <motion.div
              key="media"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-20 flex flex-col items-center justify-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-4">
                <ImageIcon className="w-8 h-8 text-text-3" />
              </div>
              <h3 className="text-lg font-semibold text-text-1 mb-1">Gallery coming soon</h3>
              <p className="text-text-3 text-sm max-w-[280px]">
                Generated images will appear here once Phase 5 is complete.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Diff modal */}
      <DiffModal
        open={diffOpen}
        onClose={() => {
          setDiffOpen(false);
          setDiffIds([]);
        }}
        promptA={diffPromptA}
        promptB={diffPromptB}
      />
    </div>
  );
}
