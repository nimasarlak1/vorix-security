// ثبت سایت‌هایی که کد امضا را گذاشته‌اند (با وضعیت «در انتظار تأیید»).
// دامنه فقط از هدر Origin/Referer مرورگر خوانده می‌شود، نه از پارامتر. ثبت در خود درخواست اسکریپت انجام می‌شود،
// پس حتی اگر سایت مشتری CSP سخت‌گیر داشته باشد و درخواست عکس (img-src) را ببندد، ثبت انجام می‌شود.
import { clientIp } from './security';
import { hitRateLimit } from './ratelimit';
import { ensureSchema } from './schema';
import { clean } from './itemspec';

const OWN = ['vorixsecurity.ir', 'www.vorixsecurity.ir', 'localhost'];
const MAX_PENDING = 300;

export function sourceHost(request: Request): string {
  const source = request.headers.get('origin') || request.headers.get('referer');
  let host = '';
  try {
    host = new URL(source || '').hostname.toLowerCase();
  } catch {
    return '';
  }
  const own = (request.headers.get('host') || '').split(':')[0].toLowerCase();
  const valid = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(host) && !/^\d+(\.\d+){3}$/.test(host);
  if (!valid || host.length > 100 || OWN.includes(host) || host === own || host.endsWith('.vorixsecurity.ir')) return '';
  return host;
}

export async function registerSignature(db: any, request: Request, title: string | null): Promise<void> {
  if (!db) return;
  const host = sourceHost(request);
  if (!host) return;
  try {
    const lim = await hitRateLimit(db, `sig:${clientIp(request)}`, 20, 3600);
    if (lim.limited) return;
    await ensureSchema(db);
    const t = clean(title, 80);
    const id = `sig_${host}`;
    const count = await db.prepare(`SELECT COUNT(*) AS c FROM vx_items WHERE kind = 'portfolio' AND status = 'pending'`).first();
    if (Number(count?.c) < MAX_PENDING) {
      const now = new Date().toISOString();
      const data = { title: host, category: 'طراحی سایت', description: '', points: [], url: `https://${host}/`, image: '', pageTitle: t, firstSeen: now };
      // هر دامنه فقط یک‌بار ثبت می‌شود (اگر قبلاً تأیید یا رد شده، دوباره اضافه نمی‌شود)
      await db
        .prepare(`INSERT OR IGNORE INTO vx_items (id, kind, status, sort, data, created_at, updated_at) VALUES (?1, 'portfolio', 'pending', 0, ?2, ?3, ?3)`)
        .bind(id, JSON.stringify(data), now)
        .run();
    }
    // اگر عنوان صفحه بعداً رسید و هنوز در انتظار تأیید است، ثبتش کن
    if (t) {
      await db
        .prepare(`UPDATE vx_items SET data = json_set(data, '$.pageTitle', ?1) WHERE id = ?2 AND status = 'pending' AND COALESCE(json_extract(data, '$.pageTitle'), '') = ''`)
        .bind(t, id)
        .run();
    }
  } catch (e) {
    console.error('signature register failed', e);
  }
}
