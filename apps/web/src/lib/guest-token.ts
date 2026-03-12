import crypto from 'crypto';

const GUEST_TOKEN_SECRET = process.env.GUEST_TOKEN_SECRET || process.env.NEXT_PUBLIC_SUPABASE_URL || 'spb-dev-secret';
const GUEST_TOKEN_MAX_AGE = 86400; // 24 hours in seconds

function getSecret(): string {
  return `spb-guest-${GUEST_TOKEN_SECRET}`;
}

/** Create a signed guest token: `{timestamp}.{hmac}` */
export function createGuestToken(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const hmac = crypto
    .createHmac('sha256', getSecret())
    .update(timestamp)
    .digest('hex');
  return `${timestamp}.${hmac}`;
}

/** Verify a guest token is valid and not expired. */
export function verifyGuestToken(token: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [timestamp, providedHmac] = parts;
  const ts = parseInt(timestamp, 10);
  if (isNaN(ts)) return false;

  // Check expiry
  const now = Math.floor(Date.now() / 1000);
  if (now - ts > GUEST_TOKEN_MAX_AGE) return false;

  // Verify HMAC
  const expectedHmac = crypto
    .createHmac('sha256', getSecret())
    .update(timestamp)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(providedHmac, 'hex'),
      Buffer.from(expectedHmac, 'hex'),
    );
  } catch {
    return false;
  }
}
