import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// ۱. خواندن لیست سفارش‌ها از دیتابیس D1
export async function GET(request: Request) {
  try {
    const adminPassword = request.headers.get('x-admin-password');
    if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized - دسترسی غیرمجاز' }, { status: 401 });
    }

    // @ts-ignore
    const db = process.env.DB;
    if (!db) {
      return NextResponse.json({ error: 'Database binding (DB) is not configured!' }, { status: 500 });
    }

    const { results } = await db.prepare('SELECT * FROM orders ORDER BY id DESC').all();

    return NextResponse.json({ success: true, orders: results || [] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'خطای سرور در دریافت اطلاعات' }, { status: 500 });
  }
}

// ۲. آپدیت کردن وضعیت سفارش در دیتابیس D1
export async function POST(request: Request) {
  try {
    const adminPassword = request.headers.get('x-admin-password');
    if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized - دسترسی غیرمجاز' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, newStatus } = body;

    if (!orderId || !newStatus) {
      return NextResponse.json({ error: 'اطلاعات ارسالی ناقص است' }, { status: 400 });
    }

    // @ts-ignore
    const db = process.env.DB;
    if (!db) {
      return NextResponse.json({ error: 'Database binding (DB) is not configured!' }, { status: 500 });
    }

    // به‌روزرسانی وضعیت در جدول orders
    await db.prepare('UPDATE orders SET status = ? WHERE id = ?')
      .bind(newStatus, orderId)
      .run();

    return NextResponse.json({ success: true, message: 'وضعیت با موفقیت به‌روزرسانی شد' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: 'خطا در پردازش درخواست' }, { status: 500 });
  }
}
