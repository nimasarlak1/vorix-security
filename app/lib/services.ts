// ترکیب خدمات ثابت (کد) با تغییرات مدیر از پنل. نشانی (slug) یکسان = بازنویسی خدمت فعلی؛ نشانی جدید = خدمت اضافه.
// خدمت ثابتی که مدیر در پنل «مخفی» کند، نمایش داده نمی‌شود.
import { SERVICES, type Service } from '../data/services';
import { ensureSchema } from './schema';

export async function getServices(db: any): Promise<Service[]> {
  if (!db) return SERVICES;
  try {
    await ensureSchema(db);
    const { results } = await db.prepare(`SELECT status, sort, data FROM vx_items WHERE kind = 'service' ORDER BY sort ASC, created_at ASC LIMIT 100`).all();
    const base = new Map(SERVICES.map((s) => [s.slug, s]));
    const hidden = new Set<string>();
    const extra: Service[] = [];
    const order = new Map<string, number>(SERVICES.map((s, i) => [s.slug, i]));
    let extraPos = 1000;
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
        icon: (d.icon as Service['icon']) || cur?.icon || 'code',
        title: d.title || cur?.title || d.slug,
        text: d.text || cur?.text || '',
        points: d.points?.length ? d.points : cur?.points || [],
        orderLabel: d.orderLabel || cur?.orderLabel || 'سایر خدمات',
        seoTitle: d.seoTitle || cur?.seoTitle || d.title,
        seoDesc: d.seoDesc || cur?.seoDesc || d.text || '',
        body: paras.length ? paras : cur?.body || (d.text ? [d.text] : []),
        steps: d.steps?.length ? d.steps : cur?.steps,
        docs: d.docs?.length ? d.docs : cur?.docs,
        docsNote: d.docsNote || cur?.docsNote,
        installment: typeof d.installment === 'string' && d.installment.trim() ? d.installment : cur?.installment,
      };
      // ترتیب: عدد «ترتیب» پنل (بزرگ‌تر از صفر)؛ وگرنه جای فعلی خدمت؛ خدمت جدید بدون ترتیب = آخر فهرست
      const sortNum = Number(r.sort) > 0 ? Number(r.sort) : cur ? (order.get(d.slug) as number) : extraPos++;
      order.set(d.slug, sortNum);
      if (cur) base.set(d.slug, merged);
      else extra.push(merged);
    }
    return [...[...base.values()].filter((s) => !hidden.has(s.slug)), ...extra].sort((a, b) => (order.get(a.slug) ?? 999) - (order.get(b.slug) ?? 999));
  } catch (e) {
    console.error('getServices failed', e);
    return SERVICES;
  }
}
