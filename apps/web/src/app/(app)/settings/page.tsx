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
import { clsx } from "clsx";

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
    <div className="p-6 md:p-8 max-w-2xl mx-auto pb-20">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/15">
          <SettingsIcon className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-1">Settings</h1>
          <p className="text-text-2 text-sm">Customize and manage your experience.</p>
        </div>
      </div>

      <div className="space-y-10">
        {/* ──────── Account ──────── */}
        {isAuthenticated && user && (
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-text-1 uppercase tracking-wider">Account</h2>
            <div className="p-5 rounded-xl bg-bg-2 border border-border space-y-4">
              <div className="flex items-center gap-4">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/15 text-accent text-sm font-bold">
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
                  <p className="text-xs text-text-3">{user.email}</p>
                </div>
                {devMode && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500">
                    Dev Mode
                  </span>
                )}
              </div>

              {/* Pro/Free toggle (dev mode) */}
              {/* BACKEND: Auth required — show real user data, link to Stripe portal */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div>
                  <p className="text-sm text-text-1 font-medium">Subscription Tier</p>
                  <p className="text-xs text-text-3 mt-0.5">
                    {isPro ? "Pro — all features unlocked" : "Free — limited features"}
                  </p>
                </div>
                <button
                  onClick={() => setPro(!isPro)}
                  className={clsx(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    isPro ? "bg-accent" : "bg-surface",
                  )}
                  aria-label="Toggle Pro tier"
                >
                  <span
                    className={clsx(
                      "inline-block h-4 w-4 rounded-full bg-white transition-transform",
                      isPro ? "translate-x-6" : "translate-x-1",
                    )}
                  />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ──────── Appearance ──────── */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text-1 uppercase tracking-wider">Appearance</h2>

          <div className="flex items-center gap-4 p-5 rounded-xl bg-bg-2 border border-border">
            <div className="flex-1">
              <p className="text-sm text-text-1 font-medium">Theme</p>
              <p className="text-xs text-text-3 mt-0.5">Switch between dark and light modes</p>
            </div>
            <ThemeToggle />
          </div>

          <div className="p-5 rounded-xl bg-bg-2 border border-border">
            <p className="text-sm text-text-1 font-medium mb-4">Accent Color</p>
            <AccentPicker />
          </div>
        </section>

        {/* ──────── Default Generator (D1) ──────── */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text-1 uppercase tracking-wider">Default Generator</h2>
          <div className="p-5 rounded-xl bg-bg-2 border border-border">
            <p className="text-xs text-text-3 mb-4">
              New prompts will start with this generator selected.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {GENERATORS.map((gen) => (
                <button
                  key={gen.id}
                  onClick={() => setDefaultGenerator(gen.id as GeneratorId)}
                  className={clsx(
                    "flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all text-sm",
                    defaultGenerator === gen.id
                      ? "bg-accent/15 border border-accent/40 text-accent font-medium"
                      : "bg-surface border border-transparent text-text-2 hover:text-text-1 hover:bg-surface/80",
                  )}
                >
                  <LucideIcon name={gen.icon} className="w-4 h-4 shrink-0" />
                  <span className="truncate">{gen.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ──────── Style Packs (D3) ──────── */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text-1 uppercase tracking-wider">
            <Package className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
            Style Packs
          </h2>
          <p className="text-xs text-text-3 -mt-2">
            Install curated style packs to use in the builder.
          </p>
          {/* BACKEND: Replace with API for community style packs */}
          <div className="grid grid-cols-1 gap-3">
            {STYLE_PACKS.map((pack) => {
              const installed = installedStylePacks.includes(pack.id);
              return (
                <div
                  key={pack.id}
                  className="p-4 rounded-xl bg-bg-2 border border-border space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-1">{pack.name}</p>
                      <p className="text-xs text-text-3 mt-0.5">{pack.description}</p>
                    </div>
                    <button
                      onClick={() =>
                        installed ? uninstallStylePack(pack.id) : installStylePack(pack.id)
                      }
                      className={clsx(
                        "shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        installed
                          ? "bg-accent/15 text-accent border border-accent/30"
                          : "bg-surface text-text-2 hover:text-text-1 hover:bg-surface/80 border border-transparent",
                      )}
                    >
                      {installed ? (
                        <span className="flex items-center gap-1">
                          <Check className="w-3 h-3" /> Installed
                        </span>
                      ) : (
                        "Install"
                      )}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {pack.styles.slice(0, 4).map((style) => (
                      <span
                        key={style}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-surface text-text-3"
                      >
                        {style}
                      </span>
                    ))}
                    {pack.styles.length > 4 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface text-text-3">
                        +{pack.styles.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ──────── Phrase Library (D4) ──────── */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text-1 uppercase tracking-wider">
            <BookOpen className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
            Phrase Library
          </h2>

          {/* Built-in phrases */}
          <div className="space-y-2">
            <p className="text-xs text-text-3 font-medium uppercase tracking-wider">Built-in</p>
            <div className="grid grid-cols-1 gap-2">
              {PHRASES.map((phrase) => (
                <div
                  key={phrase.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-bg-2 border border-border"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-1">{phrase.label}</p>
                    <p className="text-xs text-text-3 mt-0.5 truncate">{phrase.content}</p>
                  </div>
                  <button
                    onClick={() => handleCopyPhrase(phrase.id, phrase.content)}
                    className="shrink-0 p-1.5 rounded-md text-text-3 hover:text-accent hover:bg-accent/10 transition-colors"
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
              <p className="text-xs text-text-3 font-medium uppercase tracking-wider">Custom</p>
              {!phraseForm && (
                <button
                  onClick={() => setPhraseForm({ name: "", content: "" })}
                  className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add Phrase
                </button>
              )}
            </div>

            {/* Add form */}
            {phraseForm && (
              <div className="p-4 rounded-xl bg-bg-2 border border-accent/30 space-y-3">
                <input
                  type="text"
                  placeholder="Phrase name…"
                  value={phraseForm.name}
                  onChange={(e) => setPhraseForm({ ...phraseForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-bg-input border border-border text-sm text-text-1 placeholder:text-text-3 focus:outline-none focus:border-accent/50"
                />
                <textarea
                  placeholder="Phrase content…"
                  value={phraseForm.content}
                  onChange={(e) => setPhraseForm({ ...phraseForm, content: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-bg-input border border-border text-sm text-text-1 placeholder:text-text-3 focus:outline-none focus:border-accent/50 resize-none"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setPhraseForm(null)}
                    className="px-3 py-1.5 rounded-lg text-xs text-text-3 hover:text-text-1 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
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
                    className="px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* Custom phrase list */}
            {customPhrases.length === 0 && !phraseForm && (
              <p className="text-xs text-text-3 italic">No custom phrases yet.</p>
            )}
            {customPhrases.map((phrase) => (
              <div
                key={phrase.id}
                className="p-3 rounded-lg bg-bg-2 border border-border"
              >
                {editingPhraseId === phrase.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editingPhrase.name}
                      onChange={(e) => setEditingPhrase({ ...editingPhrase, name: e.target.value })}
                      aria-label="Phrase name"
                      className="w-full px-3 py-1.5 rounded-lg bg-bg-input border border-border text-sm text-text-1 focus:outline-none focus:border-accent/50"
                    />
                    <textarea
                      value={editingPhrase.content}
                      onChange={(e) => setEditingPhrase({ ...editingPhrase, content: e.target.value })}
                      rows={2}
                      aria-label="Phrase content"
                      className="w-full px-3 py-1.5 rounded-lg bg-bg-input border border-border text-sm text-text-1 focus:outline-none focus:border-accent/50 resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setEditingPhraseId(null)}
                        className="px-3 py-1.5 rounded-lg text-xs text-text-3 hover:text-text-1"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (!editingPhrase.name.trim() || !editingPhrase.content.trim()) return;
                          updateCustomPhrase(phrase.id, {
                            name: editingPhrase.name.trim(),
                            content: editingPhrase.content.trim(),
                          });
                          setEditingPhraseId(null);
                          addToast({ message: "Phrase updated!", type: "success" });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-medium hover:opacity-90"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-1">{phrase.name}</p>
                      <p className="text-xs text-text-3 mt-0.5 truncate">{phrase.content}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleCopyPhrase(phrase.id, phrase.content)}
                        className="p-1.5 rounded-md text-text-3 hover:text-accent hover:bg-accent/10 transition-colors"
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
                        className="p-1.5 rounded-md text-text-3 hover:text-text-1 hover:bg-surface transition-colors"
                        aria-label={`Edit ${phrase.name}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          deleteCustomPhrase(phrase.id);
                          addToast({ message: "Phrase deleted.", type: "info" });
                        }}
                        className="p-1.5 rounded-md text-text-3 hover:text-red-500 hover:bg-red-500/10 transition-colors"
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
          <h2 className="text-sm font-semibold text-text-1 uppercase tracking-wider">Data Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleExport}
              className="group flex flex-col items-start p-5 rounded-xl bg-bg-2 border border-border hover:border-accent/40 hover:bg-surface/5 transition-all text-left"
            >
              <div className="p-2 rounded-lg bg-surface mb-3">
                <Download className="w-5 h-5 text-accent" />
              </div>
              <p className="text-sm font-semibold text-text-1">Export Data</p>
              <p className="text-xs text-text-3 mt-1 leading-relaxed">
                Download prompts, recipes, settings, and custom phrases as JSON.
              </p>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="group flex flex-col items-start p-5 rounded-xl bg-bg-2 border border-border hover:border-accent/40 hover:bg-surface/5 transition-all text-left"
            >
              <div className="p-2 rounded-lg bg-surface mb-3">
                <Upload className="w-5 h-5 text-accent" />
              </div>
              <p className="text-sm font-semibold text-text-1">Import Data</p>
              <p className="text-xs text-text-3 mt-1 leading-relaxed">
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
          <div className="p-5 rounded-xl bg-bg-2 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-text-1 font-medium">Clear All Data</p>
                <p className="text-xs text-text-3 mt-0.5">
                  Permanently delete all saved prompts, recipes, and custom data.
                </p>
              </div>
              {!clearConfirmOpen && (
                <button
                  onClick={() => setClearConfirmOpen(true)}
                  aria-label="Clear all data"
                  className="p-2.5 rounded-lg text-text-3 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
            {clearConfirmOpen && (
              <div className="pt-2 border-t border-border space-y-2">
                <p className="text-xs text-red-400">
                  Type <span className="font-mono font-bold">DELETE</span> to confirm.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={clearConfirmText}
                    onChange={(e) => setClearConfirmText(e.target.value)}
                    placeholder="Type DELETE"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-bg-input border border-border text-sm text-text-1 placeholder:text-text-3 focus:outline-none focus:border-red-500/50"
                  />
                  <button
                    onClick={handleClearAll}
                    disabled={clearConfirmText !== "DELETE"}
                    className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => {
                      setClearConfirmOpen(false);
                      setClearConfirmText("");
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs text-text-3 hover:text-text-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ──────── About ──────── */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text-1 uppercase tracking-wider">About</h2>
          <div className="p-5 rounded-xl bg-bg-2 border border-border space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-surface">
                <Database className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-1">Free Tier / Offline Mode</p>
                <p className="text-xs text-text-3 mt-0.5">All data is stored locally in your browser.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-surface">
                <HardDrive className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-1">Storage Status</p>
                <p className="text-xs text-text-3 mt-0.5">Using Browser LocalStorage (persist enabled)</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
