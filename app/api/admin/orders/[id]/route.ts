import { NextResponse } from 'next/server';
import { getDBSafe, getEnv, NO_DB_MESSAGE } from '../../../../lib/db';
import { isAuthorizedRequest } from '../../../../lib/session';

export const runtime = 'edge';

const ALLOWED_STATUSES = ['جدید', 'در حال بررسی', 'انجام شد', 'لغو شد'];

// در Next.js 15 و 16، params یک Promise است و باید await شود (در نسخه‌ی ۱۴ آبجکت ساده بود؛ await روی آن هم مشکلی ندارد)
type Ctx = { params: Promise<{ id: string }> | { id: string } };

export async function PATCH(request: Request, context: Ctx) {
  const env = getEnv();
  if (!(await isAuthorizedRequest(request, env.SESSION_SECRET || ''))) {
    return NextResponse.json({ success: false, error: 'لطفاً وارد شوید.' }, { status: 401 });
  }

  const { id } = await context.params;
  if (typeof id !== 'string' || !id || id.length > 64) {
    return NextResponse.json({ success: false, error: 'شناسه‌ی سفارش نامعتبر است.' }, { status: 400 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'درخواست نامعتبر است.' }, { status: 400 });
  }

  const status = typeof body?.status === 'string' ? body.status : '';
  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json({ success: false, error: 'وضعیت نامعتبر است.' }, { status: 400 });
  }

  const db = getDBSafe();
  if (!db) return NextResponse.json({ success: false, error: NO_DB_MESSAGE }, { status: 503 });

  try {
    const result = await db.prepare('UPDATE orders SET status = ? WHERE id = ?').bind(status, id).run();
    if (result?.meta?.changes === 0) {
      return NextResponse.json({ success: false, error: 'سفارش پیدا نشد.' }, { status: 404 });
    }
  } catch (e) {
    console.error('order status update failed', e);
    return NextResponse.json({ success: false, error: 'ذخیره‌ی وضعیت انجام نشد.' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
