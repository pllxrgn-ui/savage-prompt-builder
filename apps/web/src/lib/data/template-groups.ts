import type { TemplateGroup } from "@/types";

export const TEMPLATE_GROUPS: TemplateGroup[] = [
  { id: "design-print", label: "Design & Print", icon: "Printer" },
  { id: "branding", label: "Branding", icon: "Megaphone" },
  { id: "art", label: "Art & Illustration", icon: "Palette" },
  { id: "product", label: "Product", icon: "Package" },
  { id: "other", label: "Other", icon: "Sparkles" },
] as const;
