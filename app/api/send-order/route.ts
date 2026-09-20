import { NextResponse } from 'next/server';
import { cleanText, isValidMobile, normalizePhone } from '../../lib/validate';

export const runtime = 'edge';

// سازگاری با پنل ادمین قبلی (لیست موقت در حافظه؛ ماندگار نیست)
declare global {
  // eslint-disable-next-line no-var
  var globalOrders: any[] | undefined;
}
if (!globalThis.globalOrders) {
  globalThis.globalOrders = [];
}

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
  if (!token || !chatId) {
    console.error('BOT_TOKEN or CHAT_ID is not set');
    return fail('ثبت سفارش موقتاً ممکن نیست. لطفاً تماس بگیرید.', 503);
  }

  const order = {
    id: Date.now().toString(),
    data: { name, phone, service, description },
    status: 'در حال بررسی',
    created_at: new Date().toISOString(),
  };
  globalThis.globalOrders?.unshift(order);
  if (globalThis.globalOrders && globalThis.globalOrders.length > 200) {
    globalThis.globalOrders.length = 200;
  }

  const time = new Date().toLocaleString('fa-IR', { timeZone: 'Asia/Tehran' });
  const text = [
    '🚨 سفارش جدید',
    `👤 نام: ${name}`,
    `📞 شماره: ${phone}`,
    `🛠 خدمت: ${service}`,
    `💬 توضیحات: ${description || 'بدون توضیحات'}`,
    `🕒 ${time}`,
  ].join('\n');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error('Telegram responded with status', res.status);
      return fail('ارسال سفارش انجام نشد. لطفاً با دفتر تماس بگیرید.', 502);
    }
  } catch {
    console.error('Telegram request failed');
    return fail('ارسال سفارش انجام نشد. لطفاً با دفتر تماس بگیرید.', 502);
  } finally {
    clearTimeout(timer);
  }

  return NextResponse.json({ success: true });
}
