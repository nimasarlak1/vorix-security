import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import OrderForm from '../../components/OrderForm';
import AssistantMount from '../../components/AssistantMount';
import { getDBSafe } from '../../lib/db';
import { getServices } from '../../lib/services';
import { SITE } from '../../data/site';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> | { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const db = getDBSafe();
  const { slug } = await params;
  const s = (await getServices(db)).find((x) => x.slug === slug);
  if (!s) return { title: 'صفحه پیدا نشد', robots: { index: false } };
  return {
    title: s.seoTitle,
    description: s.seoDesc,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: { title: s.seoTitle, description: s.seoDesc, url: `${SITE.url}/services/${s.slug}`, locale: 'fa_IR', type: 'website' },
  };
}

export default async function ServicePage({ params }: Props) {
  const db = getDBSafe();
  const { slug } = await params;
  const all = await getServices(db);
  const s = all.find((x) => x.slug === slug);
  if (!s) notFound();
  const others = all.filter((x) => x.slug !== s.slug);

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${SITE.url}/services/${s.slug}#service`,
        name: s.title,
        description: s.seoDesc,
        url: `${SITE.url}/services/${s.slug}`,
        areaServed: { '@type': 'Country', name: 'ایران' },
        provider: { '@id': `${SITE.url}/#business` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'خانه', item: SITE.url },
          { '@type': 'ListItem', position: 2, name: s.title, item: `${SITE.url}/services/${s.slug}` },
        ],
      },
    ],
  };

  return (
    <main id="main" className="relative py-14 sm:py-20">
      <div className="container-x max-w-3xl">
        <nav aria-label="مسیر صفحه" className="text-sm text-neutral-500">
          <a href="/" className="hover:text-cyan-300">خانه</a> / <a href="/#services" className="hover:text-cyan-300">خدمات</a> / <span className="text-neutral-300">{s.title}</span>
        </nav>
        <h1 className="section-title mt-6">{s.title}</h1>
        <p className="mt-4 leading-9 text-neutral-300">{s.text}</p>

        <div className="mt-8 space-y-5 leading-9 text-neutral-400">
          {s.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        {s.points.length > 0 && (
          <ul className="mt-8 grid gap-2 sm:grid-cols-2">
            {s.points.map((p) => (
              <li key={p} className="card flex items-center gap-2 p-3 text-sm text-neutral-200">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" aria-hidden="true" />{p}
              </li>
            ))}
          </ul>
        )}

        {s.steps && s.steps.length > 0 && (
          <>
            <h2 className="mt-12 text-xl font-bold text-white">روند کار</h2>
            <ol className="mt-5 space-y-3">
              {s.steps.map((st, i) => (
                <li key={st} className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-400/10 text-sm font-bold text-cyan-200">{i + 1}</span>
                  <span className="pt-1 text-neutral-300">{st}</span>
                </li>
              ))}
            </ol>
          </>
        )}

        {s.docs && s.docs.length > 0 && (
          <>
            <h2 className="mt-12 text-xl font-bold text-white">مدارک موردنیاز</h2>
            <ul className="mt-5 list-disc space-y-2 pr-6 text-neutral-300">
              {s.docs.map((d) => <li key={d}>{d}</li>)}
            </ul>
            {s.docsNote && <p className="mt-4 text-sm leading-8 text-neutral-500">{s.docsNote}</p>}
          </>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <a href="#order" className="btn-primary">ثبت سفارش این خدمت</a>
          <a href={`tel:${SITE.phone}`} className="btn-ghost" dir="ltr">{SITE.phone}</a>
        </div>
      </div>

      <OrderForm defaultService={s.orderLabel} />

      <div className="container-x max-w-3xl pb-6">
        <h2 className="text-lg font-bold text-white">سایر خدمات</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {others.map((o) => (
            <li key={o.slug}><a href={`/services/${o.slug}`} className="rounded-full border border-white/10 px-4 py-2 text-sm text-neutral-300 hover:border-cyan-400/50 hover:text-cyan-300">{o.title}</a></li>
          ))}
        </ul>
      </div>

      <AssistantMount />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
    </main>
  );
}
