"use client";

import { useState, useMemo, useRef } from "react";
import { Search, X, Plus, Pipette } from "lucide-react";
import { clsx } from "clsx";
import { useBuilderStore } from "@/lib/store";
import { PALETTES, searchPalettes, PALETTE_TAGS } from "@/lib/data";

function CustomColorSection() {
  const customColors = useBuilderStore((s) => s.customColors);
  const addCustomColor = useBuilderStore((s) => s.addCustomColor);
  const removeCustomColor = useBuilderStore((s) => s.removeCustomColor);
  const setCustomColors = useBuilderStore((s) => s.setCustomColors);
  const [hexInput, setHexInput] = useState("");
  const colorPickerRef = useRef<HTMLInputElement>(null);

  function handleAddHex() {
    const trimmed = hexInput.trim().replace(/^#/, "");
    if (!/^[0-9a-fA-F]{3,8}$/.test(trimmed)) return;
    const hex = `#${trimmed.length === 3 ? trimmed.split("").map((c) => c + c).join("") : trimmed}`;
    if (customColors.length < 8) {
      addCustomColor(hex);
      setHexInput("");
    }
  }

  function handlePickerChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (customColors.length < 8) {
      addCustomColor(e.target.value);
    }
  }

  return (
    <div className="px-4 pb-3 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-medium text-text-3 uppercase tracking-wider">Custom Colors</p>
        {customColors.length > 0 && (
          <button
            onClick={() => setCustomColors([])}
            className="text-[10px] text-text-3 hover:text-accent transition-colors cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Color swatches */}
      {customColors.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {customColors.map((color, i) => (
            <button
              key={`${color}-${i}`}
              onClick={() => removeCustomColor(i)}
              className="group relative w-8 h-8 rounded-lg border border-glass-border hover:border-red-400/50 transition-colors cursor-pointer"
              style={{ backgroundColor: color }}
              aria-label={`Remove ${color}`}
              title={color}
            >
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-lg">
                <X className="w-3 h-3 text-white" />
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Add color row */}
      {customColors.length < 8 && (
        <div className="flex gap-1.5">
          <div className="flex items-center gap-1.5 flex-1 border border-glass-border bg-bg-input px-2.5 py-1.5 rounded-[var(--radius-md)]">
            <span className="text-text-3 text-xs">#</span>
            <input
              type="text"
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddHex(); }}
              placeholder="FF6B00"
              maxLength={8}
              className="flex-1 bg-transparent text-xs text-text-1 placeholder:text-text-3 outline-none font-mono"
            />
          </div>
          <button
            onClick={handleAddHex}
            disabled={!hexInput.trim()}
            className={clsx(
              "flex items-center justify-center w-8 h-8 rounded-[var(--radius-md)] transition-colors cursor-pointer",
              hexInput.trim()
                ? "bg-accent/15 text-accent hover:bg-accent/25"
                : "bg-glass text-text-3",
            )}
            aria-label="Add hex color"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => colorPickerRef.current?.click()}
            className="flex items-center justify-center w-8 h-8 rounded-[var(--radius-md)] bg-glass text-text-3 hover:text-accent2 hover:bg-accent2/10 transition-colors cursor-pointer"
            aria-label="Pick color"
          >
            <Pipette className="w-3.5 h-3.5" />
          </button>
          <input
            ref={colorPickerRef}
            type="color"
            onChange={handlePickerChange}
            className="sr-only"
            aria-label="Color picker"
          />
        </div>
      )}

      {customColors.length >= 8 && (
        <p className="text-[10px] text-text-3">Max 8 custom colors reached.</p>
      )}
    </div>
  );
}

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
    <div className="border border-accent/8 bg-bg-2 overflow-hidden rounded-[var(--radius-lg)]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-accent/8">
        <h3 className="text-[11px] font-medium text-text-2 uppercase tracking-wider">Color Palettes</h3>
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
              "w-full pl-8 pr-8 py-2 text-xs",
              "bg-bg-input border border-accent/8 rounded-[var(--radius-md)]",
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

      {/* Custom colors */}
      <CustomColorSection />

      <div className="mx-4 border-t border-glass-border" />

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
                "border cursor-pointer text-left rounded-[var(--radius-md)]",
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
                  "text-xs font-medium truncate",
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
