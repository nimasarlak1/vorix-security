import { NextResponse } from 'next/server';
import { getDB, getEnv } from '../../../lib/db';
import { isAuthorizedRequest } from '../../../lib/session';

export const runtime = 'edge';

export async function GET(request: Request) {
  const env = getEnv();
  if (!(await isAuthorizedRequest(request, env.SESSION_SECRET || ''))) {
    return NextResponse.json({ success: false, error: 'لطفاً وارد شوید.' }, { status: 401 });
  }

  const db = getDB();
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        service TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'جدید'
      )`
    )
    .run();

  const { results } = await db
    .prepare(
      'SELECT id, created_at, name, phone, service, description, status FROM orders ORDER BY created_at DESC LIMIT 200'
    )
    .all();

  return NextResponse.json({ success: true, orders: results });
}
