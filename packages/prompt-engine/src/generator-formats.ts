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

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Midjourney: /imagine {prompt} --no {negative} --ar 16:9 --v 6.1
 * Negative goes in --no parameter. Parameters appended directly.
 */
function midjourney(input: FormatInput): string {
  const parts = [input.positive];
  if (input.negative) {
    parts.push(`--no ${input.negative}`);
  }
  if (input.parameters) {
    parts.push(input.parameters);
  }
  return truncate(parts.join(" "), 6000);
}

/**
 * DALL·E 3: Natural language only, no negative prompt support.
 * Weave negative as "avoid X" at the end if present.
 */
function dalle3(input: FormatInput): string {
  let prompt = input.positive;
  if (input.negative) {
    prompt += `. Avoid: ${input.negative}`;
  }
  if (input.parameters) {
    prompt += `. ${input.parameters}`;
  }
  return truncate(prompt, 4000);
}

/**
 * Stable Diffusion: positive and negative are separate.
 * Supports (attention:weight) syntax. Returns in a structured way.
 */
function stableDiffusion(input: FormatInput): string {
  let output = input.positive;
  if (input.negative) {
    output += `\nNegative prompt: ${input.negative}`;
  }
  if (input.parameters) {
    output += `\n${input.parameters}`;
  }
  return output;
}

/**
 * Flux: Natural language prompt. No native negative support.
 */
function flux(input: FormatInput): string {
  let prompt = input.positive;
  if (input.negative) {
    prompt += `. Without: ${input.negative}`;
  }
  if (input.parameters) {
    prompt += `. ${input.parameters}`;
  }
  return truncate(prompt, 2048);
}

/**
 * Leonardo AI: Supports negative prompts separately.
 */
function leonardo(input: FormatInput): string {
  let output = input.positive;
  if (input.negative) {
    output += `\nNegative prompt: ${input.negative}`;
  }
  if (input.parameters) {
    output += `\n${input.parameters}`;
  }
  return truncate(output, 1000);
}

/**
 * Adobe Firefly: Natural language. No negative prompt support.
 * Commercial-safe language recommended.
 */
function firefly(input: FormatInput): string {
  let prompt = input.positive;
  if (input.negative) {
    prompt += `. Exclude: ${input.negative}`;
  }
  if (input.parameters) {
    prompt += `. ${input.parameters}`;
  }
  return truncate(prompt, 2000);
}

/**
 * Ideogram: Natural language. Best for text-in-image.
 */
function ideogram(input: FormatInput): string {
  let prompt = input.positive;
  if (input.negative) {
    prompt += `. Do not include: ${input.negative}`;
  }
  if (input.parameters) {
    prompt += `. ${input.parameters}`;
  }
  return truncate(prompt, 2048);
}

/**
 * NanoBanana Pro: Multi-model gateway. Supports negative prompt separately.
 */
function nanobanana(input: FormatInput): string {
  let output = input.positive;
  if (input.negative) {
    output += `\nNegative: ${input.negative}`;
  }
  if (input.parameters) {
    output += `\n${input.parameters}`;
  }
  return truncate(output, 4000);
}

/**
 * Replicate: Similar to Stable Diffusion format. Supports negative prompt.
 */
function replicate(input: FormatInput): string {
  let output = input.positive;
  if (input.negative) {
    output += `\nNegative prompt: ${input.negative}`;
  }
  if (input.parameters) {
    output += `\n${input.parameters}`;
  }
  return truncate(output, 4000);
}

/**
 * Maps generator ID → formatter function.
 */
export const generatorFormats: Record<string, (input: FormatInput) => string> = {
  midjourney,
  dalle3,
  "stable-diffusion": stableDiffusion,
  flux,
  leonardo,
  firefly,
  ideogram,
  nanobanana,
  replicate,
};

/**
 * Format a prompt for any generator.
 * Falls back to simple positive + negative concatenation.
 */
export function formatForGenerator(
  generatorId: string,
  input: FormatInput,
): string {
  const formatter = generatorFormats[generatorId];
  if (formatter) {
    return formatter(input);
  }
  // Generic fallback
  let result = input.positive;
  if (input.negative) {
    result += `\nNegative: ${input.negative}`;
  }
  return result;
}
