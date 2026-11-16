import { getDBSafe, getEnv } from '../../../lib/db';
import { authenticate, newId, readJson } from '../../../lib/guard';
import { jsonNoStore } from '../../../lib/security';
import { isKind, KINDS, sanitizeItem } from '../../../lib/itemspec';
import { ensureSchema } from '../../../lib/schema';

export const runtime = 'edge';

// فهرست آیتم‌های یک نوع (?kind=portfolio|product|service|credential) — دسترسی هر نوع جداست
export async function GET(request: Request) {
  const db = getDBSafe();
  const env = getEnv();
  const kind = new URL(request.url).searchParams.get('kind');
  if (!isKind(kind)) return jsonNoStore({ success: false, error: 'نوع نامعتبر است.' }, 400);
  const a = await authenticate(request, db, env, KINDS[kind].perm);
  if (a.res) return a.res;
  await ensureSchema(db);
  const { results } = await db
    .prepare('SELECT id, status, sort, data, created_at, updated_at FROM vx_items WHERE kind = ?1 ORDER BY sort ASC, created_at DESC LIMIT 300')
    .bind(kind)
    .all();
  const items = (results || []).map((r: any) => {
    let data = {};
    try {
      data = JSON.parse(r.data);
    } catch {}
    return { id: r.id, status: r.status, sort: r.sort, created_at: r.created_at, ...data };
  });
  return jsonNoStore({ success: true, items });
}

async function slugTaken(db: any, slug: string, exceptId: string) {
  const row = await db
    .prepare(`SELECT id FROM vx_items WHERE kind = 'service' AND json_extract(data, '$.slug') = ?1 AND id != ?2`)
    .bind(slug, exceptId)
    .first();
  return !!row;
}
export async function POST(request: Request) {
  const db = getDBSafe();
  const env = getEnv();
  const body = await readJson(request, 20000);
  const kind = body?.kind;
  if (!isKind(kind)) return jsonNoStore({ success: false, error: 'نوع نامعتبر است.' }, 400);
  const a = await authenticate(request, db, env, KINDS[kind].perm);
  if (a.res) return a.res;

  const { data, error } = sanitizeItem(kind, body.data);
  if (!data) return jsonNoStore({ success: false, error }, 400);
  const status = KINDS[kind].statuses.some((s) => s.v === body.status) ? body.status : 'draft';

  await ensureSchema(db);
  const count = await db.prepare('SELECT COUNT(*) AS c FROM vx_items WHERE kind = ?1').bind(kind).first();
  if (Number(count?.c) >= 200) return jsonNoStore({ success: false, error: 'تعداد آیتم‌ها به حد مجاز رسیده است.' }, 400);
  if (kind === 'service' && (await slugTaken(db, data.slug, ''))) {
    return jsonNoStore({ success: false, error: 'این نشانی صفحه قبلاً استفاده شده است.' }, 409);
  }

  const id = newId();
  const now = new Date().toISOString();
  await db
    .prepare('INSERT INTO vx_items (id, kind, status, sort, data, created_at, updated_at) VALUES (?1, ?2, ?3, 0, ?4, ?5, ?5)')
    .bind(id, kind, status, JSON.stringify(data), now)
    .run();
  return jsonNoStore({ success: true, id });
}
