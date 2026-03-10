import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GeneratorId } from "@/types";

interface MockupState {
  enabled: boolean;
  item: string;
  color: string;
  display: string;
}

interface BuilderState {
  activeTemplateId: string | null;
  templateFields: Record<string, string>;
  selectedStyles: string[];
  selectedPalette: string | null;
  selectedKeywords: string[];
  negativePrompt: string;
  selectedGenerator: GeneratorId;
  selectedPhrases: string[];
  mockup: MockupState;
}

interface BuilderActions {
  setTemplate: (id: string) => void;
  setField: (fieldId: string, value: string) => void;
  toggleStyle: (style: string) => void;
  setPalette: (palette: string | null) => void;
  toggleKeyword: (keyword: string) => void;
  setNegative: (value: string) => void;
  setGenerator: (id: GeneratorId) => void;
  togglePhrase: (phrase: string) => void;
  setMockup: (mockup: MockupState) => void;
  resetBuilder: () => void;
}

type BuilderStore = BuilderState & BuilderActions;

const INITIAL_MOCKUP: MockupState = {
  enabled: false,
  item: "",
  color: "",
  display: "",
};

const INITIAL_STATE: BuilderState = {
  activeTemplateId: null,
  templateFields: {},
  selectedStyles: [],
  selectedPalette: null,
  selectedKeywords: [],
  negativePrompt: "",
  selectedGenerator: "midjourney",
  selectedPhrases: [],
  mockup: INITIAL_MOCKUP,
};

export const useBuilderStore = create<BuilderStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      setTemplate: (id) =>
        set({
          activeTemplateId: id,
          templateFields: {},
          selectedStyles: [],
          selectedPalette: null,
          selectedKeywords: [],
          negativePrompt: "",
          selectedPhrases: [],
        }),

      setField: (fieldId, value) =>
        set((state) => ({
          templateFields: { ...state.templateFields, [fieldId]: value },
        })),

      toggleStyle: (style) =>
        set((state) => ({
          selectedStyles: state.selectedStyles.includes(style)
            ? state.selectedStyles.filter((s) => s !== style)
            : [...state.selectedStyles, style],
        })),

      setPalette: (palette) => set({ selectedPalette: palette }),

      toggleKeyword: (keyword) =>
        set((state) => ({
          selectedKeywords: state.selectedKeywords.includes(keyword)
            ? state.selectedKeywords.filter((k) => k !== keyword)
            : [...state.selectedKeywords, keyword],
        })),

      setNegative: (value) => set({ negativePrompt: value }),

      setGenerator: (id) => set({ selectedGenerator: id }),

      togglePhrase: (phrase) =>
        set((state) => ({
          selectedPhrases: state.selectedPhrases.includes(phrase)
            ? state.selectedPhrases.filter((p) => p !== phrase)
            : [...state.selectedPhrases, phrase],
        })),

      setMockup: (mockup) => set({ mockup }),

      resetBuilder: () => set(INITIAL_STATE),
    }),
    {
      name: "spb-builder",
      partialize: (state) => ({
        activeTemplateId: state.activeTemplateId,
        templateFields: state.templateFields,
        selectedStyles: state.selectedStyles,
        selectedPalette: state.selectedPalette,
        selectedKeywords: state.selectedKeywords,
        negativePrompt: state.negativePrompt,
        selectedGenerator: state.selectedGenerator,
        selectedPhrases: state.selectedPhrases,
      }),
    },
  ),
);
