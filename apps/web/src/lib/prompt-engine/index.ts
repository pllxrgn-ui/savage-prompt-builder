/**
 * Re-export prompt engine from the shared package.
 * Components import from "@/lib/prompt-engine" for convenience.
 */
export {
  buildPrompt,
  buildTemplatePrompt,
  buildClothingPrompt,
  formatForGenerator,
  templateBuilders,
  generatorFormats,
} from "@spb/prompt-engine";

export type {
  PromptInput,
  BuiltPrompt,
  FormatInput,
  ClothingPromptInput,
  ClothingPromptOutput,
} from "@spb/prompt-engine";
