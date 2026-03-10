import type { Template } from "@/types";

export const TEMPLATES: Template[] = [
  // --- Photography ---
  {
    id: "portrait",
    name: "Portrait",
    icon: "User",
    group: "photography",
    description: "People, headshots, fashion, editorial portraits",
    fields: [
      { id: "subject", label: "Subject", placeholder: "A young woman with freckles", required: true },
      { id: "setting", label: "Setting", placeholder: "Natural light studio" },
      { id: "mood", label: "Mood", placeholder: "Ethereal, soft, introspective" },
      { id: "camera", label: "Camera & Lens", placeholder: "Sony A7III, 85mm f/1.4" },
    ],
    defaultNegative: "deformed, bad anatomy, disfigured, poorly drawn face, mutation, extra limbs",
  },
  {
    id: "landscape",
    name: "Landscape",
    icon: "Mountain",
    group: "photography",
    description: "Nature, scenery, aerial, seascapes",
    fields: [
      { id: "scene", label: "Scene", placeholder: "Misty mountain valley at sunrise", required: true },
      { id: "weather", label: "Weather & Time", placeholder: "Golden hour, low fog" },
      { id: "composition", label: "Composition", placeholder: "Leading lines, rule of thirds" },
      { id: "camera", label: "Camera & Lens", placeholder: "Nikon Z7, 24-70mm" },
    ],
    defaultNegative: "oversaturated, HDR, artificial, watermark, text",
  },
  {
    id: "street",
    name: "Street Photography",
    icon: "MapPin",
    group: "photography",
    description: "Urban life, candid moments, city scenes",
    fields: [
      { id: "scene", label: "Scene", placeholder: "Rainy Tokyo alley at night", required: true },
      { id: "subject", label: "Subject", placeholder: "Lone figure with umbrella" },
      { id: "mood", label: "Mood", placeholder: "Noir, cinematic, melancholic" },
      { id: "style", label: "Style", placeholder: "35mm film grain, high contrast" },
    ],
    defaultNegative: "digital look, overprocessed, cartoon, anime",
  },
  {
    id: "product",
    name: "Product Shot",
    icon: "Package",
    group: "photography",
    description: "Commercial product photography, still life",
    fields: [
      { id: "product", label: "Product", placeholder: "Luxury perfume bottle", required: true },
      { id: "surface", label: "Surface", placeholder: "Black marble with water droplets" },
      { id: "lighting", label: "Lighting", placeholder: "Dramatic rim light, soft fill" },
      { id: "style", label: "Style", placeholder: "Minimalist, editorial, high-end" },
    ],
    defaultNegative: "low quality, blurry, amateur, bad lighting, cluttered background",
  },

  // --- Illustration ---
  {
    id: "digital-art",
    name: "Digital Art",
    icon: "Brush",
    group: "illustration",
    description: "Digital paintings, concept art, illustrations",
    fields: [
      { id: "subject", label: "Subject", placeholder: "Ancient dragon perched on a crystal spire", required: true },
      { id: "style", label: "Art Style", placeholder: "Painterly, detailed, fantasy realism" },
      { id: "colors", label: "Color Palette", placeholder: "Deep purples, molten gold, teal accents" },
      { id: "mood", label: "Mood", placeholder: "Epic, mysterious, awe-inspiring" },
    ],
    defaultNegative: "photo, realistic, amateur, clipart, simple",
  },
  {
    id: "anime",
    name: "Anime & Manga",
    icon: "Star",
    group: "illustration",
    description: "Anime-style characters and scenes",
    fields: [
      { id: "character", label: "Character", placeholder: "Cyberpunk mage with neon tattoos", required: true },
      { id: "action", label: "Action/Pose", placeholder: "Casting a spell, dynamic angle" },
      { id: "style", label: "Style", placeholder: "Studio Ghibli meets Akira" },
      { id: "background", label: "Background", placeholder: "Neon-lit rooftop, rain" },
    ],
    defaultNegative: "realistic, 3D render, western cartoon, low quality, extra fingers",
  },
  {
    id: "watercolor",
    name: "Watercolor",
    icon: "Droplets",
    group: "illustration",
    description: "Traditional watercolor painting aesthetic",
    fields: [
      { id: "subject", label: "Subject", placeholder: "Wildflower meadow with butterflies", required: true },
      { id: "technique", label: "Technique", placeholder: "Wet-on-wet, loose brushstrokes" },
      { id: "colors", label: "Colors", placeholder: "Soft pastels, bleeding edges" },
      { id: "paper", label: "Paper", placeholder: "Cold press textured paper" },
    ],
    defaultNegative: "digital, sharp edges, vector, flat color, photograph",
  },
  {
    id: "comic",
    name: "Comic Book",
    icon: "BookOpen",
    group: "illustration",
    description: "Comic panels, sequential art, graphic novel style",
    fields: [
      { id: "scene", label: "Scene", placeholder: "Hero facing villain on a rooftop", required: true },
      { id: "style", label: "Style", placeholder: "Jim Lee meets Moebius" },
      { id: "inking", label: "Inking", placeholder: "Bold linework, cross-hatching" },
      { id: "colors", label: "Colors", placeholder: "Vibrant, cel-shaded" },
    ],
    defaultNegative: "realistic, photograph, 3D, blurry, soft",
  },

  // --- Design ---
  {
    id: "logo",
    name: "Logo Design",
    icon: "Hexagon",
    group: "design",
    description: "Brand logos, marks, emblems, monograms",
    fields: [
      { id: "brand", label: "Brand Name", placeholder: "Nebula Labs", required: true },
      { id: "style", label: "Style", placeholder: "Geometric, minimal, tech-forward" },
      { id: "icon", label: "Icon Element", placeholder: "Abstract star/nebula shape" },
      { id: "colors", label: "Colors", placeholder: "Deep navy, electric blue accent" },
    ],
    defaultNegative: "clipart, complex, photorealistic, too many details, text errors",
  },
  {
    id: "ui-mockup",
    name: "UI Mockup",
    icon: "Monitor",
    group: "design",
    description: "App interfaces, dashboards, web mockups",
    fields: [
      { id: "app", label: "App Type", placeholder: "Crypto trading dashboard", required: true },
      { id: "platform", label: "Platform", placeholder: "Desktop web, dark mode" },
      { id: "style", label: "Style", placeholder: "Glassmorphism, neon accents" },
      { id: "features", label: "Key Features", placeholder: "Charts, portfolio, trade panel" },
    ],
    defaultNegative: "blurry text, inconsistent UI, low resolution, wireframe",
  },
  {
    id: "poster",
    name: "Poster",
    icon: "Image",
    group: "design",
    description: "Event posters, movie posters, typographic art",
    fields: [
      { id: "title", label: "Title Text", placeholder: "ECLIPSE", required: true },
      { id: "theme", label: "Theme", placeholder: "Space opera film premiere" },
      { id: "style", label: "Style", placeholder: "Retro sci-fi, hand-lettered" },
      { id: "elements", label: "Visual Elements", placeholder: "Nebula, silhouettes, lens flare" },
    ],
    defaultNegative: "misspelled text, low quality typography, generic stock photo",
  },
  {
    id: "pattern",
    name: "Seamless Pattern",
    icon: "Grid3x3",
    group: "design",
    description: "Tileable patterns for textiles, wallpapers, branding",
    fields: [
      { id: "motif", label: "Motif", placeholder: "Tropical leaves and birds", required: true },
      { id: "style", label: "Style", placeholder: "William Morris meets modern minimal" },
      { id: "colors", label: "Colors", placeholder: "Forest green, cream, gold" },
      { id: "repeat", label: "Repeat Type", placeholder: "Half-drop, seamless tile" },
    ],
    defaultNegative: "non-repeating, visible seams, low resolution, simple",
  },

  // --- 3D & Render ---
  {
    id: "3d-render",
    name: "3D Render",
    icon: "Box",
    group: "3d",
    description: "Photorealistic 3D renders, objects, scenes",
    fields: [
      { id: "subject", label: "Subject", placeholder: "Floating crystal geometric sculpture", required: true },
      { id: "material", label: "Material", placeholder: "Iridescent glass, chrome accents" },
      { id: "lighting", label: "Lighting", placeholder: "Studio HDRI, caustics" },
      { id: "renderer", label: "Renderer Style", placeholder: "Octane render, 8K, subsurface scattering" },
    ],
    defaultNegative: "2D, flat, cartoon, low poly, draft quality",
  },
  {
    id: "isometric",
    name: "Isometric Scene",
    icon: "Layers",
    group: "3d",
    description: "Cute isometric worlds, dioramas, game assets",
    fields: [
      { id: "scene", label: "Scene", placeholder: "Cozy coffee shop interior", required: true },
      { id: "style", label: "Style", placeholder: "Low-poly, pastel colors, tilt-shift" },
      { id: "details", label: "Details", placeholder: "Tiny people, plants, warm lighting" },
      { id: "scale", label: "Scale", placeholder: "Miniature diorama, toy-like" },
    ],
    defaultNegative: "realistic, dark, horror, complex, messy",
  },
  {
    id: "arch-viz",
    name: "Architecture",
    icon: "Building",
    group: "3d",
    description: "Architectural visualization, interior design",
    fields: [
      { id: "space", label: "Space", placeholder: "Scandinavian loft apartment", required: true },
      { id: "style", label: "Style", placeholder: "Minimalist, warm wood, concrete" },
      { id: "lighting", label: "Lighting", placeholder: "Natural light, floor-to-ceiling windows" },
      { id: "details", label: "Details", placeholder: "Designer furniture, plants, art pieces" },
    ],
    defaultNegative: "cluttered, dark, unrealistic proportions, cartoon",
  },
  {
    id: "character-3d",
    name: "3D Character",
    icon: "PersonStanding",
    group: "3d",
    description: "3D character design, figurines, game characters",
    fields: [
      { id: "character", label: "Character", placeholder: "Steampunk inventor with mechanical arm", required: true },
      { id: "style", label: "Style", placeholder: "Pixar-quality, stylized realism" },
      { id: "pose", label: "Pose", placeholder: "Confident stance, holding gadget" },
      { id: "material", label: "Material", placeholder: "Subsurface skin, cloth simulation" },
    ],
    defaultNegative: "2D, flat, bad anatomy, uncanny valley, low poly draft",
  },

  // --- Experimental ---
  {
    id: "abstract",
    name: "Abstract",
    icon: "Waves",
    group: "experimental",
    description: "Non-representational art, color fields, textures",
    fields: [
      { id: "concept", label: "Concept", placeholder: "The feeling of nostalgia dissolving", required: true },
      { id: "medium", label: "Medium", placeholder: "Oil paint on large canvas" },
      { id: "colors", label: "Colors", placeholder: "Burnt sienna, midnight blue, gold leaf" },
      { id: "texture", label: "Texture", placeholder: "Heavy impasto, dripping, layered" },
    ],
    defaultNegative: "representational, figurative, clipart, simple, boring",
  },
  {
    id: "surreal",
    name: "Surrealism",
    icon: "Eye",
    group: "experimental",
    description: "Dreamlike, impossible scenes, Dalí-inspired",
    fields: [
      { id: "scene", label: "Scene", placeholder: "A library where books float like fish", required: true },
      { id: "elements", label: "Surreal Elements", placeholder: "Melting clocks, impossible architecture" },
      { id: "style", label: "Style", placeholder: "Hyperrealistic surrealism, matte painting" },
      { id: "mood", label: "Mood", placeholder: "Dreamlike, uncanny, beautiful" },
    ],
    defaultNegative: "normal, mundane, cartoon, anime, simple",
  },
  {
    id: "pixel-art",
    name: "Pixel Art",
    icon: "Grid2x2",
    group: "experimental",
    description: "Retro pixel art, game sprites, 8-bit scenes",
    fields: [
      { id: "scene", label: "Scene", placeholder: "Fantasy tavern with adventurers", required: true },
      { id: "resolution", label: "Resolution", placeholder: "32x32 sprite or 256x224 scene" },
      { id: "palette", label: "Palette", placeholder: "NES palette, limited 16 colors" },
      { id: "style", label: "Style", placeholder: "SNES-era RPG, dithering" },
    ],
    defaultNegative: "high resolution, smooth, realistic, 3D, anti-aliased",
  },
  {
    id: "collage",
    name: "Mixed Media Collage",
    icon: "Scissors",
    group: "experimental",
    description: "Cut-and-paste, magazine collage, mixed media",
    fields: [
      { id: "theme", label: "Theme", placeholder: "Retro-futurism meets botanical", required: true },
      { id: "materials", label: "Materials", placeholder: "Vintage magazines, pressed flowers, stamps" },
      { id: "composition", label: "Composition", placeholder: "Layered, overlapping, torn edges" },
      { id: "colors", label: "Colors", placeholder: "Faded pastels, kraft paper, gold" },
    ],
    defaultNegative: "clean, digital, vector, uniform, sterile",
  },
] as const;

export function getTemplateById(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function getTemplatesByGroup(group: string): Template[] {
  return TEMPLATES.filter((t) => t.group === group);
}
