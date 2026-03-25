export type VibeTheme = {
  id: string;
  label: string;
};

export const CLOTHING_VIBES: VibeTheme[] = [
  { id: "streetwear", label: "Streetwear" },
  { id: "vintage-americana", label: "Vintage Americana" },
  { id: "athletic", label: "Athletic" },
  { id: "luxury", label: "Luxury" },
  { id: "kawaii-cute", label: "Kawaii / Cute" },
  { id: "gothic-dark", label: "Gothic / Dark" },
  { id: "tropical", label: "Tropical" },
  { id: "retro-80s-90s", label: "Retro 80s/90s" },
  { id: "minimalist", label: "Minimalist" },
  { id: "punk-grunge", label: "Punk / Grunge" },
  { id: "western", label: "Western" },
  { id: "military", label: "Military" },
  { id: "nature", label: "Nature" },
  { id: "psychedelic", label: "Psychedelic" },
  { id: "anime", label: "Anime" },
  { id: "hip-hop", label: "Hip-Hop" },
] as const;
