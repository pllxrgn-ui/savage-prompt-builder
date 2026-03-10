export interface TemplateField {
  id: string;
  label: string;
  placeholder: string;
  required?: boolean;
}

export interface Template {
  id: string;
  name: string;
  icon: string;
  group: TemplateGroupId;
  description: string;
  fields: TemplateField[];
  defaultNegative?: string;
}

export type TemplateGroupId =
  | "photography"
  | "illustration"
  | "design"
  | "3d"
  | "experimental";

export interface TemplateGroup {
  id: TemplateGroupId;
  label: string;
  icon: string;
}
