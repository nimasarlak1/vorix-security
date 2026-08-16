export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, details } = body;

    // ۱. اعتبارسنجی امنیتی نام (جلوگیری از ارسال مقادیر خالی یا خیلی طولانی)
    if (!name || typeof name !== 'string' || name.trim() === '' || name.length > 100) {
      return Response.json({ success: false, error: 'نام نامعتبر است' }, { status: 400 });
    }

    // ۲. اعتبارسنجی امنیتی شماره تلفن
    if (!phone || typeof phone !== 'string' || phone.trim() === '' || phone.length > 20) {
      return Response.json({ success: false, error: 'شماره تلفن نامعتبر است' }, { status: 400 });
    }

    // ۳. پاکسازی و ایمن‌سازی داده‌ها (Sanitization)
    const safeName = name.trim().slice(0, 100);
    const safePhone = phone.trim().slice(0, 20);
    const safeDetails = details ? String(details).trim().slice(0, 500) : 'بدون توضیحات';

    const BOT_TOKEN = "8949625828:AAG9f6Ve6HXLI4cCOxsLrNicNlQYRGnQSZM";
    const CHAT_ID = "1039217150";

    const message = `🛡️ ثبت سفارش جدید (VORIX.SECURITY):
👤 نام: ${safeName}
📞 تلفن: ${safePhone}
📝 توضیحات: ${safeDetails}`;

    const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        chat_id: CHAT_ID, 
        text: message
      }),
    });

    if (!telegramResponse.ok) {
      throw new Error('خطا در ارتباط با سرور تلگرام');
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: 'خطای داخلی سرور' }, { status: 500 });
  }
}
