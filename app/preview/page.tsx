import HomePage from '../components/HomePage';

// صفحه‌ی آزمایشی فقط برای شاخه‌ی dev (قبل از ادغام با main حذف می‌شود).
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'پیش‌نمایش',
  robots: { index: false, follow: false, nocache: true },
};

export default function PreviewPage() {
  return <HomePage />;
}
