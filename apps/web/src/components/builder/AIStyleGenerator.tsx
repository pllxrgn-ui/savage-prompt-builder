"use client";

import { useState } from "react";
import { Sparkles, Plus, PlusCircle, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { useBuilderStore } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";
import { ProUpgradeCard } from "@/components/ui/ProUpgradeCard";

const VIBE_CHIPS = [
  "dark moody cinematic",
  "retro 70s sunset",
  "cute kawaii pastel",
  "gritty cyberpunk neon",
  "clean minimalist white",
  "ethereal dreamy fog",
  "bold pop art",
  "warm golden hour",
  "cold blue noir",
  "vintage film grain",
] as const;

/* Hardcoded stub results — replaced by /api/ai/styles */
const STUB_STYLES = [
  {
    label: "Cinematic Noir Atmosphere",
    content:
      "dark cinematic lighting, high contrast shadows, desaturated color palette, film noir mood, volumetric haze",
  },
  {
    label: "Ethereal Dream Wash",
    content:
      "soft diffused glow, pastel color bleeding, dreamy bokeh layers, gentle lens flare, overexposed highlights",
  },
  {
    label: "Raw Analog Texture",
    content:
      "heavy film grain, Kodak Tri-X 400, slight light leak, vignette corners, analog warmth, imperfect scan lines",
  },
];

interface GeneratedStyle {
  label: string;
  content: string;
}

export function AIStyleGenerator() {
  const { isPro } = useAuth();
  const addCustomStyle = useBuilderStore((s) => s.addCustomStyle);

  const [vibeText, setVibeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GeneratedStyle[]>([]);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

  // BACKEND: Pro only — calls /api/ai/styles with vibe text + mood board images
  const handleGenerate = async () => {
    if (!vibeText.trim()) return;
    setLoading(true);
    setResults([]);
    setAddedIds(new Set());
    // Stub: fake delay then return hardcoded styles
    await new Promise((r) => setTimeout(r, 1500));
    setResults(STUB_STYLES);
    setLoading(false);
  };

  const handleAddStyle = (index: number, style: GeneratedStyle) => {
    addCustomStyle({
      label: style.label,
      content: style.content,
    });
    setAddedIds((prev) => new Set(prev).add(index));
  };

  const handleAddAll = () => {
    for (let i = 0; i < results.length; i++) {
      if (!addedIds.has(i)) {
        handleAddStyle(i, results[i]!);
      }
    }
  };

  if (!isPro) {
    return (
      <ProUpgradeCard
        feature="AI Style Generator"
        description="Describe a vibe and get 3 custom styles generated instantly."
        className="mt-4"
      />
    );
  }

  return (
    <div className="rounded-xl border border-border bg-bg-2 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <Sparkles className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-semibold text-text-1">AI Style Generator</h3>
        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-accent/15 text-accent">
          Pro
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Vibe input */}
        <div className="space-y-2">
          <input
            type="text"
            placeholder='Describe a vibe… (e.g. "dark japanese ink, moody")'
            value={vibeText}
            onChange={(e) => setVibeText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            aria-label="Describe a vibe"
            className="w-full px-3 py-2 rounded-lg bg-bg-input border border-border text-sm text-text-1 placeholder:text-text-2 focus:outline-none focus:border-accent/50"
          />

          {/* Quick-fill chips */}
          <div className="flex flex-wrap gap-1.5">
            {VIBE_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => setVibeText(chip)}
                className={clsx(
                  "px-2 py-0.5 rounded-md text-[10px] transition-all",
                  vibeText === chip
                    ? "bg-accent/15 text-accent border border-accent/30"
                    : "bg-surface text-text-3 border border-transparent hover:text-text-2",
                )}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={!vibeText.trim() || loading}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-opacity"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Generating…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Generate 3 Styles
            </>
          )}
        </button>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-2">
            {results.map((style, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-surface border border-border"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-text-1">{style.label}</p>
                  <p className="text-[11px] text-text-2 mt-0.5 line-clamp-2">
                    {style.content}
                  </p>
                </div>
                <button
                  onClick={() => handleAddStyle(i, style)}
                  disabled={addedIds.has(i)}
                  className={clsx(
                    "shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all",
                    addedIds.has(i)
                      ? "bg-accent/15 text-accent"
                      : "bg-accent text-white hover:opacity-90",
                  )}
                >
                  {addedIds.has(i) ? (
                    "Added ✓"
                  ) : (
                    <>
                      <Plus className="w-3 h-3" /> Add
                    </>
                  )}
                </button>
              </div>
            ))}

            {addedIds.size < results.length && (
              <button
                onClick={handleAddAll}
                className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg border border-accent/30 text-accent text-xs font-medium hover:bg-accent/5 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Add All Styles
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
