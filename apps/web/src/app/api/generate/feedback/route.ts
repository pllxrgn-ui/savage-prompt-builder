import { NextResponse } from 'next/server';
import { db } from '@/db';
import { generations, users, positiveDataset, negativeDataset } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { requireAuth } from '@/lib/require-auth';
import { z } from 'zod';

const feedbackSchema = z.object({
  jobId: z.string(),
  isPositive: z.boolean(), // true = YES Reward, false = NO Reward
});

export async function POST(req: Request) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const body = await req.json();
    const parsed = feedbackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { jobId, isPositive } = parsed.data;

    // 1. Fetch the generation job
    const job = await db.query.generations.findFirst({
      where: eq(generations.id, jobId),
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Security: users can only give feedback on their own jobs
    if (job.userId !== auth.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Already submitted?
    if (job.feedbackSubmitted) {
      return NextResponse.json({ error: 'Feedback already submitted for this job' }, { status: 400 });
    }

    // 3. Perform atomic update using a transaction
    await db.transaction(async (tx) => {
      // Mark as submitted
      await tx.update(generations)
        .set({ feedbackSubmitted: true })
        .where(eq(generations.id, jobId));

      // Separate datasets based on feedback:
      if (isPositive) {
        // Save to Positive Dataset
        await tx.insert(positiveDataset).values({
          generationId: jobId,
          userId: auth.user.id,
          prompt: job.prompt || 'Missing prompt',
          metadata: { model: job.model, type: job.type },
        });
      } else {
        // Save to Negative Dataset
        await tx.insert(negativeDataset).values({
          generationId: jobId,
          userId: auth.user.id,
          prompt: job.prompt || 'Missing prompt',
          metadata: { model: job.model, type: job.type },
        });
      }

      // 4. Reward Logic (only for Polish feature, or as per preference)
      if (isPositive && !job.isRewarded && auth.profile.tier === 'free') {
        const cost = job.count;
        
        await tx.update(users)
          .set({ credits: sql`${users.credits} + ${cost}` })
          .where(eq(users.id, auth.user.id));

        await tx.update(generations)
          .set({ isRewarded: true })
          .where(eq(generations.id, jobId));
      }
    });

    return NextResponse.json({ 
      success: true, 
      rewarded: isPositive && auth.profile.tier === 'free',
      message: (isPositive && auth.profile.tier === 'free') 
        ? "Free generation rewarded! 1 credit added back." 
        : "Feedback recorded. Thank you!"
    });

  } catch (err: any) {
    console.error('[Feedback API Error]', err);
    return NextResponse.json({ error: 'Failed to process feedback' }, { status: 500 });
  }
}
