import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

/** 
 * Checks if a user has sufficient credits and deducts them if so.
 * Returns true if deduction was successful, false otherwise.
 */
export async function deductCredits(userId: string, cost: number = 1): Promise<boolean> {
  // We use a transaction or a conditional update to ensure credits don't go negative
  // and we don't have race conditions.
  
  try {
    const result = await db.update(users)
      .set({ 
        credits: sql`${users.credits} - ${cost}` 
      })
      .where(
        sql`${users.id} = ${userId} AND (${users.tier} = 'pro' OR ${users.credits} >= ${cost})`
      )
      .returning();

    return result.length > 0;
  } catch (err) {
    console.error('[Credit Deduction Error]', err);
    return false;
  }
}

/** 
 * Utility more suitable for API routes to handle the error response automatically.
 * Returns null if deduction succeeded, or a NextResponse if it failed.
 */
export async function validateAndDeductCredits(userId: string, tier: string, cost: number = 1) {
  // Pro users have infinite credits in this simple implementation
  if (tier === 'pro') return null;

  const success = await deductCredits(userId, cost);
  
  if (!success) {
    return NextResponse.json({ 
      error: 'Insufficient credits', 
      code: 'INSUFFICIENT_CREDITS' 
    }, { status: 403 });
  }

  return null;
}
