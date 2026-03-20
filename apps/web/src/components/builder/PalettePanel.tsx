"use client";

import { useState, useMemo } from "react";
import { Search, X, Plus } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/lib/store";
import { PALETTES, searchPalettes, PALETTE_TAGS } from "@/lib/data";

/** Normalize a raw hex string (with or without #, 3 or 6 chars) to a full 6-char #rrggbb, or null if invalid. */
function normalizeHex(raw: string): string | null {
  const trimmed = raw.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{6}$/.test(trimmed)) return `#${trimmed}`;
  if (/^[0-9a-fA-F]{3}$/.test(trimmed))
    return `#${trimmed.split("").map((c) => c + c).join("")}`;
  return null;
}

function CustomColorSection() {
  const customColors = useBuilderStore((s) => s.customColors);
  const addCustomColor = useBuilderStore((s) => s.addCustomColor);
  const removeCustomColor = useBuilderStore((s) => s.removeCustomColor);
  const setCustomColors = useBuilderStore((s) => s.setCustomColors);

  const [hexInput, setHexInput] = useState("FF6B00");
  const [pickerOpen, setPickerOpen] = useState(false);

  const previewColor = useMemo(() => normalizeHex(hexInput), [hexInput]);

  function handleAddColor() {
    if (!previewColor || customColors.length >= 4) return;
    addCustomColor(previewColor);
    setPickerOpen(false);
  }

  /** Sync picker → hex input */
  function handlePickerChange(hex: string) {
    setHexInput(hex.replace(/^#/, "").toUpperCase());
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

      {/* Saved color swatches */}
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
      {customColors.length < 4 ? (
        <div className="space-y-2">
          <div className="flex gap-1.5 items-center">
            {/* Color swatch — opens react-colorful Popover */}
            <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
              <PopoverTrigger asChild>
                <button
                  className="relative w-8 h-8 rounded-[var(--radius-md)] border border-glass-border hover:border-accent/40 transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                  style={{ backgroundColor: previewColor ?? "#FF6B00" }}
                  aria-label="Open color picker"
                  title="Open color picker"
                />
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-3 bg-bg-2 border border-glass-border rounded-[var(--radius-lg)] shadow-xl"
                side="bottom"
                align="start"
                sideOffset={6}
              >
                <HexColorPicker
                  color={previewColor ?? "#FF6B00"}
                  onChange={handlePickerChange}
                  style={{ width: 200, height: 160 }}
                />
                {/* Hex display + add button inline in popover */}
                <div className="flex items-center gap-2 mt-2.5">
                  <div className="flex items-center gap-1 flex-1 border border-glass-border bg-bg-input px-2.5 py-1.5 rounded-[var(--radius-md)]">
                    <span className="text-text-3 text-xs select-none">#</span>
                    <input
                      type="text"
                      value={hexInput}
                      onChange={(e) =>
                        setHexInput(e.target.value.toUpperCase().replace(/[^0-9A-F]/gi, ""))
                      }
                      onKeyDown={(e) => { if (e.key === "Enter") handleAddColor(); }}
                      placeholder="FF6B00"
                      maxLength={6}
                      spellCheck={false}
                      className="flex-1 bg-transparent text-xs text-text-1 placeholder:text-text-3 outline-none focus-visible:ring-1 focus-visible:ring-accent/50 font-mono min-w-0"
                    />
                  </div>
                  <button
                    onClick={handleAddColor}
                    disabled={!previewColor}
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-[var(--radius-md)] transition-colors cursor-pointer shrink-0",
                      previewColor
                        ? "bg-accent/15 text-accent hover:bg-accent/25"
                        : "bg-glass text-text-3 cursor-not-allowed",
                    )}
                    aria-label="Add color"
                    title={previewColor ? `Add ${previewColor}` : "Enter a valid hex first"}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Hex text input (outside popover, for quick typing) */}
            <div className="flex items-center gap-1 flex-1 border border-glass-border bg-bg-input px-2.5 py-1.5 rounded-[var(--radius-md)]">
              <span className="text-text-3 text-xs select-none">#</span>
              <input
                type="text"
                value={hexInput}
                onChange={(e) =>
                  setHexInput(e.target.value.toUpperCase().replace(/[^0-9A-F]/gi, ""))
                }
                onKeyDown={(e) => { if (e.key === "Enter") handleAddColor(); }}
                placeholder="FF6B00"
                maxLength={6}
                spellCheck={false}
                className="flex-1 bg-transparent text-xs text-text-1 placeholder:text-text-3 outline-none focus-visible:ring-1 focus-visible:ring-accent/50 font-mono min-w-0"
              />
            </div>

            {/* Add button */}
            <button
              onClick={handleAddColor}
              disabled={!previewColor}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-[var(--radius-md)] transition-colors cursor-pointer shrink-0",
                previewColor
                  ? "bg-accent/15 text-accent hover:bg-accent/25"
                  : "bg-glass text-text-3 cursor-not-allowed",
              )}
              aria-label="Add color"
              title={previewColor ? `Add ${previewColor}` : "Enter a valid hex first"}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[10px] text-text-3 leading-tight">
            Click the swatch to open the color picker, or type a hex value and press{" "}
            <kbd className="px-1 py-0.5 bg-bg-3 rounded text-[9px] font-mono">Enter</kbd>.
          </p>
        </div>
      ) : (
        <p className="text-[10px] text-text-3">Max 4 custom colors reached.</p>
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
            className={cn(
              "w-full pl-8 pr-8 py-2 text-xs",
              "bg-bg-input border border-accent/8 rounded-[var(--radius-md)]",
              "text-text-1 placeholder:text-text-2",
              "focus-visible:outline-none focus-visible:border-accent/40",
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
            className={cn(
              "px-2 py-0.5 rounded text-[10px] font-medium transition-all duration-150 cursor-pointer",
              activeTag === tag
                ? "bg-accent/15 text-accent"
                : "bg-glass text-text-3 hover:text-text-2",
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
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 transition-all duration-150",
                "border cursor-pointer text-left rounded-[var(--radius-md)]",
                isSelected
                  ? "bg-accent/10 border-accent/30"
                  : "bg-transparent border-transparent hover:bg-glass",
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
                className={cn(
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
