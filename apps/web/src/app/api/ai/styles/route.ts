import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';
import { requireAuth } from '@/lib/require-auth';

export async function POST(req: Request) {
    try {
        const auth = await requireAuth();
        if (auth.error) return auth.error;

        const { vibe } = await req.json();

        const { object } = await generateObject({
            model: openai('gpt-4o-mini'),
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
