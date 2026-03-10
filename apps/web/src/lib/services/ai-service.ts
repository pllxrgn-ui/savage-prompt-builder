/**
 * AI service — stub implementation for AI-powered features.
 * BACKEND: Replace internals with fetch('/api/ai/...') + auth header.
 */

export interface PolishResult {
  result: string;
  model: string;
}

export interface VariationResult {
  variations: string[];
}

export interface FieldSuggestion {
  field: string;
  suggestion: string;
}

export interface GeneratedStyleSuggestion {
  label: string;
  content: string;
}

// BACKEND: POST /api/ai/polish
export async function polishPrompt(
  prompt: string,
  // BACKEND: will pass generator + templateId to API
  _generator: string, // eslint-disable-line @typescript-eslint/no-unused-vars
  _templateId: string, // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<PolishResult> {
  await new Promise((r) => setTimeout(r, 1500));
  return {
    result: `${prompt}, masterfully composed, award-winning quality, ultra-detailed`,
    model: "gpt-4o",
  };
}

// BACKEND: POST /api/ai/variations
export async function getVariations(
  prompt: string,
  count: number = 3,
): Promise<VariationResult> {
  await new Promise((r) => setTimeout(r, 1200));
  return {
    variations: Array.from({ length: count }, (_, i) =>
      `${prompt} — variation ${i + 1} with unique artistic interpretation`,
    ),
  };
}

// BACKEND: POST /api/ai/suggest-fields
export async function suggestFields(
  _templateId: string, // eslint-disable-line @typescript-eslint/no-unused-vars
  _partialFields: Record<string, string>, // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<FieldSuggestion[]> {
  await new Promise((r) => setTimeout(r, 800));
  return [
    { field: "subject", suggestion: "a serene mountain landscape at dawn" },
    { field: "style", suggestion: "oil painting with impressionist brushwork" },
    { field: "mood", suggestion: "peaceful and contemplative" },
  ];
}

// BACKEND: POST /api/ai/styles (Pro only)
export async function generateStyles(
  _vibe: string, // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<GeneratedStyleSuggestion[]> {
  await new Promise((r) => setTimeout(r, 1500));
  return [
    {
      label: "Cinematic Noir Atmosphere",
      content:
        "dark cinematic lighting, high contrast shadows, desaturated color palette, film noir mood, volumetric haze",
    },
    {
      label: "Ethereal Dream Wash",
      content:
        "soft diffused glow, pastel color bleeding, dreamy bokeh layers, gentle lens flare, overexposed highlights",
    },
    {
      label: "Raw Analog Texture",
      content:
        "heavy film grain, Kodak Tri-X 400, slight light leak, vignette corners, analog warmth, imperfect scan lines",
    },
  ];
}
