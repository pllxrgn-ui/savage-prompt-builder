import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
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

        const { prompt, feedback } = await req.json();

        const { text } = await generateText({
            model: google('gemini-2.0-flash'),
            system: AI_SYSTEM_PROMPTS.refine,
            prompt: `Current Prompt: ${prompt}\nFeedback / Wanted Changes: ${feedback}`,
        });

        return NextResponse.json({ result: text });
    } catch (error) {
        console.error('[AI Refine Error]', error);
        return NextResponse.json({ error: 'Failed to refine prompt' }, { status: 500 });
    }
}

