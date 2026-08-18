import { NextResponse } from 'next/server';

export const runtime = 'edge';

// حافظه مشترک پایدار در لبه سرور
declare global {
  var globalOrders: any[];
}

if (!global.globalOrders) {
  global.globalOrders = [];
}

export async function GET(request: Request) {
  try {
    const adminPassword = request.headers.get('x-admin-password');
    if (process.env.ADMIN_PASSWORD && adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: 'دسترسی غیرمجاز' }, { status: 401 });
    }

    return NextResponse.json({ success: true, orders: global.globalOrders || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const adminPassword = request.headers.get('x-admin-password');
    if (process.env.ADMIN_PASSWORD && adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: 'دسترسی غیرمجاز' }, { status: 401 });
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
