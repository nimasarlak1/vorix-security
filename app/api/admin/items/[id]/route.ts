import { getDBSafe, getEnv } from '../../../../lib/db';
import { authenticate, readJson } from '../../../../lib/guard';
import { jsonNoStore } from '../../../../lib/security';
import { isKind, KINDS, sanitizeItem, type ItemKind } from '../../../../lib/itemspec';
import { ensureSchema } from '../../../../lib/schema';

export const runtime = 'edge';
type Ctx = { params: Promise<{ id: string }> | { id: string } };

async function load(db: any, id: string) {
  await ensureSchema(db);
  return db.prepare('SELECT id, kind, status, data FROM vx_items WHERE id = ?1').bind(id).first();
}

export async function PATCH(request: Request, context: Ctx) {
  const db = getDBSafe();
  const env = getEnv();
  const { id } = await context.params;
  if (typeof id !== 'string' || !id || id.length > 100) return jsonNoStore({ success: false, error: 'شناسه نامعتبر است.' }, 400);
  const body = await readJson(request, 20000);
  if (!body) return jsonNoStore({ success: false, error: 'درخواست نامعتبر است.' }, 400);

  const a0 = await authenticate(request, db, env);
  if (a0.res) return a0.res;
  const row = await load(db, id);
  if (!row || !isKind(row.kind)) return jsonNoStore({ success: false, error: 'پیدا نشد.' }, 404);
  const kind = row.kind as ItemKind;
  const a = await authenticate(request, db, env, KINDS[kind].perm);
  if (a.res) return a.res;

  let data: any = null;
  try {
    data = JSON.parse(row.data);
  } catch {}
  if (body.data !== undefined) {
    const s = sanitizeItem(kind, body.data);
    if (!s.data) return jsonNoStore({ success: false, error: s.error }, 400);
    data = s.data;
    if (kind === 'service') {
      const taken = await db
        .prepare(`SELECT id FROM vx_items WHERE kind = 'service' AND json_extract(data, '$.slug') = ?1 AND id != ?2`)
        .bind(data.slug, id)
        .first();
      if (taken) return jsonNoStore({ success: false, error: 'این نشانی صفحه قبلاً استفاده شده است.' }, 409);
    }
  }
  let status = row.status;
  if (body.status !== undefined) {
    if (!KINDS[kind].statuses.some((x) => x.v === body.status)) {
      return jsonNoStore({ success: false, error: 'وضعیت نامعتبر است.' }, 400);
    }
    status = body.status;
  }
  const sort = Number.isInteger(body.sort) ? Math.max(-9999, Math.min(9999, body.sort)) : undefined;
  if (status === 'published' && !data?.title) return jsonNoStore({ success: false, error: 'عنوان خالی است.' }, 400);

  await db
    .prepare(`UPDATE vx_items SET status = ?1, data = ?2, sort = COALESCE(?3, sort), updated_at = ?4 WHERE id = ?5`)
    .bind(status, JSON.stringify(data), sort ?? null, new Date().toISOString(), id)
    .run();
  return jsonNoStore({ success: true });
}

export async function DELETE(request: Request, context: Ctx) {
  const db = getDBSafe();
  const env = getEnv();
  const { id } = await context.params;
  const a0 = await authenticate(request, db, env);
  if (a0.res) return a0.res;
  const row = typeof id === 'string' && id.length <= 100 ? await load(db, id) : null;
  if (!row || !isKind(row.kind)) return jsonNoStore({ success: false, error: 'پیدا نشد.' }, 404);
  const kind = row.kind as ItemKind;
  const a = await authenticate(request, db, env, KINDS[kind].perm);
  if (a.res) return a.res;
  await db.prepare('DELETE FROM vx_items WHERE id = ?1').bind(id).run();
  return jsonNoStore({ success: true });
}
