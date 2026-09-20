import { getRequestContext } from '@cloudflare/next-on-pages';

// اتصال به دیتابیس D1.
// اگر Binding با نام DB نبود، هر Binding دیگری که شبیه دیتابیس D1 باشد (تابع prepare داشته باشد) پیدا و استفاده می‌شود.
// اگر هیچ‌کدام نبود، دلیل دقیق برگردانده می‌شود تا عیب‌یابی ساده باشد.

export type DBInfo = { db: any | null; reason: string };

export function getDBInfo(): DBInfo {
  let env: Record<string, any>;
  try {
    env = (getRequestContext() as any).env || {};
  } catch (e) {
    return {
      db: null,
      reason: `کانتکست Cloudflare در دسترس نیست (${String((e as any)?.message || e).slice(0, 120)})`,
    };
  }

  if (env.DB && typeof env.DB.prepare === 'function') {
    return { db: env.DB, reason: '' };
  }

  // Binding با اسم دیگر (مثلاً vorix_db یا D1)
  for (const key of Object.keys(env)) {
    const v = env[key];
    if (v && typeof v === 'object' && typeof v.prepare === 'function') {
      return { db: v, reason: `از Binding «${key}» استفاده شد` };
    }
  }

  const seen = Object.keys(env).filter((k) => {
    const t = typeof env[k];
    return t === 'object' || t === 'function';
  });
  return {
    db: null,
    reason: `هیچ Binding دیتابیسی در این Deploy نیست. Bindingهای دیده‌شده: ${seen.length ? seen.join('، ') : 'هیچ'}`,
  };
}

// نسخه‌ی معمولی: اگر دیتابیس وصل نباشد خطا می‌دهد
export function getDB(): any {
  const { db } = getDBInfo();
  if (!db) {
    throw new Error('D1 binding به اسم DB پیدا نشد. در تنظیمات Cloudflare Pages بررسی کنید.');
  }
  return db;
}

// نسخه‌ی امن: اگر دیتابیس وصل نبود null برمی‌گرداند تا API بتواند پیام واضح بدهد
export function getDBSafe(): any | null {
  return getDBInfo().db;
}

export function getEnv(): Record<string, string> {
  const { env } = getRequestContext();
  return env as unknown as Record<string, string>;
}

export const NO_DB_MESSAGE =
  'دیتابیس D1 هنوز به پروژه وصل نشده است. در Cloudflare یک Binding با نام DB بسازید و دوباره Deploy کنید.';

// اسم جدول سفارش‌ها. عمداً «orders» نیست تا با جدول قدیمیِ احتمالیِ داخل دیتابیس تداخل نکند.
export const ORDERS_TABLE = 'vx_orders';
