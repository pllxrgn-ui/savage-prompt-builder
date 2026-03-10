export type GeneratorId =
  | "midjourney"
  | "dalle3"
  | "stable-diffusion"
  | "flux"
  | "leonardo"
  | "firefly"
  | "ideogram"
  | "nanobanana"
  | "replicate";

export interface Generator {
  id: GeneratorId;
  name: string;
  icon: string;
  copyOnly?: boolean;
  supportsNegative?: boolean;
  maxLength?: number;
  description: string;
}

export interface PromptInput {
  templateId: string;
  fields: Record<string, string>;
  styles: string[];
  palette: string | null;
  keywords: string[];
  negative: string;
  generator: GeneratorId;
  phrases: string[];
  garmentMode?: "dark" | "light" | null;
  referenceImageUrl?: string | null;
}

export interface BuiltPrompt {
  positive: string;
  negative: string;
  parameters: string;
  full: string;
}
