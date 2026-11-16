import { getDBSafe, getEnv } from '../../../lib/db';
import { authenticate } from '../../../lib/guard';
import { jsonNoStore } from '../../../lib/security';
import { runAI } from '../../../lib/ai';

export const runtime = 'edge';

// فقط برای ادمین دارای دسترسی تنظیمات: یک پیام آزمایشی به مدل می‌فرستد و خطای دقیق را (اگر بود) نشان می‌دهد
export async function POST(request: Request) {
  const db = getDBSafe();
  const env = getEnv() as Record<string, any>;
  const a = await authenticate(request, db, env, 'settings');
  if (a.res) return a.res;

  const ai = env.AI;
  if (!ai || typeof ai.run !== 'function') {
    return jsonNoStore({ success: false, error: 'Binding با نام AI در این Deploy وجود ندارد.' });
  }
  const r = await runAI(ai, env.AI_MODEL, [{ role: 'user', content: 'یک جمله‌ی کوتاه فارسی بگو.' }], 400);
  if (r.reply) return jsonNoStore({ success: true, reply: r.reply.slice(0, 300), model: r.model, failedModels: r.errors });
  return jsonNoStore({ success: false, error: 'هیچ‌کدام از مدل‌ها جواب نداد.', detail: r.errors.map((e) => `${e.model}: ${e.error}`).join(' | ').slice(0, 600) });
}
