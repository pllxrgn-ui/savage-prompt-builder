/**
 * Generate service — stub implementation.
 * BACKEND: Replace internals with /api/generate POST + /api/generate/status/[jobId] SSE polling.
 */

export interface GenerateRequest {
  prompt: string;
  modelId: string;
  count: number;
  aspectRatio: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  modelId: string;
  aspectRatio: string;
  createdAt: string;
}

export type JobStatus = "pending" | "generating" | "complete" | "error";

export interface GenerateJob {
  id: string;
  status: JobStatus;
  progress: number;
  images: GeneratedImage[];
  error?: string;
}

// Stub: fake placeholder SVG as data URI
function makePlaceholder(index: number, ratio: string): string {
  const [w, h] = ratio.split(":").map(Number);
  const width = (w ?? 4) * 100;
  const height = (h ?? 4) * 100;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect fill="#1a1a2e" width="100%" height="100%"/>
    <text x="50%" y="45%" text-anchor="middle" fill="#555" font-size="20" font-family="sans-serif">PLACEHOLDER #${index + 1}</text>
    <text x="50%" y="55%" text-anchor="middle" fill="#444" font-size="14" font-family="sans-serif">${ratio}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Stub: Simulates image generation with a 2s delay.
 * Returns placeholder images.
 */
export async function generateImages(
  request: GenerateRequest,
): Promise<GenerateJob> {
  const jobId = crypto.randomUUID();

  // BACKEND: POST /api/generate → returns { jobId }
  // Then poll GET /api/generate/status/[jobId] via SSE until complete

  await new Promise((r) => setTimeout(r, 2000));

  const images: GeneratedImage[] = Array.from(
    { length: request.count },
    (_, i) => ({
      id: crypto.randomUUID(),
      url: makePlaceholder(i, request.aspectRatio),
      prompt: request.prompt,
      modelId: request.modelId,
      aspectRatio: request.aspectRatio,
      createdAt: new Date().toISOString(),
    }),
  );

  return {
    id: jobId,
    status: "complete",
    progress: 100,
    images,
  };
}
