import type { GeneratorId } from "./prompt";

export interface SavedPrompt {
  id: string;
  title: string;
  content: string;
  templateId: string;
  generatorId: GeneratorId;
  fieldData: Record<string, string>;
  styles: string[];
  palette: string | null;
  customColors?: string[];
  keywords: string[];
  negative: string;
  starred: boolean;
  score: number | null;
  note: string;
  parentId: string | null;
  version: number;
  projectId: string | null;
  phrases?: string[];
  garmentMode?: "dark" | "light" | null;
  referenceImageUrl?: string | null;
  variables?: Record<string, string>;
  variations: Record<string, string>[];
  mockup?: { enabled: boolean; item: string; color: string; display: string } | null;
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
  generatorId: GeneratorId;
  phrases: string[];
  garmentMode: "dark" | "light" | null;
  referenceImageUrl: string | null;
  variables: Record<string, string>;
  variations: Record<string, string>[];
  mockup: { enabled: boolean; item: string; color: string; display: string } | null;
  clothingData?: Record<string, unknown>;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
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
  content?: string;
  defaultActive?: boolean;
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

export interface MockupItem {
  id: string;
  label: string;
  prompt: string;
  icon?: string;
}

export interface MockupColor {
  id: string;
  label: string;
  value: string;
  hex?: string;
}

export interface MockupDisplay {
  id: string;
  label: string;
  value: string;
  icon?: string;
}

export interface MockupConfig {
  templateId: string;
  label: string;
  items: MockupItem[];
  colors: MockupColor[];
  displays: MockupDisplay[];
}
