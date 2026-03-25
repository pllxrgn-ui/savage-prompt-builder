export type LetteringStyle = {
  id: string;
  label: string;
};

export const LETTERING_STYLES: LetteringStyle[] = [
  { id: "bold-block", label: "Bold Block Letters" },
  { id: "script-cursive", label: "Script / Cursive" },
  { id: "distressed-weathered", label: "Distressed / Weathered" },
  { id: "graffiti-tag", label: "Graffiti / Tag" },
  { id: "serif-classic", label: "Serif / Classic" },
  { id: "gothic-blackletter", label: "Gothic / Blackletter" },
  { id: "hand-lettered", label: "Hand-lettered" },
  { id: "stencil", label: "Stencil" },
  { id: "retro-diner", label: "Retro Diner" },
  { id: "none", label: "None (no text)" },
] as const;
