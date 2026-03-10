"use client";

import { clsx } from "clsx";
import { useBuilderStore } from "@/lib/store";
import { NEGATIVE_PRESETS } from "@/lib/data";

export function NegativePanel() {
  const negativePrompt = useBuilderStore((s) => s.negativePrompt);
  const setNegative = useBuilderStore((s) => s.setNegative);
  const templateId = useBuilderStore((s) => s.activeTemplateId);

  const presetEntry = templateId
    ? (NEGATIVE_PRESETS[templateId] ?? NEGATIVE_PRESETS._default)
    : NEGATIVE_PRESETS._default;
  const presets = presetEntry?.presets ?? [];

  return (
    <div className="rounded-xl border border-border bg-bg-2 overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-text-1">Negative Prompt</h3>
      </div>
      <div className="p-4 space-y-3">
        <textarea
          value={negativePrompt}
          onChange={(e) => setNegative(e.target.value)}
          placeholder="Things to exclude from the generation..."
          rows={3}
          className={clsx(
            "w-full px-3 py-2.5 rounded-lg text-xs resize-none",
            "bg-bg-input border border-border",
            "text-text-1 placeholder:text-text-3",
            "focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20",
            "transition-all duration-150",
          )}
        />
        {presets.length > 0 && (
          <div>
            <p className="text-[10px] text-text-3 mb-2 uppercase tracking-wider font-medium">
              Quick add
            </p>
            <div className="space-y-1.5">
              {presets.map((preset) => {
                const isIncluded = negativePrompt.includes(preset);
                return (
                  <button
                    key={preset}
                    onClick={() => {
                      if (isIncluded) return;
                      setNegative(
                        negativePrompt
                          ? `${negativePrompt}, ${preset}`
                          : preset,
                      );
                    }}
                    disabled={isIncluded}
                    className={clsx(
                      "w-full text-left px-3 py-1.5 rounded-lg text-[11px] transition-all duration-150",
                      "border cursor-pointer",
                      isIncluded
                        ? "bg-accent/10 text-accent/60 border-accent/20 cursor-default"
                        : "bg-surface text-text-3 border-transparent hover:text-text-2 hover:bg-bg-3",
                    )}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
