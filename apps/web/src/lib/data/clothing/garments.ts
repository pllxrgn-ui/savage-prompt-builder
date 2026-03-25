export type GarmentType = {
  id: string;
  label: string;
  icon: string;
};

export const GARMENT_TYPES: GarmentType[] = [
  { id: "t-shirt", label: "T-shirt", icon: "ph:TShirt" },
  { id: "hoodie", label: "Hoodie", icon: "ph:Hoodie" },
  { id: "tank-top", label: "Tank Top", icon: "garment:TankTop" },
  { id: "crewneck", label: "Crewneck", icon: "ph:ShirtFolded" },
  { id: "long-sleeve", label: "Long Sleeve", icon: "garment:LongSleeve" },
  { id: "joggers", label: "Joggers", icon: "ph:Pants" },
  { id: "shorts", label: "Shorts", icon: "garment:Shorts" },
  { id: "cap-hat", label: "Cap / Hat", icon: "ph:BaseballCap" },
  { id: "tote-bag", label: "Tote Bag", icon: "ph:Tote" },
  { id: "jacket", label: "Jacket", icon: "garment:Jacket" },
  { id: "jersey", label: "Jersey", icon: "garment:Jersey" },
] as const;

export type Placement = {
  id: string;
  label: string;
};

export const PLACEMENTS: Placement[] = [
  { id: "front-center", label: "Front Center" },
  { id: "back-center", label: "Back Center" },
  { id: "left-chest", label: "Left Chest" },
  { id: "right-chest", label: "Right Chest" },
  { id: "full-front", label: "Full Front" },
  { id: "full-back", label: "Full Back" },
  { id: "sleeve-l", label: "Sleeve (L)" },
  { id: "sleeve-r", label: "Sleeve (R)" },
  { id: "hood-panel", label: "Hood Panel" },
  { id: "all-over", label: "All-Over" },
] as const;

export type PrintSize = {
  id: string;
  label: string;
  dimensions: string;
};

export const PRINT_SIZES: PrintSize[] = [
  { id: "small-badge", label: "Small / Badge", dimensions: "~3×3\"" },
  { id: "medium", label: "Medium", dimensions: "~8×10\"" },
  { id: "standard", label: "Standard", dimensions: "~10×12\"" },
  { id: "oversized", label: "Oversized", dimensions: "~14×16\"" },
  { id: "full-panel", label: "Full Panel (all-over)", dimensions: "edge to edge" },
] as const;

export type GarmentColor = {
  id: string;
  label: string;
  hex: string;
  tone: "dark" | "light" | "medium";
};

export const GARMENT_COLORS: GarmentColor[] = [
  { id: "black", label: "Black", hex: "#000000", tone: "dark" },
  { id: "white", label: "White", hex: "#FFFFFF", tone: "light" },
  { id: "navy", label: "Navy", hex: "#1B2A4A", tone: "dark" },
  { id: "heather-gray", label: "Heather Gray", hex: "#9CA3AF", tone: "medium" },
  { id: "red", label: "Red", hex: "#DC2626", tone: "medium" },
  { id: "forest-green", label: "Forest Green", hex: "#166534", tone: "dark" },
  { id: "sand-tan", label: "Sand / Tan", hex: "#D4A574", tone: "light" },
  { id: "royal-blue", label: "Royal Blue", hex: "#2563EB", tone: "medium" },
] as const;
