import { NextResponse } from 'next/server';
import { getDBSafe, getEnv, NO_DB_MESSAGE } from '../../../lib/db';
import { createSessionToken, SESSION_COOKIE, SESSION_TTL_SECONDS, timingSafeEqualString, verifyPassword } from '../../../lib/session';
import { clientIp, isAllowedOrigin, sleep } from '../../../lib/security';
import { hitRateLimit, resetRateLimit } from '../../../lib/ratelimit';
import { ensureSchema } from '../../../lib/schema';

export const runtime = 'edge';

// حداکثر ۶ تلاش ورود در ۱۵ دقیقه برای هر IP
const MAX_ATTEMPTS = 6;
const WINDOW_SECONDS = 15 * 60;
// هش ساختگی برای یکسان ماندن زمان پاسخ وقتی نام کاربری وجود ندارد
const DUMMY_SALT = '00112233445566778899aabbccddeeff';
const DUMMY_HASH = '0'.repeat(64);

function fail(error: string, status: number) {
  return NextResponse.json({ success: false, error }, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) return fail('درخواست نامعتبر است.', 403);

  // کانتکست Cloudflare (دیتابیس) قبل از هر await گرفته می‌شود
  const db = getDBSafe();
  const env = getEnv();
  const ownerPassword = env.ADMIN_PASSWORD || '';
  const sessionSecret = env.SESSION_SECRET || '';

  if (!ownerPassword || !sessionSecret) {
    console.error('ADMIN_PASSWORD یا SESSION_SECRET در Cloudflare تنظیم نشده است');
    return fail('ورود موقتاً ممکن نیست. با پشتیبانی فنی تماس بگیرید.', 503);
  }
  if (sessionSecret.length < 16) return fail('SESSION_SECRET باید حداقل ۱۶ کاراکتر باشد.', 503);
  if (!db) return fail(NO_DB_MESSAGE, 503);

  const key = `login:${clientIp(request)}`;
  const limit = await hitRateLimit(db, key, MAX_ATTEMPTS, WINDOW_SECONDS);
  if (limit.limited) return fail('تعداد تلاش‌های ورود زیاد بوده. حدود ۱۵ دقیقه دیگر دوباره امتحان کنید.', 429);

  let body: any;
  try {
    const raw = await request.text();
    if (raw.length > 2000) return fail('درخواست نامعتبر است.', 413);
    body = JSON.parse(raw);
  } catch {
    return fail('درخواست نامعتبر است.', 400);
  }

  const username = (typeof body?.username === 'string' ? body.username : 'owner').trim().toLowerCase().slice(0, 40) || 'owner';
  const password = typeof body?.password === 'string' ? body.password.slice(0, 200) : '';

  let who: { id: string; u: string; role: 'owner' | 'admin' } | null = null;
  if (password) {
    if (username === 'owner') {
      if (timingSafeEqualString(password, ownerPassword)) who = { id: 'owner', u: 'owner', role: 'owner' };
    } else {
      await ensureSchema(db);
      const row = await db.prepare('SELECT id, username, pass_hash, salt, active FROM vx_admins WHERE username = ?1').bind(username).first();
      const okHash = await verifyPassword(password, row?.pass_hash || DUMMY_HASH, row?.salt || DUMMY_SALT);
      if (row && okHash && Number(row.active) === 1) who = { id: row.id, u: row.username, role: 'admin' };
    }
  }

  if (!who) {
    await sleep(500); // کند کردن حدس‌زدن رمز
    return fail('نام کاربری یا رمز اشتباه است.', 401);
  }

  await resetRateLimit(db, key);
  const token = await createSessionToken(sessionSecret, who, SESSION_TTL_SECONDS);
  const res = NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
  res.cookies.set(SESSION_COOKIE, token, { httpOnly: true, secure: true, sameSite: 'strict', path: '/', maxAge: SESSION_TTL_SECONDS });
  return res;
}
