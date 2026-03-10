"use client";

import { Plus, X } from "lucide-react";
import { clsx } from "clsx";
import { useBuilderStore } from "@/lib/store";

const MAX_VARIATIONS = 10;

export function VariationTabs() {
  const variations = useBuilderStore((s) => s.variations);
  const activeVariationIndex = useBuilderStore((s) => s.activeVariationIndex);
  const addVariation = useBuilderStore((s) => s.addVariation);
  const removeVariation = useBuilderStore((s) => s.removeVariation);
  const switchVariation = useBuilderStore((s) => s.switchVariation);

  if (variations.length <= 1 && Object.keys(variations[0] ?? {}).length === 0) {
    // Show minimal "add variation" when only one empty variation exists
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-text-3">Variations</span>
        <button
          onClick={addVariation}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium text-text-3 hover:text-accent hover:bg-accent/5 transition-colors"
          aria-label="Add variation"
        >
          <Plus className="w-3 h-3" />
          Add
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {variations.map((_, index) => (
        <div key={index} className="relative group">
          <button
            onClick={() => switchVariation(index)}
            className={clsx(
              "px-2.5 py-1 rounded-lg text-xs font-medium transition-all",
              index === activeVariationIndex
                ? "bg-accent text-white shadow-sm"
                : "bg-surface text-text-2 hover:text-text-1 hover:bg-bg-3",
            )}
          >
            V{index + 1}
          </button>
          {variations.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeVariation(index);
              }}
              className="absolute -top-1 -right-1 flex items-center justify-center w-3.5 h-3.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Remove variation ${index + 1}`}
            >
              <X className="w-2 h-2" />
            </button>
          )}
        </div>
      ))}
      {variations.length < MAX_VARIATIONS && (
        <button
          onClick={addVariation}
          className="flex items-center justify-center w-7 h-7 rounded-lg bg-surface text-text-3 hover:text-accent hover:bg-accent/5 transition-colors"
          aria-label="Add variation"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
