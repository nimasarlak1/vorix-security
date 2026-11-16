import { getDBSafe, getEnv } from '../../../lib/db';
import { authenticate } from '../../../lib/guard';
import { jsonNoStore } from '../../../lib/security';

export const runtime = 'edge';

const DEFAULT_MODEL = '@cf/meta/llama-3.1-8b-instruct';

// فقط برای ادمین دارای دسترسی تنظیمات: یک پیام آزمایشی به مدل می‌فرستد و خطای دقیق را (اگر بود) نشان می‌دهد
export async function POST(request: Request) {
  const db = getDBSafe();
  const env = getEnv() as Record<string, any>;
  const a = await authenticate(request, db, env, 'settings');
  if (a.res) return a.res;

  const ai = env.AI;
  const model = env.AI_MODEL || DEFAULT_MODEL;
  if (!ai || typeof ai.run !== 'function') {
    return jsonNoStore({ success: false, error: 'Binding با نام AI در این Deploy وجود ندارد.', model });
  }
  try {
    const out: any = await Promise.race([
      ai.run(model, { messages: [{ role: 'user', content: 'یک جمله‌ی کوتاه فارسی بگو.' }], max_tokens: 60 }),
      new Promise((_, rej) => setTimeout(() => rej(new Error('بعد از ۲۰ ثانیه جوابی نیامد (timeout)')), 20000)),
    ]);
    const reply = typeof out?.response === 'string' ? out.response.slice(0, 300) : '';
    if (!reply) return jsonNoStore({ success: false, error: 'مدل جواب خالی یا با فرمت ناشناخته برگرداند.', model, detail: JSON.stringify(out ?? null).slice(0, 300) });
    return jsonNoStore({ success: true, reply, model });
  } catch (e) {
    return jsonNoStore({ success: false, error: 'اجرای مدل خطا داد.', model, detail: String((e as any)?.message || e).slice(0, 400) });
  }
}
