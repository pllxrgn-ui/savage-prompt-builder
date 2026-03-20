import { NextResponse } from 'next/server';
import { db } from '@/db';
import { generations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/require-auth';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ jobId: string }> }
) {
    try {
        const auth = await requireAuth();
        if (auth.error) return auth.error;

        const { jobId } = await params;

        const job = await db.query.generations.findFirst({
            where: eq(generations.id, jobId),
        });

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        // Security: users can only poll their own jobs
        if (job.userId !== auth.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json({
            jobId: job.id,
            status: job.status,
            images: job.images ?? [],
            error: job.error ?? null,
            createdAt: job.createdAt,
            completedAt: job.completedAt ?? null,
        });

    } catch (error: any) {
        console.error('[Generation Status Error]', error);
        return NextResponse.json(
            { error: 'Failed to check generation status', details: error.message },
            { status: 500 }
        );
    }
}
