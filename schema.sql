-- این فایل اختیاری است: کد پروژه خودش این جدول‌ها را در اولین اجرا می‌سازد.
-- اگر خواستید همین الان و دستی بسازید، این را در Cloudflare Dashboard > D1 > vorix-db > Console اجرا کنید.

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'جدید'
);

CREATE TABLE IF NOT EXISTS login_attempts (
  ip TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  first_attempt INTEGER NOT NULL
);
