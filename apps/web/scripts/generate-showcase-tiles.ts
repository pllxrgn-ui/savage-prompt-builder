/**
 * Generate AI showcase tile images via Pollinations.ai
 * Each image is tailored to match its "Made with Savage" card title.
 *
 * Usage: npx tsx scripts/generate-showcase-tiles.ts
 */
import fs from "node:fs";
import path from "node:path";

const API_KEY = process.env.POLLINATIONS_KEY ?? "sk_SWNrIJVzpJbmn8x0EYu6gLBckd8aAbWx";
const OUTPUT_DIR = path.join(process.cwd(), "public", "showcase", "tiles");

// Bigger resolution for better quality at retina
const WIDTH = 512;
const HEIGHT = 672;

const TILES = [
  {
    filename: "tattoo-flash.jpg",
    prompt:
      "A tattoo flash sheet pinned to a wall, featuring old school American traditional tattoo designs: a red rose, an eagle, a skull with crossbones, and a dagger with a snake, bold black outlines, bright saturated colors on cream paper, tattoo parlor wall, realistic photograph",
  },
  {
    filename: "streetwear.jpg",
    prompt:
      "A premium black oversized hoodie with a bold graphic skull print on the front, hanging on a clothing rack in a dimly lit streetwear store, urban fashion photography, shallow depth of field, moody lighting, hypebeast aesthetic",
  },
  {
    filename: "brand-identity.jpg",
    prompt:
      "Flat lay of premium brand identity mockup: black business cards with gold foil logo, letterhead, envelope, and pen arranged on a dark marble surface, top-down studio photography, luxury branding, minimal elegant design",
  },
  {
    filename: "sticker-pack.jpg",
    prompt:
      "Collection of colorful die-cut vinyl stickers scattered on a dark desk, featuring cute cartoon characters, food icons, emoji faces, and pop art designs, holographic shiny edges, vibrant kawaii style, product photography from above",
  },
  {
    filename: "art-print.jpg",
    prompt:
      "A framed risograph art print hanging on a white gallery wall, featuring bold abstract geometric shapes in coral pink and deep navy blue, grainy halftone texture, mid-century modern art style, gallery exhibition photograph",
  },
  {
    filename: "product-mockup.jpg",
    prompt:
      "A sleek perfume bottle sitting on a smooth marble surface with soft studio lighting, photorealistic 3D rendering, luxury cosmetic product mockup, glass reflections, minimal background with subtle gradient, professional product photography",
  },
  {
    filename: "video-concept.jpg",
    prompt:
      "A dramatic cinematic film still of a person walking alone down a rain-soaked Tokyo street at night, neon signs reflecting on wet pavement, anamorphic lens bokeh, cyberpunk atmosphere, movie scene widescreen composition, professional cinematography",
  },
  {
    filename: "pattern-design.jpg",
    prompt:
      "A close-up photograph of luxury fabric with an elegant William Morris inspired floral botanical pattern, deep jewel tones of emerald green and gold on dark navy background, seamless repeating pattern, textile design, rich detailed",
  },
] as const;

async function generateImage(prompt: string, dest: string): Promise<boolean> {
  const url = new URL("https://gen.pollinations.ai/image/" + encodeURIComponent(prompt));
  url.searchParams.set("width", String(WIDTH));
  url.searchParams.set("height", String(HEIGHT));
  url.searchParams.set("model", "gptimage");
  url.searchParams.set("nologo", "true");
  url.searchParams.set("seed", String(Math.floor(Math.random() * 100000)));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${API_KEY}` },
    redirect: "follow",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`  ✗ HTTP ${res.status} — ${body.slice(0, 200)}`);
    return false;
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("image")) {
    console.error(`  ✗ Unexpected content-type: ${contentType}`);
    return false;
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buffer);
  return true;
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let success = 0;
  let skipped = 0;

  for (const tile of TILES) {
    const dest = path.join(OUTPUT_DIR, tile.filename);

    // Delete old picsum placeholder so we regenerate
    if (fs.existsSync(dest)) {
      fs.unlinkSync(dest);
    }

    process.stdout.write(`  🎨 Generating "${tile.filename}"...`);
    const ok = await generateImage(tile.prompt, dest);
    if (ok) {
      const size = fs.statSync(dest).size;
      console.log(` ✓ ${(size / 1024).toFixed(0)} KB`);
      success++;
    }

    // Delay between requests to avoid rate limits
    await new Promise((r) => setTimeout(r, 5000));
  }

  console.log(
    `\nDone: ${success} generated, ${skipped} skipped, ${TILES.length - success - skipped} failed`,
  );
}

main().catch(console.error);
