import { describe, it, expect } from "vitest";
import { buildTemplatePrompt, templateBuilders } from "../src/template-builders";

/** All 21 template IDs that must have a builder */
const TEMPLATE_IDS = [
  "clothing", "social", "marketing", "brand", "threeD", "jewelry",
  "collection", "freestyle", "album", "poster", "sticker", "wallpaper",
  "mockup", "tattoo", "sneaker", "pattern", "character", "bookcover",
  "pin", "carwrap", "meme",
];

describe("templateBuilders", () => {
  it("has a builder for all 21 templates", () => {
    for (const id of TEMPLATE_IDS) {
      expect(templateBuilders[id]).toBeDefined();
    }
    expect(Object.keys(templateBuilders)).toHaveLength(21);
  });

  it("returns non-empty string for each builder with minimal input", () => {
    for (const id of TEMPLATE_IDS) {
      const result = templateBuilders[id]!({});
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    }
  });
});

describe("buildTemplatePrompt", () => {
  it("uses the correct builder for clothing", () => {
    const result = buildTemplatePrompt("clothing", {
      subject: "Roaring lion",
      style: "Streetwear",
      mood: "Bold",
      colors: "Black and gold",
    });
    expect(result).toContain("Roaring lion");
    expect(result).toContain("Streetwear style");
    expect(result).toContain("Bold mood");
    expect(result).toContain("print-ready");
  });

  it("uses the correct builder for brand", () => {
    const result = buildTemplatePrompt("brand", {
      brandname: "Nebula Labs",
      subject: "Abstract star",
      style: "Geometric minimal",
    });
    expect(result).toContain('"Nebula Labs"');
    expect(result).toContain("Abstract star");
    expect(result).toContain("brand logo design");
    expect(result).toContain("vector quality");
  });

  it("uses the correct builder for threeD", () => {
    const result = buildTemplatePrompt("threeD", {
      subject: "Floating crystal",
      material: "Iridescent glass",
      lighting: "Studio HDRI",
    });
    expect(result).toContain("3D render of Floating crystal");
    expect(result).toContain("Iridescent glass material");
    expect(result).toContain("octane render quality");
  });

  it("uses the correct builder for tattoo", () => {
    const result = buildTemplatePrompt("tattoo", {
      subject: "Koi fish",
      style: "Japanese traditional",
      placement: "forearm",
    });
    expect(result).toContain("Koi fish tattoo design");
    expect(result).toContain("Japanese traditional tattoo style");
    expect(result).toContain("designed for forearm");
    expect(result).toContain("tattoo flash sheet quality");
  });

  it("uses the correct builder for pattern", () => {
    const result = buildTemplatePrompt("pattern", {
      subject: "Tropical leaves",
      style: "Modern minimal",
      colors: "Green and cream",
    });
    expect(result).toContain("seamless tileable pattern");
    expect(result).toContain("Tropical leaves motif");
    expect(result).toContain("fabric-ready");
  });

  it("falls back to comma-joined fields for unknown template", () => {
    const result = buildTemplatePrompt("unknown-template", {
      foo: "hello",
      bar: "world",
    });
    expect(result).toBe("hello, world");
  });

  it("handles empty fields gracefully", () => {
    const result = buildTemplatePrompt("clothing", {
      subject: "A dragon",
    });
    expect(result).toContain("A dragon");
    expect(result).toContain("print-ready");
    expect(result).not.toContain("undefined");
  });
});

// --- Snapshot tests for every builder ---

describe("template builder snapshots", () => {
  const SNAPSHOT_INPUTS: Record<string, Record<string, string>> = {
    clothing: { subject: "Roaring lion", style: "Streetwear", mood: "Bold", colors: "Black and gold" },
    social: { subject: "Coffee shop aesthetic", style: "Warm minimalist", mood: "Cozy", colors: "Earth tones" },
    marketing: { product: "Smart Watch Pro", headline: "Time reimagined", style: "Tech minimal", mood: "Innovative" },
    brand: { brandname: "Nebula Labs", subject: "Abstract star", style: "Geometric minimal", mood: "Futuristic", colors: "Navy and silver" },
    threeD: { subject: "Floating crystal", style: "Hyperrealistic", material: "Iridescent glass", lighting: "Studio HDRI", camera: "Low angle" },
    jewelry: { piece: "Statement ring", style: "Art Deco", material: "Rose gold", gemstones: "Sapphire cluster", colors: "Blue and gold" },
    collection: { subject: "Skull motif", style: "Gothic street", theme: "Dark Royalty", colors: "Black, purple, gold", unique: "Crown elements" },
    freestyle: { subject: "Neon samurai", style: "Cyberpunk", mood: "Electric", colors: "Neon pink and blue", details: "Rain and reflections" },
    album: { subject: "Silhouette on mountain", style: "Dreamy analog", mood: "Melancholic", genre: "Indie folk", colors: "Faded earth" },
    poster: { subject: "Music festival", style: "Psychedelic", mood: "Energetic", colors: "Rainbow neon", composition: "Radial symmetry" },
    sticker: { subject: "Happy cat astronaut", style: "Kawaii", mood: "Playful", colors: "Pastel rainbow", shape: "Round" },
    wallpaper: { subject: "Sakura tree", style: "Japanese watercolor", mood: "Serene", colors: "Soft pink and white", device: "desktop 16:9" },
    mockup: { product: "Ceramic mug", scene: "Rustic wood table", style: "Lifestyle", colors: "Warm neutrals", lighting: "Natural window" },
    tattoo: { subject: "Koi fish", style: "Japanese traditional", placement: "Forearm sleeve", size: "Medium", colors: "Black and red ink" },
    sneaker: { silhouette: "Air Max 1", style: "Y2K futurism", materials: "Translucent TPU", colors: "Chrome and powder blue", details: "LED sole" },
    pattern: { subject: "Tropical leaves", style: "Modern minimal", mood: "Fresh", colors: "Green and cream", density: "Medium" },
    character: { character: "Steampunk inventor", style: "Anime-inspired", outfit: "Brass goggles and leather coat", colors: "Copper and brown", pose: "Confident stance" },
    bookcover: { subject: "Mysterious lighthouse", style: "Moody atmospheric", genre: "Gothic horror", colors: "Dark teal and amber", composition: "Upper third clear" },
    pin: { subject: "Sleeping fox", style: "Minimalist cute", mood: "Cozy", colors: "Orange, white, gold", shape: "Irregular organic" },
    carwrap: { design: "Digital camo", vehicle: "BMW M3", style: "Military tactical", colors: "Matte black and olive", coverage: "Full wrap" },
    meme: { subject: "Surprised capybara", expression: "Shocked open mouth", style: "Photorealistic", colors: "Natural", context: "Office cubicle" },
  };

  for (const [id, fields] of Object.entries(SNAPSHOT_INPUTS)) {
    it(`snapshot: ${id}`, () => {
      const result = buildTemplatePrompt(id, fields);
      expect(result).toMatchSnapshot();
    });
  }
});
