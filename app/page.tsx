import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between" dir="rtl">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 py-24 text-center space-y-8">
        <div className="inline-block bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold px-4 py-1.5 rounded-full tracking-wider">
          سامانه تخصصی امنیت دیجیتال و خدمات مهندسی
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">
          حفاظت از دارایی‌های دیجیتال با <span className="text-cyan-400">VORIX.SECURITY</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-neutral-400 text-base md:text-lg leading-relaxed">
          ارائه تخصصی‌ترین خدمات امنیت شبکه، ریکاوری پیشرفته اطلاعات، نصب و بهینه‌سازی دوربین‌های مداربسته و راهکارهای هوش مصنوعی در استان لرستان و پشتیبانی آنلاین.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link 
            href="/contact" 
            className="bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 transition duration-300"
          >
            درخواست مشاوره فوری
          </Link>
          <Link 
            href="/security" 
            className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 font-semibold px-8 py-3.5 rounded-xl transition duration-300"
          >
            مشاهده خدمات تخصصی
          </Link>
        </div>
      </div>

      {/* Features / Quick Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-6 w-full">
        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 space-y-3">
          <div className="text-cyan-400 font-bold text-lg">امنیت و بازیابی پیج</div>
          <p className="text-neutral-400 text-sm leading-relaxed">
            ریکاوری صفحات از دست رفته اینستاگرام، ارزیابی امنیت حساب‌ها و بررسی فایل‌های مشکوک.
          </p>
        </div>

        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 space-y-3">
          <div className="text-cyan-400 font-bold text-lg">دوربین‌های مداربسته</div>
          <p className="text-neutral-400 text-sm leading-relaxed">
            طراحی، مشاوره نصب و بالا بردن کیفیت فیلم‌های دوربین مداربسته با پردازش‌های پیشرفته.
          </p>
        </div>

        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 space-y-3">
          <div className="text-cyan-400 font-bold text-lg">ریکاوری پیشرفته اطلاعات</div>
          <p className="text-neutral-400 text-sm leading-relaxed">
            بازیابی اطلاعات از دست رفته انواع گوشی، هارد، دوربین و تجهیزات دیجیتال با بالاترین درصد موفقیت.
          </p>
        </div>
      </div>
    </main>
  );
}
