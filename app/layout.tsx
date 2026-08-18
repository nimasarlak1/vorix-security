import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata = {
  title: 'VORIX.SECURITY | امنیت سایبری، هوش مصنوعی و ریکاوری اطلاعات',
description: 'VORIX.SECURITY ارائه‌دهنده خدمات امنیت دیجیتال، هوش مصنوعی، ریکاوری اطلاعات، سیستم‌های نظارتی و راهکارهای حفاظتی حرفه‌ای.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta name="google-site-verification" content="eWpLO4qdD5WZe49-VnjdBy2vx3uMrlMVBFnQBx7NvVk" />
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
