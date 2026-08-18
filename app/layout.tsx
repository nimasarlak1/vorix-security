import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata = {
  title: 'VORIX.SECURITY',
  description: 'امنیت دیجیتال و راهکارهای هوش مصنوعی',
  verification: {
    google: 'eWpLO4qdD5WZe49-VnjdBy2vx3uMrlMVBFnQBx7NvVk',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
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
