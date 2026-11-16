import { NextResponse } from 'next/server';
import { getDBInfo } from '../../lib/db';
import { getJobsCount } from '../../lib/content';
import { ensureSchema } from '../../lib/schema';

export const runtime = 'edge';

// عدد «کارهای انجام‌شده»: عدد پایه‌ی پنل + سفارش‌های «انجام شد». اگر صفر باشد نمایش داده نمی‌شود.
const CACHE = { 'Cache-Control': 'public, max-age=60, s-maxage=60' };

export async function GET() {
  const { db } = getDBInfo();
  if (!db) return NextResponse.json({ count: 0 }, { headers: CACHE });
  try {
    await ensureSchema(db);
    return NextResponse.json({ count: (await getJobsCount(db)).total }, { headers: CACHE });
  } catch {
    return NextResponse.json({ count: 0 }, { headers: CACHE });
  }
}
