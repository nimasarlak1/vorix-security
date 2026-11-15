import { NextResponse } from 'next/server';
import { getDBSafe, getEnv, NO_DB_MESSAGE } from '../../../lib/db';
import { createSessionToken, SESSION_COOKIE, SESSION_TTL_SECONDS, timingSafeEqualString } from '../../../lib/session';
import { clientIp, isAllowedOrigin, sleep } from '../../../lib/security';
import { hitRateLimit, resetRateLimit } from '../../../lib/ratelimit';

export const runtime = 'edge';

// حداکثر ۶ تلاش ورود در ۱۵ دقیقه برای هر IP
const MAX_ATTEMPTS = 6;
const WINDOW_SECONDS = 15 * 60;

function fail(error: string, status: number) {
  return NextResponse.json({ success: false, error }, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) return fail('درخواست نامعتبر است.', 403);

  // کانتکست Cloudflare (دیتابیس) قبل از هر await گرفته می‌شود
  const db = getDBSafe();
  const env = getEnv();
  const adminPassword = env.ADMIN_PASSWORD || '';
  const sessionSecret = env.SESSION_SECRET || '';

  if (!adminPassword || !sessionSecret) {
    console.error('ADMIN_PASSWORD یا SESSION_SECRET در Cloudflare تنظیم نشده است');
    return fail('ورود موقتاً ممکن نیست. با پشتیبانی فنی تماس بگیرید.', 503);
  }
  if (sessionSecret.length < 16) {
    console.error('SESSION_SECRET کوتاه است (حداقل ۱۶ کاراکتر)');
    return fail('ورود موقتاً ممکن نیست. SESSION_SECRET باید حداقل ۱۶ کاراکتر باشد.', 503);
  }
  if (!db) {
    console.error('D1 binding DB is missing');
    return fail(NO_DB_MESSAGE, 503);
  }

  const key = `login:${clientIp(request)}`;
  const limit = await hitRateLimit(db, key, MAX_ATTEMPTS, WINDOW_SECONDS);
  if (limit.limited) {
    return fail('تعداد تلاش‌های ورود زیاد بوده. حدود ۱۵ دقیقه دیگر دوباره امتحان کنید.', 429);
  }

  let body: any;
  try {
    const raw = await request.text();
    if (raw.length > 2000) return fail('درخواست نامعتبر است.', 413);
    body = JSON.parse(raw);
  } catch {
    return fail('درخواست نامعتبر است.', 400);
  }

  const password = typeof body?.password === 'string' ? body.password.slice(0, 200) : '';
  const ok = password.length > 0 && timingSafeEqualString(password, adminPassword);

  if (!ok) {
    await sleep(500); // کند کردن حدس‌زدن رمز
    return fail('رمز اشتباه است.', 401);
  }

  await resetRateLimit(db, key);

  const token = await createSessionToken(sessionSecret, SESSION_TTL_SECONDS);
  const res = NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
  return res;
}
