import { getDBSafe, getEnv } from '../../../lib/db';
import { authenticate, newId } from '../../../lib/guard';
import { jsonNoStore } from '../../../lib/security';
import { sanitizeItem } from '../../../lib/itemspec';
import { ensureSchema } from '../../../lib/schema';
import { SERVICES } from '../../../data/services';

export const runtime = 'edge';

// خدمات ثابت سایت را (همان متن فعلی) در پنل وارد می‌کند تا قابل ویرایش شوند. اگر خدمتی قبلاً در پنل باشد دست نمی‌خورد.
export async function POST(request: Request) {
  const db = getDBSafe();
  const env = getEnv();
  const a = await authenticate(request, db, env, 'services');
  if (a.res) return a.res;
  await ensureSchema(db);

  const { results } = await db.prepare(`SELECT id, data FROM vx_items WHERE kind = 'service'`).all();
  const have = new Map<string, { id: string; d: any }>();
  for (const row of results || []) {
    try {
      const d = JSON.parse(row.data);
      if (d?.slug) have.set(d.slug, { id: row.id, d });
    } catch {}
  }
  const now = new Date().toISOString();
  let added = 0;

  for (let i = 0; i < SERVICES.length; i++) {
    const s = SERVICES[i];
    const extraFields = { steps: s.steps || [], docs: s.docs || [], docsNote: s.docsNote || '', icon: s.icon, orderLabel: s.orderLabel };
    const existing = have.get(s.slug);
    if (existing) {
      // خدمتی که قبلاً وارد شده ولی فیلدهای جدید را ندارد: فقط همین فیلدها از متن فعلی پر می‌شود، بقیه دست نمی‌خورد
      if (existing.d.icon === undefined) {
        const { data: merged } = sanitizeItem('service', { ...existing.d, ...extraFields });
        if (merged) {
          await db.prepare('UPDATE vx_items SET data = ?1, updated_at = ?2 WHERE id = ?3').bind(JSON.stringify(merged), now, existing.id).run();
          added++;
        }
      }
      continue;
    }
    const { data } = sanitizeItem('service', {
      slug: s.slug,
      title: s.title,
      text: s.text,
      points: s.points,
      body: s.body.join('\n\n'),
      seoTitle: s.seoTitle,
      seoDesc: s.seoDesc,
      installment: '',
      ...extraFields,
    });
    if (!data) continue;
    await db
      .prepare('INSERT INTO vx_items (id, kind, status, sort, data, created_at, updated_at) VALUES (?1, \'service\', \'published\', ?2, ?3, ?4, ?4)')
      .bind(newId(), i, JSON.stringify(data), now)
      .run();
    added++;
  }
  return jsonNoStore({ success: true, added });
}
