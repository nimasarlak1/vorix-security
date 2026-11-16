import { getDBSafe, getEnv, ORDERS_TABLE } from '../../../../lib/db';
import { authenticate, readJson } from '../../../../lib/guard';
import { jsonNoStore } from '../../../../lib/security';
import { clean } from '../../../../lib/itemspec';
import { ensureSchema } from '../../../../lib/schema';

export const runtime = 'edge';

const ALLOWED_STATUSES = ['جدید', 'در حال بررسی', 'انجام شد', 'لغو شد'];

// در Next.js 15 و 16، params یک Promise است (در ۱۴ آبجکت ساده)؛ await روی هر دو درست کار می‌کند
type Ctx = { params: Promise<{ id: string }> | { id: string } };

// تغییر وضعیت و/یا یادداشت سفارش
export async function PATCH(request: Request, context: Ctx) {
  const db = getDBSafe();
  const env = getEnv();
  const a = await authenticate(request, db, env, 'orders');
  if (a.res) return a.res;

  const { id } = await context.params;
  if (typeof id !== 'string' || !id || id.length > 64) return jsonNoStore({ success: false, error: 'شناسه‌ی سفارش نامعتبر است.' }, 400);

  const body = await readJson(request, 4000);
  if (!body) return jsonNoStore({ success: false, error: 'درخواست نامعتبر است.' }, 400);

  const hasStatus = body.status !== undefined;
  const hasNote = body.note !== undefined;
  if (!hasStatus && !hasNote) return jsonNoStore({ success: false, error: 'چیزی برای ذخیره نیست.' }, 400);
  if (hasStatus && !ALLOWED_STATUSES.includes(body.status)) return jsonNoStore({ success: false, error: 'وضعیت نامعتبر است.' }, 400);

  try {
    await ensureSchema(db);
    const exists = await db.prepare(`SELECT id FROM ${ORDERS_TABLE} WHERE id = ?1`).bind(id).first();
    if (!exists) return jsonNoStore({ success: false, error: 'سفارش پیدا نشد.' }, 404);
    if (hasStatus) await db.prepare(`UPDATE ${ORDERS_TABLE} SET status = ?1 WHERE id = ?2`).bind(body.status, id).run();
    if (hasNote) {
      const note = clean(body.note, 1000);
      if (note) {
        await db
          .prepare('INSERT INTO vx_order_notes (order_id, note, updated_at) VALUES (?1, ?2, ?3) ON CONFLICT(order_id) DO UPDATE SET note = ?2, updated_at = ?3')
          .bind(id, note, new Date().toISOString())
          .run();
      } else {
        await db.prepare('DELETE FROM vx_order_notes WHERE order_id = ?1').bind(id).run();
      }
    }
  } catch (e) {
    console.error('order update failed', e);
    return jsonNoStore({ success: false, error: 'ذخیره انجام نشد.', detail: String((e as any)?.message || e).slice(0, 300) }, 500);
  }
  return jsonNoStore({ success: true });
}

export async function DELETE(request: Request, context: Ctx) {
  const db = getDBSafe();
  const env = getEnv();
  const a = await authenticate(request, db, env, 'orders');
  if (a.res) return a.res;
  const { id } = await context.params;
  if (typeof id !== 'string' || !id || id.length > 64) return jsonNoStore({ success: false, error: 'شناسه‌ی سفارش نامعتبر است.' }, 400);
  try {
    await ensureSchema(db);
    await db.prepare('DELETE FROM vx_order_notes WHERE order_id = ?1').bind(id).run();
    await db.prepare(`DELETE FROM ${ORDERS_TABLE} WHERE id = ?1`).bind(id).run();
  } catch (e) {
    console.error('order delete failed', e);
    return jsonNoStore({ success: false, error: 'حذف انجام نشد.' }, 500);
  }
  return jsonNoStore({ success: true });
}
