import { describe, it, expect } from "vitest";
import { formatForGenerator, generatorFormats } from "../src/generator-formats";

const GENERATOR_IDS = [
  "midjourney", "dalle3", "stable-diffusion", "flux",
  "leonardo", "firefly", "ideogram", "nanobanana", "replicate",
];

const SAMPLE_INPUT = {
  positive: "A young woman with freckles, natural light studio, professional photography",
  negative: "deformed, bad anatomy, disfigured",
  parameters: "",
};

describe("generatorFormats", () => {
  it("has a formatter for all 9 generators", () => {
    for (const id of GENERATOR_IDS) {
      expect(generatorFormats[id]).toBeDefined();
    }
    expect(Object.keys(generatorFormats)).toHaveLength(9);
  });

  it("returns non-empty string for each formatter", () => {
    for (const id of GENERATOR_IDS) {
      const result = generatorFormats[id]!(SAMPLE_INPUT);
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    }
  });
});

describe("formatForGenerator", () => {
  it("midjourney: uses --no for negative", () => {
    const result = formatForGenerator("midjourney", SAMPLE_INPUT);
    expect(result).toContain(SAMPLE_INPUT.positive);
    expect(result).toContain("--no deformed");
  });

  it("midjourney: appends parameters", () => {
    const result = formatForGenerator("midjourney", {
      ...SAMPLE_INPUT,
      parameters: "--ar 16:9 --v 6.1",
    });
    expect(result).toContain("--ar 16:9");
    expect(result).toContain("--v 6.1");
  });

  it("dalle3: weaves negative as 'Avoid'", () => {
    const result = formatForGenerator("dalle3", SAMPLE_INPUT);
    expect(result).toContain("Avoid: deformed");
  });

  it("dalle3: no negative separator when negative is empty", () => {
    const result = formatForGenerator("dalle3", {
      positive: "test prompt",
      negative: "",
    });
    expect(result).not.toContain("Avoid");
  });

  it("stable-diffusion: separates positive and negative on newlines", () => {
    const result = formatForGenerator("stable-diffusion", SAMPLE_INPUT);
    expect(result).toContain("Negative prompt: deformed");
    const lines = result.split("\n");
    expect(lines.length).toBeGreaterThanOrEqual(2);
  });

  it("flux: uses 'Without' for negative", () => {
    const result = formatForGenerator("flux", SAMPLE_INPUT);
    expect(result).toContain("Without: deformed");
  });

  it("leonardo: separates like stable-diffusion", () => {
    const result = formatForGenerator("leonardo", SAMPLE_INPUT);
    expect(result).toContain("Negative prompt: deformed");
  });

  it("firefly: uses 'Exclude'", () => {
    const result = formatForGenerator("firefly", SAMPLE_INPUT);
    expect(result).toContain("Exclude: deformed");
  });

  it("ideogram: uses 'Do not include'", () => {
    const result = formatForGenerator("ideogram", SAMPLE_INPUT);
    expect(result).toContain("Do not include: deformed");
  });

  it("nanobanana: separates with 'Negative:'", () => {
    const result = formatForGenerator("nanobanana", SAMPLE_INPUT);
    expect(result).toContain("Negative: deformed");
  });

  it("replicate: separates like stable-diffusion", () => {
    const result = formatForGenerator("replicate", SAMPLE_INPUT);
    expect(result).toContain("Negative prompt: deformed");
  });

  it("unknown generator falls back gracefully", () => {
    const result = formatForGenerator("unknown-gen", SAMPLE_INPUT);
    expect(result).toContain(SAMPLE_INPUT.positive);
    expect(result).toContain("Negative: deformed");
  });
});

// --- Snapshot tests for every generator ---

describe("generator format snapshots", () => {
  const FULL_INPUT = {
    positive: "A dragon perched on a crystal spire, fantasy realism, deep purples and gold, epic, digital art",
    negative: "photo, amateur, clipart, watermark",
    parameters: "",
  };

  for (const id of GENERATOR_IDS) {
    it(`snapshot: ${id}`, () => {
      const result = formatForGenerator(id, FULL_INPUT);
      expect(result).toMatchSnapshot();
    });
  }
});
