import { db } from '@/db';
import { recipes } from '@/db/schema';
import { requireAuth } from '@/lib/require-auth';
import { NextResponse } from 'next/server';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const userRecipes = await db.query.recipes.findMany({
      where: eq(recipes.userId, auth.user.id),
      orderBy: [desc(recipes.createdAt)],
    });

    return NextResponse.json(userRecipes);
  } catch (error) {
    console.error('[API Recipes GET Error]', error);
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const body = await req.json();
    const { name, description, templateId, fieldData, styles, palettes, keywords, negative, generatorId } = body;

    if (!name || !templateId || !fieldData || !styles || !generatorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [newRecipe] = await db.insert(recipes).values({
      userId: auth.user.id,
      name,
      description,
      templateId,
      fieldData,
      styles,
      palettes,
      keywords,
      negative,
      generatorId,
    }).returning();

    return NextResponse.json(newRecipe);
  } catch (error) {
    console.error('[API Recipes POST Error]', error);
    return NextResponse.json({ error: 'Failed to save recipe' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Recipe ID required' }, { status: 400 });

    await db.delete(recipes).where(eq(recipes.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API Recipes DELETE Error]', error);
    return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 });
  }
}
