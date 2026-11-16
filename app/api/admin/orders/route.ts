import { getDBSafe, getEnv, NO_DB_MESSAGE, ORDERS_TABLE } from '../../../lib/db';
import { authenticate } from '../../../lib/guard';
import { jsonNoStore } from '../../../lib/security';
import { ensureSchema } from '../../../lib/schema';

export const runtime = 'edge';

const STATUSES = ['جدید', 'در حال بررسی', 'انجام شد', 'لغو شد'];

// فهرست سفارش‌ها با جستجو (?q=) و فیلتر وضعیت (?status=) به‌همراه یادداشت هر سفارش
export async function GET(request: Request) {
  const db = getDBSafe();
  const env = getEnv();
  const a = await authenticate(request, db, env, 'orders');
  if (a.res) return a.res;
  if (!db) return jsonNoStore({ success: false, error: NO_DB_MESSAGE }, 503);

  const url = new URL(request.url);
  const q = (url.searchParams.get('q') || '').trim().slice(0, 60);
  const status = url.searchParams.get('status') || '';

  try {
    await ensureSchema(db);
    const where: string[] = [];
    const binds: any[] = [];
    if (status && STATUSES.includes(status)) {
      where.push('o.status = ?');
      binds.push(status);
    }
    if (q) {
      const like = `%${q.replace(/[%_\\]/g, (m) => '\\' + m)}%`;
      where.push(`(o.name LIKE ? ESCAPE '\\' OR o.phone LIKE ? ESCAPE '\\' OR o.service LIKE ? ESCAPE '\\' OR o.description LIKE ? ESCAPE '\\')`);
      binds.push(like, like, like, like);
    }
    const sql = `SELECT o.id, o.created_at, o.name, o.phone, o.service, o.description, o.status, COALESCE(n.note, '') AS note
      FROM ${ORDERS_TABLE} o LEFT JOIN vx_order_notes n ON n.order_id = o.id
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY o.created_at DESC LIMIT 300`;
    const { results } = await db.prepare(sql).bind(...binds).all();
    return jsonNoStore({ success: true, orders: results });
  } catch (e) {
    console.error('load orders failed', e);
    return jsonNoStore({ success: false, error: 'خواندن سفارش‌ها از دیتابیس انجام نشد.', detail: String((e as any)?.message || e).slice(0, 300) }, 500);
  }
}
