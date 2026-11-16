import AssistantWidget from './AssistantWidget';
import { getDBSafe, getEnv } from '../lib/db';
import { getSetting } from '../lib/content';
import { ensureSchema } from '../lib/schema';

// دستیار فقط وقتی نمایش داده می‌شود که در پنل روشن شده باشد و Binding با نام AI در Cloudflare وجود داشته باشد.
export default async function AssistantMount() {
  const db = getDBSafe();
  const env = getEnv() as Record<string, any>;
  if (!db || !env.AI) return null;
  try {
    await ensureSchema(db);
    if ((await getSetting(db, 'ai_enabled')) !== '1') return null;
  } catch {
    return null;
  }
  return <AssistantWidget />;
}
