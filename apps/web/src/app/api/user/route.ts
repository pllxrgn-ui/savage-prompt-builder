import { db } from '@/db';
import { users } from '@/db/schema';
import { requireAuth } from '@/lib/require-auth';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const userRecord = await db.query.users.findFirst({
      where: eq(users.id, auth.user.id),
    });

    if (!userRecord) {
      // If trigger failed or hasn't run yet, user record might be missing
      return NextResponse.json({ error: 'User record not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: userRecord,
    });
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
