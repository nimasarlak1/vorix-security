import Link from 'next/link';

export const metadata = {
  title: 'صفحه پیدا نشد',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main id="main" className="container-x flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="text-7xl font-black text-grad" dir="ltr">
        404
      </p>
      <h1 className="mt-4 text-2xl font-black text-white">صفحه‌ای که دنبالش بودید پیدا نشد</h1>
      <p className="mt-3 max-w-md text-neutral-400">
        ممکن است آدرس را اشتباه وارد کرده باشید یا صفحه جابه‌جا شده باشد.
      </p>
      <Link href="/" className="btn-primary mt-8">
        بازگشت به صفحه اصلی
      </Link>
    </main>
  );
}
