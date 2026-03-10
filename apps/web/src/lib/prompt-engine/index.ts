/**
 * Re-export prompt engine from the shared package.
 * Components import from "@/lib/prompt-engine" for convenience.
 */
export {
  buildPrompt,
  buildTemplatePrompt,
  formatForGenerator,
  templateBuilders,
  generatorFormats,
} from "@spb/prompt-engine";

export type {
  PromptInput,
  BuiltPrompt,
  FormatInput,
} from "@spb/prompt-engine";
