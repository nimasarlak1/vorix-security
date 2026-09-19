import type { Metadata } from 'next';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const siteUrl = 'https://vorixsecurity.ir';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'VORIX.SECURITY | امنیت سایبری و خدمات فناوری در الیگودرز',
    template: '%s | VORIX.SECURITY',
  },
  description:
    'VORIX.SECURITY به مدیریت نیما سرلک؛ ارائه خدمات امنیت سایبری، امنیت دیجیتال، بازیابی اطلاعات، امنیت حساب‌های آنلاین، دوربین مداربسته، هوش مصنوعی و راهکارهای فناوری در الیگودرز و لرستان.',
  keywords: [
    'VORIX.SECURITY',
    'وریکس سکیوریتی',
    'امنیت سایبری',
    'امنیت دیجیتال',
    'خدمات امنیت سایبری در الیگودرز',
    'امنیت سایبری در لرستان',
    'ریکاوری اطلاعات',
    'بازیابی اطلاعات',
    'امنیت پیج اینستاگرام',
    'امنیت حساب‌های آنلاین',
    'دوربین مداربسته الیگودرز',
    'هوش مصنوعی',
    'OSINT',
    'تست امنیت',
    'سئو',
  ],
  authors: [{ name: 'نیما سرلک', url: siteUrl }],
  creator: 'نیما سرلک',
  publisher: 'VORIX.SECURITY',
  category: 'technology',
  alternates: { canonical: siteUrl },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: siteUrl,
    siteName: 'VORIX.SECURITY',
    title: 'VORIX.SECURITY | امنیت سایبری و خدمات فناوری',
    description:
      'خدمات امنیت سایبری، امنیت دیجیتال، بازیابی اطلاعات و راهکارهای فناوری با مدیریت نیما سرلک در الیگودرز، لرستان.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'VORIX.SECURITY - امنیت سایبری و فناوری',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VORIX.SECURITY | امنیت سایبری و فناوری',
    description:
      'خدمات امنیت سایبری، امنیت دیجیتال، بازیابی اطلاعات و راهکارهای فناوری در الیگودرز و لرستان.',
    images: ['/logo.png'],
  },
  verification: {
    google: 'eWpLO4qdD5WZe49-VnjdBy2vx3uMrlMVBFnQBx7NvVk',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['ProfessionalService', 'Organization'],
  name: 'VORIX.SECURITY',
  alternateName: 'وریکس سکیوریتی',
  description:
    'خدمات امنیت سایبری، امنیت دیجیتال، بازیابی اطلاعات و راهکارهای فناوری با مدیریت نیما سرلک.',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  image: `${siteUrl}/logo.png`,
  founder: {
    '@type': 'Person',
    name: 'نیما سرلک',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'میدان امام، پاساژ سینا، طبقه دوم',
    addressLocality: 'الیگودرز',
    addressRegion: 'لرستان',
    addressCountry: 'IR',
  },
  areaServed: [
    { '@type': 'City', name: 'الیگودرز' },
    { '@type': 'AdministrativeArea', name: 'لرستان' },
    { '@type': 'Country', name: 'ایران' },
  ],
  knowsAbout: [
    'امنیت سایبری',
    'امنیت دیجیتال',
    'بازیابی اطلاعات',
    'هوش مصنوعی',
    'سیستم‌های نظارتی',
    'OSINT',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="alternate" hrefLang="fa-IR" href={siteUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-neutral-950 text-white selection:bg-cyan-500 selection:text-black min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
