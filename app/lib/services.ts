// ترکیب خدمات ثابت (کد) با تغییرات مدیر از پنل. نشانی (slug) یکسان = بازنویسی خدمت فعلی؛ نشانی جدید = خدمت اضافه.
// خدمت ثابتی که مدیر در پنل «مخفی» کند، نمایش داده نمی‌شود.
import { SERVICES, type Service } from '../data/services';
import { ensureSchema } from './schema';

export async function getServices(db: any): Promise<Service[]> {
  if (!db) return SERVICES;
  try {
    await ensureSchema(db);
    const { results } = await db.prepare(`SELECT status, data FROM vx_items WHERE kind = 'service' ORDER BY sort ASC, created_at ASC LIMIT 100`).all();
    const base = new Map(SERVICES.map((s) => [s.slug, s]));
    const hidden = new Set<string>();
    const extra: Service[] = [];
    for (const r of results || []) {
      let d: any;
      try {
        d = JSON.parse(r.data);
      } catch {
        continue;
      }
      if (!d?.slug) continue;
      if (r.status !== 'published') {
        if (base.has(d.slug)) hidden.add(d.slug);
        continue;
      }
      const paras = String(d.body || '').split(/\n{2,}|\n/).map((x: string) => x.trim()).filter(Boolean);
      const cur = base.get(d.slug);
      const merged: Service = {
        id: cur?.id || `x-${d.slug}`,
        slug: d.slug,
        icon: cur?.icon || 'code',
        title: d.title || cur?.title || d.slug,
        text: d.text || cur?.text || '',
        points: d.points?.length ? d.points : cur?.points || [],
        orderLabel: cur?.orderLabel || 'سایر خدمات',
        seoTitle: d.seoTitle || cur?.seoTitle || d.title,
        seoDesc: d.seoDesc || cur?.seoDesc || d.text || '',
        body: paras.length ? paras : cur?.body || (d.text ? [d.text] : []),
        steps: cur?.steps,
        docs: cur?.docs,
        docsNote: cur?.docsNote,
        installment: typeof d.installment === 'string' && d.installment.trim() ? d.installment : cur?.installment,
      };
      if (cur) base.set(d.slug, merged);
      else extra.push(merged);
    }
    return [...[...base.values()].filter((s) => !hidden.has(s.slug)), ...extra];
  } catch (e) {
    console.error('getServices failed', e);
    return SERVICES;
  }
}
