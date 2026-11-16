import { getDBSafe, getEnv } from '../../../lib/db';
import { authenticate, newId, readJson } from '../../../lib/guard';
import { jsonNoStore } from '../../../lib/security';
import { ensureSchema } from '../../../lib/schema';
import { normCode, parseCouponBody, rowToCoupon } from '../../../lib/coupons';
import { ORDER_SERVICES } from '../../../data/site';

export const runtime = 'edge';

// فقط مدیر کل (دسترسی settings)
export async function GET(request: Request) {
  const db = getDBSafe();
  const env = getEnv();
  const a = await authenticate(request, db, env, 'settings');
  if (a.res) return a.res;
  await ensureSchema(db);
  const { results } = await db.prepare('SELECT * FROM vx_coupons ORDER BY created_at DESC LIMIT 200').all();
  return jsonNoStore({ success: true, coupons: (results || []).map(rowToCoupon) });
}

export async function POST(request: Request) {
  const db = getDBSafe();
  const env = getEnv();
  const a = await authenticate(request, db, env, 'settings');
  if (a.res) return a.res;
  const body = await readJson(request, 5000);
  if (!body) return jsonNoStore({ success: false, error: 'درخواست نامعتبر است.' }, 400);

  const code = normCode(body.code);
  if (!code) return jsonNoStore({ success: false, error: 'کد: ۳ تا ۲۰ حرف انگلیسی، عدد، خط تیره یا زیرخط.' }, 400);
  const p = parseCouponBody(body, ORDER_SERVICES);
  if ('error' in p) return jsonNoStore({ success: false, error: p.error }, 400);

  await ensureSchema(db);
  const count = await db.prepare('SELECT COUNT(*) AS c FROM vx_coupons').first();
  if (Number(count?.c) >= 200) return jsonNoStore({ success: false, error: 'تعداد کدها به حد مجاز رسیده است؛ کدهای قدیمی را حذف کنید.' }, 400);
  const dup = await db.prepare('SELECT id FROM vx_coupons WHERE code = ?1').bind(code).first();
  if (dup) return jsonNoStore({ success: false, error: 'این کد قبلاً ساخته شده است.' }, 409);

  const d = p.data;
  const id = newId();
  await db
    .prepare(
      `INSERT INTO vx_coupons (id, code, title, kind, value, services, starts_at, expires_at, max_uses, per_phone, used, active, created_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, 0, 1, ?11)`
    )
    .bind(id, code, d.title, d.kind, d.value, JSON.stringify(d.services), d.starts_at, d.expires_at, d.max_uses, d.per_phone, new Date().toISOString())
    .run();
  return jsonNoStore({ success: true, id });
}
