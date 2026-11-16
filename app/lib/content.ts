// خواندن محتوای عمومی سایت از دیتابیس (فقط موارد «نمایش داده شود»). اگر دیتابیس در دسترس نبود، همه‌چیز خالی برمی‌گردد.
import { ensureSchema } from './schema';
import type { ItemKind } from './itemspec';
import { ORDERS_TABLE } from './db';

export type PublicItem = { id: string; status: string; sort: number; [k: string]: any };
export type SiteContent = {
  completedJobs: number; // ۰ یعنی نمایش داده نشود
  portfolio: PublicItem[];
  product: PublicItem[];
  service: PublicItem[];
  credential: PublicItem[];
};

export const EMPTY_CONTENT: SiteContent = { completedJobs: 0, portfolio: [], product: [], service: [], credential: [] };

export async function getSetting(db: any, key: string): Promise<string | null> {
  const row = await db.prepare('SELECT value FROM vx_settings WHERE key = ?1').bind(key).first();
  return row ? String(row.value) : null;
}

// عدد «کارهای انجام‌شده» = عدد پایه‌ای که مدیر در پنل وارد کرده (کارهای حضوری و قبلی) + سفارش‌های ثبت‌شده در پنل با وضعیت «انجام شد».
// ۰ یعنی نمایش داده نشود.
export async function getJobsCount(db: any): Promise<{ base: number; done: number; total: number }> {
  const base = Number(await getSetting(db, 'completed_jobs'));
  const row = await db.prepare(`SELECT COUNT(*) AS c FROM ${ORDERS_TABLE} WHERE status = ?1`).bind('انجام شد').first();
  const b = Number.isFinite(base) && base > 0 ? Math.floor(base) : 0;
  const d = Number(row?.c) || 0;
  return { base: b, done: d, total: b + d };
}

export async function loadContent(db: any): Promise<SiteContent> {
  if (!db) return EMPTY_CONTENT;
  try {
    await ensureSchema(db);
    const { results } = await db
      .prepare(`SELECT id, kind, status, sort, data FROM vx_items WHERE status = 'published' ORDER BY sort ASC, created_at DESC LIMIT 300`)
      .all();
    const out: SiteContent = { ...EMPTY_CONTENT, portfolio: [], product: [], service: [], credential: [] };
    for (const r of results || []) {
      const k = r.kind as ItemKind;
      if (!out[k]) continue;
      try {
        out[k].push({ id: r.id, status: r.status, sort: r.sort, ...JSON.parse(r.data) });
      } catch {}
    }
    out.completedJobs = (await getJobsCount(db)).total;
    return out;
  } catch (e) {
    console.error('loadContent failed', e);
    return EMPTY_CONTENT;
  }
}
