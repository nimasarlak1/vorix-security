import { getDBSafe, getEnv } from '../../../lib/db';
import { authenticate, newId, readJson } from '../../../lib/guard';
import { jsonNoStore } from '../../../lib/security';
import { ensureSchema } from '../../../lib/schema';
import { hitRateLimit } from '../../../lib/ratelimit';

export const runtime = 'edge';

const MAX_B64 = 460_000; // حدود ۳۴۰ کیلوبایت عکس؛ پنل قبل از ارسال عکس را کوچک و فشرده می‌کند
const SIGNATURES: Record<string, (b: Uint8Array) => boolean> = {
  'image/webp': (b) => b[0] === 0x52 && b[1] === 0x49 && b[8] === 0x57 && b[9] === 0x45,
  'image/jpeg': (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  'image/png': (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
};

// آپلود عکس از پنل: عکس داخل دیتابیس ذخیره می‌شود (بدون نیاز به R2) و از /api/media/<id> نمایش داده می‌شود
export async function POST(request: Request) {
  const db = getDBSafe();
  const env = getEnv();
  const a = await authenticate(request, db, env);
  if (a.res) return a.res;
  const canUpload = a.admin.role === 'owner' || a.admin.perms.some((p) => ['portfolio', 'products', 'services', 'credentials'].includes(p));
  if (!canUpload) return jsonNoStore({ success: false, error: 'به این بخش دسترسی ندارید.' }, 403);

  const limit = await hitRateLimit(db, `upload:${a.admin.id}`, 60, 3600);
  if (limit.limited) return jsonNoStore({ success: false, error: 'تعداد آپلود زیاد است. کمی بعد دوباره امتحان کنید.' }, 429);

  const body = await readJson(request, MAX_B64 + 200);
  const m = typeof body?.dataUrl === 'string' ? /^data:(image\/(?:webp|jpeg|png));base64,([A-Za-z0-9+/=]+)$/.exec(body.dataUrl) : null;
  if (!m) return jsonNoStore({ success: false, error: 'فایل عکس نامعتبر یا بیش از حد بزرگ است.' }, 400);
  const [, mime, b64] = m;

  let head: Uint8Array;
  try {
    head = Uint8Array.from(atob(b64.slice(0, 16)), (c) => c.charCodeAt(0));
  } catch {
    return jsonNoStore({ success: false, error: 'فایل عکس نامعتبر است.' }, 400);
  }
  if (!SIGNATURES[mime](head)) return jsonNoStore({ success: false, error: 'محتوای فایل با نوع عکس نمی‌خواند.' }, 400);

  await ensureSchema(db);
  const id = newId();
  await db.prepare('INSERT INTO vx_media (id, mime, data, created_at) VALUES (?1, ?2, ?3, ?4)').bind(id, mime, b64, new Date().toISOString()).run();
  return jsonNoStore({ success: true, id });
}
