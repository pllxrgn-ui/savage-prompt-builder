import { db } from '@/db';
import { generations } from '@/db/schema';
import { eq } from 'drizzle-orm';

const IMAGEN_MODELS = [
    'imagen-4.0-generate-001',
    'imagen-4.0-fast-generate-001',
    'imagen-4.0-ultra-generate-001',
] as const;

const NANOBANANA_MODELS = [
    'gemini-3.1-flash-image-preview',
    'gemini-3-pro-image-preview',
    'gemini-2.5-flash-image',
] as const;

type ImagenModel = typeof IMAGEN_MODELS[number];
type NanobananaModel = typeof NANOBANANA_MODELS[number];

async function callImagen(
    apiKey: string,
    model: ImagenModel,
    prompt: string,
    count: number,
    aspectRatio: string,
    negativePrompt?: string,
): Promise<string[]> {
    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                instances: [{ prompt, ...(negativePrompt ? { negativePrompt } : {}) }],
                parameters: {
                    sampleCount: count,
                    aspectRatio,
                    includeRaiReason: false,
                    outputMimeType: 'image/jpeg',
                },
            }),
        },
    );
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message ?? `Imagen API error ${res.status}`);
    }
    const data = await res.json();
    return (data.predictions as Array<{ bytesBase64Encoded: string; mimeType: string }>)
        .map((p) => `data:${p.mimeType ?? 'image/jpeg'};base64,${p.bytesBase64Encoded}`);
}

async function callNanobanana(
    apiKey: string,
    model: NanobananaModel,
    prompt: string,
    count: number,
): Promise<string[]> {
    const images: string[] = [];
    await Promise.all(
        Array.from({ length: count }, async () => {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
                    }),
                },
            );
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err?.error?.message ?? `Nanobanana API error ${res.status}`);
            }
            const data = await res.json();
            const parts: Array<{ inlineData?: { data: string; mimeType: string } }> =
                data?.candidates?.[0]?.content?.parts ?? [];
            const img = parts.find((p) => p.inlineData);
            if (img?.inlineData) {
                images.push(`data:${img.inlineData.mimeType};base64,${img.inlineData.data}`);
            }
        }),
    );
    return images;
}

/** Runs the actual generation and updates the job record in DB */
export async function runGeneration(
    jobId: string,
    apiKey: string,
    model: string,
    prompt: string,
    count: number,
    aspectRatio: string,
    negativePrompt?: string,
) {
    try {
        await db.update(generations)
            .set({ status: 'processing' })
            .where(eq(generations.id, jobId));

        let images: string[];

        if (NANOBANANA_MODELS.includes(model as NanobananaModel)) {
            images = await callNanobanana(apiKey, model as NanobananaModel, prompt, count);
        } else {
            const imagenModel: ImagenModel = IMAGEN_MODELS.includes(model as ImagenModel)
                ? (model as ImagenModel)
                : 'imagen-4.0-generate-001';
            images = await callImagen(apiKey, imagenModel, prompt, count, aspectRatio, negativePrompt);
        }

        await db.update(generations)
            .set({ status: 'completed', images, completedAt: new Date() })
            .where(eq(generations.id, jobId));

    } catch (err: any) {
        console.error(`[Generation Job ${jobId} Failed]`, err);
        await db.update(generations)
            .set({ status: 'failed', error: err.message ?? 'Generation failed' })
            .where(eq(generations.id, jobId));
    }
}
