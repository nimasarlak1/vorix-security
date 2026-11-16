// کد تخفیف: ساخت و بررسی. سایت قیمت ثابت ندارد؛ پس تخفیف فقط روی سفارش ثبت می‌شود و مبلغ نهایی را دفتر اعلام می‌کند.
import { cleanText, normalizeDigits } from './validate';

export type CouponKind = 'percent' | 'fixed' | 'free';
export type Coupon = {
  id: string;
  code: string;
  title: string;
  kind: CouponKind;
  value: number;
  services: string[]; // خالی = همه‌ی خدمات
  starts_at: string | null;
  expires_at: string | null;
  max_uses: number; // ۰ = نامحدود
  per_phone: number; // ۰ = نامحدود
  used: number;
  active: boolean;
};

export const COUPON_NOTE = 'مبلغ نهایی بعد از بررسی توسط دفتر و با اعمال تخفیف اعلام می‌شود.';

export function normCode(v: unknown): string {
  if (typeof v !== 'string') return '';
  const s = normalizeDigits(v).trim().toUpperCase().replace(/\s+/g, '');
  return /^[A-Z0-9_-]{3,20}$/.test(s) ? s : '';
}

export function couponLabel(c: Pick<Coupon, 'kind' | 'value' | 'title'>): string {
  if (c.kind === 'percent') return `${c.value.toLocaleString('fa-IR')}٪ تخفیف` + (c.title ? ` — ${c.title}` : '');
  if (c.kind === 'fixed') return `${c.value.toLocaleString('fa-IR')} تومان تخفیف` + (c.title ? ` — ${c.title}` : '');
  return c.title || 'مزیت ویژه';
}

export function rowToCoupon(r: any): Coupon {
  let services: string[] = [];
  try {
    const a = JSON.parse(r.services || '[]');
    if (Array.isArray(a)) services = a.filter((x) => typeof x === 'string');
  } catch {}
  return {
    id: r.id,
    code: r.code,
    title: r.title || '',
    kind: r.kind,
    value: Number(r.value) || 0,
    services,
    starts_at: r.starts_at || null,
    expires_at: r.expires_at || null,
    max_uses: Number(r.max_uses) || 0,
    per_phone: Number(r.per_phone) || 0,
    used: Number(r.used) || 0,
    active: Number(r.active) === 1,
  };
}

export type CouponCheck = { ok: true; coupon: Coupon; label: string } | { ok: false; error: string };

// phone اختیاری است: در مرحله‌ی «اعمال کد» شماره‌ای نیست و سقف هر شماره در لحظه‌ی ثبت سفارش دوباره بررسی می‌شود.
export async function findValidCoupon(db: any, code: string, service: string, phone?: string): Promise<CouponCheck> {
  const row = await db.prepare('SELECT * FROM vx_coupons WHERE code = ?1').bind(code).first();
  if (!row) return { ok: false, error: 'کد تخفیف معتبر نیست.' };
  const c = rowToCoupon(row);
  if (!c.active) return { ok: false, error: 'کد تخفیف معتبر نیست.' };
  const now = Date.now();
  if (c.starts_at && now < Date.parse(c.starts_at)) return { ok: false, error: 'این کد هنوز فعال نشده است.' };
  if (c.expires_at && now > Date.parse(c.expires_at)) return { ok: false, error: 'مهلت این کد تمام شده است.' };
  if (c.max_uses > 0 && c.used >= c.max_uses) return { ok: false, error: 'ظرفیت این کد تمام شده است.' };
  if (c.services.length && !c.services.includes(service)) return { ok: false, error: 'این کد برای خدمت انتخاب‌شده قابل استفاده نیست.' };
  if (phone && c.per_phone > 0) {
    const n = await db.prepare('SELECT COUNT(*) AS c FROM vx_order_coupons WHERE code = ?1 AND phone = ?2').bind(code, phone).first();
    if (Number(n?.c) >= c.per_phone) return { ok: false, error: 'شما قبلاً از این کد استفاده کرده‌اید.' };
  }
  return { ok: true, coupon: c, label: couponLabel(c) };
}

// تاریخ «YYYY-MM-DD» از پنل → زمان ایران؛ شروع = ابتدای روز، پایان = انتهای روز
export function dateToIso(v: unknown, end: boolean): string | null | undefined {
  if (v === '' || v === null || v === undefined) return null;
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return undefined; // undefined = نامعتبر
  const iso = `${v}T${end ? '23:59:59' : '00:00:00'}+03:30`;
  return Number.isNaN(Date.parse(iso)) ? undefined : iso;
}
export function isoToDate(v: string | null): string {
  if (!v) return '';
  return v.slice(0, 10);
}

// اعتبارسنجی مشترک ساخت و ویرایش؛ خروجی: فیلدهای تمیز یا خطا
export function parseCouponBody(body: any, services: readonly string[]): { error: string } | { data: any } {
  const kind = body?.kind;
  if (kind !== 'percent' && kind !== 'fixed' && kind !== 'free') return { error: 'نوع تخفیف نامعتبر است.' };
  const title = cleanText(body?.title, 80);
  let value = 0;
  if (kind === 'percent') {
    value = Number(body?.value);
    if (!Number.isInteger(value) || value < 1 || value > 100) return { error: 'درصد باید عددی بین ۱ تا ۱۰۰ باشد.' };
  } else if (kind === 'fixed') {
    value = Number(body?.value);
    if (!Number.isInteger(value) || value < 1 || value > 1000000000) return { error: 'مبلغ تخفیف (تومان) نامعتبر است.' };
  } else if (title.length < 2) {
    return { error: 'برای مزیت رایگان، عنوان را بنویسید (مثلاً: بررسی اولیه رایگان).' };
  }
  const maxUses = Number(body?.max_uses ?? 0);
  const perPhone = Number(body?.per_phone ?? 0);
  if (!Number.isInteger(maxUses) || maxUses < 0 || maxUses > 1000000) return { error: 'تعداد کل استفاده نامعتبر است.' };
  if (!Number.isInteger(perPhone) || perPhone < 0 || perPhone > 1000) return { error: 'تعداد استفاده‌ی هر شماره نامعتبر است.' };
  const starts = dateToIso(body?.starts_at, false);
  const expires = dateToIso(body?.expires_at, true);
  if (starts === undefined || expires === undefined) return { error: 'تاریخ نامعتبر است.' };
  if (starts && expires && Date.parse(expires) < Date.parse(starts)) return { error: 'تاریخ پایان قبل از شروع است.' };
  const svc = Array.isArray(body?.services) ? body.services.filter((s: unknown) => typeof s === 'string' && services.includes(s)) : [];
  return { data: { kind, title, value, max_uses: maxUses, per_phone: perPhone, starts_at: starts, expires_at: expires, services: svc } };
}

