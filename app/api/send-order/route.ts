import { NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, service, details } = body;

    if (!name || !phone) {
      return NextResponse.json({ success: false, error: 'اطلاعات ناقص است.' }, { status: 400 });
    }

    const orderId = 'order_' + Date.now();
    const orderData = {
      id: orderId,
      name: String(name).trim(),
      phone: String(phone).trim(),
      service: String(service || 'عمومی').trim(),
      details: String(details || '').trim(),
      status: 'در حال بررسی',
      date: new Date().toLocaleDateString('fa-IR')
    };

    // ذخیره در Netlify Blobs (دیتابیس ابری نتلیفای)
    try {
      const ordersStore = getStore('orders');
      await ordersStore.setJSON(orderId, orderData);
    } catch (e) {
      console.error('Database error:', e);
    }

    // ارسال به تلگرام
    const botToken = process.env.BOT_TOKEN;
    const chatId = process.env.CHAT_ID;

    if (botToken && chatId) {
      const message = `🚨 سفارش جدید در VORIX.SECURITY\n\n👤 نام: ${orderData.name}\n📞 شماره: ${orderData.phone}\n🛠 خدمت: ${orderData.service}\n💬 توضیحات: ${orderData.details}`;

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' })
      });
    }

    return NextResponse.json({ success: true, orderId });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
