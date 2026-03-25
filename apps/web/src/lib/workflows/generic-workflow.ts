import type { WorkflowDefinition } from "./types";

/**
 * Default 6-step workflow used by all templates that don't have a custom workflow.
 * Maps 1:1 to the existing WORKFLOW_STEPS in builder/page.tsx.
 */
export const GENERIC_WORKFLOW: WorkflowDefinition = {
  id: "generic",
  templateId: "*",
  phases: [
    { id: "fields",   label: "Fields",    description: "Core prompt details",   icon: "FileText"   },
    { id: "styles",   label: "Styles",    description: "Aesthetic modifiers",   icon: "Paintbrush" },
    { id: "colors",   label: "Colors",    description: "Color palette",         icon: "Palette"    },
    { id: "keywords", label: "Keywords",  description: "Extra descriptors",     icon: "Tags"       },
    { id: "negative", label: "Negative",  description: "What to exclude",       icon: "Ban"        },
    { id: "mockup",   label: "Mockup",    description: "Visualization",         icon: "Layers"     },
  ],
};
