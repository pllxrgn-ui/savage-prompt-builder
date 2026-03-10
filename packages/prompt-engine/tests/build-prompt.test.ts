import { describe, it, expect } from "vitest";
import { buildPrompt, type PromptInput } from "../src/index";

function makeInput(overrides: Partial<PromptInput> = {}): PromptInput {
  return {
    templateId: "clothing",
    fields: { subject: "A roaring lion" },
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
    expect(result.positive).toContain("A roaring lion");
    expect(result.positive).toContain("print-ready");
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

// --- End-to-end snapshot: all 21 templates × 3 key generators ---

describe("integration snapshots", () => {
  const GENERATORS = ["midjourney", "dalle3", "stable-diffusion"] as const;
  const TEMPLATES: Array<{ id: string; fields: Record<string, string> }> = [
    { id: "clothing", fields: { subject: "Roaring lion", style: "Streetwear" } },
    { id: "social", fields: { subject: "Coffee aesthetic", mood: "Cozy" } },
    { id: "marketing", fields: { product: "Smart Watch", style: "Tech minimal" } },
    { id: "brand", fields: { brandname: "Nebula Labs", subject: "Star" } },
    { id: "threeD", fields: { subject: "Crystal", material: "Glass" } },
    { id: "jewelry", fields: { piece: "Ring", style: "Art Deco" } },
    { id: "collection", fields: { subject: "Skull", theme: "Dark Royalty" } },
    { id: "freestyle", fields: { subject: "Neon samurai", style: "Cyberpunk" } },
    { id: "album", fields: { subject: "Mountain silhouette", genre: "Indie" } },
    { id: "poster", fields: { subject: "Music festival", style: "Psychedelic" } },
    { id: "sticker", fields: { subject: "Cat astronaut", style: "Kawaii" } },
    { id: "wallpaper", fields: { subject: "Sakura tree", style: "Watercolor" } },
    { id: "mockup", fields: { product: "Ceramic mug", scene: "Wood table" } },
    { id: "tattoo", fields: { subject: "Koi fish", style: "Japanese" } },
    { id: "sneaker", fields: { silhouette: "Air Max 1", style: "Y2K" } },
    { id: "pattern", fields: { subject: "Tropical leaves", style: "Minimal" } },
    { id: "character", fields: { character: "Steampunk inventor" } },
    { id: "bookcover", fields: { subject: "Lighthouse", genre: "Gothic" } },
    { id: "pin", fields: { subject: "Sleeping fox", style: "Cute" } },
    { id: "carwrap", fields: { design: "Digital camo", vehicle: "BMW M3" } },
    { id: "meme", fields: { subject: "Surprised capybara", style: "Photorealistic" } },
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
