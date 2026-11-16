import { getDBSafe } from '../../../lib/db';
import { registerSignature } from '../../../lib/sig';

export const runtime = 'edge';

// درخواست عکس-بیکن اسکریپت امضا؛ فقط عنوان صفحه را کامل می‌کند (ثبت اصلی در /api/sig/js انجام می‌شود)
export async function GET(request: Request) {
  const db = getDBSafe();
  await registerSignature(db, request, new URL(request.url).searchParams.get('t'));
  return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store', 'Cross-Origin-Resource-Policy': 'cross-origin' } });
}
