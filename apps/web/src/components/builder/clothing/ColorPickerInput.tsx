"use client";

import { useState, useMemo } from "react";
import { Plus, X } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const MAX_COLORS = 8;

/** Normalize raw hex (with or without #, 3 or 6 chars) to #rrggbb, or null if invalid. */
function normalizeHex(raw: string): string | null {
  const trimmed = raw.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{6}$/.test(trimmed)) return `#${trimmed}`;
  if (/^[0-9a-fA-F]{3}$/.test(trimmed))
    return `#${trimmed.split("").map((c) => c + c).join("")}`;
  return null;
}

interface ColorPickerInputProps {
  colors: string[];
  onAdd: (hex: string) => void;
  onRemove: (index: number) => void;
  onClear: () => void;
  max?: number;
  label?: string;
}

export function ColorPickerInput({
  colors,
  onAdd,
  onRemove,
  onClear,
  max = MAX_COLORS,
  label = "Custom Colors",
}: ColorPickerInputProps) {
  const [hexInput, setHexInput] = useState("FF6B00");
  const [pickerOpen, setPickerOpen] = useState(false);

  const previewColor = useMemo(() => normalizeHex(hexInput), [hexInput]);

  function handleAddColor() {
    if (!previewColor || colors.length >= max) return;
    if (colors.includes(previewColor)) return;
    onAdd(previewColor);
    setPickerOpen(false);
  }

  function handlePickerChange(hex: string) {
    setHexInput(hex.replace(/^#/, "").toUpperCase());
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="label-section">{label}</p>
        {colors.length > 0 && (
          <button
            onClick={onClear}
            className="text-[10px] text-text-3 hover:text-accent transition-colors duration-150 cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Saved swatches */}
      {colors.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {colors.map((color, i) => (
            <button
              key={`${color}-${i}`}
              onClick={() => onRemove(i)}
              className="group relative w-8 h-8 rounded-lg border border-glass-border hover:border-red-400/50 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
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
      {colors.length < max && (
        <>
          <div className="flex gap-1.5 items-center">
            {/* Color swatch — opens color picker popover */}
            <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
              <PopoverTrigger asChild>
                <button
                  className="relative w-8 h-8 rounded-[var(--radius-md)] border border-glass-border hover:border-accent/40 transition-colors duration-150 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
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
                      "flex items-center justify-center w-8 h-8 rounded-[var(--radius-md)] transition-colors duration-150 cursor-pointer shrink-0",
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

            {/* Hex text input (outside popover) */}
            <div className="flex items-center gap-1 flex-1 border border-glass-border bg-bg-input px-2.5 py-1.5 rounded-[var(--radius-md)] focus-within:ring-1 focus-within:ring-accent/50 focus-within:border-accent">
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
                className="flex-1 bg-transparent text-xs text-text-1 placeholder:text-text-3 outline-none font-mono min-w-0"
              />
            </div>

            {/* Add button */}
            <button
              onClick={handleAddColor}
              disabled={!previewColor}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-150 cursor-pointer shrink-0",
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

          <p className="text-[10px] text-text-3">
            Click the swatch to open the color picker, or type a hex value and press Enter.
          </p>
        </>
      )}

      {colors.length >= max && (
        <p className="text-[10px] text-text-3">Maximum {max} custom colors reached.</p>
      )}
    </div>
  );
}
