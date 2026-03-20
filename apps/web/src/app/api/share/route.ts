import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { sharedLinks } from '@/db/schema';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const { payload } = await req.json();

        if (!payload || typeof payload !== 'string') {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        // Generate a random 6-character ID
        const id = crypto.randomBytes(3).toString('hex');

        // Insert into DB
        await db.insert(sharedLinks).values({
            id,
            payload
        });

        // Return the short ID
        return NextResponse.json({ id });

    } catch (error) {
        console.error('[Share Link Error]', error);
        return NextResponse.json({ error: 'Failed to generate share link' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
        }

        const link = await db.query.sharedLinks.findFirst({
            where: (links, { eq }) => eq(links.id, id)
        });

        if (!link) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 });
        }

        return NextResponse.json({ payload: link.payload });

    } catch (error) {
        console.error('[Share Link Error]', error);
        return NextResponse.json({ error: 'Failed to retrieve share link' }, { status: 500 });
    }
}
