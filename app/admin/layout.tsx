import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'پنل مدیریت',
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div dir="rtl">{children}</div>;
}
