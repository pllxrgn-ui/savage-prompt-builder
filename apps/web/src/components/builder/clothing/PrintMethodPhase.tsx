"use client";

import { useMemo } from "react";
import { useClothingStore } from "@/lib/store/clothing-store";
import { PRINT_METHODS, getClothingWarnings, type ClothingWarning } from "@/lib/data/clothing";
import { PrintMethodCard } from "./PrintMethodCard";
import { AlertTriangle, Info } from "lucide-react";
import { clsx } from "clsx";
import { AccordionSection, useAccordion } from "./AccordionSection";
import { PillTagInput, type Pill } from "./PillTagInput";

export function PrintMethodPhase() {
  const printMethod = useClothingStore((s) => s.printMethod);
  const setPrintMethod = useClothingStore((s) => s.setPrintMethod);
  const artStyles = useClothingStore((s) => s.artStyles);
  const garmentColor = useClothingStore((s) => s.garmentColor);
  const colorPalette = useClothingStore((s) => s.colorPalette);
  const placements = useClothingStore((s) => s.placements);
  const detailLevel = useClothingStore((s) => s.detailLevel);
  const printSize = useClothingStore((s) => s.printSize);
  const layout = useClothingStore((s) => s.layout);
  const outputQuality = useClothingStore((s) => s.outputQuality);
  const customTags = useClothingStore((s) => s.customTags);
  const addCustomTag = useClothingStore((s) => s.addCustomTag);
  const removeCustomTag = useClothingStore((s) => s.removeCustomTag);

  const [openId, toggle] = useAccordion("print-method");

  const methodBadge = printMethod
    ? PRINT_METHODS.find((m) => m.id === printMethod)?.label
    : undefined;

  const methodPills = useMemo<Pill[]>(() => {
    const selected: Pill[] = printMethod
      ? [{ id: printMethod, label: PRINT_METHODS.find((m) => m.id === printMethod)?.label ?? printMethod, type: "selected" }]
      : [];
    const custom: Pill[] = (customTags["print-method"] ?? []).map((t) => ({ id: t, label: t, type: "custom" }));
    return [...selected, ...custom];
  }, [printMethod, customTags]);

  const warnings = useMemo<ClothingWarning[]>(
    () =>
      getClothingWarnings({
        printMethod,
        garmentColor,
        artStyles,
        colorPalette,
        placements,
        detailLevel,
        printSize,
        layout,
        outputQuality,
      }),
    [printMethod, garmentColor, artStyles, colorPalette, placements, detailLevel, printSize, layout, outputQuality],
  );

  return (
    <div className="space-y-3">
      <div className="border border-accent/8 bg-bg-2 overflow-hidden rounded-[var(--radius-lg)]">
        <AccordionSection
          id="print-method"
          title="Print Method"
          description="Choose a print technique — affects detail and color limits"
          badge={methodBadge}
          isOpen={openId === "print-method"}
          onToggle={toggle}
        >
          <PillTagInput
            pills={methodPills}
            onRemove={(pill) => pill.type === "selected" ? setPrintMethod(null) : removeCustomTag("print-method", pill.id)}
            onAddCustom={(text) => addCustomTag("print-method", text)}
            placeholder="Type a custom print method and press Enter…"
          />
          <div className="space-y-2 mt-3">
            {PRINT_METHODS.map((method) => (
              <PrintMethodCard
                key={method.id}
                method={method}
                isSelected={printMethod === method.id}
                onSelect={() => setPrintMethod(printMethod === method.id ? null : method.id)}
              />
            ))}
          </div>
        </AccordionSection>
      </div>

      {/* Warnings — always visible */}
      {warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map((w, i) => (
            <div
              key={i}
              className={clsx(
                "flex items-start gap-2 px-3 py-2 rounded-[var(--radius-md)] text-[11px] leading-snug border",
                w.severity === "warning" && "bg-yellow-500/5 border-yellow-500/15 text-yellow-300",
                w.severity === "error" && "bg-red-500/5 border-red-500/15 text-red-300",
                w.severity === "info" && "bg-sky-500/5 border-sky-500/15 text-sky-300",
              )}
            >
              {w.severity === "info" ? (
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              )}
              <span>{w.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
