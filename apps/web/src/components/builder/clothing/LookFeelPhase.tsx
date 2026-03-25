"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import { useClothingStore } from "@/lib/store/clothing-store";
import { CLOTHING_ART_STYLES, DETAIL_LEVELS } from "@/lib/data/clothing";
import { PALETTES, PALETTE_TAGS } from "@/lib/data/palettes";
import { TagChipSelector } from "./TagChipSelector";
import { AccordionSection, useAccordion } from "./AccordionSection";
import { PillTagInput, type Pill } from "./PillTagInput";
import { ColorPickerInput } from "./ColorPickerInput";
import { Input } from "@/components/ui/input";

export function LookFeelPhase() {
  const artStyles = useClothingStore((s) => s.artStyles);
  const toggleArtStyle = useClothingStore((s) => s.toggleArtStyle);
  const colorPalette = useClothingStore((s) => s.colorPalette);
  const setColorPalette = useClothingStore((s) => s.setColorPalette);
  const customPaletteColors = useClothingStore((s) => s.customPaletteColors);
  const addCustomPaletteColor = useClothingStore((s) => s.addCustomPaletteColor);
  const removeCustomPaletteColor = useClothingStore((s) => s.removeCustomPaletteColor);
  const setCustomPaletteColors = useClothingStore((s) => s.setCustomPaletteColors);
  const detailLevel = useClothingStore((s) => s.detailLevel);
  const setDetailLevel = useClothingStore((s) => s.setDetailLevel);
  const customTags = useClothingStore((s) => s.customTags);
  const addCustomTag = useClothingStore((s) => s.addCustomTag);
  const removeCustomTag = useClothingStore((s) => s.removeCustomTag);

  const [openId, toggle] = useAccordion("art-style");

  // Palette filter state
  const [paletteTag, setPaletteTag] = useState<string | null>(null);
  const [paletteSearch, setPaletteSearch] = useState("");

  const filteredPalettes = useMemo(() => {
    let result = [...PALETTES];
    if (paletteTag) result = result.filter((p) => p.tags.includes(paletteTag));
    if (paletteSearch.trim()) {
      const q = paletteSearch.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q)),
      );
    }
    return result;
  }, [paletteTag, paletteSearch]);

  const paletteBadge = colorPalette
    ? PALETTES.find((p) => p.id === colorPalette)?.name
    : customPaletteColors.length > 0
      ? `${customPaletteColors.length} custom`
      : undefined;
  const detailBadge = detailLevel
    ? DETAIL_LEVELS.find((d) => d.id === detailLevel)?.label
    : undefined;

  const artPills = useMemo<Pill[]>(() => {
    const selected: Pill[] = artStyles.map((id) => ({
      id,
      label: CLOTHING_ART_STYLES.find((a) => a.id === id)?.label ?? id,
      type: "selected",
    }));
    const custom: Pill[] = (customTags["art-style"] ?? []).map((t) => ({ id: t, label: t, type: "custom" }));
    return [...selected, ...custom];
  }, [artStyles, customTags]);

  const palettePills = useMemo<Pill[]>(() => {
    const selected: Pill[] = colorPalette
      ? [{ id: colorPalette, label: PALETTES.find((p) => p.id === colorPalette)?.name ?? colorPalette, type: "selected" }]
      : [];
    return selected;
  }, [colorPalette]);

  const detailPills = useMemo<Pill[]>(() => {
    const selected: Pill[] = detailLevel
      ? [{ id: detailLevel, label: DETAIL_LEVELS.find((d) => d.id === detailLevel)?.label ?? detailLevel, type: "selected" }]
      : [];
    const custom: Pill[] = (customTags["detail-level"] ?? []).map((t) => ({ id: t, label: t, type: "custom" }));
    return [...selected, ...custom];
  }, [detailLevel, customTags]);

  return (
    <div className="border border-accent/8 bg-bg-2 overflow-hidden rounded-[var(--radius-lg)]">
      {/* Art Style */}
      <AccordionSection
        id="art-style"
        title="Art Style"
        description="The visual rendering style for your design"
        badge={artStyles.length > 0 ? `${artStyles.length}/3` : undefined}
        isOpen={openId === "art-style"}
        onToggle={toggle}
      >
        <PillTagInput
          pills={artPills}
          onRemove={(pill) => pill.type === "selected" ? toggleArtStyle(pill.id) : removeCustomTag("art-style", pill.id)}
          onAddCustom={(text) => addCustomTag("art-style", text)}
          placeholder="Type a custom art style and press Enter…"
        />
        <div className="mt-3">
          <TagChipSelector
            items={CLOTHING_ART_STYLES}
            selected={artStyles}
            onToggle={toggleArtStyle}
            max={3}
            size="md"
          />
        </div>
      </AccordionSection>

      {/* Color Palette */}
      <AccordionSection
        id="color-palette"
        title="Color Palette"
        description="Pick a curated color palette for your design"
        badge={paletteBadge}
        isOpen={openId === "color-palette"}
        onToggle={toggle}
      >
        {/* Selected palette pill */}
        {colorPalette && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-full bg-accent/15 text-accent border border-accent/20">
              {PALETTES.find((p) => p.id === colorPalette)?.name ?? colorPalette}
              <button
                onClick={() => setColorPalette(null)}
                className="ml-0.5 hover:text-accent/70 transition-colors duration-150 cursor-pointer"
                aria-label="Remove palette"
              >
                ×
              </button>
            </span>
          </div>
        )}

        {/* Custom color picker */}
        <ColorPickerInput
          colors={customPaletteColors}
          onAdd={addCustomPaletteColor}
          onRemove={removeCustomPaletteColor}
          onClear={() => setCustomPaletteColors([])}
          label="Custom Colors"
        />

        {/* Search */}
        <div className="mt-3">
          <Input
            value={paletteSearch}
            onChange={(e) => setPaletteSearch(e.target.value)}
            placeholder="Search palettes…"
            className="bg-bg-input border-glass-border text-text-1 placeholder:text-text-3 rounded-[var(--radius-md)] text-xs h-8 focus-visible:ring-1 focus-visible:ring-accent/50 focus-visible:border-accent"
          />
        </div>

        {/* Tag filter chips */}
        <div className="flex flex-wrap gap-1 mt-2">
          <button
            onClick={() => setPaletteTag(null)}
            className={clsx(
              "px-2 py-0.5 text-[10px] font-medium rounded-full transition-colors duration-150 cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
              !paletteTag
                ? "bg-accent/15 text-accent border border-accent/30"
                : "text-text-3 hover:text-text-2 hover:bg-glass border border-transparent",
            )}
          >
            All
          </button>
          {PALETTE_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setPaletteTag(paletteTag === tag ? null : tag)}
              className={clsx(
                "px-2 py-0.5 text-[10px] font-medium rounded-full capitalize transition-colors duration-150 cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                paletteTag === tag
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "text-text-3 hover:text-text-2 hover:bg-glass border border-transparent",
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Palette grid with color swatches */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 max-h-[280px] overflow-y-auto pr-1">
          {filteredPalettes.map((p) => (
            <button
              key={p.id}
              onClick={() => setColorPalette(colorPalette === p.id ? null : p.id)}
              className={clsx(
                "flex flex-col gap-1.5 p-2 border rounded-[var(--radius-md)] transition-all duration-150 cursor-pointer text-left",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                colorPalette === p.id
                  ? "bg-accent/10 border-accent/30 ring-1 ring-accent/20"
                  : "bg-bg-3/50 border-transparent hover:bg-bg-3 hover:border-glass-border",
              )}
            >
              <div className="flex gap-0.5">
                {p.colors.map((c, ci) => (
                  <span
                    key={ci}
                    className="flex-1 h-5 first:rounded-l-sm last:rounded-r-sm border border-white/5"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <span
                className={clsx(
                  "text-[10px] font-medium truncate w-full",
                  colorPalette === p.id ? "text-accent" : "text-text-3",
                )}
              >
                {p.name}
              </span>
            </button>
          ))}
          {filteredPalettes.length === 0 && (
            <p className="col-span-full text-xs text-text-3 text-center py-4">
              No palettes match your search
            </p>
          )}
        </div>
      </AccordionSection>

      {/* Detail Level */}
      <AccordionSection
        id="detail-level"
        title="Detail Level"
        description="How intricate and complex the design should be"
        badge={detailBadge}
        isOpen={openId === "detail-level"}
        onToggle={toggle}
      >
        <PillTagInput
          pills={detailPills}
          onRemove={(pill) => pill.type === "selected" ? setDetailLevel(null) : removeCustomTag("detail-level", pill.id)}
          onAddCustom={(text) => addCustomTag("detail-level", text)}
          placeholder="Type a custom detail level and press Enter…"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
          {DETAIL_LEVELS.map((dl) => (
            <button
              key={dl.id}
              onClick={() => setDetailLevel(detailLevel === dl.id ? null : dl.id)}
              className={clsx(
                "flex flex-col items-start p-3 border transition-all duration-150 cursor-pointer rounded-[var(--radius-md)] text-left",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                detailLevel === dl.id
                  ? "bg-accent/10 border-accent/30"
                  : "bg-surface border-transparent hover:bg-bg-3",
              )}
            >
              <span className={clsx("text-xs font-medium", detailLevel === dl.id ? "text-accent" : "text-text-1")}>
                {dl.label}
              </span>
              <span className="text-[10px] text-text-3 mt-0.5 leading-snug">{dl.description}</span>
            </button>
          ))}
        </div>
      </AccordionSection>

      {/* AI Style Generator (coming soon) */}
      <AccordionSection
        id="ai-style-gen"
        title="AI Style Generator"
        description="Let AI suggest style combos based on your vibe and print method"
        isOpen={openId === "ai-style-gen"}
        onToggle={toggle}
      >
        <div className="flex flex-col items-center py-6 px-4 border border-dashed border-glass-border rounded-[var(--radius-md)] bg-bg-3/50">
          <div className="w-10 h-10 rounded-full bg-accent2/10 flex items-center justify-center mb-3">
            <span className="text-accent2 text-lg">✦</span>
          </div>
          <p className="text-sm font-medium text-text-2 mb-1">AI Style Suggestions</p>
          <p className="text-xs text-text-3 text-center max-w-xs">
            Describe your vibe and AI will suggest 3 ready-made style combos — art style, color palette, and detail level — optimized for your print method.
          </p>
          <span className="mt-3 px-3 py-1 text-[10px] font-medium text-accent2 bg-accent2/10 border border-accent2/20 rounded-full">
            Coming Soon
          </span>
        </div>
      </AccordionSection>
    </div>
  );
}
