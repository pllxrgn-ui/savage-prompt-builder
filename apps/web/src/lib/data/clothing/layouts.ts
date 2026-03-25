export type ClothingLayout = {
  id: string;
  label: string;
  description: string;
};

export const CLOTHING_LAYOUTS: ClothingLayout[] = [
  { id: "centered-icon", label: "Centered Icon", description: "One subject placed in the center" },
  { id: "badge-emblem", label: "Badge / Emblem / Crest", description: "Circular crest or emblem composition" },
  { id: "scene-landscape", label: "Scene / Landscape", description: "Full scene with background environment" },
  { id: "repeating-pattern", label: "Repeating Pattern", description: "Seamless tiling for all-over prints" },
  { id: "typography-dominant", label: "Typography-Dominant", description: "Text is the main visual element" },
  { id: "mixed-type-illustration", label: "Mixed Type + Illustration", description: "Balanced text and artwork together" },
  { id: "asymmetric", label: "Asymmetric", description: "Off-center dynamic placement" },
  { id: "stacked-vertical", label: "Stacked Vertical", description: "Elements stacked top to bottom" },
] as const;
