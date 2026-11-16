-- این فایل اختیاری است: کد پروژه خودش همه‌ی جدول‌ها را در اولین اجرا می‌سازد (CREATE TABLE IF NOT EXISTS).
-- اگر خواستید دستی بسازید، در Cloudflare Dashboard > D1 > vorix-db > Console اجرا کنید.

CREATE TABLE IF NOT EXISTS vx_orders (
  id TEXT PRIMARY KEY, created_at TEXT NOT NULL, name TEXT NOT NULL, phone TEXT NOT NULL,
  service TEXT NOT NULL, description TEXT, status TEXT NOT NULL DEFAULT 'جدید'
);
CREATE TABLE IF NOT EXISTS vx_order_notes (order_id TEXT PRIMARY KEY, note TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS vx_admins (
  id TEXT PRIMARY KEY, username TEXT NOT NULL UNIQUE, pass_hash TEXT NOT NULL, salt TEXT NOT NULL,
  perms TEXT NOT NULL DEFAULT '[]', active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS vx_items (
  id TEXT PRIMARY KEY, kind TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'draft', sort INTEGER NOT NULL DEFAULT 0,
  data TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS vx_items_kind_status ON vx_items (kind, status);
CREATE TABLE IF NOT EXISTS vx_media (id TEXT PRIMARY KEY, mime TEXT NOT NULL, data TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS vx_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS vx_rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, window_start INTEGER NOT NULL);
