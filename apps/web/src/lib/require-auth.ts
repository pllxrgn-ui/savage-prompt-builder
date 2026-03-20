import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export type UserProfile = typeof users.$inferSelect;

type RouteResult =
  | { user: User; profile: UserProfile; error?: never }
  | { user?: never; profile?: never; error: NextResponse };

/** 
 * Check auth in an API route. 
 * Returns the Supabase user AND their database profile.
 * Creates the profile if it doesn't exist (Lazy Registration).
 */
export async function requireAuth(): Promise<RouteResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  // 1. Fetch profile from DB
  let profile = await db.query.users.findFirst({
    where: eq(users.id, user.id),
  });

  // 2. Lazy Registration: If profile is missing, create it
  if (!profile) {
    try {
      const [newProfile] = await db.insert(users).values({
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.full_name || user.user_metadata?.name || null,
        avatar: user.user_metadata?.avatar_url || null,
        tier: 'free',
        credits: 100, // Starting credits for new users
      }).returning();
      
      profile = newProfile;
    } catch (err) {
      console.error('[Lazy Registration Error]', err);
      return { 
        error: NextResponse.json({ error: 'Failed to initialize user session' }, { status: 500 }) 
      };
    }
  }

  return { user, profile };
}

