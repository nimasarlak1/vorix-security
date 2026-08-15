import React from 'react';

export default function SecurityPage() {
  const services = [
    {
      title: "امنیت حساب و شبکه‌های اجتماعی",
      desc: "ریکاوری پیج‌های از دست رفته، تست نفوذ و ایمن‌سازی اکانت‌های اینستاگرام و پلتفرم‌های دیجیتال."
    },
    {
      title: "نصب و مانیتورینگ دوربین مداربسته",
      desc: "مشاوره، جانمایی، نصب تخصصی و بررسی و افزایش کیفیت فیلم‌های دوربین‌های مداربسته."
    },
    {
      title: "ریکاوری پیشرفته اطلاعات",
      desc: "بازیابی اطلاعات از روی گوشی‌های هوشمند، هارد اکسترنال، دوربین و تجهیزات دیجیتال آسیب‌دیده."
    },
    {
      title: "توسعه نرم‌افزار و امنیت شبکه",
      desc: "طراحی سایت‌های حرفه‌ای، توسعه نرم‌افزار امن و ارزیابی فایل‌های مشکوک و بدافزارها."
    }
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 py-20 px-6" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-cyan-400">خدمات امنیت دیجیتال</h1>
          <p className="text-neutral-400 text-lg">
            راهکارهای جامع و پیشرفته برای محافظت از داده‌ها و دارایی‌های دیجیتال شما
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-4 hover:border-cyan-500/50 transition duration-300 shadow-xl"
            >
              <h3 className="text-xl font-semibold text-cyan-400">{service.title}</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

