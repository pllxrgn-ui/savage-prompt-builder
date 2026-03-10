import type { Generator } from "@/types";

export const GENERATORS: Generator[] = [
  {
    id: "midjourney",
    name: "Midjourney",
    icon: "Sailboat",
    copyOnly: true,
    supportsNegative: true,
    maxLength: 6000,
    description: "Copy prompt for Midjourney Discord. No direct API.",
  },
  {
    id: "dalle3",
    name: "DALL·E 3",
    icon: "Sparkles",
    supportsNegative: false,
    maxLength: 4000,
    description: "OpenAI image generation. Natural language prompts.",
  },
  {
    id: "stable-diffusion",
    name: "Stable Diffusion",
    icon: "Cpu",
    supportsNegative: true,
    maxLength: 77,
    description: "Open-source. Supports negative prompts and weights.",
  },
  {
    id: "flux",
    name: "Flux",
    icon: "Zap",
    supportsNegative: false,
    maxLength: 2048,
    description: "Black Forest Labs. High quality, fast generation.",
  },
  {
    id: "leonardo",
    name: "Leonardo AI",
    icon: "Palette",
    supportsNegative: true,
    maxLength: 1000,
    description: "Fine-tuned models for specific art styles.",
  },
  {
    id: "firefly",
    name: "Adobe Firefly",
    icon: "Flame",
    supportsNegative: false,
    maxLength: 2000,
    description: "Adobe's commercially safe image generation.",
  },
  {
    id: "ideogram",
    name: "Ideogram",
    icon: "Type",
    supportsNegative: false,
    maxLength: 2048,
    description: "Best for text rendering in images.",
  },
  {
    id: "nanobanana",
    name: "NanoBanana Pro",
    icon: "Banana",
    supportsNegative: true,
    maxLength: 4000,
    description: "Multi-model gateway. Primary generation provider.",
  },
  {
    id: "replicate",
    name: "Replicate",
    icon: "Server",
    supportsNegative: true,
    maxLength: 4000,
    description: "Run open-source models via API. Async generation.",
  },
] as const;

export function getGeneratorById(id: string): Generator | undefined {
  return GENERATORS.find((g) => g.id === id);
}
