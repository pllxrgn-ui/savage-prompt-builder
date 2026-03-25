export type OutputQuality = {
  id: string;
  label: string;
  description: string;
};

export const OUTPUT_QUALITIES: OutputQuality[] = [
  { id: "print-ready", label: "Print-Ready", description: "Production quality — maximum resolution and detail" },
  { id: "quick-preview", label: "Quick Preview", description: "Draft quality — faster generation for iteration" },
  { id: "pattern-tile", label: "Pattern Tile", description: "Seamless repeating tile for all-over prints" },
] as const;
