import { describe, it, expect } from "vitest";
import { buildTemplatePrompt, templateBuilders } from "../src/template-builders";

/** All 20 template IDs that must have a builder */
const TEMPLATE_IDS = [
  "portrait", "landscape", "street", "product",
  "digital-art", "anime", "watercolor", "comic",
  "logo", "ui-mockup", "poster", "pattern",
  "3d-render", "isometric", "arch-viz", "character-3d",
  "abstract", "surreal", "pixel-art", "collage",
];

describe("templateBuilders", () => {
  it("has a builder for all 20 templates", () => {
    for (const id of TEMPLATE_IDS) {
      expect(templateBuilders[id]).toBeDefined();
    }
    expect(Object.keys(templateBuilders)).toHaveLength(20);
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
  it("uses the correct builder for portrait", () => {
    const result = buildTemplatePrompt("portrait", {
      subject: "A young woman with freckles",
      setting: "Natural light studio",
      mood: "Ethereal",
      camera: "Sony A7III, 85mm f/1.4",
    });
    expect(result).toContain("A young woman with freckles");
    expect(result).toContain("Natural light studio");
    expect(result).toContain("Ethereal");
    expect(result).toContain("Sony A7III");
    expect(result).toContain("professional photography");
  });

  it("uses the correct builder for landscape", () => {
    const result = buildTemplatePrompt("landscape", {
      scene: "Misty mountain valley at sunrise",
      weather: "Golden hour, low fog",
    });
    expect(result).toContain("Misty mountain valley at sunrise");
    expect(result).toContain("Golden hour");
    expect(result).toContain("landscape photography");
  });

  it("uses the correct builder for logo", () => {
    const result = buildTemplatePrompt("logo", {
      brand: "Nebula Labs",
      style: "Geometric, minimal",
      icon: "Abstract star",
    });
    expect(result).toContain('"Nebula Labs"');
    expect(result).toContain("Geometric, minimal");
    expect(result).toContain("Abstract star");
    expect(result).toContain("logo design");
  });

  it("uses the correct builder for 3d-render", () => {
    const result = buildTemplatePrompt("3d-render", {
      subject: "Floating crystal",
      material: "Iridescent glass",
      lighting: "Studio HDRI",
      renderer: "Octane render, 8K",
    });
    expect(result).toContain("Floating crystal");
    expect(result).toContain("Iridescent glass");
    expect(result).toContain("3D render");
  });

  it("uses the correct builder for pixel-art", () => {
    const result = buildTemplatePrompt("pixel-art", {
      scene: "Fantasy tavern",
      resolution: "256x224",
      palette: "NES palette",
      style: "SNES-era RPG",
    });
    expect(result).toContain("Fantasy tavern");
    expect(result).toContain("pixel art");
  });

  it("falls back to comma-joined fields for unknown template", () => {
    const result = buildTemplatePrompt("unknown-template", {
      foo: "hello",
      bar: "world",
    });
    expect(result).toBe("hello, world");
  });

  it("handles empty fields gracefully", () => {
    const result = buildTemplatePrompt("portrait", {
      subject: "A man",
    });
    expect(result).toContain("A man");
    expect(result).toContain("professional photography");
    // Should not have "in undefined" or trailing commas
    expect(result).not.toContain("undefined");
  });
});

// --- Snapshot tests for every builder ---

describe("template builder snapshots", () => {
  const SNAPSHOT_INPUTS: Record<string, Record<string, string>> = {
    portrait: { subject: "A young woman", setting: "Golden hour field", mood: "Warm", camera: "Canon 5D" },
    landscape: { scene: "Mountain lake", weather: "Sunrise fog", composition: "Rule of thirds", camera: "Nikon Z7" },
    street: { scene: "Tokyo alley at night", subject: "Lone figure", mood: "Noir", style: "35mm film" },
    product: { product: "Perfume bottle", surface: "Marble", lighting: "Rim light", style: "Editorial" },
    "digital-art": { subject: "Dragon on crystal", style: "Fantasy realism", colors: "Purple and gold", mood: "Epic" },
    anime: { character: "Cyberpunk mage", action: "Casting spell", style: "Ghibli", background: "Neon rooftop" },
    watercolor: { subject: "Wildflowers", technique: "Wet-on-wet", colors: "Soft pastels", paper: "Cold press" },
    comic: { scene: "Hero vs villain", style: "Jim Lee", inking: "Bold linework", colors: "Vibrant" },
    logo: { brand: "Nebula Labs", style: "Geometric minimal", icon: "Star shape", colors: "Navy and blue" },
    "ui-mockup": { app: "Trading dashboard", platform: "Desktop dark mode", style: "Glassmorphism", features: "Charts" },
    poster: { title: "ECLIPSE", theme: "Sci-fi premiere", style: "Retro", elements: "Nebula, silhouettes" },
    pattern: { motif: "Tropical leaves", style: "Modern minimal", colors: "Green and cream", repeat: "Half-drop" },
    "3d-render": { subject: "Crystal sculpture", material: "Glass", lighting: "HDRI", renderer: "Octane 8K" },
    isometric: { scene: "Coffee shop", style: "Low-poly pastel", details: "Tiny people", scale: "Miniature" },
    "arch-viz": { space: "Scandinavian loft", style: "Minimalist", lighting: "Natural light", details: "Plants" },
    "character-3d": { character: "Steampunk inventor", style: "Pixar-quality", pose: "Confident stance", material: "Subsurface skin" },
    abstract: { concept: "Nostalgia dissolving", medium: "Oil on canvas", colors: "Burnt sienna, midnight blue", texture: "Heavy impasto" },
    surreal: { scene: "Floating library", elements: "Melting clocks", style: "Hyperrealistic", mood: "Dreamlike" },
    "pixel-art": { scene: "Fantasy tavern", resolution: "256x224", palette: "NES palette", style: "SNES RPG" },
    collage: { theme: "Retro-futurism botanical", materials: "Vintage magazines", composition: "Layered", colors: "Faded pastels" },
  };

  for (const [id, fields] of Object.entries(SNAPSHOT_INPUTS)) {
    it(`snapshot: ${id}`, () => {
      const result = buildTemplatePrompt(id, fields);
      expect(result).toMatchSnapshot();
    });
  }
});
