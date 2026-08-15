import React from 'react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-12" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* هدر صفحه */}
        <div className="text-center space-y-4">
          <div className="inline-block bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold px-4 py-1.5 rounded-full">
            ارتباط با VORIX.SECURITY
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white">راه‌های ارتباطی و پشتیبانی</h1>
          <p className="text-neutral-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            برای دریافت مشاوره، ثبت سفارش یا پیگیری خدمات از راه‌های زیر با ما در ارتباط باشید.
          </p>
        </div>

        {/* کارت‌های اطلاعات تماس (شماره تلفن و موقعیت) */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-neutral-900/40 border border-neutral-800/80 p-8 rounded-3xl space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xl font-bold">
              📞
            </div>
            <h2 className="text-lg font-bold text-white">شماره تماس مستقیم</h2>
            <p className="text-xs text-neutral-400 leading-relaxed">پشتیبانی و هماهنگی خدمات فنی و امنیتی:</p>
            <div className="text-cyan-400 font-mono text-sm font-bold" dir="ltr">
              09357781529
            </div>
          </div>

          <div className="bg-neutral-900/40 border border-neutral-800/80 p-8 rounded-3xl space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xl font-bold">
              📍
            </div>
            <h2 className="text-lg font-bold text-white">موقعیت دفتر مرکزی</h2>
            <p className="text-xs text-neutral-400 leading-relaxed">ارائه خدمات حضوری در استان لرستان و پشتیبانی آنلاین سراسری.</p>
            <div className="text-white text-xs font-medium">ایران، لرستان</div>
          </div>
        </div>

        {/* بخش اینستاگرام */}
        <div className="bg-neutral-900/40 border border-neutral-800/80 p-8 rounded-3xl space-y-6 shadow-xl text-center">
          <h2 className="text-lg font-bold text-white">صفحه رسمی اینستاگرام</h2>
          <p className="text-xs text-neutral-400">
            برای مشاهده نمونه کارها و ارتباط سریع‌تر، پیج ما را دنبال کنید:
          </p>
          <div className="pt-2">
            <a 
              href="https://instagram.com/vorix.security" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-neutral-800 hover:bg-neutral-700 text-cyan-400 font-mono font-bold px-8 py-3 rounded-xl text-xs transition border border-neutral-700"
            >
              @vorix.security
            </a>
          </div>
        </div>

        {/* دکمه بازگشت */}
        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-neutral-400 hover:text-cyan-400 transition">
            ← بازگشت به صفحه اصلی سایت
          </Link>
        </div>

      </div>
    </main>
  );
}
