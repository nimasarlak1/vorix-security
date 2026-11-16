import type { Metadata } from 'next';
import OrderForm from '../components/OrderForm';

export const metadata: Metadata = {
  title: 'درخواست همکاری برای دستگاه‌ها، ادارات و شرکت‌ها',
  description: 'فرم درخواست همکاری برای دستگاه‌ها، ادارات و شرکت‌ها در زمینه‌ی ریکاوری اطلاعات، امنیت دیجیتال، دوربین مداربسته و طراحی سایت.',
  alternates: { canonical: '/cooperation' },
};

export default function CooperationPage() {
  return (
    <main id="main" className="relative py-14 sm:py-20">
      <div className="container-x max-w-3xl">
        <h1 className="section-title">درخواست همکاری</h1>
        <p className="mt-4 leading-9 text-neutral-400">
          اگر نماینده‌ی یک دستگاه، اداره یا شرکت هستید و می‌خواهید در زمینه‌ی ریکاوری اطلاعات، امنیت دیجیتال، دوربین مداربسته یا طراحی سایت همکاری کنید، فرم زیر را پر کنید. در بخش توضیحات نام مجموعه و نوع همکاری موردنظر را بنویسید تا با شما تماس بگیریم.
        </p>
      </div>
      <OrderForm defaultService="درخواست همکاری (دستگاه، اداره یا شرکت)" />
    </main>
  );
}
