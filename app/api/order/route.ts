import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, service, description } = body;

    // اعتبارسنجی دقیق نوع داده‌ها
    if (!name || typeof name !== 'string' || !phone || typeof phone !== 'string' || !service) {
      return NextResponse.json({ success: false, message: 'اطلاعات وارد شده نامعتبر است.' }, { status: 400 });
    }

    // خواندن امن توکن‌ها از تنظیمات محیطی سرور (Cloudflare Workers Secrets)
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !ADMIN_CHAT_ID) {
      return NextResponse.json({ success: false, message: 'تنظیمات امنیتی سرور ناقص است.' }, { status: 500 });
    }

    // پاکسازی ورودی‌ها برای جلوگیری از تزریق کدهای مخرب (XSS / HTML Injection)
    const safeName = name.replace(/<[^>]*>?/gm, '').trim();
    const safePhone = phone.replace(/<[^>]*>?/gm, '').trim();
    const safeService = service.replace(/<[^>]*>?/gm, '').trim();
    const safeDesc = description ? description.replace(/<[^>]*>?/gm, '').trim() : 'توضیحاتی ثبت نشده است';

    const message = `🚨 سفارش جدید در VORIX.SECURITY\n\n👤 نام: ${safeName}\n📞 شماره تماس: ${safePhone}\n🛠 خدمت: ${safeService}\n📝 توضیحات: ${safeDesc}`;

    const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!telegramResponse.ok) {
      throw new Error('خطا در ارتباط با سرور تلگرام');
    }

    return NextResponse.json({ success: true, message: 'سفارش با موفقیت ثبت شد و برای مدیریت ارسال گردید.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'خطای داخلی سرور رخ داد.' }, { status: 500 });
  }
}

