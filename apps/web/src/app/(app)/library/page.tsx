"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
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
  Download,
  Sparkles,
} from "lucide-react";
import { getMedia, deleteMedia } from "@/lib/services/media-service";
import type { GeneratedImage } from "@/lib/services/generate-service";
import { BlurFade } from "@/components/ui/blur-fade";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useHistoryStore } from "@/lib/store";
import { getTemplateById } from "@/lib/data";
import { PromptCard } from "@/components/library/PromptCard";
import { RecipeCard } from "@/components/library/RecipeCard";
import { DiffModal } from "@/components/library/DiffModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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

  // Media gallery state
  const [mediaItems, setMediaItems] = useState<GeneratedImage[]>([]);
  const [clearConfirm, setClearConfirm] = useState(false);
  const loadMedia = useCallback(() => setMediaItems(getMedia()), []);
  useEffect(() => { loadMedia(); }, [loadMedia, activeTab]);

  function handleDeleteMedia(id: string) {
    deleteMedia(id);
    setMediaItems((prev) => prev.filter((m) => m.id !== id));
  }

  function handleDownloadMedia(img: GeneratedImage) {
    const a = document.createElement("a");
    a.href = img.url;
    a.download = `sidekick-${img.id}.png`;
    a.click();
  }

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
    { id: "media" as const, label: "Gallery", icon: ImageIcon, count: mediaItems.length },
  ];

  const diffPromptA = diffIds[0] ? savedPrompts.find((p) => p.id === diffIds[0]) ?? null : null;
  const diffPromptB = diffIds[1] ? savedPrompts.find((p) => p.id === diffIds[1]) ?? null : null;

  return (
    <div className="p-5 md:p-8 pb-20 md:pb-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <BlurFade>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 border border-accent/20">
            <BookOpen className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-bold text-text-1">Library</h1>
            <p className="text-text-3 text-sm">Your saved prompts, recipes, and generated media.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Diff compare button */}
          {diffIds.length === 2 && (
            <Button
              onClick={() => setDiffOpen(true)}
              className="bg-accent text-white hover:bg-accent/90"
            >
              <Columns2 className="w-4 h-4" />
              Compare ({diffIds.length})
            </Button>
          )}
          {diffIds.length > 0 && diffIds.length < 2 && (
            <span className="text-xs text-text-2 px-3 py-2">
              Select 1 more to compare
            </span>
          )}
          {clearConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-400">Clear all history?</span>
              <Button
                onClick={() => { clearHistory(); setClearConfirm(false); }}
                size="sm"
                variant="ghost"
                className="h-7 text-xs text-white bg-red-500 hover:bg-red-600"
              >
                Yes, clear
              </Button>
              <Button
                onClick={() => setClearConfirm(false)}
                size="sm"
                variant="ghost"
                className="h-7 text-xs text-text-3 hover:text-text-1"
              >
                Cancel
              </Button>
            </div>
          ) : (
          <Button
            onClick={() => setClearConfirm(true)}
            disabled={savedPrompts.length === 0 && recipes.length === 0}
            variant="ghost"
            className="text-text-3 hover:text-red-500 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </Button>
          )}
        </div>
      </div>
      </BlurFade>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
          <Input
            type="text"
            placeholder={`Search ${activeTab}…`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label={`Search ${activeTab}`}
            className="w-full pl-10 bg-bg-input border-glass-border"
          />
        </div>

        {/* Tab pills */}
        <div className="flex items-center gap-1.5 p-1 bg-bg-2 rounded-full border border-glass-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer",
                  isActive
                    ? "bg-accent/15 text-accent border border-accent/20"
                    : "text-text-3 hover:text-text-1 hover:bg-glass",
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.count > 0 && (
                  <span className={cn(
                    "text-[10px] tabular-nums",
                    isActive ? "text-accent/70" : "text-text-3",
                  )}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* View mode toggle */}
        <div className="hidden md:flex items-center gap-0.5 p-1 bg-bg-2 rounded-xl border border-glass-border">
          <button
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
            className={cn(
              "p-2 rounded-lg transition-all duration-150 cursor-pointer",
              viewMode === "grid" ? "bg-bg-3 text-text-1" : "text-text-3 hover:text-text-1",
            )}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            aria-label="List view"
            className={cn(
              "p-2 rounded-lg transition-all duration-150 cursor-pointer",
              viewMode === "list" ? "bg-bg-3 text-text-1" : "text-text-3 hover:text-text-1",
            )}
          >
            <List className="w-3.5 h-3.5" />
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
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 cursor-pointer",
                projectFilter === proj.id
                  ? "bg-accent/15 text-accent border-accent/20"
                  : "bg-bg-2 text-text-2 border-glass-border hover:border-border-strong hover:text-text-1",
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
              className="px-3 py-1.5 text-xs rounded-full bg-bg-2 text-text-2 border border-glass-border focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/50 focus-visible:border-accent cursor-pointer"
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
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 cursor-pointer",
              starFilter
                ? "bg-amber-400/10 text-amber-400 border-amber-400/20"
                : "bg-bg-2 text-text-2 border-glass-border hover:text-text-1 hover:border-border-strong",
            )}
          >
            <Star className="w-3 h-3" fill={starFilter ? "currentColor" : "none"} />
            Starred
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
                  <div className="w-14 h-14 rounded-2xl bg-bg-2 border border-glass-border flex items-center justify-center mb-4">
                    <History className="w-6 h-6 text-text-3" />
                  </div>
                  <h3 className="text-sm font-heading font-semibold text-text-1 mb-1">No prompts found</h3>
                  <p className="text-text-3 text-xs max-w-[280px]">
                    {searchQuery
                      ? "Try adjusting your search terms."
                      : "Build and save a prompt in the Builder to see it here."}
                  </p>
                </div>
              ) : (
                <div
                  className={cn(
                    "grid gap-4 md:gap-6",
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
                  <div className="w-14 h-14 rounded-2xl bg-bg-2 border border-glass-border flex items-center justify-center mb-4">
                    <ChefHat className="w-6 h-6 text-text-3" />
                  </div>
                  <h3 className="text-sm font-heading font-semibold text-text-1 mb-1">No recipes yet</h3>
                  <p className="text-text-3 text-xs max-w-[280px]">
                    Save a prompt as a recipe from the Builder.
                  </p>
                </div>
              ) : (
                <div
                  className={cn(
                    "grid gap-4 md:gap-6",
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
            >
              {mediaItems.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-bg-2 border border-glass-border flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-text-3" />
                  </div>
                  <h3 className="text-sm font-heading font-semibold text-text-1 mb-1">No images yet</h3>
                  <p className="text-text-3 text-xs max-w-[280px]">
                    Generated images from the Generate page will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {mediaItems.map((img, i) => (
                    <motion.div
                      key={img.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="group relative aspect-square rounded-[var(--radius-md)] overflow-hidden bg-bg-2 border border-glass-border"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt={img.prompt} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex flex-col justify-between p-2">
                        <p className="text-[10px] text-white/80 line-clamp-3 leading-snug">{img.prompt}</p>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleDownloadMedia(img)}
                            aria-label="Download image"
                            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMedia(img.id)}
                            aria-label="Delete image"
                            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-red-500/60 text-white flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
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
