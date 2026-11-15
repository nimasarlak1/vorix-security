import { NextResponse } from 'next/server';
import { cleanText, isValidMobile, normalizePhone } from '../../lib/validate';
import { getDBInfo, getEnv, ORDERS_TABLE } from '../../lib/db';
import { clientIp, describePlatform, isAllowedOrigin } from '../../lib/security';
import { hitRateLimit } from '../../lib/ratelimit';

export const runtime = 'edge';

const STATS_TABLE = 'order_stats';

// حداکثر ۵ سفارش در ۱۰ دقیقه برای هر IP، و ۱۰۰ سفارش در ساعت برای کل سایت (مانع حمله‌ی انبوه به تلگرام)
const IP_MAX = 5;
const IP_WINDOW_SEC = 10 * 60;
const GLOBAL_MAX = 100;
const GLOBAL_WINDOW_SEC = 60 * 60;

function fail(error: string, status: number) {
  return NextResponse.json({ success: false, error }, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  // مهم: کانتکست Cloudflare (دیتابیس) باید همین اول و قبل از هر await گرفته شود
  const dbInfo = getDBInfo();
  const { db, reason: dbReason } = dbInfo;

  if (!isAllowedOrigin(request)) return fail('درخواست نامعتبر است.', 403);

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return fail('اطلاعات ارسالی نامعتبر است.', 400);
  }

  const ip = clientIp(request);
  const ipLimit = await hitRateLimit(db, `order:${ip}`, IP_MAX, IP_WINDOW_SEC);
  if (ipLimit.limited) {
    return fail('تعداد درخواست‌ها زیاد است. کمی بعد دوباره تلاش کنید.', 429);
  }
  const globalLimit = await hitRateLimit(db, 'order:all', GLOBAL_MAX, GLOBAL_WINDOW_SEC);
  if (globalLimit.limited) {
    return fail('در حال حاضر ثبت آنلاین ممکن نیست. لطفاً تماس بگیرید.', 429);
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

  const env = getEnv();
  const token = env.BOT_TOKEN;
  const chatId = env.CHAT_ID;

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  // ذخیره در D1 برای نمایش و مدیریت در پنل ادمین
  let saved = false;
  let dbNote = '';
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

      // ساخت و به‌روزرسانی جدول آمار (شمارنده سفارش‌ها)
      await db
        .prepare(
          `CREATE TABLE IF NOT EXISTS ${STATS_TABLE} (
            id INTEGER PRIMARY KEY,
            count INTEGER NOT NULL
          )`
        )
        .run();
      await db.prepare(`INSERT OR IGNORE INTO ${STATS_TABLE} (id, count) VALUES (1, 312)`).run();
      await db.prepare(`UPDATE ${STATS_TABLE} SET count = count + 1 WHERE id = 1`).run();

      const check = await db.prepare(`SELECT COUNT(*) AS c FROM ${ORDERS_TABLE}`).first();
      saved = true;
      dbNote = `ذخیره شد (تعداد کل سفارش‌ها در پنل: ${check?.c ?? '?'})`;
    } catch (e) {
      console.error('D1 insert failed', e);
      dbNote = `ذخیره نشد — ${String((e as any)?.message || e).slice(0, 150)}`;
    }
  } else {
    console.error('D1 binding DB is missing:', dbReason);
    dbNote = `ذخیره نشد — ${dbReason}`;
  }

  const time = new Date().toLocaleString('fa-IR', { timeZone: 'Asia/Tehran' });
  const lines = [
    '🚨 سفارش جدید',
    `👤 نام: ${name}`,
    `📞 شماره: ${phone}`,
    `🛠 خدمت: ${service}`,
    `💬 توضیحات: ${description || 'بدون توضیحات'}`,
    `🕒 ${time}`,
    `${saved ? '🗄' : '⚠️'} پنل: ${dbNote}`,
  ];
  // فقط وقتی ذخیره نشده، محل اجرای سایت هم نوشته می‌شود تا علت مشکل مشخص شود
  if (!saved) lines.push(`🔎 اجرا روی: ${describePlatform(request)}`);
  const text = lines.join('\n');

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

  // اگر سفارش نه ذخیره شد و نه به تلگرام رسید، به مشتری خطا بده تا با دفتر تماس بگیرد
  if (!saved && !notified) {
    return fail('ارسال سفارش انجام نشد. لطفاً با دفتر تماس بگیرید.', 502);
  }
  return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
}
