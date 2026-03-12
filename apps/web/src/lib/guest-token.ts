const GUEST_TOKEN_SECRET = process.env.GUEST_TOKEN_SECRET || process.env.NEXT_PUBLIC_SUPABASE_URL || 'spb-dev-secret';
const GUEST_TOKEN_MAX_AGE = 86400; // 24 hours in seconds

function getSecret(): string {
  return `spb-guest-${GUEST_TOKEN_SECRET}`;
}

const encoder = new TextEncoder();

async function hmacSha256(key: string, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Create a signed guest token: `{timestamp}.{hmac}` */
export async function createGuestToken(): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const hmac = await hmacSha256(getSecret(), timestamp);
  return `${timestamp}.${hmac}`;
}

/** Verify a guest token is valid and not expired. */
export async function verifyGuestToken(token: string): Promise<boolean> {
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [timestamp, providedHmac] = parts;
  const ts = parseInt(timestamp, 10);
  if (isNaN(ts)) return false;

  // Check expiry
  const now = Math.floor(Date.now() / 1000);
  if (now - ts > GUEST_TOKEN_MAX_AGE) return false;

  // Verify HMAC — constant-time comparison via Web Crypto
  const expectedHmac = await hmacSha256(getSecret(), timestamp);
  if (expectedHmac.length !== providedHmac.length) return false;

  // Timing-safe compare using subtle crypto
  const a = encoder.encode(expectedHmac);
  const b = encoder.encode(providedHmac);
  if (a.byteLength !== b.byteLength) return false;

  // Import both as keys and compare — crypto.subtle.verify gives constant-time comparison
  const key = await crypto.subtle.importKey(
    'raw', a, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new Uint8Array(0));
  const key2 = await crypto.subtle.importKey(
    'raw', b, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );
  const sig2 = await crypto.subtle.sign('HMAC', key2, new Uint8Array(0));

  const arr1 = new Uint8Array(sig);
  const arr2 = new Uint8Array(sig2);
  let diff = 0;
  for (let i = 0; i < arr1.length; i++) {
    diff |= arr1[i]! ^ arr2[i]!;
  }
  return diff === 0;
}
