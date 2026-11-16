import { getDBSafe, getEnv } from '../../../lib/db';
import { authenticate } from '../../../lib/guard';
import { jsonNoStore } from '../../../lib/security';

export const runtime = 'edge';

export async function GET(request: Request) {
  const db = getDBSafe();
  const env = getEnv();
  const a = await authenticate(request, db, env);
  if (a.res) return a.res;
  return jsonNoStore({ success: true, admin: a.admin });
}
