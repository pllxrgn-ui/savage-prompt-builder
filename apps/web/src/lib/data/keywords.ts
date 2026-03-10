import type { KeywordCategory } from "@/types";

export const KEYWORDS: KeywordCategory[] = [
  {
    id: "quality",
    label: "Quality",
    icon: "Award",
    keywords: [
      "masterpiece", "best quality", "ultra detailed", "8K UHD", "4K",
      "high resolution", "sharp focus", "professional", "award winning",
      "highly detailed", "intricate details", "photorealistic",
      "studio quality", "crisp", "ultra sharp", "fine detail",
    ],
  },
  {
    id: "lighting",
    label: "Lighting",
    icon: "Sun",
    keywords: [
      "golden hour", "blue hour", "dramatic lighting", "volumetric light",
      "god rays", "rim lighting", "backlit", "soft diffused light",
      "studio lighting", "neon glow", "candlelight", "moonlight",
      "cinematic lighting", "chiaroscuro", "ambient occlusion",
      "global illumination", "natural light", "hard shadows",
    ],
  },
  {
    id: "camera",
    label: "Camera",
    icon: "Camera",
    keywords: [
      "depth of field", "bokeh", "wide angle", "telephoto", "macro",
      "fisheye", "tilt-shift", "35mm film", "medium format",
      "shallow DOF", "f/1.4", "f/2.8", "long exposure",
      "lens flare", "motion blur", "film grain", "anamorphic",
    ],
  },
  {
    id: "mood",
    label: "Mood",
    icon: "Heart",
    keywords: [
      "ethereal", "moody", "cinematic", "dramatic", "peaceful",
      "melancholic", "mysterious", "whimsical", "epic", "intimate",
      "nostalgic", "serene", "haunting", "vibrant", "somber",
      "dreamy", "gritty", "elegant", "raw", "atmospheric",
    ],
  },
  {
    id: "composition",
    label: "Composition",
    icon: "LayoutGrid",
    keywords: [
      "rule of thirds", "leading lines", "symmetry", "asymmetric",
      "foreground interest", "framing", "negative space", "bird's eye",
      "worm's eye", "dutch angle", "close-up", "wide shot",
      "establishing shot", "over the shoulder", "centered",
      "panoramic", "diagonal", "layered depth",
    ],
  },
  {
    id: "style",
    label: "Art Style",
    icon: "Paintbrush",
    keywords: [
      "concept art", "matte painting", "oil painting", "watercolor",
      "ink illustration", "charcoal drawing", "digital painting",
      "mixed media", "collage", "vector art", "woodcut print",
      "lithograph", "gouache", "acrylic pour", "pastel drawing",
      "pencil sketch", "engraving", "fresco",
    ],
  },
] as const;
