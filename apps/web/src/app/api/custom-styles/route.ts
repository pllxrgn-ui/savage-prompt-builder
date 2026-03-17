import { db } from '@/db';
import { customStyles } from '@/db/schema';
import { requireAuth } from '@/lib/require-auth';
import { NextResponse } from 'next/server';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const styles = await db.query.customStyles.findMany({
      where: eq(customStyles.userId, auth.user.id),
      orderBy: [desc(customStyles.createdAt)],
    });

    return NextResponse.json(styles);
  } catch (error) {
    console.error('[API Custom Styles GET Error]', error);
    return NextResponse.json({ error: 'Failed to fetch custom styles' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const body = await req.json();
    const { name, content, templateId, category } = body;

    if (!name || !content) {
      return NextResponse.json({ error: 'Missing name or content' }, { status: 400 });
    }

    const [newStyle] = await db.insert(customStyles).values({
      userId: auth.user.id,
      name,
      content,
      templateId,
      category,
    }).returning();

    return NextResponse.json(newStyle);
  } catch (error) {
    console.error('[API Custom Styles POST Error]', error);
    return NextResponse.json({ error: 'Failed to save custom style' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Style ID required' }, { status: 400 });

    await db.delete(customStyles).where(eq(customStyles.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API Custom Styles DELETE Error]', error);
    return NextResponse.json({ error: 'Failed to delete custom style' }, { status: 500 });
  }
}
