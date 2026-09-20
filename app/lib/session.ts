// امضا و بررسی کوکی نشست ادمین با HMAC-SHA256 (بدون نیاز به جدول نشست در دیتابیس)
// و مقایسه‌ی امن رمز عبور در برابر حمله‌ی زمان‌سنجی (timing attack).

const encoder = new TextEncoder();

export const SESSION_COOKIE = 'vorix_admin_session';
export const SESSION_TTL_SECONDS = 8 * 60 * 60; // ۸ ساعت

async function hmacKey(secret: string) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function toHex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function createSessionToken(secret: string, ttlSeconds: number): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(String(exp)));
  return `${exp}.${toHex(sig)}`;
}

export async function verifySessionToken(secret: string, token: string | undefined | null): Promise<boolean> {
  if (!secret || !token) return false;
  const [expStr, sig] = token.split('.');
  if (!expStr || !sig) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false;
  const key = await hmacKey(secret);
  const expected = await crypto.subtle.sign('HMAC', key, encoder.encode(expStr));
  return timingSafeEqualHex(toHex(expected), sig);
}

export async function isAuthorizedRequest(request: Request, secret: string): Promise<boolean> {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  return verifySessionToken(secret, match?.[1]);
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// مقایسه‌ی رمز عبور با طول ثابت، حتی اگر طول دو رشته فرق داشته باشد
export function timingSafeEqualString(a: string, b: string): boolean {
  const maxLen = Math.max(a.length, b.length, 32);
  const pa = a.padEnd(maxLen, '\0');
  const pb = b.padEnd(maxLen, '\0');
  let diff = a.length === b.length ? 0 : 1;
  for (let i = 0; i < maxLen; i++) diff |= pa.charCodeAt(i) ^ pb.charCodeAt(i);
  return diff === 0;
}
