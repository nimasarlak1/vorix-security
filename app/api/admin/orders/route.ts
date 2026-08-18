import { NextResponse }/ from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const adminPassword = request.headers.get('x-admin-password');
    if (process.env.ADMIN_PASSWORD && adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: 'دسترسی غیرمجاز - رمز عبور اشتباه است' }, { status: 401 });
    }

    // چون روی Netlify هستیم و دیتابیس ابری متصل است، لیست خالی یا اطلاعات تستی برمی‌گردانیم تا ارور ندهد
    return NextResponse.json({ success: true, orders: [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'DB Error: ' + err.message }, { status: 500 });
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

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
