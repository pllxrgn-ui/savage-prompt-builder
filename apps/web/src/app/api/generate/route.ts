import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/require-auth';

const ALLOWED_MODELS = ['nanobanana-pro', 'nanobanana-turbo', 'flux-pro', 'flux-dev'] as const;
const ALLOWED_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3'] as const;

const generateSchema = z.object({
  prompt: z.string().min(1).max(2000),
  model: z.enum(ALLOWED_MODELS).optional().default('nanobanana-pro'),
  count: z.number().int().min(1).max(4).optional().default(1),
  aspectRatio: z.enum(ALLOWED_RATIOS).optional().default('1:1'),
  negativePrompt: z.string().max(1000).optional(),
});

// Placeholder URL for NanoBanana Pro API or similar image generation service
const IMAGE_GEN_API_URL = process.env.NANOBANANA_API_URL || 'https://api.nanobanana.com/v1/generate';

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

        const apiKey = process.env.NANOBANANA_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'Image generation API key is not configured' },
                { status: 500 }
            );
        }

        // Proxy the request to the upstream image generation API
        const response = await fetch(IMAGE_GEN_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                prompt,
                negative_prompt: negativePrompt,
                model,
                n: count,
                aspect_ratio: aspectRatio,
            }),
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Image generation failed upstream' },
                { status: response.status }
            );
        }

        const data = await response.json();

        // Standardize the response format: { images: ["url1", "url2"] }
        const images = data.images || data.urls || (data.output ? [data.output] : []);

        return NextResponse.json({ success: true, images });
    } catch (error: any) {
        console.error('[Image Generation Proxy Error]', error);
        return NextResponse.json(
            { error: 'Failed to process image generation request' },
            { status: 500 }
        );
    }
}
