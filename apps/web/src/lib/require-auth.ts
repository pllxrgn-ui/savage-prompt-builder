import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';

type RouteResult =
  | { user: User; error?: never }
  | { user?: never; error: NextResponse };

/** Check auth in an API route. Returns the user or a 401 response. */
export async function requireAuth(): Promise<RouteResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { user };
}
