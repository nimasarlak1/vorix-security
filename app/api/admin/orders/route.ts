import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = process.env.DB as any;

    if (!db) {
      return NextResponse.json(
        { success: false, error: 'دیتابیس متصل نیست.' },
        { status: 500 }
      );
    }

    // خواندن لیست سفارش‌ها از دیتابیس D1 با کست کردن نوع داده
    const { results } = await db.prepare(
      'SELECT * FROM orders ORDER BY id DESC'
    ).all();

    return NextResponse.json({ success: true, orders: results || [] });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'خطای سرور' },
      { status: 500 }
    );
  }
}
