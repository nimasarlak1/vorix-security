import { NextResponse } from 'next/server';
import { getDBInfo } from '../../lib/db';
import { getSetting } from '../../lib/content';
import { ensureSchema } from '../../lib/schema';

export const runtime = 'edge';

// عدد «کارهای انجام‌شده» را فقط مدیر در پنل تعیین می‌کند. اگر وارد نشده باشد ۰ برمی‌گردد (یعنی نمایش داده نمی‌شود).
const CACHE = { 'Cache-Control': 'public, max-age=60, s-maxage=60' };

export async function GET() {
  const { db } = getDBInfo();
  if (!db) return NextResponse.json({ count: 0 }, { headers: CACHE });
  try {
    await ensureSchema(db);
    const n = Number(await getSetting(db, 'completed_jobs'));
    return NextResponse.json({ count: Number.isFinite(n) && n > 0 ? Math.floor(n) : 0 }, { headers: CACHE });
  } catch {
    return NextResponse.json({ count: 0 }, { headers: CACHE });
  }
}
