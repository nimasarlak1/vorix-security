import { getDBSafe, getEnv, NO_DB_MESSAGE, ORDERS_TABLE } from '../../../../lib/db';
import { isAuthorizedRequest } from '../../../../lib/session';
import { isAllowedOrigin, jsonNoStore } from '../../../../lib/security';

export const runtime = 'edge';

const ALLOWED_STATUSES = ['جدید', 'در حال بررسی', 'انجام شد', 'لغو شد'];

// در Next.js 15 و 16، params یک Promise است و باید await شود (در نسخه‌ی ۱۴ آبجکت ساده بود؛ await روی آن هم مشکلی ندارد)
type Ctx = { params: Promise<{ id: string }> | { id: string } };

export async function PATCH(request: Request, context: Ctx) {
  // کانتکست Cloudflare (دیتابیس) قبل از هر await گرفته می‌شود
  const db = getDBSafe();
  const env = getEnv();

  if (!isAllowedOrigin(request)) {
    return jsonNoStore({ success: false, error: 'درخواست نامعتبر است.' }, 403);
  }
  if (!(await isAuthorizedRequest(request, env.SESSION_SECRET || ''))) {
    return jsonNoStore({ success: false, error: 'لطفاً وارد شوید.' }, 401);
  }

  const { id } = await context.params;
  if (typeof id !== 'string' || !id || id.length > 64) {
    return jsonNoStore({ success: false, error: 'شناسه‌ی سفارش نامعتبر است.' }, 400);
  }

  let body: any;
  try {
    const raw = await request.text();
    if (raw.length > 2000) return jsonNoStore({ success: false, error: 'درخواست نامعتبر است.' }, 413);
    body = JSON.parse(raw);
  } catch {
    return jsonNoStore({ success: false, error: 'درخواست نامعتبر است.' }, 400);
  }

  const status = typeof body?.status === 'string' ? body.status : '';
  if (!ALLOWED_STATUSES.includes(status)) {
    return jsonNoStore({ success: false, error: 'وضعیت نامعتبر است.' }, 400);
  }

  if (!db) return jsonNoStore({ success: false, error: NO_DB_MESSAGE }, 503);

  try {
    const result = await db.prepare(`UPDATE ${ORDERS_TABLE} SET status = ? WHERE id = ?`).bind(status, id).run();
    if (result?.meta?.changes === 0) {
      return jsonNoStore({ success: false, error: 'سفارش پیدا نشد.' }, 404);
    }
  } catch (e) {
    console.error('order status update failed', e);
    const detail = String((e as any)?.message || e).slice(0, 300);
    return jsonNoStore({ success: false, error: 'ذخیره‌ی وضعیت انجام نشد.', detail }, 500);
  }
  return jsonNoStore({ success: true });
}
