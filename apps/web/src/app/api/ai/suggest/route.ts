import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';
import { requireAuth } from '@/lib/require-auth';

export async function POST(req: Request) {
    try {
        const auth = await requireAuth();
        if (auth.error) return auth.error;

        const { templateId, filledFields, emptyFields } = await req.json();

        const { object } = await generateObject({
            model: google('gemini-2.0-flash'),
            system: AI_SYSTEM_PROMPTS.suggest,
            schema: z.record(z.string(), z.string()),
            prompt: `Template: ${templateId}\nFilled fields: ${JSON.stringify(filledFields)}\nEmpty fields to suggest for: ${JSON.stringify(emptyFields)}`,
        });

        return NextResponse.json({ result: object });
    } catch (error) {
        console.error('[AI Suggest Error]', error);
        return NextResponse.json({ error: 'Failed to suggest fields' }, { status: 500 });
    }
}
