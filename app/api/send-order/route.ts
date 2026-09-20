import { NextResponse } from 'next/server';
import { cleanText, isValidMobile, normalizePhone } from '../../lib/validate';
import { getDBInfo, ORDERS_TABLE } from '../../lib/db';

export const runtime = 'edge';

// محدودیت تعداد درخواست (در حافظه‌ی همین سرور؛ کمک‌کننده است نه کامل)
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

function isLimited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 500) {
    hits.forEach((v, k) => {
      if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
    });
  }
  return list.length > MAX_HITS;
}

function originAllowed(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    const host = new URL(origin).hostname;
    return (
      host === 'vorixsecurity.ir' ||
      host.endsWith('.vorixsecurity.ir') ||
      host.endsWith('.pages.dev') ||
      host.endsWith('.workers.dev') ||
      host === 'localhost'
    );
  } catch {
    return false;
  }
}

function fail(error: string, status: number) {
  return NextResponse.json({ success: false, error }, { status });
}

export async function POST(request: Request) {
  if (!originAllowed(request)) return fail('درخواست نامعتبر است.', 403);

  const ip =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';
  if (isLimited(ip)) {
    return fail('تعداد درخواست‌ها زیاد است. کمی بعد دوباره تلاش کنید.', 429);
  }

  let body: any;
  try {
    const raw = await request.text();
    if (raw.length > 8000) return fail('حجم اطلاعات ارسالی زیاد است.', 413);
    body = JSON.parse(raw);
  } catch {
    return fail('اطلاعات ارسالی نامعتبر است.', 400);
  }

  // فیلد تله‌ی ربات‌ها: انسان آن را خالی می‌گذارد
  if (body && typeof body === 'object' && body.hp) {
    return NextResponse.json({ success: true });
  }

  const name = cleanText(body?.name, 80);
  const phone = normalizePhone(cleanText(body?.phone, 20));
  const service = cleanText(body?.service, 100) || 'عمومی';
  const description = cleanText(body?.description, 1000);

  if (name.length < 2) return fail('نام را وارد کنید.', 400);
  if (!isValidMobile(phone)) {
    return fail('شماره موبایل معتبر نیست (مثال: 09123456789).', 400);
  }

  const token = process.env.BOT_TOKEN;
  const chatId = process.env.CHAT_ID;

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  // ذخیره در D1 برای نمایش و مدیریت در پنل ادمین
  let saved = false;
  let dbNote = '';
  const { db, reason: dbReason } = getDBInfo();
  if (db) {
    try {
      await db
        .prepare(
          `CREATE TABLE IF NOT EXISTS ${ORDERS_TABLE} (
            id TEXT PRIMARY KEY,
            created_at TEXT NOT NULL,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            service TEXT NOT NULL,
            description TEXT,
            status TEXT NOT NULL DEFAULT 'جدید'
          )`
        )
        .run();
      await db
        .prepare(
          `INSERT INTO ${ORDERS_TABLE} (id, created_at, name, phone, service, description, status) VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(id, createdAt, name, phone, service, description, 'جدید')
        .run();

      // بعد از ذخیره، مطمئن می‌شویم سفارش واقعاً در جدول هست
      const check = await db
        .prepare(`SELECT COUNT(*) AS c FROM ${ORDERS_TABLE}`)
        .first();
      saved = true;
      dbNote = `ذخیره شد (تعداد کل سفارش‌های پنل: ${check?.c ?? '?'})`;
    } catch (e) {
      console.error('D1 insert failed', e);
      dbNote = `ذخیره نشد — ${String((e as any)?.message || e).slice(0, 200)}`;
    }
  } else {
    console.error('D1 binding DB is missing:', dbReason);
    dbNote = `ذخیره نشد — ${dbReason}`;
  }

  const time = new Date().toLocaleString('fa-IR', { timeZone: 'Asia/Tehran' });
  const text = [
    '🚨 سفارش جدید',
    `👤 نام: ${name}`,
    `📞 شماره: ${phone}`,
    `🛠 خدمت: ${service}`,
    `💬 توضیحات: ${description || 'بدون توضیحات'}`,
    `🕒 ${time}`,
    `${saved ? '🗄' : '⚠️'} پنل: ${dbNote}`,
  ].join('\n');

  // اعلان تلگرام
  let notified = false;
  if (token && chatId) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text }),
        signal: controller.signal,
      });
      if (res.ok) notified = true;
      else console.error('Telegram responded with status', res.status);
    } catch {
      console.error('Telegram request failed');
    } finally {
      clearTimeout(timer);
    }
  } else {
    console.error('BOT_TOKEN or CHAT_ID is not set');
  }

  // اگر سفارش حداقل یک‌جا (دیتابیس یا تلگرام) ثبت شده باشد، برای مشتری موفق است
  if (!saved && !notified) {
    return fail('ارسال سفارش انجام نشد. لطفاً با دفتر تماس بگیرید.', 502);
  }
  return NextResponse.json({ success: true });
}
