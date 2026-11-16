import { getDBSafe, getEnv } from '../../../../lib/db';
import { authenticate, readJson } from '../../../../lib/guard';
import { jsonNoStore } from '../../../../lib/security';
import { ensureSchema } from '../../../../lib/schema';
import { ORDER_SERVICES } from '../../../../data/site';
import { parseCouponBody } from '../../../../lib/coupons';

export const runtime = 'edge';
type Ctx = { params: Promise<{ id: string }> | { id: string } };

// روشن/خاموش کردن کد، یا ویرایش کامل مشخصات (خود کد و تعداد استفاده‌شده تغییر نمی‌کند)
export async function PATCH(request: Request, context: Ctx) {
  const db = getDBSafe();
  const env = getEnv();
  const a = await authenticate(request, db, env, 'settings');
  if (a.res) return a.res;
  const { id } = await context.params;
  if (typeof id !== 'string' || !id || id.length > 64) return jsonNoStore({ success: false, error: 'شناسه نامعتبر است.' }, 400);
  const body = await readJson(request, 5000);
  if (!body) return jsonNoStore({ success: false, error: 'درخواست نامعتبر است.' }, 400);

  await ensureSchema(db);
  const row = await db.prepare('SELECT id FROM vx_coupons WHERE id = ?1').bind(id).first();
  if (!row) return jsonNoStore({ success: false, error: 'کد پیدا نشد.' }, 404);

  if (typeof body.active === 'boolean' && body.kind === undefined) {
    await db.prepare('UPDATE vx_coupons SET active = ?1 WHERE id = ?2').bind(body.active ? 1 : 0, id).run();
    return jsonNoStore({ success: true });
  }
  const p = parseCouponBody(body, ORDER_SERVICES);
  if ('error' in p) return jsonNoStore({ success: false, error: p.error }, 400);
  const d = p.data;
  await db
    .prepare(
      `UPDATE vx_coupons SET title = ?1, kind = ?2, value = ?3, services = ?4, starts_at = ?5, expires_at = ?6, max_uses = ?7, per_phone = ?8,
       active = COALESCE(?9, active) WHERE id = ?10`
    )
    .bind(d.title, d.kind, d.value, JSON.stringify(d.services), d.starts_at, d.expires_at, d.max_uses, d.per_phone, typeof body.active === 'boolean' ? (body.active ? 1 : 0) : null, id)
    .run();
  return jsonNoStore({ success: true });
}

export async function DELETE(request: Request, context: Ctx) {
  const db = getDBSafe();
  const env = getEnv();
  const a = await authenticate(request, db, env, 'settings');
  if (a.res) return a.res;
  const { id } = await context.params;
  if (typeof id !== 'string' || !id || id.length > 64) return jsonNoStore({ success: false, error: 'شناسه نامعتبر است.' }, 400);
  await ensureSchema(db);
  await db.prepare('DELETE FROM vx_coupons WHERE id = ?1').bind(id).run();
  return jsonNoStore({ success: true });
}
