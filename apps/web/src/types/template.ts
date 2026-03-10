export interface TemplateField {
  id: string;
  label: string;
  placeholder: string;
  required?: boolean;
  question?: string;
  color?: string;
}

export interface Template {
  id: string;
  name: string;
  icon: string;
  group: TemplateGroupId;
  description: string;
  fields: TemplateField[];
  defaultNegative?: string;
  tip?: string;
}

export type TemplateGroupId =
  | "design-print"
  | "branding"
  | "art"
  | "product"
  | "other";

export interface TemplateGroup {
  id: TemplateGroupId;
  label: string;
  icon: string;
}
