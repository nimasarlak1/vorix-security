import { getDBSafe } from '../../../lib/db';
import { clientIp, isAllowedOrigin, jsonNoStore } from '../../../lib/security';
import { hitRateLimit } from '../../../lib/ratelimit';
import { ensureSchema } from '../../../lib/schema';
import { cleanText } from '../../../lib/validate';
import { COUPON_NOTE, findValidCoupon, normCode } from '../../../lib/coupons';

export const runtime = 'edge';

// بررسی کد تخفیف در فرم سفارش (برای جلوگیری از حدس زدن کد، محدودیت تعداد دارد)
export async function POST(request: Request) {
  const db = getDBSafe();
  if (!isAllowedOrigin(request)) return jsonNoStore({ success: false, error: 'درخواست نامعتبر است.' }, 403);
  if (!db) return jsonNoStore({ success: false, error: 'بررسی کد فعلاً ممکن نیست.' }, 503);

  const limit = await hitRateLimit(db, `coupon:${clientIp(request)}`, 15, 10 * 60);
  if (limit.limited) return jsonNoStore({ success: false, error: 'تعداد تلاش‌ها زیاد است. کمی بعد دوباره امتحان کنید.' }, 429);

  let body: any;
  try {
    const raw = await request.text();
    if (raw.length > 2000) return jsonNoStore({ success: false, error: 'درخواست نامعتبر است.' }, 400);
    body = JSON.parse(raw);
  } catch {
    return jsonNoStore({ success: false, error: 'درخواست نامعتبر است.' }, 400);
  }
  const code = normCode(body?.code);
  if (!code) return jsonNoStore({ success: false, error: 'کد تخفیف معتبر نیست.' }, 400);
  const service = cleanText(body?.service, 100) || 'عمومی';

  try {
    await ensureSchema(db);
    const r = await findValidCoupon(db, code, service);
    if (!r.ok) return jsonNoStore({ success: false, error: r.error }, 400);
    return jsonNoStore({ success: true, label: r.label, note: COUPON_NOTE });
  } catch (e) {
    console.error('coupon check failed', e);
    return jsonNoStore({ success: false, error: 'بررسی کد انجام نشد.' }, 500);
  }
}
