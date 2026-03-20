import { db } from '@/db';
import { users } from '@/db/schema';
import { requireAuth } from '@/lib/require-auth';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    // requireAuth now handles lazy registration, so profile is always present
    return NextResponse.json({ user: auth.profile });
  } catch (error) {
    console.error('[API User GET Error]', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const body = await req.json();
    const { name, avatar } = body;

    const [updatedUser] = await db
      .update(users)
      .set({ name, avatar })
      .where(eq(users.id, auth.user.id))
      .returning();

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('[API User PATCH Error]', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    // Delete user profile — cascades to all user-owned data via DB foreign keys
    await db.delete(users).where(eq(users.id, auth.user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API User DELETE Error]', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

