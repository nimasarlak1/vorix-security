import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, service, details, description, message } = body;
    
    // پشتیبانی از هر نامی که فرم سایت بفرستد
    const finalMessage = details || description || message || 'بدون توضیحات';

    if (!name || !phone || !service) {
      return NextResponse.json(
        { success: false, error: 'لطفاً فیلدهای ضروری را پر کنید' }, 
        { status: 400 }
      );
    }

    // @ts-ignore
    const db = process.env.DB;
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' }, 
        { status: 500 }
      );
    }
    
    // درج سفارش در جدول D1 با وضعیت پیش‌فرض
    await db.prepare(`
      INSERT INTO orders (name, phone, service, message, status) 
      VALUES (?, ?, ?, ?, 'در حال بررسی')
    `)
    .bind(name, phone, service, finalMessage)
    .run();

    return NextResponse.json({ success: true, message: 'سفارش با موفقیت ثبت شد' });
    
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'خطای سرور' }, 
      { status: 500 }
    );
  }
}
