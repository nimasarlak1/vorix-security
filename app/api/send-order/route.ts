import { NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, service, description } = body;

    if (!name || !phone) {
      return NextResponse.json({ success: false, error: 'اطلاعات ناقص است' }, { status: 400 });
    }

    const orderData = {
      name,
      phone,
      service,
      description,
      timestamp: new Date().toISOString()
    };

    // ۱. ذخیره در دیتابیس نتلیفای (Netlify Blobs)
    const store = getStore('orders');
    await store.set(Date.now().toString(), JSON.stringify(orderData));

    // ۲. ارسال به تلگرام
    const message = `🚨 سفارش جدید:
👤 نام: ${name}
📞 شماره: ${phone}
🛠 خدمت: ${service}
💬 توضیحات: ${description || 'بدون توضیحات'}`;

    if (process.env.BOT_TOKEN && process.env.CHAT_ID) {
      await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: process.env.CHAT_ID, text: message })
      });
    }

    return NextResponse.json({ success: true, message: 'ثبت و ارسال شد' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
