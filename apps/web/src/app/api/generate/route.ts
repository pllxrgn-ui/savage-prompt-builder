import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/require-auth';

/** Models available on this Google AI key */
const IMAGEN_MODELS = [
    'imagen-4.0-generate-001',
    'imagen-4.0-fast-generate-001',
    'imagen-4.0-ultra-generate-001',
] as const;

const NANOBANANA_MODELS = [
    'gemini-3.1-flash-image-preview',  // Nanobanana 2
    'gemini-3-pro-image-preview',      // Nanobanana Pro
    'gemini-2.5-flash-image',          // Nano Banana
] as const;

type ImagenModel = typeof IMAGEN_MODELS[number];
type NanobananaModel = typeof NANOBANANA_MODELS[number];

const ALL_MODELS = [...IMAGEN_MODELS, ...NANOBANANA_MODELS] as const;

const ALLOWED_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:4'] as const;

const generateSchema = z.object({
    prompt: z.string().min(1).max(2000),
    model: z.string().optional().default('imagen-4.0-generate-001'),
    count: z.number().int().min(1).max(4).optional().default(1),
    aspectRatio: z.enum(ALLOWED_RATIOS).optional().default('1:1'),
    negativePrompt: z.string().max(1000).optional(),
});

/** Call Imagen 4 via the predict endpoint */
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

/** Call Nanobanana (Gemini image generation) via generateContent */
async function callNanobanana(
    apiKey: string,
    model: NanobananaModel,
    prompt: string,
    count: number,
): Promise<string[]> {
    const images: string[] = [];
    // Gemini image generation is one image per call
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

export async function POST(req: Request) {
    try {
        const auth = await requireAuth();
        if (auth.error) return auth.error;

        const body = await req.json();
        const parsed = generateSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid request parameters', issues: parsed.error.issues.map(i => i.message) },
                { status: 400 },
            );
        }

        const { prompt, model, count, aspectRatio, negativePrompt } = parsed.data;

        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Google AI API key is not configured' }, { status: 500 });
        }

        let images: string[];

        if (NANOBANANA_MODELS.includes(model as NanobananaModel)) {
            images = await callNanobanana(apiKey, model as NanobananaModel, prompt, count);
        } else {
            const imagenModel: ImagenModel = IMAGEN_MODELS.includes(model as ImagenModel)
                ? (model as ImagenModel)
                : 'imagen-4.0-generate-001';
            images = await callImagen(apiKey, imagenModel, prompt, count, aspectRatio, negativePrompt);
        }

        return NextResponse.json({ success: true, images });
    } catch (error: unknown) {
        console.error('[Image Generate Error]', error);
        const message = error instanceof Error ? error.message : 'Image generation failed';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
