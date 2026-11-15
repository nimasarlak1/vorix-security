-- این فایل اختیاری است: کد پروژه خودش این جدول‌ها را در اولین اجرا می‌سازد.
-- اگر خواستید همین الان و دستی بسازید، این را در Cloudflare Dashboard > D1 > vorix-db > Console اجرا کنید.

-- سفارش‌ها (نمایش در پنل ادمین)
CREATE TABLE IF NOT EXISTS vx_orders (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'جدید'
);

-- شمارنده‌ی «کارهای انجام‌شده» در صفحه‌ی اصلی
CREATE TABLE IF NOT EXISTS order_stats (
  id INTEGER PRIMARY KEY,
  count INTEGER NOT NULL
);

-- محدودیت تعداد درخواست (ثبت سفارش و ورود ادمین)
CREATE TABLE IF NOT EXISTS vx_rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  window_start INTEGER NOT NULL
);
