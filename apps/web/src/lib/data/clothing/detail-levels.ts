export type DetailLevel = {
  id: string;
  label: string;
  description: string;
};

export const DETAIL_LEVELS: DetailLevel[] = [
  { id: "minimal", label: "Minimal / Clean", description: "Simple shapes, few elements — best for small prints and screen print" },
  { id: "moderate", label: "Moderate Detail", description: "Balanced complexity — works with most print methods and sizes" },
  { id: "highly-detailed", label: "Highly Detailed", description: "Intricate linework and textures — best for DTF/DTG at larger sizes" },
] as const;
