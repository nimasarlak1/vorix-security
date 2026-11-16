import { getDBSafe, getEnv } from '../../../lib/db';
import { authenticate, readJson } from '../../../lib/guard';
import { jsonNoStore } from '../../../lib/security';
import { ensureSchema } from '../../../lib/schema';

export const runtime = 'edge';

const BOOL_KEYS = ['telegram_enabled', 'bale_enabled'];

export async function GET(request: Request) {
  const db = getDBSafe();
  const env = getEnv();
  const a = await authenticate(request, db, env, 'settings');
  if (a.res) return a.res;
  await ensureSchema(db);
  const { results } = await db.prepare('SELECT key, value FROM vx_settings').all();
  const map: Record<string, string> = {};
  for (const r of results || []) map[r.key] = r.value;
  return jsonNoStore({
    success: true,
    settings: {
      completed_jobs: map.completed_jobs ?? '',
      telegram_enabled: map.telegram_enabled !== '0',
      bale_enabled: map.bale_enabled === '1',
    },
    // فقط نشان می‌دهد Secretها در Cloudflare تنظیم شده‌اند؛ مقدارشان هرگز برگردانده نمی‌شود
    configured: { telegram: !!(env.BOT_TOKEN && env.CHAT_ID), bale: !!(env.BALE_BOT_TOKEN && env.BALE_CHAT_ID) },
  });
}

export async function PUT(request: Request) {
  const db = getDBSafe();
  const env = getEnv();
  const a = await authenticate(request, db, env, 'settings');
  if (a.res) return a.res;
  const body = await readJson(request, 2000);
  if (!body) return jsonNoStore({ success: false, error: 'درخواست نامعتبر است.' }, 400);
  await ensureSchema(db);

  const writes: any[] = [];
  const put = (k: string, v: string) =>
    writes.push(db.prepare('INSERT INTO vx_settings (key, value) VALUES (?1, ?2) ON CONFLICT(key) DO UPDATE SET value = ?2').bind(k, v));

  if (body.completed_jobs !== undefined) {
    const raw = String(body.completed_jobs).trim();
    if (raw === '') writes.push(db.prepare('DELETE FROM vx_settings WHERE key = ?1').bind('completed_jobs'));
    else {
      const n = Number(raw);
      if (!Number.isInteger(n) || n < 0 || n > 999999) return jsonNoStore({ success: false, error: 'عدد کارهای انجام‌شده نامعتبر است.' }, 400);
      put('completed_jobs', String(n));
    }
  }
  for (const k of BOOL_KEYS) if (typeof body[k] === 'boolean') put(k, body[k] ? '1' : '0');

  if (writes.length) await db.batch(writes);
  return jsonNoStore({ success: true });
}
