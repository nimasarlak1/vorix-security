import HomePage from './components/HomePage';

// صفحه‌ی اصلی واقعی سایت (جایگزین صفحه‌ی موقت «در حال بروزرسانی»).
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default function Home() {
  return <HomePage />;
}
