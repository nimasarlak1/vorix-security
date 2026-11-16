import { getDBSafe } from '../../../lib/db';
import { clientIp } from '../../../lib/security';
import { hitRateLimit } from '../../../lib/ratelimit';
import { ensureSchema } from '../../../lib/schema';
import { clean } from '../../../lib/itemspec';

export const runtime = 'edge';

const OWN = ['vorixsecurity.ir', 'www.vorixsecurity.ir', 'localhost'];
const MAX_PENDING = 300;

function noContent() {
  return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store', 'Cross-Origin-Resource-Policy': 'cross-origin' } });
}

// ثبت سایتی که کد امضا را گذاشته، با وضعیت «در انتظار تأیید». دامنه فقط از Origin/Referer مرورگر خوانده می‌شود، نه از پارامتر.
export async function GET(request: Request) {
  const db = getDBSafe();
  if (!db) return noContent();

  const source = request.headers.get('origin') || request.headers.get('referer');
  let host = '';
  try {
    host = new URL(source || '').hostname.toLowerCase();
  } catch {
    return noContent();
  }
  const own = (request.headers.get('host') || '').split(':')[0].toLowerCase();
  const valid = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(host) && !/^\d+(\.\d+){3}$/.test(host);
  if (!valid || host.length > 100 || OWN.includes(host) || host === own || host.endsWith('.vorixsecurity.ir')) return noContent();

  try {
    const lim = await hitRateLimit(db, `sig:${clientIp(request)}`, 20, 3600);
    if (lim.limited) return noContent();
    await ensureSchema(db);
    const count = await db.prepare(`SELECT COUNT(*) AS c FROM vx_items WHERE kind = 'portfolio' AND status = 'pending'`).first();
    if (Number(count?.c) >= MAX_PENDING) return noContent();

    const now = new Date().toISOString();
    const data = {
      title: host,
      category: 'طراحی سایت',
      description: '',
      points: [],
      url: `https://${host}/`,
      image: '',
      pageTitle: clean(new URL(request.url).searchParams.get('t'), 80),
      firstSeen: now,
    };
    // هر دامنه فقط یک‌بار ثبت می‌شود (اگر قبلاً تأیید یا رد شده، دوباره اضافه نمی‌شود)
    await db
      .prepare(`INSERT OR IGNORE INTO vx_items (id, kind, status, sort, data, created_at, updated_at) VALUES (?1, 'portfolio', 'pending', 0, ?2, ?3, ?3)`)
      .bind(`sig_${host}`, JSON.stringify(data), now)
      .run();
  } catch (e) {
    console.error('sig ping failed', e);
  }
  return noContent();
}
