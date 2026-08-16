export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, details } = body;

    // ۱. بررسی پر بودن فیلدهای ضروری
    if (!name || !phone) {
      return Response.json(
        { success: false, error: 'وارد کردن نام و شماره تلفن الزامی است.' },
        { status: 400 }
      );
    }

    // ۲. پاک‌سازی و ایمن‌سازی ورودی‌ها
    const safeName = String(name).trim().slice(0, 50);
    const safePhone = String(phone).trim().slice(0, 20);
    const safeDetails = details ? String(details).trim().slice(0, 500) : 'ثبت سفارش بدون توضیحات';

    // ۳. خواندن متغیرهای محیطی از کلادفلر
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      return Response.json(
        { success: false, error: 'تنظیمات سرور ناقص است.' },
        { status: 500 }
      );
    }

    // ۴. ساخت متن پیام برای تلگرام
    const message = `🚨 ثبت سفارش امن (VORIX.SECURITY):

👤 نام: ${safeName}
📞 تلفن: ${safePhone}
📝 توضیحات: ${safeDetails}`;

    // ۵. ارسال درخواست به تلگرام
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      }),
    });

    if (!response.ok) {
      return Response.json(
        { success: false, error: 'خطا در ارتباط با سرور تلگرام' },
        { status: 502 }
      );
    }

    return Response.json({ success: true });

  } catch (error) {
    return Response.json(
      { success: false, error: 'خطای داخلی سرور رخ داده است.' },
      { status: 500 }
    );
  }
}
