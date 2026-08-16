export const runtime = 'edge';
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, details, website } = body;

    // ۱. تله امنیتی برای مسدودسازی ربات‌های اسپم (Honeypot)
    if (website) {
      return Response.json({ error: 'Access Denied' }, { status: 400 });
    }

    // ۲. اعتبارسنجی دقیق ورودی‌ها (Security Validation)
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.length > 50) {
      return Response.json({ error: 'نام نامعتبر است' }, { status: 400 });
    }
    
    if (!phone || typeof phone !== 'string' || phone.length < 10 || phone.length > 15) {
      return Response.json({ error: 'شماره تماس نامعتبر است' }, { status: 400 });
    }

    // ۳. استفاده از متغیرهای محیطی برای محافظت از توکن
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      return Response.json({ error: 'خطای سیستمی' }, { status: 500 });
    }

    // ۴. پاکسازی داده‌ها (Sanitization)
    const safeName = name.trim().slice(0, 50);
    const safePhone = phone.trim().slice(0, 15);
    const safeDetails = details ? String(details).trim().slice(0, 500) : 'بدون توضیحات';

    // ۵. ارسال پیام امن به تلگرام
    const message = `🛡️ ثبت سفارش امن (VORIX.SECURITY):
👤 نام: ${safeName}
📞 تلفن: ${safePhone}
📝 توضیحات: ${safeDetails}`;

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message }),
    });

    if (!response.ok) {
      throw new Error('Telegram API Error');
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
