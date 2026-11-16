// نشست ادمین: کوکی امضاشده با HMAC-SHA256 شامل شناسه، نام کاربری و نقش (بدون جدول نشست).
// رمزها با PBKDF2 هش می‌شوند و مقایسه‌ها در برابر حمله‌ی زمان‌سنجی ایمن‌اند.

const encoder = new TextEncoder();

// پیشوند __Host- یعنی مرورگر کوکی را فقط روی HTTPS و فقط برای همین دامنه قبول می‌کند
export const SESSION_COOKIE = '__Host-vorix_admin';
export const SESSION_TTL_SECONDS = 8 * 60 * 60; // ۸ ساعت

export type Session = { id: string; u: string; role: 'owner' | 'admin'; exp: number };

async function hmacKey(secret: string) {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
}

export function toHex(buf: ArrayBuffer | Uint8Array) {
  return Array.from(buf instanceof Uint8Array ? buf : new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function b64url(s: string) {
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function unb64url(s: string) {
  return atob(s.replace(/-/g, '+').replace(/_/g, '/'));
}

export async function createSessionToken(
  secret: string,
  who: { id: string; u: string; role: 'owner' | 'admin' },
  ttlSeconds: number = SESSION_TTL_SECONDS
): Promise<string> {
  const payload = b64url(JSON.stringify({ ...who, exp: Math.floor(Date.now() / 1000) + ttlSeconds }));
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(secret), encoder.encode(payload));
  return `${payload}.${toHex(sig)}`;
}

export async function parseSessionToken(secret: string, token: string | undefined | null): Promise<Session | null> {
  if (!secret || !token) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  try {
    const expected = toHex(await crypto.subtle.sign('HMAC', await hmacKey(secret), encoder.encode(payload)));
    if (!timingSafeEqualString(expected, sig)) return null;
    const s = JSON.parse(unb64url(payload)) as Session;
    if (!s || typeof s.id !== 'string' || typeof s.u !== 'string' || !Number.isFinite(s.exp)) return null;
    if (s.exp < Math.floor(Date.now() / 1000)) return null;
    if (s.role !== 'owner' && s.role !== 'admin') return null;
    return s;
  } catch {
    return null;
  }
}

export function cookieValue(request: Request): string | undefined {
  const pair = (request.headers.get('cookie') || '')
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${SESSION_COOKIE}=`));
  return pair ? pair.slice(SESSION_COOKIE.length + 1) : undefined;
}

export async function sessionFromRequest(request: Request, secret: string): Promise<Session | null> {
  return parseSessionToken(secret, cookieValue(request));
}

// مقایسه‌ی رشته‌ها با طول ثابت، حتی اگر طول دو رشته فرق داشته باشد
export function timingSafeEqualString(a: string, b: string): boolean {
  const maxLen = Math.max(a.length, b.length, 32);
  const pa = a.padEnd(maxLen, '\0');
  const pb = b.padEnd(maxLen, '\0');
  let diff = a.length === b.length ? 0 : 1;
  for (let i = 0; i < maxLen; i++) diff |= pa.charCodeAt(i) ^ pb.charCodeAt(i);
  return diff === 0;
}

// ---------- هش رمز (PBKDF2؛ کلادفلر حداکثر ۱۰۰٬۰۰۰ دور را پشتیبانی می‌کند) ----------
const ITERATIONS = 100000;

async function pbkdf2(password: string, saltHex: string): Promise<string> {
  const salt = new Uint8Array(saltHex.match(/../g)!.map((h) => parseInt(h, 16)));
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITERATIONS }, key, 256);
  return toHex(bits);
}

export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
  return { hash: await pbkdf2(password, salt), salt };
}

export async function verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
  return timingSafeEqualString(await pbkdf2(password, salt), hash);
}
