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
  const rawBase64Images: string[] = data.images;

  // Upload the base64 images to Supabase via our proxy to get permanent URLs
  const uploadedImages = await Promise.all(
    rawBase64Images.map(async (base64Url) => {
      try {
        const uploadRes = await fetch('/api/media/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64Url,
            model: request.modelId,
          }),
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          if (uploadData.url) {
            return uploadData.url as string;
          }
        }
        console.warn('Failed to upload image to Supabase, falling back to base64');
        return base64Url;
      } catch (e) {
        console.warn('Error uploading image to Supabase, falling back to base64', e);
        return base64Url;
      }
    })
  );

  const images: GeneratedImage[] = uploadedImages.map((publicUrl) => ({
    id: crypto.randomUUID(),
    url: publicUrl,
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

