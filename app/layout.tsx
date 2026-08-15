import './globals.css';
import Navbar from '@/components/Navbar'; // بررسی کنید که پوشه components در ریشه یا پوشه app قرار دارد

export const metadata = {
  title: 'VORIX.SECURITY',
  description: 'امنیت دیجیتال و راهکارهای هوش مصنوعی',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-neutral-950 text-white selection:bg-cyan-500 selection:text-neutral-950">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
