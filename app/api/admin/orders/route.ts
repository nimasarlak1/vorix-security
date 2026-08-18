import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  const password = request.headers.get('x-admin-password');
  
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ success: false, error: 'رمز عبور اشتباه است' }, { status: 401 });
  }

  const orders = global.globalOrders || [];
  return NextResponse.json({ success: true, orders });
}

export async function POST(request: Request) {
  try {
    const password = request.headers.get('x-admin-password');
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: 'رمز عبور اشتباه است' }, { status: 401 });
    }

    const { orderId, status } = await request.json();
    if (global.globalOrders) {
      const order = global.globalOrders.find((o: any) => o.id === orderId);
      if (order) {
        order.status = status;
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
