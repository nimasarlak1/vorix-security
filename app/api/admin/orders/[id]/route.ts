import { NextResponse } from 'next/server';
import { getDB, getEnv } from '../../../../lib/db';
import { isAuthorizedRequest } from '../../../../lib/session';

export const runtime = 'edge';

const ALLOWED_STATUSES = ['جدید', 'در حال بررسی', 'انجام شد', 'لغو شد'];

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const env = getEnv();
  if (!(await isAuthorizedRequest(request, env.SESSION_SECRET || ''))) {
    return NextResponse.json({ success: false, error: 'لطفاً وارد شوید.' }, { status: 401 });
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

  const db = getDB();
  await db.prepare('UPDATE orders SET status = ? WHERE id = ?').bind(status, params.id).run();
  return NextResponse.json({ success: true });
}
