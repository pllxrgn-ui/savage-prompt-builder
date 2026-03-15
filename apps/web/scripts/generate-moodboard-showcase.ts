/**
 * Downloads showcase images for the moodboard page masonry background.
 * Uses Lorem Picsum (picsum.photos) — free, no auth needed.
 *
 * Run: npx tsx scripts/generate-moodboard-showcase.ts
 * Images saved to public/showcase/moodboard/
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const OUTPUT_DIR = join(process.cwd(), "public", "showcase", "moodboard");

// Curated Picsum photo IDs with matching aesthetic categories
// Each has a specific aspect: portrait (3:4), square (1:1), landscape (4:3)
const MOODBOARD_IMAGES = [
  { filename: "cinematic-portrait", id: 1005, width: 400, height: 533 },
  { filename: "neon-still-life", id: 1043, width: 400, height: 400 },
  { filename: "surreal-architecture", id: 1048, width: 400, height: 533 },
  { filename: "retro-street", id: 1039, width: 533, height: 400 },
  { filename: "fashion-editorial", id: 64, width: 400, height: 533 },
  { filename: "abstract-texture", id: 1002, width: 400, height: 400 },
  { filename: "moody-interior", id: 342, width: 533, height: 400 },
  { filename: "desert-landscape", id: 1058, width: 533, height: 400 },
  { filename: "cyberpunk-city", id: 1031, width: 400, height: 533 },
  { filename: "botanical-close", id: 1047, width: 400, height: 400 },
  { filename: "vintage-car", id: 133, width: 533, height: 400 },
  { filename: "dark-luxury", id: 823, width: 400, height: 533 },
  { filename: "underwater-dream", id: 1044, width: 400, height: 533 },
  { filename: "geometric-art", id: 1074, width: 400, height: 400 },
  { filename: "foggy-forest", id: 1015, width: 400, height: 533 },
  { filename: "street-mural", id: 1029, width: 533, height: 400 },
  { filename: "studio-object", id: 1080, width: 400, height: 400 },
  { filename: "fire-dancer", id: 1035, width: 400, height: 533 },
] as const;

async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(
    `\n🎨 Downloading ${MOODBOARD_IMAGES.length} moodboard showcase images from Lorem Picsum...\n`,
  );

  const results: string[] = [];

  for (const item of MOODBOARD_IMAGES) {
    const outPath = join(OUTPUT_DIR, `${item.filename}.jpg`);

    if (existsSync(outPath)) {
      console.log(`  ⏭ ${item.filename}.jpg (already exists)`);
      results.push(item.filename);
      continue;
    }

    process.stdout.write(`  ⏳ ${item.filename}... `);
    try {
      const url = `https://picsum.photos/id/${item.id}/${item.width}/${item.height}.jpg`;
      const buffer = await downloadImage(url);
      writeFileSync(outPath, buffer);
      results.push(item.filename);
      console.log(`✓  ${item.filename}.jpg (${(buffer.length / 1024).toFixed(0)} KB)`);
    } catch (err) {
      console.log(
        `✗  FAILED: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
    await delay(500);
  }

  console.log(`\n✅ Downloaded ${results.length}/${MOODBOARD_IMAGES.length} images`);
  console.log(`📁 Saved to: public/showcase/moodboard/\n`);
}

main().catch((err) => {
  console.error("\n✗ Script failed:", err);
  process.exit(1);
});
