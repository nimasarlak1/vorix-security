import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const adminPassword = request.headers.get('x-admin-password');
    if (process.env.ADMIN_PASSWORD && adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: 'دسترسی غیرمجاز - رمز عبور اشتباه است' }, { status: 401 });
    }

    // @ts-ignore
    const db = process.env.DB;
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database DB binding not found' }, { status: 500 });
    }

    const { results } = await db.prepare('SELECT * FROM orders ORDER BY id DESC').all();

    return NextResponse.json({ success: true, orders: results || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'DB Error: ' + (err.message || JSON.stringify(err)) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const adminPassword = request.headers.get('x-admin-password');
    if (process.env.ADMIN_PASSWORD && adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: 'دسترسی غیرمجاز' }, { status: 401 });
    }

    const { orderId, newStatus } = await request.json();
    
    if (!orderId || !newStatus) {
      return NextResponse.json({ success: false, error: 'اطلاعات ناقص است' }, { status: 400 });
    }

    // @ts-ignore
    const db = process.env.DB;
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database DB binding not found' }, { status: 500 });
    }

    await db.prepare('UPDATE orders SET status = ? WHERE id = ?')
      .bind(newStatus, orderId)
      .run();

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
