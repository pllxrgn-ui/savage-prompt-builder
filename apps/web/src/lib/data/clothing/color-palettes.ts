export type ClothingColorPalette = {
  id: string;
  label: string;
};

export const CLOTHING_COLOR_PALETTES: ClothingColorPalette[] = [
  { id: "full-color", label: "Full Color" },
  { id: "monochrome", label: "Monochrome (1 color)" },
  { id: "duotone", label: "Duotone (2 colors)" },
  { id: "earth-tones", label: "Earth Tones" },
  { id: "neon-fluorescent", label: "Neon / Fluorescent" },
  { id: "pastel", label: "Pastel" },
  { id: "black-white", label: "Black & White" },
  { id: "metallic-foil", label: "Metallic / Foil Look" },
  { id: "muted-desaturated", label: "Muted / Desaturated" },
  { id: "high-contrast", label: "High Contrast" },
  { id: "custom", label: "Custom Palette (picker)" },
] as const;
