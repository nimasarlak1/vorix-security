import Hero from '../components/Hero';
import Services from '../components/Services';
import Stats from '../components/Stats';
import Portfolio from '../components/Portfolio';
import About from '../components/About';
import OrderForm from '../components/OrderForm';
import Faq from '../components/Faq';
import Contact from '../components/Contact';

export const metadata = {
  title: 'پیش‌نمایش',
  robots: { index: false, follow: false, nocache: true },
};

export default function PreviewPage() {
  return (
    <main id="main">
      <Hero />
      <Services />
      <Stats />
      <Portfolio />
      <About />
      <OrderForm />
      <Faq />
      <Contact />
    </main>
  );
}
