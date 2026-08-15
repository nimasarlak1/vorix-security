import './globals.css';
import Navbar from '@/styles/components/Navbar'; // یا مسیر صحیح پوشه کامپوننت‌ها

export const metadata = {
  title: 'VORIX.SECURITY | امنیت دیجیتال',
  description: 'ارائه خدمات تخصصی امنیت سایبری، ریکاوری و هوش مصنوعی',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-neutral-950 text-neutral-100 min-h-screen font-sans antialiased selection:bg-cyan-500 selection:text-black">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
