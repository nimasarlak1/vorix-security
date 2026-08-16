import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, service, description } = body;

    // 1. اعتبارسنجی ورودی‌ها
    if (!name || name.trim().length < 3) {
      return NextResponse.json({ success: false, error: 'نام و نام خانوادگی را به درستی وارد کنید.' }, { status: 400 });
    }

    // چک کردن شماره موبایل ایرانی (09xxxxxxxxx)
    const phoneRegex = /^09\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return NextResponse.json({ success: false, error: 'شماره تماس صحیح نیست. (فرمت: 09123456789)' }, { status: 400 });
    }

    if (!service) {
      return NextResponse.json({ success: false, error: 'نوع سرویس را انتخاب کنید.' }, { status: 400 });
    }

    // 2. اتصال و درج در دیتابیس
    // @ts-ignore
    const db = process.env.DB;
    if (!db) {
      console.error("Database binding (DB) is not configured!");
      return NextResponse.json({ success: false, error: 'خطای سیستمی رخ داده است.' }, { status: 500 });
    }

    await db.prepare(
      `INSERT INTO orders (name, phone, service, message) VALUES (?, ?, ?, ?)`
    )
    .bind(name, phone, service, description?.substring(0, 500) || '') // محدودیت 500 کاراکتر برای توضیحات
    .run();

    return NextResponse.json({ success: true });

  } catch (err: any) {
    // 3. نمایش خطای عمومی برای امنیت بیشتر (هرگز جزئیات دیتابیس را به کاربر نمایش نده)
    console.error('API Error:', err);
    return NextResponse.json(
      { success: false, error: 'خطایی در ثبت سفارش رخ داد، لطفاً دوباره تلاش کنید.' }, 
      { status: 500 }
    );
  }
}

