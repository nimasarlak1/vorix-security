import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, service, details } = body;

    if (!name || !phone || !service) {
      return NextResponse.json({ success: false, error: 'فیلدهای ضروری پر نشده‌اند' }, { status: 400 });
    }

    // @ts-ignore
    const db = process.env.DB;
    if (db) {
      await db.prepare(`
        INSERT INTO orders (name, phone, service, message, status) VALUES (?, ?, ?, ?, ?)
      `)
      .bind(name, phone, service, details || 'بدون توضیحات', 'در حال بررسی')
      .run();
    }

    // ارسال پیام به تلگرام
    const botToken = process.env.BOT_TOKEN;
    const chatId = process.env.CHAT_ID || '1039217150'; // چت آیدی شما

    if (botToken) {
      const messageText = `🚨 سفارش جدید در VORIX.SECURITY\n\n👤 نام: ${name}\n📞 شماره: ${phone}\n🛠 خدمت: ${service}\n💬 توضیحات: ${details || 'بدون توضیحات'}`;
      
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText
        })
      });
    }

    return NextResponse.json({ success: true, message: 'سفارش ثبت شد' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'خطای سرور' }, { status: 500 });
  }
}
