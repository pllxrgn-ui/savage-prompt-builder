/**
 * Generate service — calls /api/generate which proxies to Google Imagen 3.
 */

export interface GenerateRequest {
  prompt: string;
  modelId: string;
  count: number;
  aspectRatio: string;
  negativePrompt?: string;
}

export interface GeneratedImage {
  id: string;
  url: string; // base64 data URI
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

export async function generateImages(request: GenerateRequest): Promise<GenerateJob> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: request.prompt,
      model: request.modelId,
      count: request.count,
      aspectRatio: request.aspectRatio,
      ...(request.negativePrompt ? { negativePrompt: request.negativePrompt } : {}),
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Generation failed' }));
    throw new Error(err.error ?? 'Image generation failed');
  }

  const data = await res.json();
  const images: GeneratedImage[] = (data.images as string[]).map((url) => ({
    id: crypto.randomUUID(),
    url,
    prompt: request.prompt,
    modelId: request.modelId,
    aspectRatio: request.aspectRatio,
    createdAt: new Date().toISOString(),
  }));

  return {
    id: crypto.randomUUID(),
    status: 'complete',
    progress: 100,
    images,
  };
}

