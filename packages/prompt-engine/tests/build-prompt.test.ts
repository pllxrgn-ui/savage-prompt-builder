import { describe, it, expect } from "vitest";
import { buildPrompt, type PromptInput } from "../src/index";

function makeInput(overrides: Partial<PromptInput> = {}): PromptInput {
  return {
    templateId: "portrait",
    fields: { subject: "A woman with red hair" },
    styles: [],
    palette: null,
    keywords: [],
    negative: "",
    generator: "midjourney",
    phrases: [],
    ...overrides,
  };
}

describe("buildPrompt", () => {
  it("returns all four fields in BuiltPrompt", () => {
    const result = buildPrompt(makeInput());
    expect(result).toHaveProperty("positive");
    expect(result).toHaveProperty("negative");
    expect(result).toHaveProperty("parameters");
    expect(result).toHaveProperty("full");
  });

  it("positive includes template output", () => {
    const result = buildPrompt(makeInput());
    expect(result.positive).toContain("A woman with red hair");
    expect(result.positive).toContain("professional photography");
  });

  it("appends styles to positive", () => {
    const result = buildPrompt(makeInput({
      styles: ["Rembrandt lighting", "Film grain"],
    }));
    expect(result.positive).toContain("Rembrandt lighting");
    expect(result.positive).toContain("Film grain");
  });

  it("appends palette to positive", () => {
    const result = buildPrompt(makeInput({
      palette: "warm sunset tones",
    }));
    expect(result.positive).toContain("color palette: warm sunset tones");
  });

  it("appends keywords to positive", () => {
    const result = buildPrompt(makeInput({
      keywords: ["8K resolution", "highly detailed"],
    }));
    expect(result.positive).toContain("8K resolution");
    expect(result.positive).toContain("highly detailed");
  });

  it("appends phrases to positive", () => {
    const result = buildPrompt(makeInput({
      phrases: ["trending on ArtStation"],
    }));
    expect(result.positive).toContain("trending on ArtStation");
  });

  it("passes negative through unchanged", () => {
    const result = buildPrompt(makeInput({
      negative: "blurry, low quality",
    }));
    expect(result.negative).toBe("blurry, low quality");
  });

  it("formats full for midjourney with --no", () => {
    const result = buildPrompt(makeInput({
      negative: "bad anatomy",
      generator: "midjourney",
    }));
    expect(result.full).toContain("--no bad anatomy");
  });

  it("formats full for dalle3 with Avoid", () => {
    const result = buildPrompt(makeInput({
      negative: "blurry",
      generator: "dalle3",
    }));
    expect(result.full).toContain("Avoid: blurry");
  });

  it("formats full for stable-diffusion with separate negative", () => {
    const result = buildPrompt(makeInput({
      negative: "deformed",
      generator: "stable-diffusion",
    }));
    expect(result.full).toContain("Negative prompt: deformed");
  });

  it("handles empty input gracefully", () => {
    const result = buildPrompt(makeInput({
      fields: {},
      styles: [],
      palette: null,
      keywords: [],
      negative: "",
      phrases: [],
    }));
    expect(result.positive).toBeTruthy();
    expect(result.full).toBeTruthy();
  });
});

// --- End-to-end snapshot: all 20 templates × 3 key generators ---

describe("integration snapshots", () => {
  const GENERATORS = ["midjourney", "dalle3", "stable-diffusion"] as const;
  const TEMPLATES: Array<{ id: string; fields: Record<string, string> }> = [
    { id: "portrait", fields: { subject: "Young woman", mood: "Ethereal" } },
    { id: "landscape", fields: { scene: "Mountain at sunrise" } },
    { id: "street", fields: { scene: "Tokyo rain" } },
    { id: "product", fields: { product: "Perfume bottle" } },
    { id: "digital-art", fields: { subject: "Dragon", style: "Fantasy" } },
    { id: "anime", fields: { character: "Cyberpunk mage" } },
    { id: "watercolor", fields: { subject: "Wildflowers" } },
    { id: "comic", fields: { scene: "Hero vs villain" } },
    { id: "logo", fields: { brand: "Nebula Labs" } },
    { id: "ui-mockup", fields: { app: "Trading dashboard" } },
    { id: "poster", fields: { title: "ECLIPSE" } },
    { id: "pattern", fields: { motif: "Tropical leaves" } },
    { id: "3d-render", fields: { subject: "Crystal sculpture" } },
    { id: "isometric", fields: { scene: "Coffee shop" } },
    { id: "arch-viz", fields: { space: "Scandinavian loft" } },
    { id: "character-3d", fields: { character: "Steampunk inventor" } },
    { id: "abstract", fields: { concept: "Nostalgia" } },
    { id: "surreal", fields: { scene: "Floating library" } },
    { id: "pixel-art", fields: { scene: "Fantasy tavern" } },
    { id: "collage", fields: { theme: "Retro-futurism" } },
  ];

  for (const tmpl of TEMPLATES) {
    for (const gen of GENERATORS) {
      it(`${tmpl.id} × ${gen}`, () => {
        const result = buildPrompt({
          templateId: tmpl.id,
          fields: tmpl.fields,
          styles: ["dramatic lighting"],
          palette: "warm tones",
          keywords: ["8K", "detailed"],
          negative: "blurry, low quality",
          generator: gen,
          phrases: ["trending on ArtStation"],
        });
        expect(result).toMatchSnapshot();
      });
    }
  }
});
