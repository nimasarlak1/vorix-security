import { ORDER_SERVICES } from '../data/site';
// مشخصات آیتم‌های قابل مدیریت از پنل (نمونه‌کار، محصول، خدمت، مجوز/همکاری).
// این فایل هم در سرور (اعتبارسنجی) و هم در پنل (ساخت فرم) استفاده می‌شود؛ پس هیچ وابستگی سروری ندارد.

export const PERMS = ['orders', 'portfolio', 'products', 'services', 'credentials', 'settings'] as const;
export type Perm = (typeof PERMS)[number];
export const PERM_LABELS: Record<Perm, string> = {
  orders: 'سفارش‌ها',
  portfolio: 'نمونه‌کارها',
  products: 'محصولات',
  services: 'خدمات',
  credentials: 'مجوزها و همکاری‌ها',
  settings: 'تنظیمات',
};

export type ItemKind = 'portfolio' | 'product' | 'service' | 'credential';
export type FieldType = 'text' | 'long' | 'url' | 'media' | 'list' | 'select';
export type Field = {
  key: string;
  label: string;
  type: FieldType;
  max: number;
  required?: boolean;
  hint?: string;
  options?: { v: string; l: string }[];
};
export type KindSpec = {
  label: string;
  perm: Perm;
  statuses: { v: string; l: string }[];
  fields: Field[];
};

export const KINDS: Record<ItemKind, KindSpec> = {
  portfolio: {
    label: 'نمونه‌کار',
    perm: 'portfolio',
    statuses: [
      { v: 'draft', l: 'پیش‌نویس' },
      { v: 'published', l: 'نمایش داده شود' },
      { v: 'pending', l: 'در انتظار تأیید' },
    ],
    fields: [
      { key: 'title', label: 'عنوان', type: 'text', max: 120, required: true },
      { key: 'category', label: 'دسته (مثلاً طراحی سایت)', type: 'text', max: 60 },
      { key: 'description', label: 'توضیح کوتاه', type: 'long', max: 600 },
      { key: 'points', label: 'ویژگی‌ها (هر خط یکی)', type: 'list', max: 80 },
      { key: 'url', label: 'آدرس سایت/پروژه (اختیاری)', type: 'url', max: 300 },
      { key: 'image', label: 'عکس', type: 'media', max: 100 },
    ],
  },
  product: {
    label: 'محصول',
    perm: 'products',
    statuses: [
      { v: 'draft', l: 'پیش‌نویس' },
      { v: 'published', l: 'نمایش داده شود' },
    ],
    fields: [
      { key: 'title', label: 'نام محصول', type: 'text', max: 120, required: true },
      { key: 'brand', label: 'برند', type: 'text', max: 60 },
      {
        key: 'category',
        label: 'دسته',
        type: 'select',
        max: 30,
        options: [
          { v: 'camera', l: 'دوربین' },
          { v: 'recorder', l: 'دستگاه ضبط' },
          { v: 'hdd', l: 'هارد' },
          { v: 'accessory', l: 'تجهیزات جانبی' },
        ],
      },
      { key: 'specs', label: 'مشخصات (هر خط یک مورد)', type: 'long', max: 1200 },
      { key: 'image', label: 'عکس', type: 'media', max: 100 },
      { key: 'price', label: 'قیمت (خالی = استعلام قیمت)', type: 'text', max: 40 },
      { key: 'installment', label: 'شرایط قسطی (اختیاری؛ خالی = در سایت نمایش داده نمی‌شود). فقط شرایطی بنویسید که واقعاً اجرا می‌کنید', type: 'long', max: 800 },
      {
        key: 'stock',
        label: 'موجودی',
        type: 'select',
        max: 10,
        options: [
          { v: 'in', l: 'موجود' },
          { v: 'out', l: 'ناموجود' },
        ],
      },
    ],
  },
  service: {
    label: 'خدمت',
    perm: 'services',
    statuses: [
      { v: 'draft', l: 'مخفی' },
      { v: 'published', l: 'نمایش داده شود' },
    ],
    fields: [
      { key: 'slug', label: 'نشانی صفحه (انگلیسی؛ برای ویرایش خدمت فعلی همان نشانی را بنویسید)', type: 'text', max: 40, required: true },
      { key: 'title', label: 'عنوان', type: 'text', max: 120, required: true },
      { key: 'text', label: 'توضیح کوتاه', type: 'long', max: 400 },
      { key: 'points', label: 'ویژگی‌ها (هر خط یکی)', type: 'list', max: 80 },
      { key: 'body', label: 'متن کامل صفحه‌ی خدمت', type: 'long', max: 4000 },
      { key: 'steps', label: 'روند کار (هر خط یک مرحله، حداکثر ۸)', type: 'list', max: 120 },
      { key: 'docs', label: 'مدارک موردنیاز (هر خط یکی، اختیاری)', type: 'list', max: 120 },
      { key: 'docsNote', label: 'توضیح زیر مدارک (اختیاری)', type: 'long', max: 400 },
      {
        key: 'icon',
        label: 'آیکون خدمت',
        type: 'select',
        max: 20,
        options: [
          { v: 'drive', l: 'هارد / ریکاوری' },
          { v: 'camera', l: 'دوربین' },
          { v: 'shield', l: 'امنیت' },
          { v: 'code', l: 'کد / سایت' },
          { v: 'ai', l: 'هوش مصنوعی' },
          { v: 'chat', l: 'مشاوره / گفتگو' },
        ],
      },
      {
        key: 'orderLabel',
        label: 'گزینه‌ی انتخاب‌شده در فرم سفارش این خدمت',
        type: 'select',
        max: 100,
        options: ORDER_SERVICES.map((s) => ({ v: s, l: s })),
      },
      { key: 'installment', label: 'شرایط قسطی (اختیاری؛ خالی = در سایت نمایش داده نمی‌شود). فقط شرایطی بنویسید که واقعاً اجرا می‌کنید', type: 'long', max: 800 },
      { key: 'seoTitle', label: 'عنوان سئو (اختیاری)', type: 'text', max: 70 },
      { key: 'seoDesc', label: 'توضیح سئو (اختیاری)', type: 'long', max: 170 },
    ],
  },
  credential: {
    label: 'مجوز / تأییدیه / همکاری',
    perm: 'credentials',
    statuses: [
      { v: 'draft', l: 'پیش‌نویس' },
      { v: 'published', l: 'تأییدشده (نمایش داده شود)' },
    ],
    fields: [
      { key: 'title', label: 'عنوان', type: 'text', max: 120, required: true },
      {
        key: 'group',
        label: 'نوع (خالی = مجوز)',
        type: 'select',
        max: 10,
        options: [
          { v: 'license', l: 'مجوز / تأییدیه' },
          { v: 'trust', l: 'نماد اعتماد' },
          { v: 'partner', l: 'همکاری / شریک' },
        ],
      },
      { key: 'issuer', label: 'صادرکننده', type: 'text', max: 120 },
      { key: 'number', label: 'شماره', type: 'text', max: 60 },
      { key: 'date', label: 'تاریخ', type: 'text', max: 30 },
      { key: 'link', label: 'لینک تأیید (اختیاری)', type: 'url', max: 300 },
      { key: 'image', label: 'تصویر مدرک', type: 'media', max: 100 },
    ],
  },
};

export const KIND_LIST = Object.keys(KINDS) as ItemKind[];
export const isKind = (k: unknown): k is ItemKind => typeof k === 'string' && k in KINDS;

const MEDIA_ID = /^[a-f0-9]{32}$/;
const LOCAL_PATH = /^\/[A-Za-z0-9_\-./]{1,100}$/;

export function clean(v: unknown, max: number): string {
  if (typeof v !== 'string') return '';
  return v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);
}

// داده‌ی ورودی را بر اساس مشخصات هر نوع پاک‌سازی می‌کند. فقط کلیدهای مجاز ذخیره می‌شوند.
export function sanitizeItem(kind: ItemKind, input: any): { data?: Record<string, any>; error?: string } {
  const spec = KINDS[kind];
  const out: Record<string, any> = {};
  for (const f of spec.fields) {
    const raw = input?.[f.key];
    let val: any = '';
    if (f.type === 'list') {
      const arr = Array.isArray(raw) ? raw : typeof raw === 'string' ? raw.split('\n') : [];
      val = arr.map((x) => clean(x, f.max)).filter(Boolean).slice(0, 8);
    } else if (f.type === 'url') {
      const u = clean(raw, f.max);
      if (u) {
        try {
          const p = new URL(u);
          if (p.protocol !== 'https:' && p.protocol !== 'http:') return { error: `«${f.label}» باید با https:// شروع شود.` };
          val = p.toString();
        } catch {
          return { error: `«${f.label}» معتبر نیست.` };
        }
      }
    } else if (f.type === 'media') {
      const m = clean(raw, f.max);
      if (m && !MEDIA_ID.test(m) && !LOCAL_PATH.test(m)) return { error: 'شناسه‌ی عکس نامعتبر است.' };
      val = m;
    } else if (f.type === 'select') {
      const s = clean(raw, f.max);
      if (s && !f.options?.some((o) => o.v === s)) return { error: `«${f.label}» نامعتبر است.` };
      val = s;
    } else if (f.type === 'long') {
      val = typeof raw === 'string' ? raw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, f.max) : '';
    } else {
      val = clean(raw, f.max);
    }
    if (f.required && (!val || (Array.isArray(val) && !val.length))) return { error: `«${f.label}» را وارد کنید.` };
    out[f.key] = val;
  }
  if (kind === 'service' && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(out.slug)) {
    return { error: 'نشانی صفحه فقط حروف انگلیسی کوچک، عدد و خط تیره (مثل hack-recovery).' };
  }
  return { data: out };
}

export function imgSrc(v: unknown): string {
  if (typeof v !== 'string' || !v) return '';
  return v.startsWith('/') ? v : `/api/media/${v}`;
}
