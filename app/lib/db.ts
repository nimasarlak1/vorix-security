import { getRequestContext } from '@cloudflare/next-on-pages';

// نسخه‌ی معمولی: اگر دیتابیس وصل نباشد خطا می‌دهد
export function getDB(): any {
  const { env } = getRequestContext();
  const db = (env as any).DB;
  if (!db) {
    throw new Error('D1 binding به اسم DB پیدا نشد. در تنظیمات Cloudflare Pages بررسی کنید.');
  }
  return db;
}

// نسخه‌ی امن: اگر دیتابیس وصل نبود null برمی‌گرداند تا API بتواند پیام واضح بدهد
export function getDBSafe(): any | null {
  try {
    return getDB();
  } catch {
    return null;
  }
}

export function getEnv(): Record<string, string> {
  const { env } = getRequestContext();
  return env as unknown as Record<string, string>;
}

export const NO_DB_MESSAGE =
  'دیتابیس D1 هنوز به پروژه وصل نشده است. در Cloudflare یک Binding با نام DB بسازید و دوباره Deploy کنید.';

// اسم جدول سفارش‌ها. عمداً «orders» نیست تا با جدول قدیمیِ احتمالیِ داخل دیتابیس تداخل نکند.
export const ORDERS_TABLE = 'vx_orders';
