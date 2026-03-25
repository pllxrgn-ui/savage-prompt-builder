export type NegativePreset = {
  id: string;
  label: string;
};

/** User-selectable negative prompt presets for Things to Avoid */
export const NEGATIVE_PRESETS: NegativePreset[] = [
  { id: "watermark", label: "Watermark" },
  { id: "border", label: "Border" },
  { id: "frame", label: "Frame" },
  { id: "text", label: "Text" },
  { id: "signature", label: "Signature" },
  { id: "logo", label: "Logo" },
  { id: "mockup", label: "Mockup" },
  { id: "background-noise", label: "Background Noise" },
];
