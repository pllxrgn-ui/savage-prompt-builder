import { NextResponse, after } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { requireAuth } from '@/lib/require-auth';
import { validateAndDeductCredits } from '@/lib/credits';
import { db } from '@/db';
import { generations } from '@/db/schema';
import { runGeneration } from '@/lib/services/generation-service';

export const maxDuration = 300; // 5 minutes max duration for bulk processing on Vercel

const ALLOWED_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:4'] as const;

const bulkGenerateSchema = z.object({
  prompts: z.array(z.string().min(1).max(2000)).min(1).max(50),
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
    const parsed = bulkGenerateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request parameters', issues: parsed.error.issues.map((i: any) => i.message) },
        { status: 400 },
      );
    }

    const { prompts, model, count, aspectRatio, negativePrompt } = parsed.data;
    const totalCreditsRequired = prompts.length * count;

    // Credit Validation & Deduction
    const creditError = await validateAndDeductCredits(profile.id, profile.tier, totalCreditsRequired);
    if (creditError) return creditError;

    // The generation service requires an API key
    const apiKey = process.env.NANOBANANA_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'Image generation API key is not configured' }, { status: 500 });
    }

    // Create a job record for EACH prompt
    const newJobs = prompts.map((prompt) => {
      return {
        id: crypto.randomBytes(4).toString('hex'),
        userId: profile.id,
        status: 'pending',
        prompt,
        model,
        count,
        aspectRatio,
      };
    });

    // Insert all pending jobs into the database in one batch
    await db.insert(generations).values(newJobs);

    // Kick off bulk processing asynchronously
    after(async () => {
      console.log(`[Bulk] Queueing ${newJobs.length} generations natively...`);
      
      // We process sequentially to respect provider rate-limits (avoid API 429 errors)
      // NanoBanana/Imagen can drop connections if flooded instantly.
      for (const job of newJobs) {
        // Automatically skips fetching and directly evaluates the same engine `runGeneration` method!
        await runGeneration(job.id, apiKey, job.model, job.prompt, job.count, job.aspectRatio, negativePrompt);
        
        // Slight throttle delay (ex. 1.5 seconds) to be extra safe against generic API quotas
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      
      console.log(`[Bulk] Finished processing ${newJobs.length} generations!`);
    });

    return NextResponse.json({ 
      success: true, 
      jobIds: newJobs.map(j => j.id),
      message: `${newJobs.length} prompts queued for asynchronous bulk generation.`
    });

  } catch (error: any) {
    console.error('[Bulk Generate Error]', error);
    return NextResponse.json({ error: error.message || 'Bulk generation failed' }, { status: 500 });
  }
}

