import { NextResponse } from 'next/server';
import { getDBInfo } from '../../lib/db';

export const runtime = 'edge';

const STATS_TABLE = 'order_stats';
const DEFAULT_COUNT = 312;

// این عدد عمومی است؛ برای جلوگیری از فشار روی دیتابیس، پاسخ ۶۰ ثانیه کش می‌شود
const CACHE = { 'Cache-Control': 'public, max-age=60, s-maxage=60' };

export async function GET() {
  const { db } = getDBInfo();

  if (!db) {
    return NextResponse.json({ count: DEFAULT_COUNT }, { headers: CACHE });
  }

  try {
    const result = await db.prepare(`SELECT count FROM ${STATS_TABLE} WHERE id = 1`).first();
    const count = Number(result?.count);
    return NextResponse.json({ count: Number.isFinite(count) && count > 0 ? count : DEFAULT_COUNT }, { headers: CACHE });
  } catch (error) {
    console.error('Error fetching order count:', error);
    return NextResponse.json({ count: DEFAULT_COUNT }, { headers: CACHE });
  }
}
