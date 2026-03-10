import type { Phrase } from "@/types";

export const PHRASES: Phrase[] = [
  {
    id: "trending",
    label: "Trending on ArtStation",
    content: "trending on ArtStation, featured artwork",
  },
  {
    id: "award",
    label: "Award Winning",
    content: "award winning photograph, National Geographic",
  },
  {
    id: "unreal",
    label: "Unreal Engine",
    content: "Unreal Engine 5, photorealistic rendering, ray tracing",
  },
  {
    id: "octane",
    label: "Octane Render",
    content: "Octane render, 8K, ultra detailed, subsurface scattering",
  },
  {
    id: "editorial",
    label: "Editorial",
    content: "editorial photography, Vogue magazine, professional retouching",
  },
  {
    id: "filmic",
    label: "Filmic",
    content: "shot on 35mm film, Kodak Portra 400, analog photography, film grain",
  },
] as const;
