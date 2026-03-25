import type { PrintMethod } from "./print-methods";
import { getPrintMethodById } from "./print-methods";
import { GARMENT_COLORS } from "./garments";

export type ClothingWarning = {
  severity: "info" | "warning" | "error";
  message: string;
};

type WarningInput = {
  printMethod: string | null;
  garmentColor: string | null;
  artStyles: string[];
  colorPalette: string | null;
  placements: string[];
  detailLevel: string | null;
  printSize: string | null;
  layout: string | null;
  outputQuality: string | null;
};

/**
 * Returns contextual warnings based on cross-phase conflicts.
 * Advisory only — never blocks the user.
 */
export function getClothingWarnings(input: WarningInput): ClothingWarning[] {
  const warnings: ClothingWarning[] = [];
  const method = input.printMethod ? getPrintMethodById(input.printMethod) : null;

  if (method) {
    checkSublimationConflicts(method, input, warnings);
    checkArtStyleConflicts(method, input.artStyles, warnings);
    checkColorPaletteConflicts(method, input.colorPalette, warnings);
    checkDetailConflicts(method, input, warnings);
    checkSublimationPlacement(method, input, warnings);
  }

  checkPlacementSize(input, warnings);
  checkPatternTile(input, warnings);

  return warnings;
}

function checkSublimationConflicts(method: PrintMethod, input: WarningInput, warnings: ClothingWarning[]) {
  if (method.id !== "sublimation") return;

  const color = GARMENT_COLORS.find((c) => c.id === input.garmentColor);
  if (color && color.tone === "dark") {
    warnings.push({
      severity: "warning",
      message: "Sublimation only works on white/light polyester. Dark garment colors will block the print.",
    });
  }
}

function checkArtStyleConflicts(method: PrintMethod, artStyles: string[], warnings: ClothingWarning[]) {
  for (const styleId of artStyles) {
    const warning = method.artStyleWarnings[styleId];
    if (warning) {
      warnings.push({ severity: "warning", message: warning });
    }
  }
}

function checkColorPaletteConflicts(method: PrintMethod, palette: string | null, warnings: ClothingWarning[]) {
  if (!palette) return;

  if (method.id === "screen-print" && palette === "full-color") {
    warnings.push({
      severity: "warning",
      message: "Screen print works best with limited colors. Consider Monochrome or Duotone for cleaner results.",
    });
  }

  if (method.id === "vinyl-htv" && !["monochrome", "duotone", "black-white"].includes(palette)) {
    warnings.push({
      severity: "info",
      message: "Vinyl/HTV supports 1–3 color layers. Simpler palettes produce better results.",
    });
  }
}

function checkDetailConflicts(method: PrintMethod, input: WarningInput, warnings: ClothingWarning[]) {
  if (input.detailLevel !== "highly-detailed") return;

  const lowDetailMethods = ["screen-print", "embroidery", "vinyl-htv", "puff-print"];
  if (lowDetailMethods.includes(method.id)) {
    warnings.push({
      severity: "info",
      message: `Highly detailed designs may not print well with ${method.label}. Consider Moderate or Minimal detail.`,
    });
  }
}

function checkPlacementSize(input: WarningInput, warnings: ClothingWarning[]) {
  if (input.placements.includes("left-chest") && input.printSize === "oversized") {
    warnings.push({
      severity: "warning",
      message: "Oversized prints don't fit on left chest placement. Consider Standard or smaller.",
    });
  }

  if (input.placements.includes("all-over") && input.printSize !== "full-panel") {
    warnings.push({
      severity: "info",
      message: "All-over placement works best with Full Panel size.",
    });
  }
}

function checkSublimationPlacement(method: PrintMethod, input: WarningInput, warnings: ClothingWarning[]) {
  if (method.id !== "sublimation") return;

  const smallPlacements = ["left-chest", "right-chest", "sleeve-l", "sleeve-r"];
  const hasSmallPlacement = input.placements.some((p) => smallPlacements.includes(p));
  if (hasSmallPlacement) {
    warnings.push({
      severity: "info",
      message: "Sublimation is best for large areas or all-over prints. Small placements may not be worth the setup cost.",
    });
  }
}

function checkPatternTile(input: WarningInput, warnings: ClothingWarning[]) {
  if (input.layout === "repeating-pattern" && input.outputQuality !== "pattern-tile") {
    warnings.push({
      severity: "info",
      message: "You chose a repeating pattern layout — consider setting Output Quality to 'Pattern Tile' for seamless tiling.",
    });
  }
}
