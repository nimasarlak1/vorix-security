export async function POST(request: Request) {
  try {
    // دریافت و بررسی داده‌ها
    const body = await request.json();
    const { name, phone, details } = body;

    // ۱. اعتبارسنجی دقیق ورودی‌ها (Security Validation)
    if (!name || name.trim().length < 2 || name.length > 50) {
      return Response.json({ error: 'نام نامعتبر' }, { status: 400 });
    }
    
    // اعتبارسنجی ساده شماره موبایل
    if (!phone || phone.length < 10 || phone.length > 15) {
      return Response.json({ error: 'شماره تماس نامعتبر' }, { status: 400 });
    }

    // ۲. استفاده از متغیرهای محیطی امن (برای جلوگیری از لو رفتن توکن)
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      console.error('Environment variables missing!');
      return Response.json({ error: 'خطای سیستمی' }, { status: 500 });
    }

    // ۳. ارسال پیام به تلگرام
    const message = `🛡️ VORIX.SECURITY Order\n👤 Name: ${name.trim()}\n📞 Phone: ${phone.trim()}\n📝 Note: ${details?.trim() || 'No detail'}`;

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message }),
    });

    if (!response.ok) throw new Error('Telegram API Error');

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
