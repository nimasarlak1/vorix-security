export const runtime = 'edge';
// @ts-nocheck
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = process.env.DB;

    if (!db) {
      return NextResponse.json(
        { success: false, error: 'دیتابیس متصل نیست.' },
        { status: 500 }
      );
    }

    const { results } = await db.prepare(
      'SELECT * FROM orders ORDER BY id DESC'
    ).all();

    return NextResponse.json({ success: true, orders: results || [] });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'خطای سرور' },
      { status: 500 }
    );
  }
}
