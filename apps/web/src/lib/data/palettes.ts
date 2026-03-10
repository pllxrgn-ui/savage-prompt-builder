import type { Palette } from "@/types";

export const PALETTES: Palette[] = [
  // --- Warm ---
  { id: "sunset-glow", name: "Sunset Glow", colors: ["#FF6B35", "#FF4D6D", "#FFC947", "#FFE66D"], tags: ["warm", "vibrant"] },
  { id: "autumn-harvest", name: "Autumn Harvest", colors: ["#8B4513", "#D2691E", "#CD853F", "#DEB887"], tags: ["warm", "natural"] },
  { id: "terracotta", name: "Terracotta", colors: ["#E07A5F", "#3D405B", "#81B29A", "#F2CC8F"], tags: ["warm", "earthy"] },
  { id: "golden-hour", name: "Golden Hour", colors: ["#FFB347", "#FFCC33", "#FF6F61", "#FFD700"], tags: ["warm", "golden"] },
  { id: "ember", name: "Ember", colors: ["#FF4500", "#FF6347", "#FF7F50", "#FFA07A"], tags: ["warm", "fire"] },
  { id: "sahara", name: "Sahara", colors: ["#C19A6B", "#A67B5B", "#6F4E37", "#E8D4B8"], tags: ["warm", "desert"] },
  { id: "clay", name: "Clay Studio", colors: ["#B85C38", "#E08F62", "#F2DCC9", "#5C3D2E"], tags: ["warm", "muted"] },
  { id: "cinnamon", name: "Cinnamon", colors: ["#D2691E", "#8B4513", "#F4A460", "#FFDAB9"], tags: ["warm", "spice"] },
  { id: "campfire", name: "Campfire", colors: ["#FF4500", "#8B0000", "#DAA520", "#2F1B0E"], tags: ["warm", "dark"] },

  // --- Cool ---
  { id: "ocean-deep", name: "Ocean Deep", colors: ["#0A2463", "#1E6091", "#168AAD", "#34E0A1"], tags: ["cool", "ocean"] },
  { id: "arctic", name: "Arctic", colors: ["#CAF0F8", "#90E0EF", "#00B4D8", "#0077B6"], tags: ["cool", "icy"] },
  { id: "midnight", name: "Midnight", colors: ["#0D1B2A", "#1B2838", "#415A77", "#778DA9"], tags: ["cool", "dark"] },
  { id: "pacific", name: "Pacific", colors: ["#006D77", "#83C5BE", "#EDF6F9", "#FFDDD2"], tags: ["cool", "serene"] },
  { id: "frost", name: "Frost", colors: ["#E8F1F8", "#B8D8E8", "#6BA4C8", "#2B6A99"], tags: ["cool", "light"] },
  { id: "deep-sea", name: "Deep Sea", colors: ["#0B132B", "#1C2541", "#3A506B", "#5BC0BE"], tags: ["cool", "dark"] },
  { id: "glacier", name: "Glacier", colors: ["#70D6FF", "#C7F9CC", "#FFFFFF", "#E8F7F0"], tags: ["cool", "fresh"] },
  { id: "rain", name: "Rainy Day", colors: ["#4A5568", "#718096", "#A0AEC0", "#CBD5E0"], tags: ["cool", "gray"] },
  { id: "sapphire", name: "Sapphire", colors: ["#0F3460", "#16537E", "#1A759F", "#48BFE3"], tags: ["cool", "royal"] },

  // --- Neon & Vibrant ---
  { id: "cyberpunk", name: "Cyberpunk", colors: ["#FF006E", "#8338EC", "#3A86FF", "#00F5D4"], tags: ["neon", "vibrant"] },
  { id: "synthwave", name: "Synthwave", colors: ["#FF00FF", "#00FFFF", "#FF1493", "#7B2FBE"], tags: ["neon", "retro"] },
  { id: "vaporwave", name: "Vaporwave", colors: ["#FF71CE", "#01CDFE", "#05FFA1", "#B967FF"], tags: ["neon", "aesthetic"] },
  { id: "neon-tokyo", name: "Neon Tokyo", colors: ["#FF2D95", "#4611F7", "#00D4FF", "#1B001F"], tags: ["neon", "urban"] },
  { id: "electric", name: "Electric", colors: ["#FFBE0B", "#FB5607", "#FF006E", "#8338EC"], tags: ["vibrant", "bold"] },
  { id: "candy", name: "Candy Pop", colors: ["#FF6B6B", "#FFA3D7", "#C084FC", "#67E8F9"], tags: ["vibrant", "playful"] },
  { id: "rave", name: "Rave", colors: ["#39FF14", "#FF073A", "#7DF9FF", "#FFD300"], tags: ["neon", "loud"] },
  { id: "holographic", name: "Holographic", colors: ["#FF75A0", "#FCE38A", "#95E1D3", "#B088F9"], tags: ["neon", "iridescent"] },

  // --- Pastel ---
  { id: "soft-morning", name: "Soft Morning", colors: ["#FFD6E0", "#FFDFBA", "#FFFFBA", "#BAFFC9"], tags: ["pastel", "light"] },
  { id: "lavender-haze", name: "Lavender Haze", colors: ["#E2C2FF", "#C9B1FF", "#FFB1C8", "#FFE5EC"], tags: ["pastel", "purple"] },
  { id: "cotton-candy", name: "Cotton Candy", colors: ["#FFB5DA", "#C2E7FF", "#FFF5BA", "#D5FDCB"], tags: ["pastel", "sweet"] },
  { id: "peach-cream", name: "Peach & Cream", colors: ["#FFDAC1", "#FFB7B2", "#B5EAD7", "#E2F0CB"], tags: ["pastel", "warm"] },
  { id: "serenity", name: "Serenity", colors: ["#F0E6EF", "#D4C5E2", "#9AC8EB", "#95D9DA"], tags: ["pastel", "calm"] },
  { id: "macaron", name: "Macaron", colors: ["#FFD3E1", "#B8E0D2", "#D6EADF", "#EAC4D5"], tags: ["pastel", "french"] },
  { id: "baby", name: "Baby Blush", colors: ["#FFC3D0", "#E8D3E8", "#C5DDFF", "#E8F0E8"], tags: ["pastel", "soft"] },

  // --- Earth tones ---
  { id: "forest", name: "Forest Floor", colors: ["#2D3A25", "#4A6741", "#8CAA7E", "#CDD5AE"], tags: ["earth", "green"] },
  { id: "desert-rose", name: "Desert Rose", colors: ["#C09078", "#BB8378", "#D4A99A", "#ECD4C8"], tags: ["earth", "pink"] },
  { id: "stone", name: "Natural Stone", colors: ["#8D8D8D", "#B0A999", "#D4C5A9", "#E8DCC8"], tags: ["earth", "neutral"] },
  { id: "olive-garden", name: "Olive Garden", colors: ["#606C38", "#283618", "#DDA15E", "#BC6C25"], tags: ["earth", "olive"] },
  { id: "mushroom", name: "Mushroom", colors: ["#5C4033", "#8B6F4E", "#C4A570", "#E8D5B7"], tags: ["earth", "brown"] },
  { id: "moss", name: "Moss & Lichen", colors: ["#4A5940", "#7D8471", "#AAB396", "#D4D6C8"], tags: ["earth", "organic"] },
  { id: "driftwood", name: "Driftwood", colors: ["#8E8D8A", "#A3A099", "#D5D0C8", "#EBE8E1"], tags: ["earth", "gray"] },

  // --- Monochrome & Minimal ---
  { id: "noir", name: "Noir", colors: ["#000000", "#1A1A1A", "#333333", "#666666"], tags: ["mono", "dark"] },
  { id: "paper", name: "Paper", colors: ["#FFFFFF", "#F5F5F0", "#E8E4DE", "#D1CCC4"], tags: ["mono", "light"] },
  { id: "charcoal", name: "Charcoal", colors: ["#2B2B2B", "#404040", "#606060", "#808080"], tags: ["mono", "gray"] },
  { id: "ink", name: "Ink & Wash", colors: ["#111111", "#3A3A3A", "#8A8A8A", "#E0E0E0"], tags: ["mono", "contrast"] },
  { id: "platinum", name: "Platinum", colors: ["#D0D0D0", "#B0B0B0", "#909090", "#707070"], tags: ["mono", "metallic"] },

  // --- Vintage & Retro ---
  { id: "70s-groove", name: "70s Groove", colors: ["#E8740C", "#D35400", "#8B4513", "#DAA520"], tags: ["retro", "70s"] },
  { id: "polaroid", name: "Polaroid", colors: ["#F5E6CC", "#D4B896", "#A67B5B", "#6F4E37"], tags: ["retro", "faded"] },
  { id: "art-deco", name: "Art Deco", colors: ["#1C1C1C", "#B8860B", "#FFD700", "#FFFFF0"], tags: ["retro", "gold"] },
  { id: "pop-art", name: "Pop Art", colors: ["#FF0000", "#FFFF00", "#0000FF", "#00FF00"], tags: ["retro", "bold"] },
  { id: "kodachrome", name: "Kodachrome", colors: ["#C1440E", "#E77728", "#2E86AB", "#F5F0E1"], tags: ["retro", "film"] },
  { id: "sepia", name: "Sepia", colors: ["#704214", "#A67B5B", "#C4A882", "#E8D5B7"], tags: ["retro", "antique"] },

  // --- Luxury ---
  { id: "black-gold", name: "Black & Gold", colors: ["#0A0A0A", "#1A1A1A", "#BFA046", "#FFD700"], tags: ["luxury", "gold"] },
  { id: "rose-gold", name: "Rosé Gold", colors: ["#B76E79", "#E8A0A0", "#F4CFC6", "#1A1A1A"], tags: ["luxury", "rose"] },
  { id: "marble", name: "Marble", colors: ["#E8E4E0", "#D4CFC8", "#A0988B", "#3C3633"], tags: ["luxury", "stone"] },
  { id: "champagne", name: "Champagne", colors: ["#F7E7CE", "#FAD6A5", "#E8C88D", "#B8860B"], tags: ["luxury", "warm"] },
  { id: "velvet", name: "Velvet Night", colors: ["#1A0825", "#2D1042", "#581D6E", "#9D4EDD"], tags: ["luxury", "purple"] },

  // --- Nature ---
  { id: "tropical", name: "Tropical", colors: ["#00B16A", "#1BA39C", "#F9E900", "#F22613"], tags: ["nature", "tropical"] },
  { id: "sakura", name: "Sakura", colors: ["#FFB7C5", "#FF85A1", "#E8D3E8", "#F5F0F0"], tags: ["nature", "japanese"] },
  { id: "aurora", name: "Aurora", colors: ["#00F260", "#0575E6", "#7F00FF", "#E100FF"], tags: ["nature", "sky"] },
  { id: "coral-reef", name: "Coral Reef", colors: ["#FF6B6B", "#FFA502", "#2ED573", "#1E90FF"], tags: ["nature", "ocean"] },
  { id: "wildflower", name: "Wildflower", colors: ["#E8A2C0", "#B794D6", "#6EB5FF", "#90EE90"], tags: ["nature", "floral"] },
  { id: "pine", name: "Pine Forest", colors: ["#1B3A2D", "#2D5A3D", "#4A8C6F", "#A8D5A2"], tags: ["nature", "green"] },

  // --- Tech & Digital ---
  { id: "matrix", name: "Matrix", colors: ["#000000", "#003300", "#00FF00", "#33FF33"], tags: ["tech", "hacker"] },
  { id: "blueprint", name: "Blueprint", colors: ["#003B6F", "#004B87", "#0066A4", "#FFFFFF"], tags: ["tech", "engineering"] },
  { id: "terminal", name: "Terminal", colors: ["#0C0C0C", "#1D1D1D", "#00FF41", "#FF5C57"], tags: ["tech", "code"] },
  { id: "chrome", name: "Chrome", colors: ["#C0C0C0", "#D0D0D0", "#E8E8E8", "#404040"], tags: ["tech", "metal"] },
  { id: "data-viz", name: "Data Viz", colors: ["#4E79A7", "#F28E2B", "#E15759", "#76B7B2"], tags: ["tech", "chart"] },

  // --- Fantasy ---
  { id: "enchanted", name: "Enchanted", colors: ["#6C3483", "#1A5276", "#0E6655", "#D4AC0D"], tags: ["fantasy", "magic"] },
  { id: "dragon-fire", name: "Dragon Fire", colors: ["#4A0000", "#8B0000", "#FF4500", "#FFD700"], tags: ["fantasy", "fire"] },
  { id: "elven", name: "Elven Forest", colors: ["#1B4332", "#2D6A4F", "#52B788", "#D8F3DC"], tags: ["fantasy", "nature"] },
  { id: "celestial", name: "Celestial", colors: ["#0D0D2B", "#1B1B4B", "#4169E1", "#FFD700"], tags: ["fantasy", "cosmic"] },
  { id: "dark-magic", name: "Dark Magic", colors: ["#1A1A2E", "#16213E", "#0F3460", "#E94560"], tags: ["fantasy", "dark"] },

  // --- Film & Cinema ---
  { id: "teal-orange", name: "Teal & Orange", colors: ["#008080", "#2AA6A6", "#FF8C42", "#FF6B35"], tags: ["film", "hollywood"] },
  { id: "film-noir", name: "Film Noir", colors: ["#0A0A0A", "#1F1F1F", "#4A4A4A", "#8A8A8A"], tags: ["film", "noir"] },
  { id: "wes-anderson", name: "Wes Anderson", colors: ["#FFB5B5", "#FED8B1", "#BFEFFF", "#D4E09B"], tags: ["film", "quirky"] },
  { id: "blade-runner", name: "Blade Runner", colors: ["#0D0D0D", "#FF6B35", "#FF00FF", "#00BFFF"], tags: ["film", "scifi"] },
  { id: "ghibli", name: "Studio Ghibli", colors: ["#87CEEB", "#98D8C8", "#F5DEB3", "#C9A96A"], tags: ["film", "anime"] },

  // --- Season ---
  { id: "spring", name: "Spring Bloom", colors: ["#FFB7C5", "#98FB98", "#87CEEB", "#FFFACD"], tags: ["season", "spring"] },
  { id: "summer", name: "Summer Heat", colors: ["#FF6347", "#FFD700", "#00CED1", "#FFFFFF"], tags: ["season", "summer"] },
  { id: "autumn", name: "Autumn Leaves", colors: ["#8B4513", "#CD853F", "#DAA520", "#800020"], tags: ["season", "fall"] },
  { id: "winter", name: "Winter Frost", colors: ["#E8F1F8", "#B0C4DE", "#4682B4", "#191970"], tags: ["season", "winter"] },

  // --- Cultural ---
  { id: "japanese-ink", name: "Japanese Ink", colors: ["#1A1A1A", "#4A4A4A", "#C8102E", "#F5F0E8"], tags: ["cultural", "japanese"] },
  { id: "moroccan", name: "Moroccan", colors: ["#C1440E", "#E07A5F", "#1A7A4C", "#004AAD"], tags: ["cultural", "arabic"] },
  { id: "nordic", name: "Nordic", colors: ["#F5F0E8", "#D4CFC8", "#5B7F95", "#2C3E50"], tags: ["cultural", "scandinavian"] },
  { id: "aztec", name: "Aztec", colors: ["#E3242B", "#009150", "#FFD700", "#1C1C1C"], tags: ["cultural", "mesoamerican"] },

  // --- Abstract ---
  { id: "bauhaus", name: "Bauhaus", colors: ["#DD1C1A", "#004AAD", "#FFDD00", "#F5F0E8"], tags: ["abstract", "geometric"] },
  { id: "mondrian", name: "Mondrian", colors: ["#FF0000", "#0000FF", "#FFFF00", "#FFFFFF"], tags: ["abstract", "block"] },
  { id: "rothko", name: "Rothko", colors: ["#8B0000", "#FF4500", "#FFD700", "#2B2B2B"], tags: ["abstract", "field"] },
  { id: "kandinsky", name: "Kandinsky", colors: ["#4169E1", "#FFD700", "#DC143C", "#2E8B57"], tags: ["abstract", "expressionist"] },

  // --- Food & Beverage ---
  { id: "espresso", name: "Espresso", colors: ["#3C1810", "#6F4E37", "#C4A570", "#F5F0E8"], tags: ["food", "coffee"] },
  { id: "berry", name: "Berry", colors: ["#8E2157", "#C94277", "#E075A5", "#FFD1DC"], tags: ["food", "fruit"] },
  { id: "mint", name: "Fresh Mint", colors: ["#3EB489", "#98D8C8", "#E0F2E9", "#FFFFFF"], tags: ["food", "fresh"] },
  { id: "wine", name: "Wine Country", colors: ["#722F37", "#9B2335", "#C5A880", "#F5E6CC"], tags: ["food", "wine"] },

  // --- Mood ---
  { id: "dreamy", name: "Dreamy", colors: ["#E6C2FF", "#C9B1FF", "#87CEEB", "#F5E6CC"], tags: ["mood", "soft"] },
  { id: "aggressive", name: "Aggressive", colors: ["#FF0000", "#000000", "#FF4500", "#FFFFFF"], tags: ["mood", "bold"] },
  { id: "zen", name: "Zen", colors: ["#F5F0E8", "#D4CFC8", "#8B8B8B", "#4A4A4A"], tags: ["mood", "calm"] },
  { id: "mysterious", name: "Mysterious", colors: ["#1A0825", "#2D1042", "#4A1A6B", "#7B2FBE"], tags: ["mood", "dark"] },
  { id: "nostalgic", name: "Nostalgic", colors: ["#F5E6CC", "#D4B896", "#A67B5B", "#6F4E37"], tags: ["mood", "warm"] },
  { id: "heroic", name: "Heroic", colors: ["#1E3A5F", "#4A90D9", "#FFD700", "#FF4500"], tags: ["mood", "epic"] },
] as const;

export function searchPalettes(query: string): Palette[] {
  const q = query.toLowerCase();
  return PALETTES.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.tags.some((t) => t.includes(q))
  );
}

export function getPalettesByTag(tag: string): Palette[] {
  return PALETTES.filter((p) => p.tags.includes(tag));
}

export const PALETTE_TAGS = [
  "warm", "cool", "neon", "vibrant", "pastel", "earth", "mono",
  "retro", "luxury", "nature", "tech", "fantasy", "film", "season",
  "cultural", "abstract", "food", "mood",
] as const;
