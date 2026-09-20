import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import About from './components/About';
import OrderForm from './components/OrderForm';
import Faq from './components/Faq';
import Contact from './components/Contact';
import { FAQS } from './data/site';

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      <Services />
      <Portfolio />
      <About />
      <OrderForm />
      <Faq />
      <Contact />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, '\\u003c') }}
      />
    </main>
  );
}
