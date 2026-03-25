export type ClothingArtStyle = {
  id: string;
  label: string;
};

export const CLOTHING_ART_STYLES: ClothingArtStyle[] = [
  { id: "screenprint", label: "Screenprint" },
  { id: "vector", label: "Vector" },
  { id: "hand-drawn", label: "Hand-drawn Illustration" },
  { id: "vintage-distressed", label: "Vintage Distressed" },
  { id: "halftone", label: "Halftone" },
  { id: "woodcut", label: "Woodcut" },
  { id: "stipple", label: "Stipple" },
  { id: "stencil-art", label: "Stencil Art" },
  { id: "line-art", label: "Line Art" },
  { id: "engraving", label: "Engraving" },
  { id: "risograph", label: "Risograph" },
  { id: "cel-shaded", label: "Cel-shaded" },
  { id: "photorealistic", label: "Photorealistic" },
  { id: "watercolor", label: "Watercolor" },
  { id: "neon-glow", label: "Neon / Glow" },
  { id: "3d-render", label: "3D Render" },
  { id: "flat-minimalist", label: "Flat / Minimalist" },
  { id: "grunge-texture", label: "Grunge Texture" },
  { id: "tattoo-flash", label: "Tattoo Flash" },
  { id: "retro-comic", label: "Retro Comic" },
  { id: "pixel-art", label: "Pixel Art" },
] as const;
