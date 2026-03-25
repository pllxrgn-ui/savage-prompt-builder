import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ClothingState {
  // Phase 1: Design
  subjects: string[];
  customSubject: string;
  vibeTheme: string | null;
  letteringStyle: string | null;
  letteringText: string;
  layout: string | null;
  referenceImageUrls: string[];

  // Phase 2: Garment
  garmentType: string | null;
  placements: string[];
  printSize: string | null;
  garmentColor: string | null;
  customGarmentColors: string[];

  // Phase 3: Print Method
  printMethod: string | null;

  // Phase 4: Look & Feel
  artStyles: string[];
  colorPalette: string | null;
  customPaletteColors: string[];
  detailLevel: string | null;

  // Phase 5: Final Touches
  background: string | null;
  customBackgroundColors: string[];
  outputQuality: string | null;
  extraNotes: string;

  // Per-section custom pills (keyed by section id)
  customTags: Record<string, string[]>;
}

interface ClothingActions {
  // Phase 1
  toggleSubject: (id: string) => void;
  setSubjects: (ids: string[]) => void;
  setCustomSubject: (value: string) => void;
  setVibeTheme: (id: string | null) => void;
  setLetteringStyle: (id: string | null) => void;
  setLetteringText: (value: string) => void;
  setLayout: (id: string | null) => void;
  addReferenceImage: (url: string) => void;
  removeReferenceImage: (url: string) => void;
  clearReferenceImages: () => void;

  // Phase 2
  setGarmentType: (id: string | null) => void;
  togglePlacement: (id: string) => void;
  setPrintSize: (id: string | null) => void;
  setGarmentColor: (id: string | null) => void;
  setCustomGarmentColors: (colors: string[]) => void;
  addCustomGarmentColor: (color: string) => void;
  removeCustomGarmentColor: (index: number) => void;

  // Phase 3
  setPrintMethod: (id: string | null) => void;

  // Phase 4
  toggleArtStyle: (id: string) => void;
  setArtStyles: (ids: string[]) => void;
  setColorPalette: (id: string | null) => void;
  setCustomPaletteColors: (colors: string[]) => void;
  addCustomPaletteColor: (color: string) => void;
  removeCustomPaletteColor: (index: number) => void;
  setDetailLevel: (id: string | null) => void;

  // Phase 5
  setBackground: (id: string | null) => void;
  setCustomBackgroundColors: (colors: string[]) => void;
  addCustomBackgroundColor: (color: string) => void;
  removeCustomBackgroundColor: (index: number) => void;
  setOutputQuality: (id: string | null) => void;
  setExtraNotes: (value: string) => void;

  // Custom tags
  addCustomTag: (section: string, tag: string) => void;
  removeCustomTag: (section: string, tag: string) => void;

  // Global
  resetClothing: () => void;
}

export type ClothingStore = ClothingState & ClothingActions;

const INITIAL_STATE: ClothingState = {
  subjects: [],
  customSubject: "",
  vibeTheme: null,
  letteringStyle: null,
  letteringText: "",
  layout: null,
  referenceImageUrls: [],

  garmentType: null,
  placements: [],
  printSize: null,
  garmentColor: null,
  customGarmentColors: [],

  printMethod: null,

  artStyles: [],
  colorPalette: null,
  customPaletteColors: [],
  detailLevel: null,

  background: null,
  customBackgroundColors: [],
  outputQuality: null,
  extraNotes: "",

  customTags: {},
};

const MAX_SUBJECTS = 5;
const MAX_ART_STYLES = 3;
const MAX_REF_IMAGES = 5;

export const useClothingStore = create<ClothingStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      // Phase 1: Design
      toggleSubject: (id) =>
        set((s) => ({
          subjects: s.subjects.includes(id)
            ? s.subjects.filter((x) => x !== id)
            : s.subjects.length < MAX_SUBJECTS
              ? [...s.subjects, id]
              : s.subjects,
        })),
      setSubjects: (ids) => set({ subjects: ids.slice(0, MAX_SUBJECTS) }),
      setCustomSubject: (value) => set({ customSubject: value }),
      setVibeTheme: (id) => set({ vibeTheme: id }),
      setLetteringStyle: (id) => set({ letteringStyle: id }),
      setLetteringText: (value) => set({ letteringText: value }),
      setLayout: (id) => set({ layout: id }),
      addReferenceImage: (url) =>
        set((s) => ({
          referenceImageUrls: s.referenceImageUrls.length < MAX_REF_IMAGES
            ? [...s.referenceImageUrls, url]
            : s.referenceImageUrls,
        })),
      removeReferenceImage: (url) =>
        set((s) => ({
          referenceImageUrls: s.referenceImageUrls.filter((u) => u !== url),
        })),
      clearReferenceImages: () => set({ referenceImageUrls: [] }),

      // Phase 2: Garment
      setGarmentType: (id) => set({ garmentType: id }),
      togglePlacement: (id) =>
        set((s) => ({
          placements: s.placements.includes(id)
            ? s.placements.filter((x) => x !== id)
            : [...s.placements, id],
        })),
      setPrintSize: (id) => set({ printSize: id }),
      setGarmentColor: (id) => set({ garmentColor: id }),
      setCustomGarmentColors: (colors) => set({ customGarmentColors: colors }),
      addCustomGarmentColor: (color) =>
        set((s) => ({
          customGarmentColors: s.customGarmentColors.length < 8
            ? [...s.customGarmentColors, color]
            : s.customGarmentColors,
        })),
      removeCustomGarmentColor: (index) =>
        set((s) => ({ customGarmentColors: s.customGarmentColors.filter((_, i) => i !== index) })),

      // Phase 3: Print Method
      setPrintMethod: (id) => set({ printMethod: id }),

      // Phase 4: Look & Feel
      toggleArtStyle: (id) =>
        set((s) => ({
          artStyles: s.artStyles.includes(id)
            ? s.artStyles.filter((x) => x !== id)
            : s.artStyles.length < MAX_ART_STYLES
              ? [...s.artStyles, id]
              : s.artStyles,
        })),
      setArtStyles: (ids) => set({ artStyles: ids.slice(0, MAX_ART_STYLES) }),
      setColorPalette: (id) => set({ colorPalette: id }),
      setCustomPaletteColors: (colors) => set({ customPaletteColors: colors }),
      addCustomPaletteColor: (color) =>
        set((s) => ({ customPaletteColors: [...s.customPaletteColors, color] })),
      removeCustomPaletteColor: (index) =>
        set((s) => ({ customPaletteColors: s.customPaletteColors.filter((_, i) => i !== index) })),
      setDetailLevel: (id) => set({ detailLevel: id }),

      // Phase 5: Final Touches
      setBackground: (id) => set({ background: id }),
      setCustomBackgroundColors: (colors) => set({ customBackgroundColors: colors }),
      addCustomBackgroundColor: (color) =>
        set((s) => ({
          customBackgroundColors: s.customBackgroundColors.length < 8
            ? [...s.customBackgroundColors, color]
            : s.customBackgroundColors,
        })),
      removeCustomBackgroundColor: (index) =>
        set((s) => ({ customBackgroundColors: s.customBackgroundColors.filter((_, i) => i !== index) })),
      setOutputQuality: (id) => set({ outputQuality: id }),
      setExtraNotes: (value) => set({ extraNotes: value }),

      // Custom tags
      addCustomTag: (section, tag) =>
        set((s) => ({
          customTags: {
            ...s.customTags,
            [section]: [...(s.customTags[section] ?? []), tag],
          },
        })),
      removeCustomTag: (section, tag) =>
        set((s) => ({
          customTags: {
            ...s.customTags,
            [section]: (s.customTags[section] ?? []).filter((t) => t !== tag),
          },
        })),

      // Global
      resetClothing: () => set(INITIAL_STATE),
    }),
    {
      name: "spb-clothing",
      version: 1,
      partialize: (state) => {
        // Reference images are session-only — don't persist blob URLs
        const { referenceImageUrls: _, ...rest } = state;
        return rest;
      },
    },
  ),
);
