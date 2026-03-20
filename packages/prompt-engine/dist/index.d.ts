/**
 * @spb/prompt-engine
 *
 * Pure TypeScript prompt building engine — no React dependencies.
 * Used by: apps/web (UI), packages/mcp-server (Claude Desktop)
 *
 * buildPrompt(input) → BuiltPrompt
 */
export interface PromptInput {
    templateId: string;
    fields: Record<string, string>;
    styles: string[];
    palette: string | null;
    customColors?: string[];
    keywords: string[];
    negative: string;
    generator: string;
    phrases: string[];
    mockup?: {
        item: string;
        color: string;
        display: string;
    };
    garmentMode?: "dark" | "light" | null;
    referenceImageUrl?: string | null;
    mood?: string;
}
export interface BuiltPrompt {
    /** The positive prompt (before generator formatting) */
    positive: string;
    /** The negative prompt */
    negative: string;
    /** Any extra parameters for the generator */
    parameters: string;
    /** The final formatted output for the selected generator */
    full: string;
}
/**
 * Build a complete prompt from user input.
 *
 * Pipeline:
 * 1. Template builder → core prompt from field values
 * 2. Append styles, palette, keywords, phrases
 * 3. Format for selected generator
 * 4. Return positive, negative, parameters, and full formatted prompt
 */
export declare function buildPrompt(input: PromptInput): BuiltPrompt;
export { buildTemplatePrompt, templateBuilders } from "./template-builders";
export { formatForGenerator, generatorFormats } from "./generator-formats";
export type { FormatInput } from "./generator-formats";
//# sourceMappingURL=index.d.ts.map