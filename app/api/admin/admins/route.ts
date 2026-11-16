import { getDBSafe, getEnv } from '../../../lib/db';
import { authenticate, newId, parsePerms, readJson } from '../../../lib/guard';
import { jsonNoStore } from '../../../lib/security';
import { PERMS } from '../../../lib/itemspec';
import { hashPassword } from '../../../lib/session';
import { ensureSchema } from '../../../lib/schema';

export const runtime = 'edge';

// فقط مدیر کل: فهرست و ساخت ادمین
export async function GET(request: Request) {
  const db = getDBSafe();
  const env = getEnv();
  const a = await authenticate(request, db, env, 'owner');
  if (a.res) return a.res;
  await ensureSchema(db);
  const { results } = await db.prepare('SELECT id, username, perms, active, created_at FROM vx_admins ORDER BY created_at DESC LIMIT 100').all();
  return jsonNoStore({ success: true, admins: (results || []).map((r: any) => ({ ...r, active: Number(r.active) === 1, perms: parsePerms(r.perms) })) });
}

export async function POST(request: Request) {
  const db = getDBSafe();
  const env = getEnv();
  const a = await authenticate(request, db, env, 'owner');
  if (a.res) return a.res;

  const body = await readJson(request, 3000);
  const username = typeof body?.username === 'string' ? body.username.trim().toLowerCase() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!/^[a-z0-9_.-]{3,30}$/.test(username) || username === 'owner') {
    return jsonNoStore({ success: false, error: 'نام کاربری: ۳ تا ۳۰ حرف انگلیسی کوچک، عدد، نقطه یا خط تیره (و نباید owner باشد).' }, 400);
  }
  if (password.length < 8 || password.length > 100) return jsonNoStore({ success: false, error: 'رمز باید حداقل ۸ کاراکتر باشد.' }, 400);
  const perms = Array.isArray(body?.perms) ? PERMS.filter((p) => body.perms.includes(p)) : [];

  await ensureSchema(db);
  const count = await db.prepare('SELECT COUNT(*) AS c FROM vx_admins').first();
  if (Number(count?.c) >= 30) return jsonNoStore({ success: false, error: 'تعداد ادمین‌ها به حد مجاز رسیده است.' }, 400);
  const dup = await db.prepare('SELECT id FROM vx_admins WHERE username = ?1').bind(username).first();
  if (dup) return jsonNoStore({ success: false, error: 'این نام کاربری قبلاً ساخته شده است.' }, 409);

  const { hash, salt } = await hashPassword(password);
  const id = newId();
  await db
    .prepare('INSERT INTO vx_admins (id, username, pass_hash, salt, perms, active, created_at) VALUES (?1, ?2, ?3, ?4, ?5, 1, ?6)')
    .bind(id, username, hash, salt, JSON.stringify(perms), new Date().toISOString())
    .run();
  return jsonNoStore({ success: true, id });
}
