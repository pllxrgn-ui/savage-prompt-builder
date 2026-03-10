/** Per-template negative prompt presets (keywords to avoid) */
export const NEGATIVE_PRESETS: Record<
  string,
  { label: string; presets: string[] }
> = {
  clothing: {
    label: "Clothing",
    presets: [
      "text", "watermark", "words", "letters", "human body", "hands",
      "fingers", "face", "blurry", "low quality", "deformed", "extra limbs",
      "bad anatomy", "pixelated", "cropped", "out of frame", "ugly", "duplicate",
    ],
  },
  brand: {
    label: "Brand/Logo",
    presets: [
      "text", "realistic photo", "3D render", "gradients", "busy background",
      "multiple colors", "thin lines", "complex detail", "pixelated", "blurry",
      "shadows", "perspective distortion",
    ],
  },
  tattoo: {
    label: "Tattoo",
    presets: [
      "blurry lines", "color bleeding", "skin texture", "realistic skin",
      "shading errors", "watermark", "text", "low resolution", "jagged edges",
      "asymmetric",
    ],
  },
  threeD: {
    label: "3D Model",
    presets: [
      "flat 2D", "pixelated", "text", "watermark", "low polygon artifacts",
      "UV seams", "blurry", "noisy render", "unrealistic scale", "floating objects",
    ],
  },
  jewelry: {
    label: "Jewelry",
    presets: [
      "text", "fingers", "skin", "mannequin", "blurry", "low quality",
      "watermark", "busy background", "unrealistic proportions", "floating stones",
      "plastic looking",
    ],
  },
  social: {
    label: "Social Media",
    presets: [
      "text", "watermark", "blurry", "low resolution", "cropped", "out of frame",
      "busy background", "cluttered", "ugly borders", "pixelated",
    ],
  },
  mockup: {
    label: "Product Mockup",
    presets: [
      "text", "logos", "hands", "fingers", "blurry", "low quality", "watermark",
      "busy background", "unrealistic lighting", "floating products",
    ],
  },
  marketing: {
    label: "Marketing",
    presets: [
      "text", "fine print", "blurry", "low quality", "watermark", "cluttered",
      "confusing layout", "too many elements", "dark shadows", "grainy",
    ],
  },
  collection: {
    label: "Collection",
    presets: [
      "text", "watermark", "inconsistent style", "different lighting",
      "mismatched colors", "varying quality", "blurry", "cropped",
    ],
  },
  pattern: {
    label: "Pattern",
    presets: [
      "visible seams", "non-repeating edges", "text", "watermark", "blurry",
      "asymmetric", "gaps in pattern", "color banding", "low resolution",
    ],
  },
  _default: {
    label: "General",
    presets: [
      "text", "watermark", "blurry", "low quality", "deformed", "extra limbs",
      "bad anatomy", "pixelated", "cropped", "out of frame", "ugly", "duplicate",
      "disfigured", "mutation",
    ],
  },
};
