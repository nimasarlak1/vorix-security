import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata = {
  title: 'VORIX.SECURITY | امنیت سایبری، هوش مصنوعی و ریکاوری اطلاعات',
  description:
    'VORIX.SECURITY ارائه‌دهنده خدمات امنیت دیجیتال، ریکاوری اطلاعات، هوش مصنوعی، سیستم‌های نظارتی و راهکارهای حفاظتی حرفه‌ای در ایران.',

  keywords: [
    'امنیت سایبری',
    'امنیت دیجیتال',
    'ریکاوری اطلاعات',
    'ریکاوری هارد',
    'هوش مصنوعی',
    'دوربین مداربسته',
    'امنیت پیج',
    'OSINT',
    'VORIX.SECURITY',
  ],

  authors: [
    {
      name: 'VORIX.SECURITY',
    },
  ],

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: 'VORIX.SECURITY | امنیت سایبری و راهکارهای دیجیتال',
    description:
      'خدمات امنیت دیجیتال، ریکاوری اطلاعات، هوش مصنوعی و سیستم‌های نظارتی.',
    url: 'https://vorixsecurity.ir',
    siteName: 'VORIX.SECURITY',
    locale: 'fa_IR',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'VORIX.SECURITY',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'VORIX.SECURITY',
    description:
      'امنیت دیجیتال، هوش مصنوعی، ریکاوری اطلاعات و سیستم‌های نظارتی.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta
          name="google-site-verification"
          content="eWpLO4qdD5WZe49-VnjdBy2vx3uMrlMVBFnQBx7NvVk"
        />
      </head>

      <body className="bg-neutral-950 text-white selection:bg-cyan-500 selection:text-black min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
