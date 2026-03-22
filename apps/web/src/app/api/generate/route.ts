import { NextResponse, after } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { requireAuth } from '@/lib/require-auth';
import { validateAndDeductCredits } from '@/lib/credits';
import { db } from '@/db';
import { generations } from '@/db/schema';
import { eq } from 'drizzle-orm';

import { runGeneration } from '@/lib/services/generation-service';

const ALLOWED_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:4'] as const;

const generateSchema = z.object({
    prompt: z.string().min(1).max(2000),
    model: z.string().optional().default('imagen-4.0-generate-001'),
    count: z.number().int().min(1).max(4).optional().default(1),
    aspectRatio: z.enum(ALLOWED_RATIOS).optional().default('1:1'),
    negativePrompt: z.string().max(1000).optional(),
});

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
