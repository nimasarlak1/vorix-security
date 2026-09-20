import { NextResponse } from 'next/server';
import { getDBInfo } from '../../lib/db';

export const runtime = 'edge';

const STATS_TABLE = 'order_stats';

export async function GET() {
  const { db } = getDBInfo();

  if (!db) {
    return NextResponse.json({ count: 312 });
  }

  try {
    const result = await db
      .prepare(`SELECT count FROM ${STATS_TABLE} WHERE id = 1`)
      .first<{ count: number }>();

    return NextResponse.json({ count: result?.count ?? 312 });
  } catch (error) {
    console.error('Error fetching order count:', error);
    return NextResponse.json({ count: 312 });
  }
}

