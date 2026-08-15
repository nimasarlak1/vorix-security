import React from 'react';
import Link from 'next/link';

export default function SecurityPage() {
  const services = [
    {
      title: 'امنیت سایبری و ارزیابی فایل',
      desc: 'بررسی فایل‌های مشکوک، تحلیل بدافزارها و ایمن‌سازی زیرساخت‌های شبکه در برابر نفوذ.',
      icon: '🛡️'
    },
    {
      title: 'ریکاوری پیج‌های اینستاگرام',
      desc: 'بازیابی حساب‌های از دست رفته، هک‌شده و بازگردانی دسترسی‌های مدیریت با متدهای تخصصی.',
      icon: '🔄'
    },
    {
      title: 'نصب و بهینه‌سازی دوربین مداربسته',
      desc: 'مشاوره، نصب اصولی تجهیزات نظارتی و افزایش کیفیت فیلم‌های دوربین مداربسته.',
      icon: '📷'
    },
    {
      title: 'بازیابی اطلاعات (Data Recovery)',
      desc: 'ریکاوری تخصصی اطلاعات از روی گوشی، هارد اکسترنال، دوربین و تجهیزات دیجیتال.',
      icon: '💾'
    },
    {
      title: 'راهکارهای هوش مصنوعی و سئو',
      desc: 'پیاده‌سازی ابزارهای هوش مصنوعی، اتوماسیون و بهینه‌سازی حضور دیجیتال برند.',
      icon: '🤖'
    },
    {
      title: 'تست نفوذ و OSINT',
      desc: 'شناسایی آسیب‌پذیری‌ها و ارزیابی اطلاعات آشکار برای بالا بردن ضریب امنیت دیجیتال.',
      icon: '🔍'
    }
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-12" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* هدر صفحه */}
        <div className="text-center space-y-4">
          <div className="inline-block bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold px-4 py-1.5 rounded-full">
            خدمات مهندسی VORIX.SECURITY
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white">راهکارهای جامع امنیت و فناوری</h1>
          <p className="text-neutral-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            ارائه خدمات تخصصی در استان لرستان و پشتیبانی آنلاین سراسری با بالاترین استانداردهای امنیتی.
          </p>
        </div>

        {/* لیست خدمات */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item, index) => (
            <div 
              key={index} 
              className="bg-neutral-900/40 border border-neutral-800/80 p-6 rounded-3xl space-y-4 hover:border-cyan-500/50 transition duration-300 shadow-xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-2xl">
                {item.icon}
              </div>
              <h2 className="text-lg font-bold text-white">{item.title}</h2>
              <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
              <div className="pt-2">
                <Link 
                  href="/order" 
                  className="inline-block text-xs font-semibold text-cyan-400 hover:underline"
                >
                  ثبت سفارش این خدمت ←
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* دکمه بازگشت */}
        <div className="text-center pt-6">
          <Link href="/" className="text-xs text-neutral-400 hover:text-cyan-400 transition">
            ← بازگشت به صفحه اصلی
          </Link>
        </div>

      </div>
    </main>
  );
}
