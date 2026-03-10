/**
 * Generator formatters: one per generator ID.
 * Each takes a positive prompt, negative prompt, and optional parameters,
 * then returns the final formatted string for that specific platform.
 */
export interface FormatInput {
    positive: string;
    negative: string;
    parameters?: string;
}
/**
 * Maps generator ID → formatter function.
 */
export declare const generatorFormats: Record<string, (input: FormatInput) => string>;
/**
 * Format a prompt for any generator.
 * Falls back to simple positive + negative concatenation.
 */
export declare function formatForGenerator(generatorId: string, input: FormatInput): string;
//# sourceMappingURL=generator-formats.d.ts.map