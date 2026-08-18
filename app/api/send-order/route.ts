import { NextResponse } from 'next/server';

export const runtime = 'edge';

declare global {
  var globalOrders: any[];
}

if (!global.globalOrders) {
  global.globalOrders = [];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, service, description } = body;

    const newOrder = {
      id: Date.now().toString(),
      data: { name, phone, service, description },
      status: 'در حال بررسی',
      created_at: new Date().toISOString()
    };

    // ذخیره در لیست ادمین
    global.globalOrders.unshift(newOrder);

    const message = `🚨 سفارش جدید:
👤 نام: ${name}
📞 شماره: ${phone}
🛠 خدمت: ${service || 'عمومی'}
💬 توضیحات: ${description || 'بدون توضیحات'}`;

    await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: process.env.CHAT_ID, text: message })
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
