import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-12" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* هدر صفحه */}
        <div className="text-center space-y-4">
          <div className="inline-block bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold px-4 py-1.5 rounded-full">
            درباره مجموعه VORIX.SECURITY
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white">پیشرو در امنیت دیجیتال و راهکارهای فناورانه</h1>
          <p className="text-neutral-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            ما با اتکا به تخصص فنی، ارائه‌دهنده خدمات پیشرفته امنیت سایبری، ریکاوری داده‌ها و راهکارهای هوش مصنوعی در استان لرستان و پشتیبانی آنلاین سراسری هستیم.
          </p>
        </div>

        {/* کارت‌های اطلاعات کلیدی */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-neutral-900/40 border border-neutral-800/80 p-8 rounded-3xl space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xl font-bold">
              🎯
            </div>
            <h2 className="text-lg font-bold text-white">مأموریت و هدف ما</h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              هدف اصلی VORIX.SECURITY بالا بردن ضریب امنیت اطلاعات کاربران و کسب‌وکارها، بازیابی دارایی‌های دیجیتال ازدست‌رفته و پیاده‌سازی زیرساخت‌های نظارتی با بالاترین استانداردهای روز است.
            </p>
          </div>

          <div className="bg-neutral-900/40 border border-neutral-800/80 p-8 rounded-3xl space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xl font-bold">
              📍
            </div>
            <h2 className="text-lg font-bold text-white">موقعیت و پشتیبانی</h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              دفتر مرکزی ما مستقر در <strong className="text-white">ایران، لرستان</strong> بوده و خدمات تخصصی و پشتیبانی آنلاین خود را به صورت سراسری به مشتریان عزیز ارائه می‌کنیم.
            </p>
          </div>
        </div>

        {/* بخش جزئیات تخصصی */}
        <div className="bg-neutral-900/40 border border-neutral-800/80 p-8 rounded-3xl space-y-6 shadow-xl">
          <h2 className="text-lg font-bold text-white border-b border-neutral-800 pb-4">حوزه‌های فعالیت تخصصی</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="bg-neutral-950/60 border border-neutral-800/60 p-4 rounded-2xl space-y-1">
              <div className="font-bold text-cyan-400">امنیت سایبری</div>
              <div className="text-neutral-400">بررسی فایل‌های مشکوک، تست نفوذ و ارزیابی سیستم‌ها</div>
            </div>
            <div className="bg-neutral-950/60 border border-neutral-800/60 p-4 rounded-2xl space-y-1">
              <div className="font-bold text-cyan-400">ریکاوری پیشرفته</div>
              <div className="text-neutral-400">بازیابی پیج‌های اینستاگرام و اطلاعات هارد/گوشی</div>
            </div>
            <div className="bg-neutral-950/60 border border-neutral-800/60 p-4 rounded-2xl space-y-1">
              <div className="font-bold text-cyan-400">دوربین مداربسته</div>
              <div className="text-neutral-400">نصب اصولی و افزایش کیفیت تصاویر ضبط‌شده</div>
            </div>
          </div>
        </div>

        {/* دکمه‌های اقدام */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <Link 
            href="/order" 
            className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold px-8 py-3.5 rounded-xl text-xs transition shadow-lg shadow-cyan-500/20 text-center"
          >
            ثبت سفارش و مشاوره آنلاین
          </Link>
          <Link 
            href="/" 
            className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-medium px-8 py-3.5 rounded-xl text-xs transition text-center"
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>

      </div>
    </main>
  );
}
