import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextResponse, after } from 'next/server';
import { AI_SYSTEM_PROMPTS } from '@/lib/ai/prompts';
import { requireAuth } from '@/lib/require-auth';
import { validateAndDeductCredits } from '@/lib/credits';
import { db } from '@/db';
import { generations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

/** Performs the actual prompt polish AI call and updates the job record */
async function runPolish(
    jobId: string,
    prompt: string,
    generator: string,
    templateId: string
) {
    try {
        await db.update(generations)
            .set({ status: 'processing' })
            .where(eq(generations.id, jobId));

        const { text } = await generateText({
            model: openai('gpt-4o-mini'), // Switching to OpenAI since your key is valid
            system: AI_SYSTEM_PROMPTS.polish,
            prompt: `Original Prompt: ${prompt}\nTarget Generator: ${generator}\nTemplate Context: ${templateId}`,
        });

        // Store the result in the `images` column as a JSON array (even though it's text) 
        // to stay consistent with the generations table schema.
        await db.update(generations)
            .set({ status: 'completed', images: [text], completedAt: new Date() })
            .where(eq(generations.id, jobId));

    } catch (err: any) {
        console.error(`[Polish Job ${jobId} Failed]`, err);
        await db.update(generations)
            .set({ status: 'failed', error: err.message ?? 'Polish failed' })
            .where(eq(generations.id, jobId));
    }
}

export async function POST(req: Request) {
    try {
        const auth = await requireAuth();
        if (auth.error) return auth.error;

        const { profile } = auth;
        const body = await req.json();
        const { prompt, generator, templateId } = body;

        // Polish costs 1 credit, refundable upon YES feedback
        const creditError = await validateAndDeductCredits(profile.id, profile.tier, 1);
        if (creditError) return creditError;

        // Create the background job
        const jobId = crypto.randomBytes(4).toString('hex');
        await db.insert(generations).values({
            id: jobId,
            userId: profile.id,
            type: 'polish', // Crucial to distinguish from image jobs
            status: 'pending',
            prompt,
            model: 'gemini-2.0-flash', 
            count: 1,
        });

        // Run the AI call after the response is sent
        after(async () => {
            await runPolish(jobId, prompt, generator, templateId);
        });

        return NextResponse.json({ jobId, status: 'pending' });

    } catch (error) {
        console.error('[AI Polish Error]', error);
        return NextResponse.json({ error: 'Failed to initiate prompt polish' }, { status: 500 });
    }
}
