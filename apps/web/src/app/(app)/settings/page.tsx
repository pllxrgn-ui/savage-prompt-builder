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
import { GENERATORS, STYLE_PACKS, PHRASES } from "@/lib/data";
import type { HistoryStore, UIStore, SettingsStore, GeneratorId } from "@/types";
import { useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

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
  const { user, isPro, isAuthenticated, devMode, setPro } = useAuth();
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
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-9 h-9 border border-accent/20">
          <SettingsIcon className="w-4 h-4 text-accent" />
        </div>
        <div>
          <h1 className="text-lg font-mono font-bold text-text-1 uppercase tracking-wide">Settings</h1>
          <p className="text-text-2 font-mono text-[11px]">Customize and manage your experience.</p>
        </div>
      </div>

      <div className="space-y-10">
        {/* ──────── Account ──────── */}
        {isAuthenticated && user && (
          <section className="space-y-4">
            <h2 className="text-[11px] font-mono text-text-2 uppercase tracking-[0.15em]">Account</h2>
            <div className="p-5 bg-bg-2 border border-accent/8 space-y-4">
              <div className="flex items-center gap-4">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-12 h-12 border border-accent/20 text-accent text-[10px] font-mono font-bold">
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

              {/* Pro/Free toggle (dev mode) */}
              {/* BACKEND: Auth required — show real user data, link to Stripe portal */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div>
                  <p className="text-sm text-text-1 font-medium">Subscription Tier</p>
                  <p className="text-xs text-text-2 mt-0.5">
                    {isPro ? "Pro — all features unlocked" : "Free — limited features"}
                  </p>
                </div>
                <Switch
                  checked={isPro}
                  onCheckedChange={(checked) => setPro(checked)}
                  aria-label="Toggle Pro tier"
                />
              </div>
            </div>
          </section>
        )}

        {/* ──────── Appearance ──────── */}
        <section className="space-y-4">
          <h2 className="text-[11px] font-mono text-text-2 uppercase tracking-[0.15em]">Appearance</h2>

          <Card className="flex items-center gap-4 p-5">
            <div className="flex-1">
              <p className="text-sm font-mono text-text-1 font-medium">Theme</p>
              <p className="text-[11px] font-mono text-text-2 mt-0.5">Switch between dark and light modes</p>
            </div>
            <ThemeToggle />
          </Card>

          <Card className="p-5">
            <p className="text-sm font-mono text-text-1 font-medium mb-4">Accent Color</p>
            <AccentPicker />
          </Card>
        </section>

        {/* ──────── Default Generator (D1) ──────── */}
        <section className="space-y-4">
          <h2 className="text-[11px] font-mono text-text-2 uppercase tracking-[0.15em]">Default Generator</h2>
          <Card className="p-5">
            <p className="text-xs text-text-2 mb-4">
              New prompts will start with this generator selected.
            </p>
            <div className="grid grid-cols-3 gap-2">
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
          <h2 className="text-[11px] font-mono text-text-2 uppercase tracking-[0.15em]">
            <Package className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5" />
            Style Packs
          </h2>
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
          <h2 className="text-[11px] font-mono text-text-2 uppercase tracking-[0.15em]">
            <BookOpen className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5" />
            Phrase Library
          </h2>

          {/* Built-in phrases */}
          <div className="space-y-2">
            <p className="text-[10px] font-mono text-text-2 uppercase tracking-[0.15em]">Built-in</p>
            <div className="grid grid-cols-1 gap-2">
              {PHRASES.map((phrase) => (
                <div
                  key={phrase.id}
                  className="flex items-center gap-3 p-3 bg-bg-2 border border-accent/8"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-1">{phrase.label}</p>
                    <p className="text-xs text-text-2 mt-0.5 truncate">{phrase.content}</p>
                  </div>
                  <button
                    onClick={() => handleCopyPhrase(phrase.id, phrase.content)}
                    className="shrink-0 p-1.5 text-text-3 hover:text-accent hover:bg-accent/10 transition-colors"
                    aria-label={`Copy ${phrase.label}`}
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
              <p className="text-[10px] font-mono text-text-2 uppercase tracking-[0.15em]">Custom</p>
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
              <div className="p-4 bg-bg-2 border border-accent/30 space-y-3">
                <input
                  type="text"
                  placeholder="Phrase name…"
                  value={phraseForm.name}
                  onChange={(e) => setPhraseForm({ ...phraseForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-bg-input border border-accent/8 text-sm font-mono text-text-1 placeholder:text-text-2 focus:outline-none focus:border-accent/40"
                />
                <textarea
                  placeholder="Phrase content…"
                  value={phraseForm.content}
                  onChange={(e) => setPhraseForm({ ...phraseForm, content: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-bg-input border border-accent/8 text-sm font-mono text-text-1 placeholder:text-text-2 focus:outline-none focus:border-accent/40 resize-none"
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
                className="p-3 bg-bg-2 border border-accent/8"
              >
                {editingPhraseId === phrase.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editingPhrase.name}
                      onChange={(e) => setEditingPhrase({ ...editingPhrase, name: e.target.value })}
                      aria-label="Phrase name"
                      className="w-full px-3 py-1.5 bg-bg-input border border-accent/8 text-sm font-mono text-text-1 focus:outline-none focus:border-accent/40"
                    />
                    <textarea
                      value={editingPhrase.content}
                      onChange={(e) => setEditingPhrase({ ...editingPhrase, content: e.target.value })}
                      rows={2}
                      aria-label="Phrase content"
                      className="w-full px-3 py-1.5 bg-bg-input border border-accent/8 text-sm font-mono text-text-1 focus:outline-none focus:border-accent/40 resize-none"
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
                        className="p-1.5 text-text-3 hover:text-accent hover:bg-accent/10 transition-colors"
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
                        className="p-1.5 text-text-3 hover:text-text-1 hover:bg-surface transition-colors"
                        aria-label={`Edit ${phrase.name}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          deleteCustomPhrase(phrase.id);
                          addToast({ message: "Phrase deleted.", type: "info" });
                        }}
                        className="p-1.5 text-text-3 hover:text-red-500 hover:bg-red-500/10 transition-colors"
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
          <h2 className="text-[11px] font-mono text-text-2 uppercase tracking-[0.15em]">Data Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleExport}
              className="group flex flex-col items-start p-5 bg-bg-2 border border-accent/8 hover:border-accent/30 hover:bg-surface/5 transition-all text-left"
            >
              <div className="p-2 border border-accent/20 mb-3">
                <Download className="w-5 h-5 text-accent" />
              </div>
              <p className="text-sm font-semibold text-text-1">Export Data</p>
              <p className="text-xs text-text-2 mt-1 leading-relaxed">
                Download prompts, recipes, settings, and custom phrases as JSON.
              </p>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="group flex flex-col items-start p-5 bg-bg-2 border border-accent/8 hover:border-accent/30 hover:bg-surface/5 transition-all text-left"
            >
              <div className="p-2 border border-accent/20 mb-3">
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
          <Card className="p-5 space-y-3">
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
              <div className="pt-2 border-t border-border space-y-2">
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
          <h2 className="text-[11px] font-mono text-text-2 uppercase tracking-[0.15em]">About</h2>
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 border border-accent/20">
                <Database className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-mono font-semibold text-text-1">Free Tier / Offline Mode</p>
                <p className="text-[11px] font-mono text-text-2 mt-0.5">All data is stored locally in your browser.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 border border-accent/20">
                <HardDrive className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-mono font-semibold text-text-1">Storage Status</p>
                <p className="text-[11px] font-mono text-text-2 mt-0.5">Using Browser LocalStorage (persist enabled)</p>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
