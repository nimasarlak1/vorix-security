import { getDBSafe } from '../../../lib/db';
import { ensureSchema } from '../../../lib/schema';

export const runtime = 'edge';
type Ctx = { params: Promise<{ id: string }> | { id: string } };

// نمایش عمومی عکس‌هایی که از پنل آپلود شده‌اند (شناسه‌ی تصادفی ۳۲ کاراکتری، کش یک‌ساله)
export async function GET(_request: Request, context: Ctx) {
  const db = getDBSafe();
  const { id } = await context.params;
  if (typeof id !== 'string' || !/^[a-f0-9]{32}$/.test(id) || !db) return new Response('Not found', { status: 404 });
  try {
    await ensureSchema(db);
    const row = await db.prepare('SELECT mime, data FROM vx_media WHERE id = ?1').bind(id).first();
    if (!row) return new Response('Not found', { status: 404 });
    const bin = atob(row.data);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new Response(bytes, {
      headers: {
        'Content-Type': row.mime,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; sandbox",
      },
    });
  } catch (e) {
    console.error('media read failed', e);
    return new Response('Error', { status: 500 });
  }
}
