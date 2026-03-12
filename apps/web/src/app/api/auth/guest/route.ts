import { NextResponse } from 'next/server';
import { createGuestToken } from '@/lib/guest-token';

export async function POST() {
  const token = createGuestToken();

  const response = NextResponse.json({ ok: true });
  response.cookies.set('spb-guest', token, {
    path: '/',
    maxAge: 86400,
    sameSite: 'lax',
    httpOnly: true,
  });

  return response;
}
