// ابزارهای امنیتی مشترک بین APIها: بررسی مبدأ درخواست، تشخیص IP و پاسخ بدون کش.
import { NextResponse } from 'next/server';

// دامنه‌های مجاز برای ارسال فرم‌ها و درخواست‌های ادمین.
// هر آدرسی هم که خودِ همین سایت روی آن اجرا می‌شود (مثلاً لینک پیش‌نمایش شاخه‌ی dev) خودکار مجاز است.
const ALLOWED_HOSTS = ['vorixsecurity.ir', 'www.vorixsecurity.ir', 'localhost'];

function hostAllowed(host: string, requestHost: string): boolean {
  if (!host) return false;
  if (ALLOWED_HOSTS.includes(host)) return true;
  if (host.endsWith('.vorixsecurity.ir')) return true;
  const own = requestHost.split(':')[0].toLowerCase();
  return own !== '' && host === own;
}

// درخواست‌های مرورگر (فرم و پنل) همیشه Origin یا Referer دارند. درخواست بدون هر دو (مثل ربات‌ها) رد می‌شود.
export function isAllowedOrigin(request: Request): boolean {
  const source = request.headers.get('origin') || request.headers.get('referer');
  if (!source) return false;
  try {
    const host = new URL(source).hostname.toLowerCase();
    return hostAllowed(host, request.headers.get('host') || '');
  } catch {
    return false;
  }
}

export function clientIp(request: Request): string {
  const h = request.headers;
  return (
    h.get('cf-connecting-ip') ||
    h.get('x-nf-client-connection-ip') ||
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

// نشان می‌دهد درخواست روی کدام پلتفرم اجرا شده؛ برای پیدا کردن مشکل «کانتکست Cloudflare».
export function describePlatform(request: Request): string {
  const h = request.headers;
  let platform = 'نامشخص';
  if (h.get('cf-ray')) platform = 'Cloudflare';
  else if (h.get('x-nf-request-id')) platform = 'Netlify';
  else if (h.get('x-vercel-id')) platform = 'Vercel';
  const host = (h.get('host') || '?').slice(0, 80);
  const device = /Mobi|Android|iPhone|iPad/i.test(h.get('user-agent') || '') ? 'موبایل' : 'دسکتاپ';
  return `${platform} | ${host} | ${device}`;
}

export const NO_STORE = { 'Cache-Control': 'no-store' } as const;

export function jsonNoStore(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
