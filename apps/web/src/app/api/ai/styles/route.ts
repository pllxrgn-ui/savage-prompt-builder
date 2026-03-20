import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';
import { requireAuth } from '@/lib/require-auth';
import { validateAndDeductCredits } from '@/lib/credits';

export async function POST(req: Request) {
    try {
        const auth = await requireAuth();
        if (auth.error) return auth.error;

        const { profile } = auth;

        const creditError = await validateAndDeductCredits(profile.id, profile.tier, 1);
        if (creditError) return creditError;

        const { vibe } = await req.json();

        const { object } = await generateObject({
            model: google('gemini-2.0-flash'),
            system: AI_SYSTEM_PROMPTS.styles,
            schema: z.object({
                styles: z.array(z.object({
                    name: z.string(),
                    content: z.string()
                })).min(3).max(4),
            }),
            prompt: `Vibe Description: ${vibe}`,
        });

        return NextResponse.json({ result: object.styles });
    } catch (error) {
        console.error('[AI Styles Error]', error);
        return NextResponse.json({ error: 'Failed to generate styles' }, { status: 500 });
    }
}

