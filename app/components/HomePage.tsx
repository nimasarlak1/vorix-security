import Hero from './Hero';
import Services from './Services';
import Stats from './Stats';
import Portfolio from './Portfolio';
import About from './About';
import Credentials from './Credentials';
import OrderForm from './OrderForm';
import Faq from './Faq';
import Contact from './Contact';
import AssistantMount from './AssistantMount';
import { getDBSafe } from '../lib/db';
import { loadContent } from '../lib/content';
import { getServices } from '../lib/services';
import { toProject } from '../data/portfolio';
import { FAQS } from '../data/site';

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

// صفحه‌ی اصلی. نمونه‌کارها، آمار، مجوزها و محصولات فقط از پنل می‌آیند؛ اگر چیزی وارد نشده باشد، آن بخش نمایش داده نمی‌شود.
export default async function HomePage() {
  const db = getDBSafe(); // کانتکست Cloudflare قبل از هر await
  const [content, services] = await Promise.all([loadContent(db), getServices(db)]);

  return (
    <main id="main">
      <Hero />
      <Services services={services} />
      <Stats jobs={content.completedJobs} />
      <Portfolio projects={content.portfolio.map(toProject)} />
      <About />
      <Credentials items={content.credential as any} />
      {content.product.length > 0 && (
        <section id="products" className="relative py-16">
          <div className="container-x text-center">
            <h2 className="section-title">محصولات دوربین مداربسته</h2>
            <p className="mx-auto mt-4 max-w-xl text-neutral-400">دوربین، دستگاه ضبط، هارد و تجهیزات جانبی؛ با امکان استعلام قیمت از همان فرم سفارش.</p>
            <a href="/products" className="btn-primary mt-6 inline-flex">مشاهده‌ی محصولات</a>
          </div>
        </section>
      )}
      <OrderForm />
      <Faq />
      <Contact />
      <AssistantMount />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, '\\u003c') }} />
    </main>
  );
}
