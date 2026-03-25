export type ClothingBackground = {
  id: string;
  label: string;
  hex: string;
};

export const CLOTHING_BACKGROUNDS: ClothingBackground[] = [
  { id: "white", label: "Solid White (#FFFFFF)", hex: "#FFFFFF" },
  { id: "black", label: "Solid Black (#000000)", hex: "#000000" },
] as const;

/**
 * Auto-selects background based on garment color tone.
 * Dark garments → white background (design visibility).
 * Light garments → black background.
 * Medium garments → white (safe default).
 */
export function getAutoBackground(garmentColorTone: "dark" | "light" | "medium" | null): string {
  if (garmentColorTone === "light") return "black";
  if (garmentColorTone === "dark") return "white";
  return "white"; // medium or null → safe default
}
