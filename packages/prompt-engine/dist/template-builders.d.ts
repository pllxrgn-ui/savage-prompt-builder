/**
 * Template builders: one per template ID.
 * Each takes a fields record and returns the core positive prompt string
 * (before styles, keywords, palette, or phrases are appended).
 */
type Fields = Record<string, string>;
/**
 * Maps template ID → builder function.
 * Each builder assembles the core prompt from the user's field values.
 */
export declare const templateBuilders: Record<string, (fields: Fields) => string>;
/**
 * Build the core prompt for any template.
 * Falls back to comma-joining all non-empty field values.
 */
export declare function buildTemplatePrompt(templateId: string, fields: Fields): string;
export {};
//# sourceMappingURL=template-builders.d.ts.map