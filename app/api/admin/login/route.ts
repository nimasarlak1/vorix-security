import { NextResponse } from 'next/server';
import { getDB, getEnv } from '../../../lib/db';
import { createSessionToken, SESSION_COOKIE, SESSION_TTL_SECONDS, timingSafeEqualString } from '../../../lib/session';

export const runtime = 'edge';

const MAX_ATTEMPTS = 5;
const WINDOW_SECONDS = 15 * 60;

function fail(error: string, status: number) {
  return NextResponse.json({ success: false, error }, { status });
}

export async function POST(request: Request) {
  const env = getEnv();
  const adminPassword = env.ADMIN_PASSWORD || '';
  const sessionSecret = env.SESSION_SECRET || '';

  if (!adminPassword || !sessionSecret) {
    console.error('ADMIN_PASSWORD یا SESSION_SECRET در Cloudflare تنظیم نشده است');
    return fail('ورود موقتاً ممکن نیست. با پشتیبانی فنی تماس بگیرید.', 503);
  }

  const db = getDB();
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS login_attempts (
        ip TEXT PRIMARY KEY,
        count INTEGER NOT NULL,
        first_attempt INTEGER NOT NULL
      )`
    )
    .run();

  const ip =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';

  const now = Math.floor(Date.now() / 1000);
  const row = await db
    .prepare('SELECT count, first_attempt FROM login_attempts WHERE ip = ?')
    .bind(ip)
    .first();

  if (row && now - row.first_attempt < WINDOW_SECONDS && row.count >= MAX_ATTEMPTS) {
    return fail('تعداد تلاش‌های ورود زیاد بوده. حدود ۱۵ دقیقه دیگر دوباره امتحان کنید.', 429);
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return fail('درخواست نامعتبر است.', 400);
  }

  const password = typeof body?.password === 'string' ? body.password : '';
  const ok = password.length > 0 && timingSafeEqualString(password, adminPassword);

  if (!ok) {
    if (row && now - row.first_attempt < WINDOW_SECONDS) {
      await db.prepare('UPDATE login_attempts SET count = count + 1 WHERE ip = ?').bind(ip).run();
    } else {
      await db
        .prepare('INSERT OR REPLACE INTO login_attempts (ip, count, first_attempt) VALUES (?, 1, ?)')
        .bind(ip, now)
        .run();
    }
    return fail('رمز اشتباه است.', 401);
  }

  await db.prepare('DELETE FROM login_attempts WHERE ip = ?').bind(ip).run();

  const token = await createSessionToken(sessionSecret, SESSION_TTL_SECONDS);
  const res = NextResponse.json({ success: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
  return res;
}
