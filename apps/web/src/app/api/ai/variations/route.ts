import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        const { object } = await generateObject({
            model: openai('gpt-4o-mini'),
            system: AI_SYSTEM_PROMPTS.variations,
            schema: z.object({
                variations: z.array(z.string()).min(3).max(5),
            }),
            prompt: `Base Prompt: ${prompt}`,
        });

        return NextResponse.json({ result: object.variations });
    } catch (error) {
        console.error('[AI Variations Error]', error);
        return NextResponse.json({ error: 'Failed to generate variations' }, { status: 500 });
    }
}
