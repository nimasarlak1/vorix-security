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
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database DB is not configured' }, { status: 500 });
    }

    // ثبت دقیق در دیتابیس D1 با متغیر DB
    await db.prepare(
      'INSERT INTO orders (name, phone, service, message, status) VALUES (?, ?, ?, ?, ?)'
    )
    .bind(name, phone, service, details || 'بدون توضیحات', 'در حال بررسی')
    .run();

    return NextResponse.json({ success: true, message: 'سفارش ثبت شد' });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'خطای سرور' }, { status: 500 });
  }
}
