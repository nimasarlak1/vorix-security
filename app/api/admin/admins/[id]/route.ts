import { getDBSafe, getEnv } from '../../../../lib/db';
import { authenticate, readJson } from '../../../../lib/guard';
import { jsonNoStore } from '../../../../lib/security';
import { PERMS } from '../../../../lib/itemspec';
import { hashPassword } from '../../../../lib/session';
import { ensureSchema } from '../../../../lib/schema';

export const runtime = 'edge';
type Ctx = { params: Promise<{ id: string }> | { id: string } };

// فقط مدیر کل: تغییر دسترسی‌ها، فعال/غیرفعال کردن و تغییر رمز
export async function PATCH(request: Request, context: Ctx) {
  const db = getDBSafe();
  const env = getEnv();
  const a = await authenticate(request, db, env, 'owner');
  if (a.res) return a.res;
  const { id } = await context.params;
  const body = await readJson(request, 3000);
  if (!body || typeof id !== 'string' || id.length > 64) return jsonNoStore({ success: false, error: 'درخواست نامعتبر است.' }, 400);

  await ensureSchema(db);
  const row = await db.prepare('SELECT id FROM vx_admins WHERE id = ?1').bind(id).first();
  if (!row) return jsonNoStore({ success: false, error: 'ادمین پیدا نشد.' }, 404);

  if (Array.isArray(body.perms)) {
    const perms = PERMS.filter((p) => body.perms.includes(p));
    await db.prepare('UPDATE vx_admins SET perms = ?1 WHERE id = ?2').bind(JSON.stringify(perms), id).run();
  }
  if (typeof body.active === 'boolean') {
    await db.prepare('UPDATE vx_admins SET active = ?1 WHERE id = ?2').bind(body.active ? 1 : 0, id).run();
  }
  if (typeof body.password === 'string') {
    if (body.password.length < 8 || body.password.length > 100) return jsonNoStore({ success: false, error: 'رمز باید حداقل ۸ کاراکتر باشد.' }, 400);
    const { hash, salt } = await hashPassword(body.password);
    await db.prepare('UPDATE vx_admins SET pass_hash = ?1, salt = ?2 WHERE id = ?3').bind(hash, salt, id).run();
  }
  return jsonNoStore({ success: true });
}

export async function DELETE(request: Request, context: Ctx) {
  const db = getDBSafe();
  const env = getEnv();
  const a = await authenticate(request, db, env, 'owner');
  if (a.res) return a.res;
  const { id } = await context.params;
  if (typeof id !== 'string' || id.length > 64) return jsonNoStore({ success: false, error: 'درخواست نامعتبر است.' }, 400);
  await ensureSchema(db);
  await db.prepare('DELETE FROM vx_admins WHERE id = ?1').bind(id).run();
  return jsonNoStore({ success: true });
}
