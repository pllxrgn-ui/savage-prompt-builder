import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';

export async function POST(req: Request) {
    try {
        const { prompt, feedback } = await req.json();

        const { text } = await generateText({
            model: openai('gpt-4o-mini'),
            system: AI_SYSTEM_PROMPTS.refine,
            prompt: `Current Prompt: ${prompt}\nFeedback / Wanted Changes: ${feedback}`,
        });

        return NextResponse.json({ result: text });
    } catch (error) {
        console.error('[AI Refine Error]', error);
        return NextResponse.json({ error: 'Failed to refine prompt' }, { status: 500 });
    }
}
