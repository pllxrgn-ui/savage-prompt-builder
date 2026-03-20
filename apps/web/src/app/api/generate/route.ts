import { NextResponse, after } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { requireAuth } from '@/lib/require-auth';
import { validateAndDeductCredits } from '@/lib/credits';
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

const ALLOWED_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:4'] as const;

const generateSchema = z.object({
    prompt: z.string().min(1).max(2000),
    model: z.string().optional().default('imagen-4.0-generate-001'),
    count: z.number().int().min(1).max(4).optional().default(1),
    aspectRatio: z.enum(ALLOWED_RATIOS).optional().default('1:1'),
    negativePrompt: z.string().max(1000).optional(),
});

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
async function runGeneration(
    jobId: string,
    apiKey: string,
    model: string,
    prompt: string,
    count: number,
    aspectRatio: string,
    negativePrompt?: string,
) {
    try {
        // Mark as processing
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

        // Mark as completed with images
        await db.update(generations)
            .set({ status: 'completed', images, completedAt: new Date() })
            .where(eq(generations.id, jobId));

    } catch (err: any) {
        console.error(`[Generation Job ${jobId} Failed]`, err);
        // Mark as failed with error message
        await db.update(generations)
            .set({ status: 'failed', error: err.message ?? 'Generation failed' })
            .where(eq(generations.id, jobId));
    }
}

export async function POST(req: Request) {
    try {
        const auth = await requireAuth();
        if (auth.error) return auth.error;

        const { profile } = auth;

        const body = await req.json();
        const parsed = generateSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid request parameters', issues: parsed.error.issues.map(i => i.message) },
                { status: 400 },
            );
        }

        const { prompt, model, count, aspectRatio, negativePrompt } = parsed.data;

        // Credit Validation & Deduction (happens before job is queued)
        const creditError = await validateAndDeductCredits(profile.id, profile.tier, count);
        if (creditError) return creditError;

        const apiKey = process.env.NANOBANANA_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Image generation API key is not configured' }, { status: 500 });
        }

        // Create a job record
        const jobId = crypto.randomBytes(4).toString('hex');
        await db.insert(generations).values({
            id: jobId,
            userId: profile.id,
            status: 'pending',
            prompt,
            model,
            count,
            aspectRatio,
        });

        // Schedule the actual generation to run AFTER the response is sent
        // This uses Next.js 15 `after()` — keeps the response fast
        after(async () => {
            await runGeneration(jobId, apiKey, model, prompt, count, aspectRatio, negativePrompt);
        });

        // Return the jobId immediately so the frontend can start polling
        return NextResponse.json({ jobId, status: 'pending' });

    } catch (error: unknown) {
        console.error('[Image Generate Error]', error);
        const message = error instanceof Error ? error.message : 'Image generation failed';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
