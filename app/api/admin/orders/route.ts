import { NextResponse } from 'next/server';

export const runtime = 'edge';

// ۱. دریافت لیست سفارش‌ها (GET) با امنیت کامل
export async function GET(request: Request) {
  try {
    // بررسی هدر احراز هویت برای جلوگیری از دسترسی غیرمجاز
    const adminPassword = request.headers.get('x-admin-password');
    
    if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized - دسترسی غیرمجاز' }, 
        { status: 401 }
      );
    }

    // اتصال به Cloudflare KV برای خواندن سفارش‌ها
    // @ts-ignore
    const kv = process.env.ORDERS_KV || globalThis.ORDERS_KV;
    let orders = [];

    if (kv) {
      const data = await kv.get('all_orders');
      orders = data ? JSON.parse(data) : [];
    }

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'خطای سرور در دریافت اطلاعات' }, 
      { status: 500 }
    );
  }
}

// ۲. ویرایش و به‌روزرسانی وضعیت سفارش (POST) با امنیت کامل
export async function POST(request: Request) {
  try {
    // بررسی هدر احراز هویت ادمین
    const adminPassword = request.headers.get('x-admin-password');
    
    if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized - دسترسی غیرمجاز' }, 
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderId, newStatus } = body;

    if (!orderId || !newStatus) {
      return NextResponse.json(
        { error: 'اطلاعات ارسالی ناقص است' }, 
        { status: 400 }
      );
    }

    // اتصال به دیتابیس KV
    // @ts-ignore
    const kv = process.env.ORDERS_KV || globalThis.ORDERS_KV;
    
    if (!kv) {
      return NextResponse.json(
        { error: 'دیتابیس در دسترس نیست' }, 
        { status: 500 }
      );
    }

    const data = await kv.get('all_orders');
    let orders = data ? JSON.parse(data) : [];

    // جستجو و تغییر وضعیت سفارش مورد نظر
    let found = false;
    orders = orders.map((order: any) => {
      if (order.id === orderId) {
        found = true;
        return { ...order, status: newStatus };
      }
      return order;
    });

    if (!found) {
      return NextResponse.json(
        { error: 'سفارش مورد نظر پیدا نشد' }, 
        { status: 404 }
      );
    }

    // ذخیره تغییرات جدید در KV
    await kv.put('all_orders', JSON.stringify(orders));

    return NextResponse.json(
      { success: true, message: 'وضعیت با موفقیت به‌روزرسانی شد' }, 
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: 'خطا در پردازش درخواست' }, 
      { status: 500 }
    );
  }
}
