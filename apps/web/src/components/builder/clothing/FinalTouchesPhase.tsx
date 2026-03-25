"use client";

import { useMemo } from "react";
import { clsx } from "clsx";
import { useClothingStore } from "@/lib/store/clothing-store";
import {
  CLOTHING_BACKGROUNDS,
  OUTPUT_QUALITIES,
  getAutoBackground,
  GARMENT_COLORS,
  NEGATIVE_PRESETS,
  getPrintMethodById,
} from "@/lib/data/clothing";
import { Textarea } from "@/components/ui/textarea";
import { AccordionSection, useAccordion } from "./AccordionSection";
import { PillTagInput, type Pill } from "./PillTagInput";
import { ColorPickerInput } from "./ColorPickerInput";

export function FinalTouchesPhase() {
  const background = useClothingStore((s) => s.background);
  const setBackground = useClothingStore((s) => s.setBackground);
  const customBackgroundColors = useClothingStore((s) => s.customBackgroundColors);
  const addCustomBackgroundColor = useClothingStore((s) => s.addCustomBackgroundColor);
  const removeCustomBackgroundColor = useClothingStore((s) => s.removeCustomBackgroundColor);
  const setCustomBackgroundColors = useClothingStore((s) => s.setCustomBackgroundColors);
  const outputQuality = useClothingStore((s) => s.outputQuality);
  const setOutputQuality = useClothingStore((s) => s.setOutputQuality);
  const extraNotes = useClothingStore((s) => s.extraNotes);
  const setExtraNotes = useClothingStore((s) => s.setExtraNotes);
  const garmentColor = useClothingStore((s) => s.garmentColor);
  const printMethod = useClothingStore((s) => s.printMethod);
  const customTags = useClothingStore((s) => s.customTags);
  const addCustomTag = useClothingStore((s) => s.addCustomTag);
  const removeCustomTag = useClothingStore((s) => s.removeCustomTag);

  const [openId, toggle] = useAccordion("background");

  const garmentTone = useMemo(() => {
    const gc = GARMENT_COLORS.find((c) => c.id === garmentColor);
    return gc?.tone ?? null;
  }, [garmentColor]);

  const autoBg = getAutoBackground(garmentTone);

  const bgPills = useMemo(() => {
    const selected: Pill[] = background
      ? [{ id: background, label: CLOTHING_BACKGROUNDS.find((b) => b.id === background)?.label ?? background, type: "selected" }]
      : [];
    return selected;
  }, [background]);

  const qualityPills = useMemo(() => {
    const selected: Pill[] = outputQuality
      ? [{ id: outputQuality, label: OUTPUT_QUALITIES.find((q) => q.id === outputQuality)?.label ?? outputQuality, type: "selected" }]
      : [];
    const custom: Pill[] = (customTags["output-quality"] ?? []).map((t) => ({ id: t, label: t, type: "custom" }));
    return [...selected, ...custom];
  }, [outputQuality, customTags]);

  const pm = useMemo(() => (printMethod ? getPrintMethodById(printMethod) : null), [printMethod]);
  const autoNegatives = pm?.autoNegatives ?? [];

  const negativePills = useMemo<Pill[]>(() => {
    const custom: Pill[] = (customTags["negatives"] ?? []).map((t) => ({
      id: t,
      label: t,
      type: "custom" as const,
    }));
    return custom;
  }, [customTags]);

  const bgBadge = background
    ? CLOTHING_BACKGROUNDS.find((b) => b.id === background)?.label
    : garmentColor
      ? `Auto: ${autoBg}`
      : undefined;
  const qualityBadge = outputQuality
    ? OUTPUT_QUALITIES.find((q) => q.id === outputQuality)?.label
    : undefined;
  const notesBadge = extraNotes.trim() ? "Has notes" : undefined;
  const negativesBadge = (autoNegatives.length + negativePills.length) > 0
    ? `${autoNegatives.length + negativePills.length} excluded`
    : undefined;

  return (
    <div className="border border-accent/8 bg-bg-2 overflow-hidden rounded-[var(--radius-lg)]">
      {/* Background */}
      <AccordionSection
        id="background"
        title="Background"
        description="The background behind your garment or design"
        badge={bgBadge}
        isOpen={openId === "background"}
        onToggle={toggle}
      >
        {/* Selected background pill */}
        {background && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full bg-accent/15 text-accent border border-accent/20">
              <span
                className="w-3 h-3 rounded-md border border-white/20 shrink-0"
                style={{ backgroundColor: CLOTHING_BACKGROUNDS.find((b) => b.id === background)?.hex }}
              />
              {CLOTHING_BACKGROUNDS.find((b) => b.id === background)?.label ?? background}
              <button
                onClick={() => setBackground(null)}
                className="ml-0.5 hover:text-accent/70 transition-colors duration-150 cursor-pointer"
                aria-label="Remove background"
              >
                ×
              </button>
            </span>
          </div>
        )}

        <div className="flex gap-2">
          {CLOTHING_BACKGROUNDS.map((bg) => (
            <button
              key={bg.id}
              onClick={() => setBackground(background === bg.id ? null : bg.id)}
              className={clsx(
                "flex items-center gap-2 px-3 py-2 border transition-all duration-150 cursor-pointer rounded-[var(--radius-md)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                background === bg.id
                  ? "bg-accent/10 border-accent/30"
                  : "bg-surface border-transparent hover:bg-bg-3",
              )}
            >
              <span
                className="w-5 h-5 rounded-md border border-white/20 shrink-0"
                style={{ backgroundColor: bg.hex }}
              />
              <span className={clsx("text-xs font-medium", background === bg.id ? "text-accent" : "text-text-2")}>
                {bg.label}
              </span>
            </button>
          ))}
        </div>
        {!background && garmentColor && (
          <p className="text-[10px] text-text-3 mt-2">
            Background auto-selected based on garment color. Override by selecting above.
          </p>
        )}

        {/* Custom background colors */}
        <div className="mt-3">
          <ColorPickerInput
            colors={customBackgroundColors}
            onAdd={addCustomBackgroundColor}
            onRemove={removeCustomBackgroundColor}
            onClear={() => setCustomBackgroundColors([])}
            label="Custom Background Colors"
          />
        </div>
      </AccordionSection>

      {/* Output Quality */}
      <AccordionSection
        id="output-quality"
        title="Output Quality"
        description="Resolution and rendering quality settings"
        badge={qualityBadge}
        isOpen={openId === "output-quality"}
        onToggle={toggle}
      >
        <PillTagInput
          pills={qualityPills}
          onRemove={(pill) => pill.type === "selected" ? setOutputQuality(null) : removeCustomTag("output-quality", pill.id)}
          onAddCustom={(text) => addCustomTag("output-quality", text)}
          placeholder="Add custom quality tag…"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
          {OUTPUT_QUALITIES.map((oq) => (
            <button
              key={oq.id}
              onClick={() => setOutputQuality(outputQuality === oq.id ? null : oq.id)}
              className={clsx(
                "flex flex-col items-start p-3 border transition-all duration-150 cursor-pointer rounded-[var(--radius-md)] text-left",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                outputQuality === oq.id
                  ? "bg-accent/10 border-accent/30"
                  : "bg-surface border-transparent hover:bg-bg-3",
              )}
            >
              <span className={clsx("text-xs font-medium", outputQuality === oq.id ? "text-accent" : "text-text-1")}>
                {oq.label}
              </span>
              <span className="text-[10px] text-text-3 mt-0.5 leading-snug">{oq.description}</span>
            </button>
          ))}
        </div>
      </AccordionSection>

      {/* Things to Avoid */}
      <AccordionSection
        id="negatives"
        title="Things to Avoid"
        description="Elements the AI should exclude from the design"
        badge={negativesBadge}
        isOpen={openId === "negatives"}
        onToggle={toggle}
      >
        {autoNegatives.length > 0 && (
          <div className="mb-3">
            <p className="text-[10px] text-text-3 mb-1.5">Auto-excluded by print method (locked)</p>
            <div className="flex flex-wrap gap-1.5">
              {autoNegatives.map((neg) => (
                <span
                  key={neg}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full bg-bg-3 text-text-3 border border-glass-border"
                >
                  {neg}
                </span>
              ))}
            </div>
          </div>
        )}
        <PillTagInput
          pills={negativePills}
          onRemove={(pill) => removeCustomTag("negatives", pill.id)}
          onAddCustom={(text) => addCustomTag("negatives", text)}
          placeholder="Add custom: e.g., watermark, border, frame…"
        />
        <div className="flex flex-wrap gap-1.5 mt-3">
          {NEGATIVE_PRESETS.map((np) => {
            const isActive = (customTags["negatives"] ?? []).includes(np.id);
            const isAutoLocked = autoNegatives.includes(np.id);
            if (isAutoLocked) return null;
            return (
              <button
                key={np.id}
                onClick={() => isActive ? removeCustomTag("negatives", np.id) : addCustomTag("negatives", np.id)}
                className={clsx(
                  "px-2.5 py-1 text-[11px] font-medium border transition-all duration-150 cursor-pointer rounded-full",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                  isActive
                    ? "bg-accent/15 text-accent border-accent/30"
                    : "bg-surface text-text-3 border-transparent hover:text-text-2 hover:bg-bg-3",
                )}
              >
                {np.label}
              </button>
            );
          })}
        </div>
      </AccordionSection>

      {/* Extra Notes */}
      <AccordionSection
        id="extra-notes"
        title="Extra Notes"
        description="Any additional instructions or context for the AI"
        badge={notesBadge}
        isOpen={openId === "extra-notes"}
        onToggle={toggle}
      >
        <Textarea
          placeholder="Any additional instructions for the AI…"
          value={extraNotes}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setExtraNotes(e.target.value)}
          rows={3}
          className="bg-bg-input border-glass-border text-text-1 placeholder:text-text-3 rounded-[var(--radius-md)] focus-visible:ring-1 focus-visible:ring-accent/50 focus-visible:border-accent text-xs resize-none"
        />
      </AccordionSection>
    </div>
  );
}
