import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';

export async function POST(req: Request) {
    try {
        const { prompt, generator, templateId } = await req.json();

        const { text } = await generateText({
            model: openai('gpt-4o-mini'),
            system: AI_SYSTEM_PROMPTS.polish,
            prompt: `Original Prompt: ${prompt}\nTarget Generator: ${generator}\nTemplate Context: ${templateId}`,
        });

        return NextResponse.json({ result: text });
    } catch (error) {
        console.error('[AI Polish Error]', error);
        return NextResponse.json({ error: 'Failed to polish prompt' }, { status: 500 });
    }
}
