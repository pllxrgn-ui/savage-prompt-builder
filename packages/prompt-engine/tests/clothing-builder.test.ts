import { describe, it, expect } from "vitest";
import {
  buildClothingPrompt,
  type ClothingPromptInput,
} from "../src/clothing-builder";

function makeClothingInput(
  overrides: Partial<ClothingPromptInput> = {},
): ClothingPromptInput {
  return {
    subjects: [],
    customSubject: "",
    vibeTheme: null,
    letteringStyle: null,
    letteringText: "",
    layout: null,
    garmentType: null,
    placements: [],
    printSize: null,
    garmentColor: null,
    customGarmentColors: [],
    printMethodPrefix: null,
    printMethodAutoNegatives: [],
    artStyles: [],
    colorPalette: null,
    customPaletteColors: [],
    detailLevel: null,
    background: "transparent",
    customBackgroundColors: [],
    outputQuality: null,
    extraNotes: "",
    userNegatives: [],
    customTags: {},
    ...overrides,
  };
}

describe("buildClothingPrompt", () => {
  it("returns positive and negative strings", () => {
    const result = buildClothingPrompt(makeClothingInput());
    expect(result).toHaveProperty("positive");
    expect(result).toHaveProperty("negative");
    expect(typeof result.positive).toBe("string");
    expect(typeof result.negative).toBe("string");
  });

  it("inserts [SUBJECT] placeholder when no subjects given", () => {
    const result = buildClothingPrompt(makeClothingInput());
    expect(result.positive).toContain("[SUBJECT] design");
  });

  it("includes selected subject", () => {
    const result = buildClothingPrompt(
      makeClothingInput({ subjects: ["skull"] }),
    );
    expect(result.positive).toContain("skull design");
    expect(result.positive).not.toContain("[SUBJECT]");
  });

  it("includes custom garment colors in output", () => {
    const result = buildClothingPrompt(
      makeClothingInput({ customGarmentColors: ["#FF6B00", "#1a1a1a"] }),
    );
    expect(result.positive).toContain("#FF6B00");
    expect(result.positive).toContain("#1a1a1a");
    expect(result.positive).toContain("garment colors");
  });

  it("includes custom palette colors in output", () => {
    const result = buildClothingPrompt(
      makeClothingInput({ customPaletteColors: ["#A78BFA", "#F5C842"] }),
    );
    expect(result.positive).toContain("#A78BFA");
    expect(result.positive).toContain("#F5C842");
    expect(result.positive).toContain("design colors");
  });

  it("includes both custom garment and palette colors", () => {
    const result = buildClothingPrompt(
      makeClothingInput({
        subjects: ["dragon"],
        customGarmentColors: ["#000000"],
        customPaletteColors: ["#FF0000", "#00FF00"],
      }),
    );
    expect(result.positive).toContain("#000000 garment colors");
    expect(result.positive).toContain("#FF0000, #00FF00 design colors");
  });

  it("does not output garment colors section when array is empty", () => {
    const result = buildClothingPrompt(
      makeClothingInput({ customGarmentColors: [] }),
    );
    expect(result.positive).not.toContain("garment colors");
  });

  it("does not output design colors section when array is empty", () => {
    const result = buildClothingPrompt(
      makeClothingInput({ customPaletteColors: [] }),
    );
    expect(result.positive).not.toContain("design colors");
  });

  it("includes garment type and color together", () => {
    const result = buildClothingPrompt(
      makeClothingInput({
        garmentType: "t-shirt",
        garmentColor: "black",
        customGarmentColors: ["#FF6B00"],
      }),
    );
    expect(result.positive).toContain("for t shirt");
    expect(result.positive).toContain("on black garment");
    expect(result.positive).toContain("#FF6B00 garment colors");
  });

  it("includes named palette alongside custom palette colors", () => {
    const result = buildClothingPrompt(
      makeClothingInput({
        colorPalette: "Sunset Blaze",
        customPaletteColors: ["#AABBCC"],
      }),
    );
    expect(result.positive).toContain("Sunset Blaze color palette");
    expect(result.positive).toContain("#AABBCC design colors");
  });

  it("includes vibe theme", () => {
    const result = buildClothingPrompt(
      makeClothingInput({ vibeTheme: "retro" }),
    );
    expect(result.positive).toContain("retro vibe");
  });

  it("includes background", () => {
    const result = buildClothingPrompt(
      makeClothingInput({ background: "white" }),
    );
    expect(result.positive).toContain("white background");
  });

  it("omits transparent background from output", () => {
    const result = buildClothingPrompt(
      makeClothingInput({ background: "transparent" }),
    );
    expect(result.positive).not.toContain("transparent background");
  });

  it("includes print-ready quality", () => {
    const result = buildClothingPrompt(
      makeClothingInput({ outputQuality: "print-ready" }),
    );
    expect(result.positive).toContain("print-ready");
    expect(result.positive).toContain("high resolution");
  });

  it("includes base negatives", () => {
    const result = buildClothingPrompt(makeClothingInput());
    expect(result.negative).toContain("worst quality");
    expect(result.negative).toContain("text artifacts");
  });

  it("includes user negatives", () => {
    const result = buildClothingPrompt(
      makeClothingInput({ userNegatives: ["blurry", "watermark"] }),
    );
    expect(result.negative).toContain("blurry");
    expect(result.negative).toContain("watermark");
  });

  it("includes custom tags for sections", () => {
    const result = buildClothingPrompt(
      makeClothingInput({
        customTags: { "art-style": ["cyberpunk neon"] },
      }),
    );
    expect(result.positive).toContain("cyberpunk neon");
  });

  it("includes placements", () => {
    const result = buildClothingPrompt(
      makeClothingInput({ placements: ["front-center", "back"] }),
    );
    expect(result.positive).toContain("front center + back placement");
  });

  it("includes lettering with text", () => {
    const result = buildClothingPrompt(
      makeClothingInput({
        letteringStyle: "gothic",
        letteringText: "SAVAGE",
      }),
    );
    expect(result.positive).toContain('"SAVAGE" in gothic lettering');
  });

  it("includes art styles", () => {
    const result = buildClothingPrompt(
      makeClothingInput({ artStyles: ["neo-traditional", "watercolor"] }),
    );
    expect(result.positive).toContain(
      "neo-traditional + watercolor style",
    );
  });
});
