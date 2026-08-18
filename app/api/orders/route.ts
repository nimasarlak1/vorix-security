import { NextResponse } from 'next/server';
import { getDatabase } from '@netlify/database';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, service, details } = body;

    if (!name || !phone || !service) {
      return NextResponse.json(
        { success: false, error: 'فیلدهای ضروری پر نشده‌اند' },
        { status: 400 }
      );
    }

    // اتصال به Netlify Database (PostgreSQL)
    const db = getDatabase();

    // ساخت جدول در صورت نبودن
    await db.sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        service TEXT NOT NULL,
        message TEXT,
        status TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // ذخیره سفارش در PostgreSQL
    await db.sql`
      INSERT INTO orders (name, phone, service, message, status)
      VALUES (
        ${name},
        ${phone},
        ${service},
        ${details || 'بدون توضیحات'},
        ${'در حال بررسی'}
      )
    `;

    // ارسال پیام به تلگرام
    const botToken = process.env.BOT_TOKEN;
    const chatId = process.env.CHAT_ID || '1039217150';

    if (botToken) {
      const messageText = `🚨 سفارش جدید در VORIX.SECURITY

👤 نام: ${name}
📞 شماره: ${phone}
🛠 خدمت: ${service}
💬 توضیحات: ${details || 'بدون توضیحات'}`;

      await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: messageText
          })
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'سفارش ثبت شد'
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'خطای سرور'
      },
      { status: 500 }
    );
  }
}
