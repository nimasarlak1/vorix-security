export const runtime = 'edge';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // خواندن رمز از متغیرهای محیطی سرور (مخفی و امن)
    const correctPassword = process.env.ADMIN_PASSWORD || '@Nimaalk2010';

    if (password === correctPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'رمز عبور اشتباه است' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}

