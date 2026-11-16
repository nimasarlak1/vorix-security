import type { Metadata } from 'next';
import { getDBSafe } from '../lib/db';
import { loadContent } from '../lib/content';
import ProductsClient from './ProductsClient';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const db = getDBSafe();
  const c = await loadContent(db);
  return {
    title: 'محصولات دوربین مداربسته',
    description: 'دوربین مداربسته، دستگاه ضبط، هارد و تجهیزات جانبی با امکان استعلام قیمت آنلاین.',
    alternates: { canonical: '/products' },
    // تا وقتی محصولی در پنل وارد نشده، این صفحه نباید در گوگل بیاید
    robots: c.product.length ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default async function ProductsPage() {
  const db = getDBSafe();
  const c = await loadContent(db);
  return (
    <main id="main" className="relative py-14 sm:py-20">
      <div className="container-x">
        <h1 className="section-title">محصولات دوربین مداربسته</h1>
        <p className="mt-4 mb-8 max-w-2xl text-neutral-400">دوربین، دستگاه ضبط، هارد و تجهیزات جانبی. برای قیمت یا مشاوره روی «استعلام قیمت» بزنید؛ درخواست شما مستقیم به دفتر می‌رسد.</p>
      </div>
      {c.product.length === 0 ? (
        <div className="container-x"><p className="text-neutral-400">فهرست محصولات به‌زودی اضافه می‌شود. برای استعلام با دفتر تماس بگیرید.</p></div>
      ) : (
        <ProductsClient products={c.product as any} />
      )}
    </main>
  );
}
