import type { Accent } from "@/types";

export const ACCENTS: Accent[] = [
  { id: "orange", label: "Orange", color: "#FF6B00" },
  { id: "rose", label: "Rose", color: "#FF4D6D" },
  { id: "violet", label: "Violet", color: "#A78BFA" },
  { id: "blue", label: "Blue", color: "#3B82F6" },
  { id: "cyan", label: "Cyan", color: "#22D3EE" },
  { id: "emerald", label: "Emerald", color: "#34D399" },
  { id: "amber", label: "Amber", color: "#F59E0B" },
  { id: "pink", label: "Pink", color: "#EC4899" },
] as const;
