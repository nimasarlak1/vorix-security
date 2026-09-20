import { getRequestContext } from '@cloudflare/next-on-pages';

export function getDB(): any {
  const { env } = getRequestContext();
  const db = (env as any).DB;
  if (!db) {
    throw new Error('D1 binding به اسم DB پیدا نشد. در تنظیمات Cloudflare Pages > Settings > Functions بررسی کنید.');
  }
  return db;
}

export function getEnv(): Record<string, string> {
  const { env } = getRequestContext();
  return env as unknown as Record<string, string>;
}
