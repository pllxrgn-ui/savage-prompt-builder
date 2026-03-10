export interface SavedPrompt {
  id: string;
  title: string;
  content: string;
  templateId: string;
  generatorId: string;
  fieldData: Record<string, string>;
  styles: string[];
  palette: string | null;
  keywords: string[];
  negative: string;
  createdAt: string;
  updatedAt: string;
}

export interface Recipe {
  id: string;
  title: string;
  templateId: string;
  fieldData: Record<string, string>;
  styles: string[];
  palette: string | null;
  keywords: string[];
  negative: string;
  generatorId: string;
  createdAt: string;
}

export type AccentId =
  | "rose"
  | "violet"
  | "blue"
  | "cyan"
  | "emerald"
  | "amber"
  | "orange"
  | "pink";

export interface Accent {
  id: AccentId;
  label: string;
  color: string;
}

export interface Palette {
  id: string;
  name: string;
  colors: string[];
  tags: string[];
}

export interface KeywordCategory {
  id: string;
  label: string;
  icon: string;
  keywords: string[];
}

export interface StyleEntry {
  label: string;
  category: string;
}

export interface Phrase {
  id: string;
  label: string;
  content: string;
}

export interface ImageGenModel {
  id: string;
  name: string;
  provider: string;
  maxWidth: number;
  maxHeight: number;
  supportedRatios: string[];
}

export interface StylePack {
  id: string;
  name: string;
  description: string;
  templateId: string;
  styles: string[];
  preview?: string;
}

export interface MockupConfig {
  templateId: string;
  layers: MockupLayer[];
}

export interface MockupLayer {
  id: string;
  label: string;
  type: "background" | "overlay" | "frame" | "shadow";
  options: string[];
}
