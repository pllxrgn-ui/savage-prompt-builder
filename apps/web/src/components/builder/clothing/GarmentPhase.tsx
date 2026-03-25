"use client";

import { useMemo } from "react";
import { clsx } from "clsx";
import { useClothingStore } from "@/lib/store/clothing-store";
import { GARMENT_TYPES, PRINT_SIZES, GARMENT_COLORS } from "@/lib/data/clothing";
import { LucideIcon } from "@/components/ui/LucideIcon";
import { AccordionSection, useAccordion } from "./AccordionSection";
import { PillTagInput, type Pill } from "./PillTagInput";
import { ColorPickerInput } from "./ColorPickerInput";

export function GarmentPhase() {
  const garmentType = useClothingStore((s) => s.garmentType);
  const setGarmentType = useClothingStore((s) => s.setGarmentType);
  const printSize = useClothingStore((s) => s.printSize);
  const setPrintSize = useClothingStore((s) => s.setPrintSize);
  const garmentColor = useClothingStore((s) => s.garmentColor);
  const setGarmentColor = useClothingStore((s) => s.setGarmentColor);
  const customGarmentColors = useClothingStore((s) => s.customGarmentColors);
  const addCustomGarmentColor = useClothingStore((s) => s.addCustomGarmentColor);
  const removeCustomGarmentColor = useClothingStore((s) => s.removeCustomGarmentColor);
  const setCustomGarmentColors = useClothingStore((s) => s.setCustomGarmentColors);
  const customTags = useClothingStore((s) => s.customTags);
  const addCustomTag = useClothingStore((s) => s.addCustomTag);
  const removeCustomTag = useClothingStore((s) => s.removeCustomTag);

  const [openId, toggle] = useAccordion("garment-type");

  const garmentBadge = garmentType
    ? GARMENT_TYPES.find((g) => g.id === garmentType)?.label
    : undefined;
  const sizeBadge = printSize
    ? PRINT_SIZES.find((p) => p.id === printSize)?.label
    : undefined;
  const colorBadge = garmentColor
    ? GARMENT_COLORS.find((c) => c.id === garmentColor)?.label
    : customGarmentColors.length > 0
      ? `${customGarmentColors.length} custom`
      : undefined;

  const garmentPills = useMemo<Pill[]>(() => {
    const selected: Pill[] = garmentType
      ? [{ id: garmentType, label: GARMENT_TYPES.find((g) => g.id === garmentType)?.label ?? garmentType, type: "selected" }]
      : [];
    const custom: Pill[] = (customTags["garment-type"] ?? []).map((t) => ({ id: t, label: t, type: "custom" }));
    return [...selected, ...custom];
  }, [garmentType, customTags]);

  const sizePills = useMemo<Pill[]>(() => {
    const selected: Pill[] = printSize
      ? [{ id: printSize, label: PRINT_SIZES.find((p) => p.id === printSize)?.label ?? printSize, type: "selected" }]
      : [];
    const custom: Pill[] = (customTags["print-size"] ?? []).map((t) => ({ id: t, label: t, type: "custom" }));
    return [...selected, ...custom];
  }, [printSize, customTags]);

  const colorPills = useMemo<Pill[]>(() => {
    const selected: Pill[] = garmentColor
      ? [{ id: garmentColor, label: GARMENT_COLORS.find((c) => c.id === garmentColor)?.label ?? garmentColor, type: "selected" }]
      : [];
    return selected;
  }, [garmentColor]);

  return (
    <div className="border border-accent/8 bg-bg-2 overflow-hidden rounded-[var(--radius-lg)]">
      {/* Garment Type */}
      <AccordionSection
        id="garment-type"
        title="Garment Type"
        description="Choose what you're designing the print for"
        badge={garmentBadge}
        isOpen={openId === "garment-type"}
        onToggle={toggle}
      >
        <PillTagInput
          pills={garmentPills}
          onRemove={(pill) => pill.type === "selected" ? setGarmentType(null) : removeCustomTag("garment-type", pill.id)}
          onAddCustom={(text) => addCustomTag("garment-type", text)}
          placeholder="Type a custom garment and press Enter…"
        />
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
          {GARMENT_TYPES.map((g) => {
            const isActive = garmentType === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setGarmentType(isActive ? null : g.id)}
                className={clsx(
                  "flex flex-col items-center gap-1.5 px-2 py-3 border transition-all duration-150 cursor-pointer rounded-[var(--radius-md)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                  isActive
                    ? "bg-accent/10 border-accent/30 text-accent"
                    : "bg-surface border-transparent text-text-2 hover:bg-bg-3 hover:text-text-1",
                )}
              >
                <LucideIcon name={g.icon} className="w-5 h-5" />
                <span className="text-[11px] font-medium text-center leading-tight">{g.label}</span>
              </button>
            );
          })}
        </div>
      </AccordionSection>

      {/* Print Size */}
      <AccordionSection
        id="print-size"
        title="Print Size"
        description="How big the design should be on the garment"
        badge={sizeBadge}
        isOpen={openId === "print-size"}
        onToggle={toggle}
      >
        <PillTagInput
          pills={sizePills}
          onRemove={(pill) => pill.type === "selected" ? setPrintSize(null) : removeCustomTag("print-size", pill.id)}
          onAddCustom={(text) => addCustomTag("print-size", text)}
          placeholder="Type a custom size and press Enter…"
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {PRINT_SIZES.map((ps) => (
            <button
              key={ps.id}
              onClick={() => setPrintSize(printSize === ps.id ? null : ps.id)}
              className={clsx(
                "flex flex-col items-start px-3 py-2 border transition-all duration-150 cursor-pointer rounded-[var(--radius-md)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                printSize === ps.id
                  ? "bg-accent/10 border-accent/30"
                  : "bg-surface border-transparent hover:bg-bg-3",
              )}
            >
              <span className={clsx("text-xs font-medium", printSize === ps.id ? "text-accent" : "text-text-1")}>
                {ps.label}
              </span>
              <span className="text-[10px] text-text-3">{ps.dimensions}</span>
            </button>
          ))}
        </div>
      </AccordionSection>

      {/* Garment Color */}
      <AccordionSection
        id="garment-color"
        title="Garment Color"
        description="Base color of the garment — affects background contrast"
        badge={colorBadge}
        isOpen={openId === "garment-color"}
        onToggle={toggle}
      >
        {/* Selected garment color pill */}
        {garmentColor && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full bg-accent/15 text-accent border border-accent/20">
              <span
                className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                style={{ backgroundColor: GARMENT_COLORS.find((c) => c.id === garmentColor)?.hex }}
              />
              {GARMENT_COLORS.find((c) => c.id === garmentColor)?.label ?? garmentColor}
              <button
                onClick={() => setGarmentColor(null)}
                className="ml-0.5 hover:text-accent/70 transition-colors duration-150 cursor-pointer"
                aria-label="Remove garment color"
              >
                ×
              </button>
            </span>
          </div>
        )}

        {/* Preset colors */}
        <div className="flex flex-wrap gap-2">
          {GARMENT_COLORS.map((gc) => (
            <button
              key={gc.id}
              onClick={() => setGarmentColor(garmentColor === gc.id ? null : gc.id)}
              className={clsx(
                "flex items-center gap-2 px-3 py-2 border transition-all duration-150 cursor-pointer rounded-full",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                garmentColor === gc.id
                  ? "bg-accent/10 border-accent/30"
                  : "bg-surface border-transparent hover:bg-bg-3",
              )}
            >
              <span
                className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                style={{ backgroundColor: gc.hex }}
              />
              <span className={clsx("text-xs font-medium", garmentColor === gc.id ? "text-accent" : "text-text-2")}>
                {gc.label}
              </span>
            </button>
          ))}
        </div>

        {/* Custom color picker */}
        <div className="mt-3">
          <ColorPickerInput
            colors={customGarmentColors}
            onAdd={addCustomGarmentColor}
            onRemove={removeCustomGarmentColor}
            onClear={() => setCustomGarmentColors([])}
            label="Custom Colors"
          />
        </div>
      </AccordionSection>
    </div>
  );
}
