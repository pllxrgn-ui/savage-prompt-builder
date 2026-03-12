"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { clsx } from "clsx";
import { useBuilderStore } from "@/lib/store";
import { PALETTES, searchPalettes, PALETTE_TAGS } from "@/lib/data";

export function PalettePanel() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const selectedPalette = useBuilderStore((s) => s.selectedPalette);
  const setPalette = useBuilderStore((s) => s.setPalette);

  const filtered = useMemo(() => {
    let results = PALETTES;
    if (query) results = searchPalettes(query);
    if (activeTag) results = results.filter((p) => p.tags.includes(activeTag));
    return results;
  }, [query, activeTag]);

  return (
    <div className="border border-accent/8 bg-bg-2 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-accent/8">
        <h3 className="text-[11px] font-mono text-text-2 uppercase tracking-[0.15em]">Color Palettes</h3>
        {selectedPalette && (
          <button
            onClick={() => setPalette(null)}
            className="text-[10px] text-text-3 hover:text-accent transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Search */}
      <div className="px-4 pt-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search palettes..."
            className={clsx(
              "w-full pl-8 pr-8 py-2 text-xs font-mono",
              "bg-bg-input border border-accent/8",
              "text-text-1 placeholder:text-text-2",
              "focus:outline-none focus:border-accent/40",
              "transition-all duration-150",
            )}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-3.5 h-3.5 text-text-3 hover:text-text-1" />
            </button>
          )}
        </div>
      </div>

      {/* Tag filter */}
      <div className="flex flex-wrap gap-1.5 px-4 pt-2 pb-3">
        {PALETTE_TAGS.slice(0, 12).map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={clsx(
              "px-2 py-0.5 rounded text-[10px] font-medium transition-all duration-150",
              activeTag === tag
                ? "bg-accent/15 text-accent"
                : "bg-surface text-text-3 hover:text-text-2",
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Palette grid */}
      <div className="px-4 pb-4 max-h-80 overflow-y-auto space-y-2">
        {filtered.length === 0 && (
          <p className="text-xs text-text-2 text-center py-4">
            No palettes found.
          </p>
        )}
        {filtered.map((palette) => {
          const isSelected = selectedPalette === palette.name;
          return (
            <button
              key={palette.id}
              onClick={() => setPalette(isSelected ? null : palette.name)}
              className={clsx(
                "w-full flex items-center gap-3 px-3 py-2 transition-all duration-150",
                "border cursor-pointer text-left",
                isSelected
                  ? "bg-accent/10 border-accent/30"
                  : "bg-transparent border-transparent hover:bg-surface",
              )}
            >
              <div className="flex gap-0.5 shrink-0">
                {palette.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-sm first:rounded-l-md last:rounded-r-md"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span
                className={clsx(
                  "text-xs font-mono font-medium truncate",
                  isSelected ? "text-accent" : "text-text-2",
                )}
              >
                {palette.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
