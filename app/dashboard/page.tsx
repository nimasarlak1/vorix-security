'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // بررسی وضعیت احراز هویت ادمین
    const auth = localStorage.getItem('vorix_admin_auth');
    if (auth !== 'true') {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('vorix_admin_auth');
    router.push('/admin/login');
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-400 text-sm">
        در حال بررسی دسترسی...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-12" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* هدر داشبورد */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-neutral-900/60 border border-neutral-800/80 p-6 rounded-3xl gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="text-cyan-400 text-xs font-mono">پنل مدیریت اختصاصی</div>
            <h1 className="text-2xl font-bold text-white">خوش آمدید، nimaslk0</h1>
            <p className="text-xs text-neutral-400">سیستم امنیتی VORIX.SECURITY در وضعیت پایدار و فعال است.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
            >
              مشاهده سایت
            </Link>
            <button 
              onClick={handleLogout}
              className="bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-semibold px-4 py-2.5 rounded-xl transition"
            >
              خروج از حساب
            </button>
          </div>
        </div>

        {/* کارت‌های آمار و اطلاعات */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-neutral-900/40 border border-neutral-800/80 p-6 rounded-3xl space-y-2">
            <div className="text-xs text-neutral-400">وضعیت سرور و هاست</div>
            <div className="text-xl font-bold text-emerald-400">فعال (Cloudflare Workers)</div>
            <div className="text-[11px] text-neutral-500">بدون اختلال و با پایداری کامل</div>
          </div>
          
          <div className="bg-neutral-900/40 border border-neutral-800/80 p-6 rounded-3xl space-y-2">
            <div className="text-xs text-neutral-400">اتصال ربات تلگرام</div>
            <div className="text-xl font-bold text-cyan-400">آماده دریافت سفارش</div>
            <div className="text-[11px] text-neutral-500">ارسال آنی پیام‌ها به ادمین</div>
          </div>

          <div className="bg-neutral-900/40 border border-neutral-800/80 p-6 rounded-3xl space-y-2">
            <div className="text-xs text-neutral-400">حفاظت امنیتی سایت</div>
            <div className="text-xl font-bold text-white">فعال (Secure Headers)</div>
            <div className="text-[11px] text-neutral-500">رمزنگاری متغیرها در سطح سرور</div>
          </div>
        </div>

        {/* بخش مدیریت سریع */}
        <div className="bg-neutral-900/40 border border-neutral-800/80 p-8 rounded-3xl space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-neutral-800 pb-4">ابزارها و وضعیت سرویس‌ها</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-neutral-950/60 border border-neutral-800/60 p-4 rounded-2xl space-y-1">
              <div className="font-bold text-white">موقعیت فعالیت ثبت‌شده</div>
              <div className="text-neutral-400">استان لرستان (پشتیبانی آنلاین سراسری)</div>
            </div>
            <div className="bg-neutral-950/60 border border-neutral-800/60 p-4 rounded-2xl space-y-1">
              <div className="font-bold text-white">شماره تماس پشتیبانی</div>
              <div className="text-neutral-400">09357781529</div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
