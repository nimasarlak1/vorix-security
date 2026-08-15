import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100" dir="rtl">
      {/* بخش اصلی (Hero) */}
      <section className="relative overflow-hidden py-20 lg:py-32 px-6">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-block bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold px-4 py-1.5 rounded-full">
            سامانه تخصصی امنیت دیجیتال و خدمات مهندسی
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            حفاظت از دارایی‌های دیجیتال با <span className="text-cyan-400">VORIX.SECURITY</span>
          </h1>
          
          <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            خدمات امنیت شبکه، ریکاوری پیشرفته اطلاعات، نصب و بهینه‌سازی دوربین‌های مداربسته و راهکارهای هوش مصنوعی در استان لرستان و پشتیبانی آنلاین.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link 
              href="/order" 
              className="bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold px-8 py-4 rounded-2xl transition duration-300 shadow-lg shadow-cyan-500/20 text-sm"
            >
              درخواست مشاوره فوری و ثبت سفارش
            </Link>
            <Link 
              href="/security" 
              className="bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-200 font-semibold px-8 py-4 rounded-2xl transition duration-300 text-sm"
            >
              مشاهده خدمات تخصصی
            </Link>
          </div>
        </div>
      </section>

      {/* بخش معرفی خدمات */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-neutral-900">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white">خدمات تخصصی VORIX</h2>
          <p className="text-neutral-400 text-sm">ارائه راهکارهای امنیتی و مهندسی با بالاترین استاندارد</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-neutral-900/40 border border-neutral-800/80 p-8 rounded-3xl space-y-4 hover:border-cyan-500/50 transition">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">01</div>
            <h3 className="text-lg font-bold text-white">امنیت شبکه و ریکاوری پیج</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              ارزیابی فایل‌های مشکوک، تست نفوذ و بازیابی تخصصی پیج‌های از دست رفته اینستاگرام با امنیت کامل.
            </p>
            <Link href="/order" className="inline-block text-xs text-cyan-400 hover:underline pt-2 font-medium">
              ثبت درخواست این خدمت ←
            </Link>
          </div>

          <div className="bg-neutral-900/40 border border-neutral-800/80 p-8 rounded-3xl space-y-4 hover:border-cyan-500/50 transition">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">02</div>
            <h3 className="text-lg font-bold text-white">دوربین مداربسته و نظارت</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              نصب اصولی، جانمایی تخصصی و بررسی و افزایش کیفیت فیلم‌های دوربین مداربسته در استان لرستان.
            </p>
            <Link href="/order" className="inline-block text-xs text-cyan-400 hover:underline pt-2 font-medium">
              ثبت درخواست این خدمت ←
            </Link>
          </div>

          <div className="bg-neutral-900/40 border border-neutral-800/80 p-8 rounded-3xl space-y-4 hover:border-cyan-500/50 transition">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">03</div>
            <h3 className="text-lg font-bold text-white">ریکاوری اطلاعات دیجیتال</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              بازیابی اطلاعات از دست رفته گوشی، هارد، دوربین و تجهیزات دیجیتال با ابزارهای پیشرفته.
            </p>
            <Link href="/order" className="inline-block text-xs text-cyan-400 hover:underline pt-2 font-medium">
              ثبت درخواست این خدمت ←
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
