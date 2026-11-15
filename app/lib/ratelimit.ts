// محدودیت تعداد درخواست با دیتابیس D1 (روی همه‌ی سرورهای Cloudflare مشترک است).
// جدول جدید با پیشوند vx_ ساخته می‌شود و به جدول‌های فعلی دست نمی‌زند.
// اگر دیتابیس در دسترس نبود، موقتاً از حافظه‌ی همان سرور استفاده می‌شود (ضعیف‌تر، ولی بهتر از هیچ).

const memory = new Map<string, { count: number; start: number }>();

export async function hitRateLimit(
  db: any | null,
  key: string,
  max: number,
  windowSec: number
): Promise<{ limited: boolean; count: number }> {
  const now = Math.floor(Date.now() / 1000);

  if (db) {
    try {
      await db
        .prepare(
          `CREATE TABLE IF NOT EXISTS vx_rate_limits (
            key TEXT PRIMARY KEY,
            count INTEGER NOT NULL,
            window_start INTEGER NOT NULL
          )`
        )
        .run();

      const row = await db
        .prepare(
          `INSERT INTO vx_rate_limits (key, count, window_start) VALUES (?1, 1, ?2)
           ON CONFLICT(key) DO UPDATE SET
             count = CASE WHEN ?2 - window_start >= ?3 THEN 1 ELSE count + 1 END,
             window_start = CASE WHEN ?2 - window_start >= ?3 THEN ?2 ELSE window_start END
           RETURNING count`
        )
        .bind(key, now, windowSec)
        .first();

      const count = Number(row?.count ?? 1);

      // پاکسازی گاه‌به‌گاه ردیف‌های قدیمی
      if (Math.random() < 0.02) {
        await db.prepare('DELETE FROM vx_rate_limits WHERE window_start < ?1').bind(now - 86400).run();
      }
      return { limited: count > max, count };
    } catch (e) {
      console.error('rate limit (D1) failed, using memory', e);
    }
  }

  const cur = memory.get(key);
  if (!cur || now - cur.start >= windowSec) {
    memory.set(key, { count: 1, start: now });
  } else {
    cur.count += 1;
  }
  if (memory.size > 500) {
    memory.forEach((v, k) => {
      if (now - v.start >= windowSec) memory.delete(k);
    });
  }
  const count = memory.get(key)!.count;
  return { limited: count > max, count };
}

export async function resetRateLimit(db: any | null, key: string): Promise<void> {
  memory.delete(key);
  if (!db) return;
  try {
    await db.prepare('DELETE FROM vx_rate_limits WHERE key = ?1').bind(key).run();
  } catch (e) {
    console.error('rate limit reset failed', e);
  }
}
