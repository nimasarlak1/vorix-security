// بررسی ورود و دسترسی برای APIهای پنل. هر درخواست ادمین‌های غیرمالک دوباره با دیتابیس چک می‌شود،
// پس غیرفعال کردن یک ادمین یا تغییر دسترسی‌اش فوراً اثر می‌کند.
import { PERMS, type Perm } from './itemspec';
import { isAllowedOrigin, jsonNoStore } from './security';
import { sessionFromRequest } from './session';
import { ensureSchema } from './schema';

export type Admin = { id: string; username: string; role: 'owner' | 'admin'; perms: Perm[] };
export type AuthResult = { admin: Admin; res?: undefined } | { admin?: undefined; res: Response };

export function parsePerms(raw: unknown): Perm[] {
  try {
    const arr = JSON.parse(String(raw || '[]'));
    return Array.isArray(arr) ? (arr.filter((p) => (PERMS as readonly string[]).includes(p)) as Perm[]) : [];
  } catch {
    return [];
  }
}

// need: دسترسی لازم؛ 'owner' یعنی فقط مدیر کل؛ undefined یعنی هر ادمین واردشده
export async function authenticate(
  request: Request,
  db: any,
  env: Record<string, string>,
  need?: Perm | 'owner'
): Promise<AuthResult> {
  const mutating = !['GET', 'HEAD', 'OPTIONS'].includes(request.method);
  if (mutating && !isAllowedOrigin(request)) {
    return { res: jsonNoStore({ success: false, error: 'درخواست نامعتبر است.' }, 403) };
  }
  const session = await sessionFromRequest(request, env.SESSION_SECRET || '');
  if (!session) return { res: jsonNoStore({ success: false, error: 'لطفاً وارد شوید.' }, 401) };
  if (!db) return { res: jsonNoStore({ success: false, error: 'دیتابیس وصل نیست.' }, 503) };

  let admin: Admin;
  if (session.role === 'owner') {
    admin = { id: 'owner', username: session.u, role: 'owner', perms: [...PERMS] };
  } else {
    await ensureSchema(db);
    const row = await db.prepare('SELECT id, username, perms, active FROM vx_admins WHERE id = ?1').bind(session.id).first();
    if (!row || Number(row.active) !== 1) {
      return { res: jsonNoStore({ success: false, error: 'دسترسی شما غیرفعال شده است.' }, 401) };
    }
    admin = { id: row.id, username: row.username, role: 'admin', perms: parsePerms(row.perms) };
  }

  if (need === 'owner' && admin.role !== 'owner') {
    return { res: jsonNoStore({ success: false, error: 'این بخش فقط برای مدیر کل است.' }, 403) };
  }
  if (need && need !== 'owner' && admin.role !== 'owner' && !admin.perms.includes(need)) {
    return { res: jsonNoStore({ success: false, error: 'به این بخش دسترسی ندارید.' }, 403) };
  }
  return { admin };
}

export async function readJson(request: Request, maxBytes: number): Promise<any | null> {
  try {
    const raw = await request.text();
    if (raw.length > maxBytes) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function newId(): string {
  return crypto.randomUUID().replace(/-/g, '');
}
