import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    // @ts-ignore
    const db = process.env.DB;
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database DB binding not found' }, { status: 500 });
    }

    // تست اینکه جدول orders اصلاً وجود داره یا نه و خوندن اطلاعات
    const { results } = await db.prepare('SELECT * FROM orders ORDER BY id DESC').all();

    return NextResponse.json({ success: true, orders: results || [] });
  } catch (err: any) {
    // اگر جدول یا دیتابیس خطا داشته باشه، دقیقاً متن خطا رو برمی‌گردونیم تا بفهمیم مشکل چیه
    return NextResponse.json({ success: false, error: 'DB Error: ' + (err.message || JSON.stringify(err)) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { orderId, newStatus } = await request.json();
    // @ts-ignore
    const db = process.env.DB;
    
    await db.prepare('UPDATE orders SET status = ? WHERE id = ?')
      .bind(newStatus, orderId)
      .run();

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
