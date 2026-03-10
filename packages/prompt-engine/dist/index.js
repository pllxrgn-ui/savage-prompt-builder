/**
 * @spb/prompt-engine
 *
 * Pure TypeScript prompt building engine — no React dependencies.
 * Used by: apps/web (UI), packages/mcp-server (Claude Desktop)
 *
 * buildPrompt(input) → BuiltPrompt
 */
import { buildTemplatePrompt } from "./template-builders";
import { formatForGenerator, } from "./generator-formats";
// --- Core ---
/**
 * Assemble the full positive prompt from template output + styles + palette + keywords + phrases.
 */
function assemblePositive(templatePrompt, styles, palette, keywords, phrases) {
    const parts = [templatePrompt];
    if (styles.length > 0) {
        parts.push(styles.join(", "));
    }
    if (palette) {
        parts.push(`color palette: ${palette}`);
    }
    if (keywords.length > 0) {
        parts.push(keywords.join(", "));
    }
    if (phrases.length > 0) {
        parts.push(phrases.join(", "));
    }
    return parts.join(", ");
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
export function buildPrompt(input) {
    // Step 1: Build core prompt from template fields
    const templatePrompt = buildTemplatePrompt(input.templateId, input.fields);
    // Step 2: Assemble full positive prompt
    const positive = assemblePositive(templatePrompt, input.styles, input.palette, input.keywords, input.phrases);
    // Step 3: Negative prompt (as-is)
    const negative = input.negative;
    // Step 4: No extra parameters by default (can be extended later)
    const parameters = "";
    // Step 5: Format for the selected generator
    const formatInput = { positive, negative, parameters };
    const full = formatForGenerator(input.generator, formatInput);
    return { positive, negative, parameters, full };
}
// --- Re-exports ---
export { buildTemplatePrompt, templateBuilders } from "./template-builders";
export { formatForGenerator, generatorFormats } from "./generator-formats";
//# sourceMappingURL=index.js.map