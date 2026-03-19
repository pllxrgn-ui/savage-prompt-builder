"use client";

import {
  Settings as SettingsIcon,
  Download,
  Upload,
  Trash2,
  Database,
  HardDrive,
  Copy,
  Check,
  Plus,
  Pencil,
  X,
  BookOpen,
  Package,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AccentPicker } from "@/components/ui/AccentPicker";
import { LucideIcon } from "@/components/ui/LucideIcon";
import { useHistoryStore, useUIStore, useSettingsStore } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";
import { useProGate } from "@/hooks/use-pro-gate";
import { GENERATORS, STYLE_PACKS, PHRASES } from "@/lib/data";
import type { HistoryStore, UIStore, SettingsStore, GeneratorId } from "@/types";
import { useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { BlurFade } from "@/components/ui/blur-fade";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { savedPrompts, recipes, clearHistory, savePrompt, saveRecipe } =
    useHistoryStore(useShallow((s: HistoryStore) => ({
      savedPrompts: s.savedPrompts,
      recipes: s.recipes,
      clearHistory: s.clearHistory,
      savePrompt: s.savePrompt,
      saveRecipe: s.saveRecipe,
    })));

  const {
    defaultGenerator,
    setDefaultGenerator,
    installedStylePacks,
    installStylePack,
    uninstallStylePack,
    customPhrases,
    addCustomPhrase,
    updateCustomPhrase,
    deleteCustomPhrase,
  } = useSettingsStore(useShallow((s: SettingsStore) => ({
    defaultGenerator: s.defaultGenerator,
    setDefaultGenerator: s.setDefaultGenerator,
    installedStylePacks: s.installedStylePacks,
    installStylePack: s.installStylePack,
    uninstallStylePack: s.uninstallStylePack,
    customPhrases: s.customPhrases,
    addCustomPhrase: s.addCustomPhrase,
    updateCustomPhrase: s.updateCustomPhrase,
    deleteCustomPhrase: s.deleteCustomPhrase,
  })));

  const addToast = useUIStore((s: UIStore) => s.addToast);
  const { user, isPro, isAuthenticated, devMode, setDevMode, setPro } = useAuth();
  const { handleUpgrade, isLoading } = useProGate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------- Phrase form state ---------- */
  const [phraseForm, setPhraseForm] = useState<{ name: string; content: string } | null>(null);
  const [editingPhraseId, setEditingPhraseId] = useState<string | null>(null);
  const [editingPhrase, setEditingPhrase] = useState<{ name: string; content: string }>({ name: "", content: "" });

  /* ---------- Clear confirm state ---------- */
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [clearConfirmText, setClearConfirmText] = useState("");

  /* ---------- Copied phrase id state ---------- */
  const [copiedPhraseId, setCopiedPhraseId] = useState<string | null>(null);

  /* ---------- Export ---------- */
  const handleExport = () => {
    const settingsState = useSettingsStore.getState();
    const data = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      savedPrompts,
      recipes,
      settings: {
        defaultGenerator: settingsState.defaultGenerator,
        accent: settingsState.accent,
        theme: settingsState.theme,
        installedStylePacks: settingsState.installedStylePacks,
        customPhrases: settingsState.customPhrases,
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `spb-export-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addToast({ message: "Data exported successfully!", type: "success" });
  };

  /* ---------- Import ---------- */
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      let imported = 0;

      if (data.savedPrompts && Array.isArray(data.savedPrompts)) {
        const existingIds = new Set(savedPrompts.map((p) => p.id));
        for (const p of data.savedPrompts) {
          if (!existingIds.has(p.id)) {
            savePrompt(p);
            imported++;
          }
        }
      }

      if (data.recipes && Array.isArray(data.recipes)) {
        const existingIds = new Set(recipes.map((r) => r.id));
        for (const r of data.recipes) {
          if (!existingIds.has(r.id)) {
            saveRecipe(r);
            imported++;
          }
        }
      }

      if (data.settings) {
        if (data.settings.defaultGenerator) setDefaultGenerator(data.settings.defaultGenerator);
        if (Array.isArray(data.settings.installedStylePacks)) {
          for (const packId of data.settings.installedStylePacks) installStylePack(packId);
        }
        if (Array.isArray(data.settings.customPhrases)) {
          const existingIds = new Set(customPhrases.map((p) => p.id));
          for (const phrase of data.settings.customPhrases) {
            if (!existingIds.has(phrase.id)) addCustomPhrase(phrase);
          }
        }
      }

      addToast({ message: `Imported ${imported} items successfully!`, type: "success" });
    } catch {
      addToast({ message: "Failed to import data. Invalid file format.", type: "error" });
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ---------- Clear all ---------- */
  const handleClearAll = () => {
    clearHistory();
    const settingsStore = useSettingsStore.getState();
    // Reset custom data in settings - preserve appearance
    for (const packId of settingsStore.installedStylePacks) {
      uninstallStylePack(packId);
    }
    for (const phrase of settingsStore.customPhrases) {
      deleteCustomPhrase(phrase.id);
    }
    setClearConfirmOpen(false);
    setClearConfirmText("");
    addToast({ message: "All data cleared.", type: "info" });
  };

  /* ---------- Copy phrase ---------- */
  const handleCopyPhrase = async (id: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedPhraseId(id);
    setTimeout(() => setCopiedPhraseId(null), 1500);
  };

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto pb-20">
      <BlurFade delay={0.05}>
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-9 h-9 rounded-[var(--radius-md)] bg-accent/10 border border-accent/20">
            <SettingsIcon className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-bold text-text-1">Settings</h1>
            <p className="text-text-2 text-sm">Customize and manage your experience.</p>
          </div>
        </div>
      </BlurFade>

      <div className="space-y-10">
        {/* ──────── Account ──────── */}
        {isAuthenticated && user && (
          <section className="space-y-4">
            <p className="label-section">Account</p>
            <div className="p-6 bg-bg-2 border border-glass-border rounded-[var(--radius-lg)] space-y-4">
              <div className="flex items-center gap-4">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border border-accent/20 bg-accent/10 text-accent text-[10px] font-semibold">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-1">{user.name}</p>
                  <p className="text-xs text-text-2">{user.email}</p>
                </div>
                {devMode && (
                  <Badge variant="outline" className="text-[10px] bg-amber-500/15 text-amber-500 border-amber-500/30">
                    Dev Mode
                  </Badge>
                )}
              </div>

              {/* Subscription Tier & Stripe Upgrade */}
              <div className="flex items-center justify-between pt-2 border-t border-glass-border">
                <div>
                  <p className="text-sm text-text-1 font-medium">Subscription Tier</p>
                  <p className="text-xs text-text-2 mt-0.5">
                    {isPro ? "Pro — all features unlocked" : "Free — limited features"}
                  </p>
                </div>
                {isPro ? (
                  <Badge variant="outline" className="bg-accent/15 text-accent border-accent/30 font-semibold px-3 py-1">
                    PRO ACTIVE
                  </Badge>
                ) : (
                  <Button
                    onClick={handleUpgrade}
                    disabled={isLoading}
                    size="sm"
                    className="bg-accent text-white hover:bg-accent/90 focus-visible:ring-accent"
                  >
                    {isLoading ? "Setting up..." : "Upgrade to Pro"}
                  </Button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ──────── Appearance ──────── */}
        <section className="space-y-4">
          <p className="label-section">Appearance</p>

          <Card className="flex items-center gap-4 p-6">
            <div className="flex-1">
              <p className="text-sm font-medium text-text-1">Theme</p>
              <p className="text-xs text-text-2 mt-0.5">Switch between dark and light modes</p>
            </div>
            <ThemeToggle />
          </Card>

          <Card className="p-6">
            <p className="text-sm font-medium text-text-1 mb-4">Accent Color</p>
            <AccentPicker />
          </Card>
        </section>

        {/* ──────── Default Generator (D1) ──────── */}
        <section className="space-y-4">
          <p className="label-section">Default Generator</p>
          <Card className="p-6">
            <p className="text-xs text-text-2 mb-4">
              New prompts will start with this generator selected.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {GENERATORS.map((gen) => (
                <Button
                  key={gen.id}
                  onClick={() => setDefaultGenerator(gen.id as GeneratorId)}
                  variant={defaultGenerator === gen.id ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "justify-start gap-2 text-sm",
                    defaultGenerator === gen.id
                      ? "bg-accent/15 text-accent border border-accent/40 shadow-none"
                      : "text-text-2",
                  )}
                >
                  <LucideIcon name={gen.icon} className="w-4 h-4 shrink-0" />
                  <span className="truncate">{gen.name}</span>
                </Button>
              ))}
            </div>
          </Card>
        </section>

        {/* ──────── Style Packs (D3) ──────── */}
        <section className="space-y-4">
          <div className="flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-text-3" />
            <p className="label-section">Style Packs</p>
          </div>
          <p className="text-xs text-text-2 -mt-2">
            Install curated style packs to use in the builder.
          </p>
          {/* BACKEND: Replace with API for community style packs */}
          <div className="grid grid-cols-1 gap-3">
            {STYLE_PACKS.map((pack) => {
              const installed = installedStylePacks.includes(pack.id);
              return (
                <Card key={pack.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-1">{pack.name}</p>
                      <p className="text-xs text-text-2 mt-0.5">{pack.description}</p>
                    </div>
                    <Button
                      onClick={() =>
                        installed ? uninstallStylePack(pack.id) : installStylePack(pack.id)
                      }
                      variant={installed ? "outline" : "ghost"}
                      size="sm"
                      className={cn(
                        "h-7 text-xs shrink-0",
                        installed && "bg-accent/15 text-accent border-accent/30",
                      )}
                    >
                      {installed ? (
                        <span className="flex items-center gap-1">
                          <Check className="w-3 h-3" /> Installed
                        </span>
                      ) : (
                        "Install"
                      )}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {pack.styles.slice(0, 4).map((style) => (
                      <Badge key={style} variant="outline" className="text-[10px] text-text-3">
                        {style}
                      </Badge>
                    ))}
                    {pack.styles.length > 4 && (
                      <Badge variant="outline" className="text-[10px] text-text-3">
                        +{pack.styles.length - 4} more
                      </Badge>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* ──────── Phrase Library (D4) ──────── */}
        <section className="space-y-4">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-text-3" />
            <p className="label-section">Phrase Library</p>
          </div>

          {/* Built-in phrases */}
          <div className="space-y-2">
            <p className="label-section">Built-in</p>
            <div className="grid grid-cols-1 gap-2">
              {PHRASES.map((phrase) => (
                <div
                  key={phrase.id}
                  className="flex items-center gap-3 p-3 bg-bg-2 border border-glass-border rounded-[var(--radius-md)]"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-1">{phrase.label}</p>
                    <p className="text-xs text-text-2 mt-0.5 truncate">{phrase.content}</p>
                  </div>
                  <button
                    onClick={() => handleCopyPhrase(phrase.id, phrase.content)}
                    className="shrink-0 p-1.5 text-text-3 hover:text-accent hover:bg-accent/10 transition-colors cursor-pointer rounded-[var(--radius-sm)]"
                  >
                    {copiedPhraseId === phrase.id ? (
                      <Check className="w-4 h-4 text-accent" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Custom phrases */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="label-section">Custom</p>
              {!phraseForm && (
                <Button
                  onClick={() => setPhraseForm({ name: "", content: "" })}
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-accent"
                >
                  <Plus className="w-3 h-3" /> Add Phrase
                </Button>
              )}
            </div>

            {/* Add form */}
            {phraseForm && (
              <div className="p-4 bg-bg-2 border border-accent/30 rounded-[var(--radius-md)] space-y-3">
                <input
                  type="text"
                  placeholder="Phrase name…"
                  value={phraseForm.name}
                  onChange={(e) => setPhraseForm({ ...phraseForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-bg-input border border-glass-border rounded-[var(--radius-md)] text-sm text-text-1 placeholder:text-text-3 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/50 focus-visible:border-accent"
                />
                <textarea
                  placeholder="Phrase content…"
                  value={phraseForm.content}
                  onChange={(e) => setPhraseForm({ ...phraseForm, content: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-bg-input border border-glass-border rounded-[var(--radius-md)] text-sm text-text-1 placeholder:text-text-3 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/50 focus-visible:border-accent resize-none"
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    onClick={() => setPhraseForm(null)}
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-text-3"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (!phraseForm.name.trim() || !phraseForm.content.trim()) return;
                      addCustomPhrase({
                        id: crypto.randomUUID(),
                        name: phraseForm.name.trim(),
                        content: phraseForm.content.trim(),
                      });
                      setPhraseForm(null);
                      addToast({ message: "Phrase added!", type: "success" });
                    }}
                    disabled={!phraseForm.name.trim() || !phraseForm.content.trim()}
                    size="sm"
                    className="h-7 text-xs bg-accent text-white hover:bg-accent/90"
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}

            {/* Custom phrase list */}
            {customPhrases.length === 0 && !phraseForm && (
              <p className="text-xs text-text-2 italic">No custom phrases yet.</p>
            )}
            {customPhrases.map((phrase) => (
              <div
                key={phrase.id}
                className="p-3 bg-bg-2 border border-glass-border rounded-[var(--radius-md)]"
              >
                {editingPhraseId === phrase.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editingPhrase.name}
                      onChange={(e) => setEditingPhrase({ ...editingPhrase, name: e.target.value })}
                      aria-label="Phrase name"
                      className="w-full px-3 py-1.5 bg-bg-input border border-glass-border rounded-[var(--radius-md)] text-sm text-text-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/50 focus-visible:border-accent"
                    />
                    <textarea
                      value={editingPhrase.content}
                      onChange={(e) => setEditingPhrase({ ...editingPhrase, content: e.target.value })}
                      rows={2}
                      aria-label="Phrase content"
                      className="w-full px-3 py-1.5 bg-bg-input border border-glass-border rounded-[var(--radius-md)] text-sm text-text-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/50 focus-visible:border-accent resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        onClick={() => setEditingPhraseId(null)}
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-text-3"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          if (!editingPhrase.name.trim() || !editingPhrase.content.trim()) return;
                          updateCustomPhrase(phrase.id, {
                            name: editingPhrase.name.trim(),
                            content: editingPhrase.content.trim(),
                          });
                          setEditingPhraseId(null);
                          addToast({ message: "Phrase updated!", type: "success" });
                        }}
                        size="sm"
                        className="h-7 text-xs bg-accent text-white hover:bg-accent/90"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-1">{phrase.name}</p>
                      <p className="text-xs text-text-2 mt-0.5 truncate">{phrase.content}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleCopyPhrase(phrase.id, phrase.content)}
                        className="p-1.5 text-text-3 hover:text-accent hover:bg-accent/10 transition-colors cursor-pointer rounded-[var(--radius-sm)]"
                        aria-label={`Copy ${phrase.name}`}
                      >
                        {copiedPhraseId === phrase.id ? (
                          <Check className="w-3.5 h-3.5 text-accent" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setEditingPhraseId(phrase.id);
                          setEditingPhrase({ name: phrase.name, content: phrase.content });
                        }}
                        className="p-1.5 text-text-3 hover:text-text-1 hover:bg-glass transition-colors cursor-pointer rounded-[var(--radius-sm)]"
                        aria-label={`Edit ${phrase.name}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          deleteCustomPhrase(phrase.id);
                          addToast({ message: "Phrase deleted.", type: "info" });
                        }}
                        className="p-1.5 text-text-3 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer rounded-[var(--radius-sm)]"
                        aria-label={`Delete ${phrase.name}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* BACKEND: Replace with /api/phrases CRUD */}
        </section>

        {/* ──────── Data Management (D5 enhanced) ──────── */}
        <section className="space-y-4">
          <p className="label-section">Data Management</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleExport}
              className="group flex flex-col items-start p-5 bg-bg-2 border border-glass-border rounded-[var(--radius-md)] hover:border-border-strong hover:bg-glass-hover transition-colors duration-150 text-left cursor-pointer"
            >
              <div className="p-2 rounded-[var(--radius-sm)] border border-accent/20 bg-accent/5 mb-3">
                <Download className="w-5 h-5 text-accent" />
              </div>
              <p className="text-sm font-semibold text-text-1">Export Data</p>
              <p className="text-xs text-text-2 mt-1 leading-relaxed">
                Download prompts, recipes, settings, and custom phrases as JSON.
              </p>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="group flex flex-col items-start p-5 bg-bg-2 border border-glass-border rounded-[var(--radius-md)] hover:border-border-strong hover:bg-glass-hover transition-colors duration-150 text-left cursor-pointer"
            >
              <div className="p-2 rounded-[var(--radius-sm)] border border-accent/20 bg-accent/5 mb-3">
                <Upload className="w-5 h-5 text-accent" />
              </div>
              <p className="text-sm font-semibold text-text-1">Import Data</p>
              <p className="text-xs text-text-2 mt-1 leading-relaxed">
                Restore from a backup. Duplicates are skipped by ID.
              </p>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              className="hidden"
              aria-label="Import data file"
            />
          </div>

          {/* Clear All — with typed confirmation */}
          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-text-1 font-medium">Clear All Data</p>
                <p className="text-xs text-text-2 mt-0.5">
                  Permanently delete all saved prompts, recipes, and custom data.
                </p>
              </div>
              {!clearConfirmOpen && (
                <Button
                  onClick={() => setClearConfirmOpen(true)}
                  aria-label="Clear all data"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-text-3 hover:text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              )}
            </div>
            {clearConfirmOpen && (
              <div className="pt-2 border-t border-glass-border space-y-2">
                <p className="text-xs text-red-400">
                  Type <span className="font-mono font-bold">DELETE</span> to confirm.
                </p>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={clearConfirmText}
                    onChange={(e) => setClearConfirmText(e.target.value)}
                    placeholder="Type DELETE"
                    className="flex-1"
                  />
                  <Button
                    onClick={handleClearAll}
                    disabled={clearConfirmText !== "DELETE"}
                    size="sm"
                    className="bg-red-500 text-white hover:bg-red-600"
                  >
                    Confirm
                  </Button>
                  <Button
                    onClick={() => {
                      setClearConfirmOpen(false);
                      setClearConfirmText("");
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-text-3"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </section>

        {/* ──────── About ──────── */}
        <section className="space-y-4">
          <p className="label-section">About</p>
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-[var(--radius-sm)] border border-accent/20 bg-accent/5">
                <Database className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-1">Free Tier / Offline Mode</p>
                <p className="text-xs text-text-2 mt-0.5">All data is stored locally in your browser.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-[var(--radius-sm)] border border-accent/20 bg-accent/5">
                <HardDrive className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-1">Storage Status</p>
                <p className="text-xs text-text-2 mt-0.5">
                  {isAuthenticated ? "Cloud Secured (Supabase + Local Cache)" : "Using Browser LocalStorage (persist enabled)"}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-1">Dev Mode</p>
                <p className="text-xs text-text-2 mt-0.5">Simulate authenticated user with 100 credits. No real Supabase session required.</p>
              </div>
              <Switch
                checked={devMode}
                onCheckedChange={(on) => setDevMode(on)}
                aria-label="Toggle dev mode"
              />
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

