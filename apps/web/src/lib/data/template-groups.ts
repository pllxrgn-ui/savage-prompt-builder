import type { TemplateGroup } from "@/types";

export const TEMPLATE_GROUPS: TemplateGroup[] = [
  { id: "photography", label: "Photography", icon: "Camera" },
  { id: "illustration", label: "Illustration", icon: "Palette" },
  { id: "design", label: "Design", icon: "PenTool" },
  { id: "3d", label: "3D & Render", icon: "Box" },
  { id: "experimental", label: "Experimental", icon: "Sparkles" },
] as const;
