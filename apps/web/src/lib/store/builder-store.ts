import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GeneratorId } from "@/types";
import { useSettingsStore } from "./settings-store";

interface MockupState {
  enabled: boolean;
  item: string;
  color: string;
  display: string;
}

type GarmentMode = "dark" | "light" | null;

export interface CustomStyle {
  id: string;
  label: string;
  content: string;
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
  garmentMode: GarmentMode;
  referenceImageUrl: string | null;
  variables: Record<string, string>;
  variations: Record<string, string>[];
  activeVariationIndex: number;
  undoStack: Record<string, string>[];
  redoStack: Record<string, string>[];
  customStyles: CustomStyle[];
}

interface BuilderActions {
  setTemplate: (id: string) => void;
  setField: (fieldId: string, value: string) => void;
  toggleStyle: (style: string) => void;
  setStyles: (styles: string[]) => void;
  setPalette: (palette: string | null) => void;
  toggleKeyword: (keyword: string) => void;
  setKeywords: (keywords: string[]) => void;
  setNegative: (value: string) => void;
  setGenerator: (id: GeneratorId) => void;
  togglePhrase: (phrase: string) => void;
  loadRecipe: (recipe: {
    templateId: string;
    fieldData: Record<string, string>;
    styles: string[];
    palette: string | null;
    keywords: string[];
    negative: string;
    generatorId: GeneratorId;
    phrases?: string[];
    garmentMode?: "dark" | "light" | null;
    referenceImageUrl?: string | null;
    variables?: Record<string, string>;
    variations?: Record<string, string>[];
    mockup?: { enabled: boolean; item: string; color: string; display: string } | null;
  }) => void;
  setMockup: (mockup: MockupState) => void;
  setGarmentMode: (mode: GarmentMode) => void;
  setReferenceImageUrl: (url: string | null) => void;
  setVariable: (key: string, value: string) => void;
  removeVariable: (key: string) => void;
  addVariation: () => void;
  removeVariation: (index: number) => void;
  switchVariation: (index: number) => void;
  undo: () => void;
  redo: () => void;
  resetBuilder: () => void;
  addCustomStyle: (style: CustomStyle) => void;
  updateCustomStyle: (id: string, updates: Partial<Omit<CustomStyle, 'id'>>) => void;
  deleteCustomStyle: (id: string) => void;
}

export type BuilderStore = BuilderState & BuilderActions;

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
  garmentMode: null,
  referenceImageUrl: null,
  variables: {},
  variations: [{}],
  activeVariationIndex: 0,
  undoStack: [],
  redoStack: [],
  customStyles: [],
};

const MAX_UNDO = 20;

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
          garmentMode: null,
          referenceImageUrl: null,
          variables: {},
          variations: [{}],
          activeVariationIndex: 0,
        }),

      setField: (fieldId, value) =>
        set((state) => {
          const newFields = { ...state.templateFields, [fieldId]: value };
          const updatedVariations = [...state.variations];
          updatedVariations[state.activeVariationIndex] = newFields;
          return {
            undoStack: [...state.undoStack, state.templateFields].slice(-MAX_UNDO),
            redoStack: [],
            templateFields: newFields,
            variations: updatedVariations,
          };
        }),

      toggleStyle: (style) =>
        set((state) => ({
          selectedStyles: state.selectedStyles.includes(style)
            ? state.selectedStyles.filter((s) => s !== style)
            : [...state.selectedStyles, style],
        })),

      setStyles: (styles) => set({ selectedStyles: styles }),

      setPalette: (palette) => set({ selectedPalette: palette }),

      toggleKeyword: (keyword) =>
        set((state) => ({
          selectedKeywords: state.selectedKeywords.includes(keyword)
            ? state.selectedKeywords.filter((k) => k !== keyword)
            : [...state.selectedKeywords, keyword],
        })),

      setKeywords: (keywords) => set({ selectedKeywords: keywords }),

      setNegative: (value) => set({ negativePrompt: value }),

      setGenerator: (id) => set({ selectedGenerator: id }),

      togglePhrase: (phrase) =>
        set((state) => ({
          selectedPhrases: state.selectedPhrases.includes(phrase)
            ? state.selectedPhrases.filter((p) => p !== phrase)
            : [...state.selectedPhrases, phrase],
        })),

      loadRecipe: (recipe) =>
        set({
          activeTemplateId: recipe.templateId,
          templateFields: recipe.fieldData,
          selectedStyles: recipe.styles,
          selectedPalette: recipe.palette,
          selectedKeywords: recipe.keywords,
          negativePrompt: recipe.negative,
          selectedGenerator: recipe.generatorId,
          selectedPhrases: recipe.phrases ?? [],
          garmentMode: recipe.garmentMode ?? null,
          referenceImageUrl: recipe.referenceImageUrl ?? null,
          variables: recipe.variables ?? {},
          variations: recipe.variations?.length ? recipe.variations : [recipe.fieldData],
          activeVariationIndex: 0,
          mockup: recipe.mockup ?? INITIAL_MOCKUP,
          undoStack: [],
          redoStack: [],
        }),

      setMockup: (mockup) => set({ mockup }),

      setGarmentMode: (mode) => set({ garmentMode: mode }),

      setReferenceImageUrl: (url) => set({ referenceImageUrl: url }),

      setVariable: (key, value) =>
        set((state) => ({
          variables: { ...state.variables, [key]: value },
        })),

      removeVariable: (key) =>
        set((state) => {
          const { [key]: _, ...rest } = state.variables;
          return { variables: rest };
        }),

      addVariation: () =>
        set((state) => {
          if (state.variations.length >= 10) return state;
          // Save current fields to current variation slot
          const updated = [...state.variations];
          updated[state.activeVariationIndex] = { ...state.templateFields };
          return {
            variations: [...updated, {}],
            activeVariationIndex: updated.length,
            templateFields: {},
            undoStack: [],
            redoStack: [],
          };
        }),

      removeVariation: (index) =>
        set((state) => {
          if (state.variations.length <= 1) return state;
          const updated = [...state.variations];
          updated.splice(index, 1);
          const newIndex = Math.min(state.activeVariationIndex, updated.length - 1);
          return {
            variations: updated,
            activeVariationIndex: newIndex,
            templateFields: { ...updated[newIndex]! },
            undoStack: [],
            redoStack: [],
          };
        }),

      switchVariation: (index) =>
        set((state) => {
          if (index === state.activeVariationIndex) return state;
          if (index < 0 || index >= state.variations.length) return state;
          // Save current fields to current variation slot
          const updated = [...state.variations];
          updated[state.activeVariationIndex] = { ...state.templateFields };
          return {
            variations: updated,
            activeVariationIndex: index,
            templateFields: { ...updated[index]! },
            undoStack: [],
            redoStack: [],
          };
        }),

      undo: () =>
        set((state) => {
          if (state.undoStack.length === 0) return state;
          const previous = state.undoStack[state.undoStack.length - 1]!;
          return {
            undoStack: state.undoStack.slice(0, -1),
            redoStack: [...state.redoStack, state.templateFields].slice(-MAX_UNDO),
            templateFields: previous,
          };
        }),

      redo: () =>
        set((state) => {
          if (state.redoStack.length === 0) return state;
          const next = state.redoStack[state.redoStack.length - 1]!;
          return {
            redoStack: state.redoStack.slice(0, -1),
            undoStack: [...state.undoStack, state.templateFields].slice(-MAX_UNDO),
            templateFields: next,
          };
        }),

      resetBuilder: () =>
        set((state) => ({
          ...INITIAL_STATE,
          selectedGenerator: useSettingsStore.getState().defaultGenerator,
          customStyles: state.customStyles,
        })),

      addCustomStyle: (style) =>
        set((state) => ({
          customStyles: [...state.customStyles, style],
        })),

      updateCustomStyle: (id, updates) =>
        set((state) => ({
          customStyles: state.customStyles.map((s) =>
            s.id === id ? { ...s, ...updates } : s,
          ),
        })),

      deleteCustomStyle: (id) =>
        set((state) => ({
          customStyles: state.customStyles.filter((s) => s.id !== id),
          selectedStyles: state.selectedStyles.filter((label) =>
            !state.customStyles.find((cs) => cs.id === id && cs.label === label),
          ),
        })),
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
        garmentMode: state.garmentMode,
        referenceImageUrl: state.referenceImageUrl,
        variables: state.variables,
        variations: state.variations,
        activeVariationIndex: state.activeVariationIndex,
        customStyles: state.customStyles,
      }),
    },
  ),
);
