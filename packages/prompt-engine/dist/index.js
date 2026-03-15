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
function assemblePositive(templatePrompt, styles, palette, keywords, phrases, mockup, garmentMode, mood) {
    const parts = [templatePrompt];
    if (mood && mood.trim()) {
        parts.push(mood.trim());
    }
    if (garmentMode === "dark") {
        parts.push("light and neon colors on dark fabric");
    }
    else if (garmentMode === "light") {
        parts.push("dark and saturated colors on light fabric");
    }
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
    if (mockup) {
        const mockupParts = [];
        if (mockup.item)
            mockupParts.push(`on a ${mockup.item}`);
        if (mockup.color)
            mockupParts.push(mockup.color);
        if (mockup.display)
            mockupParts.push(mockup.display);
        if (mockupParts.length > 0) {
            parts.push(mockupParts.join(", "));
        }
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
    const positive = assemblePositive(templatePrompt, input.styles, input.palette, input.keywords, input.phrases, input.mockup, input.garmentMode, input.mood);
    // Step 3: Negative prompt (as-is)
    const negative = input.negative;
    // Step 4: Reference image injection
    let parameters = "";
    if (input.referenceImageUrl) {
        if (input.generator === "midjourney") {
            parameters = `--sref ${input.referenceImageUrl}`;
        }
        else {
            // For non-Midjourney generators, append as text in positive
        }
    }
    // For non-Midjourney generators, append reference image text to positive
    let finalPositive = positive;
    if (input.referenceImageUrl && input.generator !== "midjourney") {
        finalPositive = `${positive}, style reference: ${input.referenceImageUrl}`;
    }
    // Step 5: Format for the selected generator
    const formatInput = { positive: finalPositive, negative, parameters };
    const full = formatForGenerator(input.generator, formatInput);
    return { positive, negative, parameters, full };
}
// --- Re-exports ---
export { buildTemplatePrompt, templateBuilders } from "./template-builders";
export { formatForGenerator, generatorFormats } from "./generator-formats";
//# sourceMappingURL=index.js.map