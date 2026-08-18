import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, service, description } = body;

    if (!name || !phone) {
      return NextResponse.json({ success: false, error: 'اطلاعات ناقص است' }, { status: 400 });
    }

    const message = `🚨 سفارش جدید:
👤 نام: ${String(name).trim()}
📞 شماره: ${String(phone).trim()}
🛠 خدمت: ${String(service || 'عمومی').trim()}
💬 توضیحات: ${String(description || 'بدون توضیحات').trim()}`;

    const botToken = process.env.BOT_TOKEN;
    const chatId = process.env.CHAT_ID;

    if (botToken && chatId) {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message })
      });
    }

    return NextResponse.json({ success: true, message: 'سفارش ثبت شد' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
