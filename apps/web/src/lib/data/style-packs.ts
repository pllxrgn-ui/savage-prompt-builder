import type { StylePack } from "@/types";

export const STYLE_PACKS: StylePack[] = [
  {
    id: "cinematic-portrait",
    name: "Cinematic Portrait Pack",
    description: "Hollywood-grade portrait styles with dramatic lighting and color grading",
    templateId: "portrait",
    styles: [
      "Rembrandt lighting", "Teal and orange color grade", "Anamorphic lens flare",
      "Film grain, Kodak Vision3 500T", "Shallow depth of field, f/1.4",
      "Dramatic rim light", "Cinematic aspect ratio",
    ],
  },
  {
    id: "moody-landscape",
    name: "Moody Landscape Pack",
    description: "Atmospheric, dramatic landscape styles for epic scenery",
    templateId: "landscape",
    styles: [
      "Long exposure, silky water", "Volumetric fog", "Dramatic storm clouds",
      "Low key, dark and brooding", "Muted desaturated tones",
      "Strong foreground interest", "Infrared false color",
    ],
  },
  {
    id: "neon-noir",
    name: "Neon Noir Pack",
    description: "Cyberpunk-influenced street scenes with neon and rain",
    templateId: "street",
    styles: [
      "Neon reflections in wet streets", "High contrast, deep blacks",
      "Cyan and magenta color cast", "35mm film grain",
      "Rain-soaked atmosphere", "Bokeh city lights", "Silhouette figures",
    ],
  },
  {
    id: "luxury-product",
    name: "Luxury Product Pack",
    description: "High-end commercial product photography styles",
    templateId: "product",
    styles: [
      "Hard rim lighting, soft fill", "Black marble surface",
      "Floating product, zero gravity", "Splash and liquid dynamics",
      "Macro detail, texture close-up", "Metallic accents, reflections",
    ],
  },
  {
    id: "fantasy-concept",
    name: "Fantasy Concept Art Pack",
    description: "Epic fantasy illustration styles for concept art",
    templateId: "digital-art",
    styles: [
      "Matte painting, epic scale", "Volumetric god rays",
      "Bioluminescent elements", "Ancient ruins overgrown",
      "Dramatic chiaroscuro", "Painterly brushstrokes, textured",
      "Gold leaf accents, ornate borders",
    ],
  },
  {
    id: "ghibli-inspired",
    name: "Ghibli-Inspired Pack",
    description: "Soft, whimsical anime styles inspired by Studio Ghibli",
    templateId: "anime",
    styles: [
      "Watercolor background wash", "Soft cel-shading",
      "Lush nature details", "Warm golden light",
      "Hand-painted cloud details", "Gentle wind movement",
      "Nostalgic color palette, warm",
    ],
  },
  {
    id: "glass-render",
    name: "Glass & Crystal Pack",
    description: "Stunning glass, crystal, and transparent material renders",
    templateId: "3d-render",
    styles: [
      "Caustics, light refraction", "Subsurface scattering",
      "Iridescent holographic surface", "Dispersion, rainbow prism",
      "Frosted glass diffusion", "Crystal facets, gemstone cuts",
    ],
  },
  {
    id: "retro-pixel",
    name: "Retro Gaming Pack",
    description: "Classic video game pixel art styles across eras",
    templateId: "pixel-art",
    styles: [
      "NES 8-bit, limited palette", "SNES 16-bit RPG tileset",
      "Game Boy monochrome green", "Sega Genesis, blast processing",
      "Dithering, pattern fills", "CRT scanline effect",
    ],
  },
] as const;
