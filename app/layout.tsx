import './globals.css';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'VORIX.SECURITY | سامانه تخصصی امنیت دیجیتال',
  description: 'امنیت شبکه، ریکاوری پیشرفته اطلاعات و تجهیزات نظارتی در استان لرستان',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-neutral-950 text-neutral-100 min-h-screen selection:bg-cyan-500 selection:text-neutral-950">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
