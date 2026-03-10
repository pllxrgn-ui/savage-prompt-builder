import type { MockupConfig } from "@/types";

export const MOCKUP_CONFIGS: MockupConfig[] = [
  {
    templateId: "logo",
    layers: [
      { id: "bg", label: "Background", type: "background", options: ["white", "black", "gradient", "textured paper", "concrete wall"] },
      { id: "frame", label: "Presentation", type: "frame", options: ["business card", "storefront sign", "app icon", "letterhead", "t-shirt"] },
      { id: "shadow", label: "Shadow", type: "shadow", options: ["none", "soft drop shadow", "hard shadow", "long shadow"] },
    ],
  },
  {
    templateId: "poster",
    layers: [
      { id: "bg", label: "Setting", type: "background", options: ["gallery wall", "bus stop", "street wall", "frame on desk", "billboard"] },
      { id: "frame", label: "Frame", type: "frame", options: ["none", "thin black frame", "white mat border", "floating frame", "clip on string"] },
      { id: "shadow", label: "Shadow", type: "shadow", options: ["none", "soft ambient", "dramatic side"] },
    ],
  },
  {
    templateId: "ui-mockup",
    layers: [
      { id: "device", label: "Device", type: "frame", options: ["MacBook Pro", "iMac", "iPhone 15 Pro", "iPad Pro", "Android phone", "browser window"] },
      { id: "bg", label: "Background", type: "background", options: ["clean desk", "gradient", "solid color", "office environment", "none"] },
      { id: "shadow", label: "Shadow", type: "shadow", options: ["floating shadow", "contact shadow", "none"] },
    ],
  },
  {
    templateId: "product",
    layers: [
      { id: "surface", label: "Surface", type: "background", options: ["marble", "wood", "concrete", "fabric", "gradient sweep"] },
      { id: "overlay", label: "Props", type: "overlay", options: ["none", "botanical elements", "water droplets", "fabric draping", "geometric shapes"] },
      { id: "shadow", label: "Shadow", type: "shadow", options: ["soft studio", "hard directional", "colored ambient", "none"] },
    ],
  },
  {
    templateId: "pattern",
    layers: [
      { id: "application", label: "Application", type: "frame", options: ["fabric swatch", "wallpaper room", "phone case", "tote bag", "wrapping paper", "flat tile"] },
      { id: "bg", label: "Background", type: "background", options: ["none", "white", "craft paper", "wooden table"] },
    ],
  },
] as const;

export function getMockupConfig(templateId: string): MockupConfig | undefined {
  return MOCKUP_CONFIGS.find((m) => m.templateId === templateId);
}
