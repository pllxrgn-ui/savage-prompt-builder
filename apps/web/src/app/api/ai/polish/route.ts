import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { NextResponse } from 'next/server';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';
import { requireAuth } from '@/lib/require-auth';

export async function POST(req: Request) {
    try {
        const auth = await requireAuth();
        if (auth.error) return auth.error;

        const { prompt, generator, templateId } = await req.json();

        const { text } = await generateText({
            model: google('gemini-2.0-flash'),
            system: AI_SYSTEM_PROMPTS.polish,
            prompt: `Original Prompt: ${prompt}\nTarget Generator: ${generator}\nTemplate Context: ${templateId}`,
        });

        return NextResponse.json({ result: text });
    } catch (error) {
        console.error('[AI Polish Error]', error);
        return NextResponse.json({ error: 'Failed to polish prompt' }, { status: 500 });
    }
}
