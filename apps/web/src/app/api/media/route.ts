import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { media } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
// Import auth helper when setup (e.g. Supabase Auth)
// import { getUser } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        // const user = await getUser(req);
        // if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Hardcoded dev ID for now since auth isn't fully integrated yet
        const userId = "00000000-0000-0000-0000-000000000000";

        const savedMedia = await db
            .select()
            .from(media)
            .where(eq(media.userId, userId))
            .orderBy(desc(media.createdAt));

        return NextResponse.json({ media: savedMedia });
    } catch (error: any) {
        console.error('[Fetch Media Error]', error);
        return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        // const user = await getUser(req);
        // if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const userId = "00000000-0000-0000-0000-000000000000";
        const body = await req.json();
        const { url, provider, model, metadata, promptId } = body;

        const newMedia = await db.insert(media).values({
            userId,
            url,
            provider,
            model,
            promptId,
            metadata,
        }).returning();

        return NextResponse.json({ success: true, media: newMedia[0] });
    } catch (error: any) {
        console.error('[Save Media Error]', error);
        return NextResponse.json({ error: 'Failed to save media entry' }, { status: 500 });
    }
}
