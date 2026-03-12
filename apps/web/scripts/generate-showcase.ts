/**
 * Generates real showcase images for the home page using Google Imagen 3.
 * Run: pnpm --filter web generate:showcase
 *
 * Images are saved to public/showcase/ and referenced by the home page.
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { config } from "dotenv";

config({ path: join(process.cwd(), ".env.local") });

const OUTPUT_DIR = join(process.cwd(), "public", "showcase");

const SHOWCASE_ITEMS = [
  {
    filename: "tattoo-flash",
    label: "Tattoo Flash",
    aspectRatio: "3:4" as const,
    prompt:
      "Traditional American tattoo flash sheet, bold black outlines, classic eagle clutching roses with banner scroll, dagger, snake, bold primary fill colors — red, green, yellow on white background. Professional tattoo illustration, high contrast, retro vintage style, iconic tattoo art, print-quality rendering",
  },
  {
    filename: "streetwear-tee",
    label: "Streetwear Tee",
    aspectRatio: "3:4" as const,
    prompt:
      "Premium oversized streetwear t-shirt flat lay, bold graphic print — abstract flame skull with drip typography, washed black heavyweight cotton, styled editorial product photography, dark moody background with dramatic directional lighting, high-fashion apparel photography, photorealistic",
  },
  {
    filename: "sticker-pack",
    label: "Sticker Pack",
    aspectRatio: "1:1" as const,
    prompt:
      "Cute kawaii die-cut vinyl sticker pack collection displayed on white background, 12 stickers: smiling cloud, retro sun with sunglasses, sparkle star, tiny mushroom, cherry, holographic lightning bolt, aesthetic Y2K style, pastel pink purple and yellow color palette, bold outlines, glossy finish, product flat lay",
  },
  {
    filename: "art-print",
    label: "Art Print",
    aspectRatio: "3:4" as const,
    prompt:
      "Abstract fine art risograph poster print, bold geometric organic shapes, rich terracotta and burnt sienna against deep forest green background, mid-century modern Bauhaus influence, limited 3-color palette, grain texture, offset printing aesthetic, gallery wall art ready, minimal compositional balance",
  },
  {
    filename: "logo-design",
    label: "Logo Design",
    aspectRatio: "1:1" as const,
    prompt:
      "Minimal modern logo mark design concept on white background, geometric negative space letterform — bold angular 'S' shape formed by intersecting trapezoids, deep navy ink, premium brand identity, vector-clean precision, professional logotype on clean white card, sophisticated and timeless",
  },
  {
    filename: "pin-design",
    label: "Pin Design",
    aspectRatio: "1:1" as const,
    prompt:
      "Hard enamel pin collection flat lay on white background, 6 pins: cute black cat face, neon pizza slice, retro rainbow, golden lightning bolt, tiny cactus, starry moon — all with gold metal borders, vibrant cloisonné enamel fills, studio lighting, clean white background, product photography",
  },
] as const;

/**
 * Nanobanana 2 (gemini-3.1-flash-image-preview) uses the generateContent
 * endpoint and returns images as inlineData — works on AI Studio free tier.
 * If that fails, falls back to Imagen 4 predict (requires billing).
 */
async function generateImageWithGemini(prompt: string, _aspectRatio: "1:1" | "3:4" | "4:3"): Promise<{ base64: string; mimeType: string }> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_GENERATIVE_AI_API_KEY not set");

  // Try Nanobanana 2 first (free tier eligible)
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
      }),
    },
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    // Fall back to Imagen 4 if Nanobanana fails
    const nanoError = err?.error?.message ?? `HTTP ${response.status}`;
    console.warn(`\n     ⚠ Nanobanana 2 failed (${nanoError}), trying Imagen 4...`);
    return callImagen4(apiKey, prompt, _aspectRatio);
  }

  const data = await response.json();
  const parts: Array<{ inlineData?: { data: string; mimeType: string } }> =
    data?.candidates?.[0]?.content?.parts ?? [];
  const imgPart = parts.find((p) => p.inlineData);
  if (!imgPart?.inlineData) {
    // No image in response — try Imagen 4 fallback
    console.warn(`\n     ⚠ Nanobanana 2 returned no image, trying Imagen 4...`);
    return callImagen4(apiKey, prompt, _aspectRatio);
  }
  return { base64: imgPart.inlineData.data, mimeType: imgPart.inlineData.mimeType ?? "image/png" };
}

async function callImagen4(apiKey: string, prompt: string, aspectRatio: "1:1" | "3:4" | "4:3"): Promise<{ base64: string; mimeType: string }> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio,
          includeRaiReason: false,
          outputMimeType: "image/jpeg",
        },
      }),
    },
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `HTTP ${response.status}`);
  }

  const data = await response.json();
  const pred = data?.predictions?.[0];
  if (!pred?.bytesBase64Encoded) throw new Error("No image in response");
  return { base64: pred.bytesBase64Encoded, mimeType: pred.mimeType ?? "image/jpeg" };
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`\n🎨 Generating ${SHOWCASE_ITEMS.length} showcase images (Nanobanana 2 / Imagen 4)...\n`);

  const results: { filename: string; ext: string }[] = [];

  for (const item of SHOWCASE_ITEMS) {
    process.stdout.write(`  ⏳ ${item.label}... `);
    try {
      const { base64, mimeType } = await generateImageWithGemini(item.prompt, item.aspectRatio);
      const ext = mimeType === "image/jpeg" ? "jpg" : "png";
      const filename = `${item.filename}.${ext}`;
      const outputPath = join(OUTPUT_DIR, filename);
      writeFileSync(outputPath, Buffer.from(base64, "base64"));
      results.push({ filename: item.filename, ext });
      console.log(`✓  public/showcase/${filename}`);
    } catch (err) {
      console.log(`✗  FAILED: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Print updated SHOWCASE_TILES for copy-paste
  if (results.length > 0) {
    console.log("\n─── Update SHOWCASE_TILES in home/page.tsx ───\n");
    const items = SHOWCASE_ITEMS.map((item, i) => {
      const result = results.find((r) => r.filename === item.filename);
      const imageProp = result
        ? `, image: "/showcase/${result.filename}.${result.ext}"`
        : "";
      return `  { id: ${i + 1}, label: "${item.label}"${imageProp} }`;
    });
    console.log(`const SHOWCASE_TILES = [\n${items.join(",\n")},\n] as const;`);
    console.log("\n");
  }
}

main().catch((err) => {
  console.error("\n✗ Script failed:", err);
  process.exit(1);
});
