import type { Metadata, Viewport } from 'next';
import { Vazirmatn } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { SITE } from './data/site';

const vazir = Vazirmatn({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-vazir',
});

const TITLE = 'VORIX.SECURITY | ریکاوری اطلاعات و دوربین مداربسته در الیگودرز';
const DESCRIPTION =
  'دفتر خدمات دیجیتال VORIX.SECURITY در الیگودرز: ریکاوری اطلاعات هارد و گوشی، نصب دوربین مداربسته، امنیت پیج و حساب‌ها، طراحی سایت و هوش مصنوعی.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: TITLE,
    template: '%s | VORIX.SECURITY',
  },
  description: DESCRIPTION,
  applicationName: SITE.name,
  authors: [{ name: SITE.legalName }],
  alternates: { canonical: '/' },
  // آیکون‌ها داخل public هستند (نه app) تا با Cloudflare Pages مشکل Edge Runtime ایجاد نکنند
  icons: {
    icon: [{ url: '/icon.png', type: 'image/png', sizes: '256x256' }],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/',
    siteName: SITE.name,
    locale: 'fa_IR',
    type: 'website',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og.jpg'],
  },
  // تأیید مالکیت در Google Search Console (از سایت قبلی حفظ شده)
  verification: { google: 'eWpLO4qdD5WZe49-VnjdBy2vx3uMrlMVBFnQBx7NvVk' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#05070d',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      inLanguage: 'fa-IR',
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${SITE.url}/#business`,
      name: SITE.legalName,
      alternateName: SITE.name,
      url: SITE.url,
      image: `${SITE.url}/og.jpg`,
      logo: `${SITE.url}/logo-mark.png`,
      telephone: SITE.phoneIntl,
      email: SITE.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE.street,
        addressLocality: SITE.city,
        addressRegion: SITE.region,
        addressCountry: 'IR',
      },
      areaServed: { '@type': 'City', name: SITE.city },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
          opens: '09:00',
          closes: '20:00',
        },
      ],
      sameAs: [SITE.instagramUrl],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <head>
        <noscript>
          <style>{'.reveal{opacity:1!important;transform:none!important}.rise{opacity:1!important;transform:none!important}'}</style>
        </noscript>
      </head>
      <body>
        <a href="#main" className="skip-link">
          پرش به محتوای اصلی
        </a>
        <Navbar />
        {children}
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      </body>
    </html>
  );
}
