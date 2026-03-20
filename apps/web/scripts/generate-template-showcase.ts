/**
 * Downloads showcase images for TemplateCard slideshows.
 *
 * Modes:
 *   Default   — loremflickr.com (keyword-based, fast, always available)
 *   --ai      — Pollinations.ai (AI-generated, slow, may be down)
 *   --hf      — Hugging Face Inference (SDXL, free tier)
 *   --fal     — FAL.ai (FLUX.1-schnell, $10 free credits)
 *
 * Run:   pnpm --filter web generate:template-showcase
 *        pnpm --filter web generate:template-showcase -- --ai
 *        pnpm --filter web generate:template-showcase -- --hf
 *        pnpm --filter web generate:template-showcase -- --fal
 *
 * Images are saved to:  public/showcase/templates/{templateId}-{n}.jpg
 * After completion, template-showcase.ts is updated automatically.
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const OUTPUT_DIR = join(process.cwd(), "public", "showcase", "templates");
const SHOWCASE_TS = join(process.cwd(), "src", "lib", "data", "template-showcase.ts");

const WIDTH = 600;
const HEIGHT = 400;

const useAI = process.argv.includes("--ai");
const useHF = process.argv.includes("--hf");
const useFAL = process.argv.includes("--fal");
const POLLINATIONS_KEY = process.env.POLLINATIONS_KEY ?? "sk_qyWix3AmZVjgS5VtnhD5rlIpsKqBFHcW";
const HF_TOKEN = process.env.HF_TOKEN ?? "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";
const FAL_KEY = process.env.FAL_KEY ?? "ff6dfffa-3d1f-4ef1-b230-59064c80efd4:2da0be126180de24e74f9842b4a59136";

// ─── loremflickr keywords (default mode) ──────────────────────────────────────
const TEMPLATE_KEYWORDS: Record<string, string[]> = {
  clothing:   ["tshirt,streetwear,apparel",        "hoodie,fashion,clothing"],
  sticker:    ["sticker,illustration,cute",        "sticker,vinyl,design"],
  pin:        ["badge,pin,accessory",              "brooch,lapel,pin"],
  poster:     ["poster,concert,typography",        "poster,event,design"],
  album:      ["vinyl,record,music",               "album,music,cd"],
  brand:      ["logo,branding,identity",           "brand,minimal,design"],
  tattoo:     ["tattoo,ink,art",                   "tattoo,traditional,design"],
  sneaker:    ["sneaker,shoe,kicks",               "sneakers,footwear,streetwear"],
  collection: ["fashion,lookbook,style",           "clothing,apparel,collection"],
  mockup:     ["tshirt,product,photography",       "hoodie,clothing,fashion"],
  pattern:    ["textile,pattern,fabric",           "pattern,fabric,wallpaper"],
  bookcover:  ["book,novel,publishing",            "book,literature,reading"],
  carwrap:    ["car,vehicle,vinyl",                "car,graphics,racing"],
  social:     ["instagram,content,photography",    "social,design,creative"],
  wallpaper:  ["wallpaper,abstract,desktop",       "wallpaper,art,digital"],
  character:  ["illustration,character,anime",     "fantasy,art,drawing"],
  threeD:     ["render,3d,digital",                "sculpture,modern,art"],
  jewelry:    ["jewelry,ring,gold",                "necklace,earrings,luxury"],
  freestyle:  ["abstract,digital,creative",        "contemporary,art,painting"],
  marketing:  ["advertising,marketing,campaign",   "product,photography,commercial"],
  meme:       ["funny,reaction,meme",              "humor,expression,comic"],
};

// ─── Pollinations.ai prompts (--ai mode) ──────────────────────────────────────
// Detailed prompts produce highly relevant AI-generated images per template.
// Use when Pollinations.ai is back online.
const TEMPLATE_PROMPTS: Record<string, string[]> = {
  clothing: [
    "bold screenprint t-shirt graphic design, fierce eagle skull, vector art, commercial apparel product flat lay, dark background",
    "streetwear hoodie mockup, abstract graffiti flame print, urban fashion editorial photography, moody lighting",
  ],
  sticker: [
    "kawaii die-cut sticker pack on white background, cute ghost and stars, thick black outline, pastel flat colors, product photography",
    "skate punk skull sticker sheet, bold linework, flat neon colors, vinyl die-cut style, white background",
  ],
  pin: [
    "hard enamel pin collection flat lay on white, cat faces and moons, gold metal borders, vibrant cloisonné fills, product photography",
    "kawaii enamel pin set, retro sun and lightning bolt designs, colorful, white background, professional product shot",
  ],
  poster: [
    "bold concert event poster, high contrast neon on black, halftone textures, punk graphic design, typographic composition",
    "modern event flyer design, geometric shapes, bold color blocking, clean typography space, professional print design",
  ],
  album: [
    "cinematic album cover art, lone silhouette against cosmic sunset gradient, dark moody atmosphere, square format",
    "abstract psychedelic album artwork, swirling vibrant colors, music industry square format, gallery quality",
  ],
  brand: [
    "minimalist phoenix logo mark on white card, premium brand identity, clean black vector, professional presentation",
    "modern geometric brand logomark, abstract crown symbol on dark background, premium branding concept",
  ],
  tattoo: [
    "traditional American tattoo flash sheet on white, bold eagle and roses, thick outlines, classic bold fill colors",
    "neo-traditional tattoo design concept, wolf portrait with ornamental geometric frame, bold linework, black and grey",
  ],
  sneaker: [
    "custom sneaker design concept, limited edition colorway, bold street art graphics, lateral product view, clean background",
    "sneaker mockup on clean surface, bold urban colorway, editorial product photography, premium streetwear",
  ],
  collection: [
    "fashion collection lookbook editorial, 3-piece coordinated streetwear set, dark moody studio photography",
    "capsule collection product flat lay, cohesive brand aesthetic, premium apparel, clean composition",
  ],
  mockup: [
    "t-shirt product mockup on model, clean lifestyle photography, natural lighting, commercial apparel photo",
    "hoodie flat lay mockup, premium product photography, dark background, editorial styling",
  ],
  pattern: [
    "seamless skull and roses textile pattern, tattoo-inspired surface design, dark background, bold repeat tile",
    "bold geometric repeat pattern, streetwear fabric design, vibrant colors, professional surface design presentation",
  ],
  bookcover: [
    "dramatic thriller book cover design, dark atmospheric illustration, foggy cityscape, clear title space at top",
    "fantasy novel cover art, epic glowing landscape, dramatic god rays lighting, professional book publishing quality",
  ],
  carwrap: [
    "custom full-vehicle vinyl wrap design concept, bold geometric tribal graphics, aggressive racing aesthetic, side view",
    "car wrap mockup on sports car, flame and abstract pattern design, dramatic colors, professional visualization",
  ],
  social: [
    "bold Instagram post design, lifestyle photography with clean white text space, personal brand aesthetic, minimal layout",
    "social media announcement graphic, product reveal template, clean modern design, high engagement layout",
  ],
  wallpaper: [
    "dark aesthetic desktop wallpaper, abstract neon geometry, deep navy and orange, cinematic digital art, 16:9",
    "moody phone wallpaper art, ethereal glowing particles, dark gradient background, premium digital artwork",
  ],
  character: [
    "original character concept art, fantasy armored warrior, detailed full-body illustration, professional game art quality",
    "anime style character design sheet, magical girl full body illustration, clean linework, vibrant palette",
  ],
  threeD: [
    "3D rendered chrome logo mockup, glossy metallic material, dramatic studio lighting, product visualization render",
    "abstract 3D geometric sculpture render, iridescent surfaces, professional studio lighting, modern digital art",
  ],
  jewelry: [
    "luxury jewelry product photography, gold and diamond ring on white marble, clean minimal background, commercial quality",
    "artisan jewelry collection flat lay, necklace and earring set, elegant props, studio product photography",
  ],
  freestyle: [
    "abstract generative digital art, fluid colorful forms, dark background, gallery-quality AI artwork",
    "surreal mixed media digital artwork, bold color explosion, creative expression, contemporary fine art",
  ],
  marketing: [
    "clean product advertisement layout, minimal white space, premium lifestyle photography, professional marketing visual",
    "brand campaign poster design, aspirational lifestyle image, bold typography area, commercial photography style",
  ],
  meme: [
    "internet meme format template design, bold impact font text space, relatable humor composition, viral potential",
    "reaction meme template, expressive facial reaction composition, clear text space, bold captions area",
  ],
};

// ─── URL builders ─────────────────────────────────────────────────────────────

function flickrUrl(keywords: string, lock: number): string {
  return `https://loremflickr.com/${WIDTH}/${HEIGHT}/${keywords}?lock=${lock}`;
}

function pollinationsUrl(prompt: string, seed: number): string {
  const encoded = encodeURIComponent(prompt);
  return `https://gen.pollinations.ai/image/${encoded}?model=flux&width=${WIDTH}&height=${HEIGHT}&nologo=true&seed=${seed}&key=${POLLINATIONS_KEY}`;
}

async function huggingfaceGenerate(prompt: string, retries = 3): Promise<Buffer> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(
      "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt: "blurry, low quality, distorted, watermark, text overlay, cropped",
          },
        }),
      },
    );

    if (res.ok) {
      const arrayBuffer = await res.arrayBuffer();
      const buf = Buffer.from(arrayBuffer);
      if (buf.length < 5000) {
        throw new Error(`HF image too small (${buf.length} bytes)`);
      }
      return buf;
    }

    // Retry on rate-limit or server errors
    if (attempt < retries && (res.status === 429 || res.status === 503 || res.status >= 500)) {
      const wait = attempt * 10_000;
      console.log(`    ⏳ HF ${res.status} — retrying in ${wait / 1000}s (attempt ${attempt}/${retries})`);
      await sleep(wait);
      continue;
    }

    const text = await res.text().catch(() => "");
    throw new Error(`HF ${res.status}: ${text.slice(0, 200)}`);
  }
  throw new Error("Unreachable");
}

async function falGenerate(prompt: string, retries = 3): Promise<Buffer> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch("https://fal.run/fal-ai/flux/schnell", {
      method: "POST",
      headers: {
        Authorization: `Key ${FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        image_size: "square_hd",
        num_inference_steps: 4,
        num_images: 1,
      }),
    });

    if (res.ok) {
      const json = (await res.json()) as { images: { url: string }[] };
      const imageUrl = json.images[0]?.url;
      if (!imageUrl) throw new Error("FAL returned no image URL");
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) throw new Error(`Failed to download FAL image: ${imgRes.status}`);
      const buf = Buffer.from(await imgRes.arrayBuffer());
      if (buf.length < 5000) throw new Error(`FAL image too small (${buf.length} bytes)`);
      return buf;
    }

    if (attempt < retries && (res.status === 429 || res.status >= 500)) {
      const wait = attempt * 8_000;
      console.log(`    \u23f3 FAL ${res.status} \u2014 retrying in ${wait / 1000}s (attempt ${attempt}/${retries})`);
      await sleep(wait);
      continue;
    }

    const text = await res.text().catch(() => "");
    throw new Error(`FAL ${res.status}: ${text.slice(0, 200)}`);
  }
  throw new Error("Unreachable");
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function downloadImage(url: string, retries = 3, timeoutMs = 30_000): Promise<Buffer> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      const res = await fetch(url, {
        headers: { "User-Agent": "savage-prompt-builder/showcase-gen" },
        redirect: "follow",
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        const buf = Buffer.from(arrayBuffer);
        if (buf.length < 5000) {
          throw new Error(`Image too small (${buf.length} bytes) — likely a placeholder`);
        }
        return buf;
      }

      if (attempt < retries && (res.status === 429 || res.status >= 500)) {
        const wait = attempt * (useAI ? 8000 : 3000);
        console.log(`    ⏳ ${res.status} — retrying in ${wait / 1000}s (attempt ${attempt}/${retries})`);
        await sleep(wait);
        continue;
      }
      throw new Error(`HTTP ${res.status} after ${retries} attempts`);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        if (attempt < retries) {
          console.log(`    ⏳ Timeout — retrying (attempt ${attempt}/${retries})`);
          await sleep(attempt * 5000);
          continue;
        }
        throw new Error("Timeout after all retries");
      }
      if (attempt >= retries) throw err;
      await sleep(attempt * 2000);
    }
  }
  throw new Error("Unreachable");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const source = (useAI || useHF || useFAL) ? TEMPLATE_PROMPTS : TEMPLATE_KEYWORDS;
  const provider = useFAL ? "FAL.ai (FLUX.1-schnell)" : useHF ? "Hugging Face (SDXL)" : useAI ? "Pollinations.ai" : "loremflickr.com";
  const templateIds = Object.keys(source);
  const generated: Record<string, string[]> = {};
  let total = 0;
  let failed = 0;

  console.log(`\n🎨 Downloading ${templateIds.length * 2} showcase images via ${provider}...\n`);

  for (const [index, templateId] of templateIds.entries()) {
    const entries = source[templateId];
    generated[templateId] = [];

    for (let i = 0; i < entries.length; i++) {
      const filename = `${templateId}-${i + 1}.jpg`;
      const outputPath = join(OUTPUT_DIR, filename);
      const publicPath = `/showcase/templates/${filename}`;

      if (existsSync(outputPath)) {
        console.log(`  ⏩ ${filename} already exists — skipping`);
        generated[templateId].push(publicPath);
        total++;
        continue;
      }

      const label = (useAI || useHF || useFAL) ? entries[i].slice(0, 50) + "…" : entries[i];
      console.log(`  ⬇  [${index + 1}/${templateIds.length}] ${filename}  (${label})`);

      try {
        let imageBuffer: Buffer;
        if (useFAL) {
          imageBuffer = await falGenerate(entries[i]);
        } else if (useHF) {
          imageBuffer = await huggingfaceGenerate(entries[i]);
        } else {
          const url = useAI
            ? pollinationsUrl(entries[i], index * 100 + i)
            : flickrUrl(entries[i], index * 10 + i + 1);
          imageBuffer = await downloadImage(url, 3, useAI ? 60_000 : 30_000);
        }
        writeFileSync(outputPath, imageBuffer);
        generated[templateId].push(publicPath);
        total++;
        console.log(`  ✅  Saved ${filename} (${Math.round(imageBuffer.length / 1024)}kb)`);
      } catch (err) {
        failed++;
        console.error(`  ❌  Failed ${filename}:`, (err as Error).message);
      }

      await sleep(useFAL ? 2000 : useHF ? 4000 : useAI ? 5000 : 500);
    }
  }

  // ─── Write updated template-showcase.ts ───────────────────────────────────
  const lines: string[] = [
    "/**",
    " * Showcase image paths per template ID.",
    " * Images live at public/showcase/templates/{templateId}-{n}.jpg",
    ` * Generated via scripts/generate-template-showcase.ts (${provider}).`,
    " *",
    " * Re-run: pnpm --filter web generate:template-showcase",
    " * TemplateCard falls back gracefully to a gradient placeholder when empty.",
    " */",
    "export const TEMPLATE_SHOWCASE: Record<string, string[]> = {",
  ];

  for (const id of templateIds) {
    const paths = generated[id] ?? [];
    if (paths.length > 0) {
      const pathList = paths.map((p) => `"${p}"`).join(", ");
      lines.push(`  ${id.padEnd(12)}: [${pathList}],`);
    } else {
      lines.push(`  ${id.padEnd(12)}: [],`);
    }
  }

  lines.push("};", "");

  writeFileSync(SHOWCASE_TS, lines.join("\n"), "utf-8");

  console.log(`\n✨ Done! ${total} images saved, ${failed} failed.`);
  console.log(`📝 Updated src/lib/data/template-showcase.ts`);
  console.log(`📂 Images in: public/showcase/templates/\n`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
