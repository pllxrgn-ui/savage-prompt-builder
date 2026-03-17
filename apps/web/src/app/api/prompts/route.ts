import { db } from '@/db';
import { prompts } from '@/db/schema';
import { requireAuth } from '@/lib/require-auth';
import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const history = await db.query.prompts.findMany({
      where: eq(prompts.userId, auth.user.id),
      orderBy: [desc(prompts.createdAt)],
      limit: 50,
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error('[API Prompts GET Error]', error);
    return NextResponse.json({ error: 'Failed to fetch prompts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const body = await req.json();
    const { 
      templateId, 
      generator, 
      promptText, 
      fieldData, 
      styles, 
      palettes, 
      keywords, 
      negative,
      projectId,
      rating,
      note,
      versionToken,
      parentId
    } = body;

    if (!promptText || !templateId || !generator) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [newPrompt] = await db.insert(prompts).values({
      userId: auth.user.id,
      templateId,
      generator,
      promptText,
      fieldData,
      styles,
      palettes,
      keywords,
      negative,
      projectId,
      rating: rating || null,
      note: note || null,
      versionToken: versionToken || null,
      parentId: parentId || null,
    }).returning();

    return NextResponse.json(newPrompt);
  } catch (error) {
    console.error('[API Prompts POST Error]', error);
    return NextResponse.json({ error: 'Failed to save prompt' }, { status: 500 });
  }
}
