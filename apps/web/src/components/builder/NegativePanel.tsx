"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { useBuilderStore } from "@/lib/store";
import { NEGATIVE_PRESETS } from "@/lib/data";

export function NegativePanel() {
  const negativePrompt = useBuilderStore((s) => s.negativePrompt);
  const setNegative = useBuilderStore((s) => s.setNegative);
  const activeTemplateId = useBuilderStore((s) => s.activeTemplateId);

  const [input, setInput] = useState("");

  const words = negativePrompt
    ? negativePrompt.split(",").map((w) => w.trim()).filter(Boolean)
    : [];

  const wordsLower = new Set(words.map((w) => w.toLowerCase()));

  const addWord = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    if (wordsLower.has(trimmed.toLowerCase())) return;
    setNegative(negativePrompt ? `${negativePrompt}, ${trimmed}` : trimmed);
  };

  const handleInput = () => {
    addWord(input);
    setInput("");
  };

  const removeWord = (word: string) => {
    const updated = words.filter((w) => w !== word).join(", ");
    setNegative(updated);
  };

  const presets = (NEGATIVE_PRESETS[activeTemplateId ?? ""] ?? NEGATIVE_PRESETS._default).presets;
  const availablePresets = presets.filter((p) => !wordsLower.has(p.toLowerCase()));

  return (
    <div className="border border-accent/8 bg-bg-2 overflow-hidden rounded-[var(--radius-lg)]">
      <div className="px-4 py-3 border-b border-accent/8">
        <h3 className="text-[11px] font-medium text-text-2 uppercase tracking-wider">Negative Prompt</h3>
      </div>
      <div className="p-4 space-y-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleInput();
            }
          }}
          placeholder="Type to exclude, press Enter to add…"
          className={clsx(
            "w-full px-3 py-2.5 text-xs",
            "bg-bg-input border border-accent/8 rounded-[var(--radius-md)]",
            "text-text-1 placeholder:text-text-2",
            "focus-visible:outline-none focus-visible:border-accent/40 focus-visible:ring-1 focus-visible:ring-accent/20",
            "transition-all duration-150",
          )}
        />

        {availablePresets.length > 0 && (
          <div>
            <p className="text-[10px] font-medium text-text-3 mb-2 uppercase tracking-wider">
              Quick Add
            </p>
            <div className="flex flex-wrap gap-1.5">
              {availablePresets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => addWord(preset)}
                  className="px-2.5 py-1 text-[11px] text-text-3 bg-glass border border-glass-border rounded-full transition-colors duration-150 hover:bg-glass-hover hover:text-text-1 hover:border-glass-border-strong cursor-pointer"
                >
                  + {preset}
                </button>
              ))}
            </div>
          </div>
        )}

        {words.length > 0 && (
          <div>
            <p className="text-[10px] font-medium text-text-2 mb-2 uppercase tracking-wider">
              Words Added
            </p>
            <div className="flex flex-wrap gap-1.5">
              {words.map((word) => (
                <button
                  key={word}
                  onClick={() => removeWord(word)}
                  className="group flex items-center gap-1 px-2.5 py-1 text-[11px] bg-accent/10 text-accent border border-accent/20 rounded-full transition-colors duration-150 hover:bg-red-500/15 hover:text-red-400 hover:border-red-500/25 cursor-pointer"
                >
                  {word}
                  <span className="text-accent/40 group-hover:text-red-400 transition-colors duration-150">×</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
