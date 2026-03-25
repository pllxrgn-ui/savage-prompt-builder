import type { WorkflowDefinition } from "./types";

/**
 * 5-phase clothing-specific workflow (SIDEKICK v3.0 spec).
 * Replaces the generic 6-step flow when template === "clothing".
 */
export const CLOTHING_WORKFLOW: WorkflowDefinition = {
  id: "clothing",
  templateId: "clothing",
  phases: [
    {
      id: "design",
      label: "Design",
      description: "Subjects, placement on garment, vibe, lettering text & layout",
      icon: "Paintbrush",
    },
    {
      id: "garment",
      label: "Garment",
      description: "Pick the garment type, print size area, and base color",
      icon: "Shirt",
    },
    {
      id: "print-method",
      label: "Print Method",
      description: "Choose a print technique — affects prompt style & quality",
      icon: "Printer",
    },
    {
      id: "look-feel",
      label: "Look & Feel",
      description: "Art style, color palette & level of detail for the design",
      icon: "Palette",
    },
    {
      id: "final-touches",
      label: "Final Touches",
      description: "Background, output quality, things to avoid & extra notes",
      icon: "Sparkles",
    },
  ],
};
