import React from 'react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 py-20 px-6" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-cyan-400">درباره Vorix Security</h1>
          <p className="text-neutral-400 text-lg">
            پیشرو در امنیت دیجیتال، هوش مصنوعی و راهکارهای پیشرفته سایبری
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8 shadow-xl space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-200">ما چه کسانی هستیم؟</h2>
          <p className="text-neutral-300 leading-relaxed">
            برند <span className="text-cyan-400 font-semibold">VORIX.SECURITY</span> با بهره‌گیری از متخصصان مجرب در حوزه امنیت سایبری، توسعه نرم‌افزار، هوش مصنوعی و زیرساخت‌های شبکه، به کسب‌وکارها و افراد کمک می‌کند تا دارایی‌های دیجیتال خود را در برابر تهدیدات پیچیده محافظت کنند.
          </p>
          <p className="text-neutral-300 leading-relaxed">
            تمرکز اصلی ما روی ارائه راهکارهای نوین، امنیت حساب‌ها و شبکه‌های اجتماعی، بازیابی پیشرفته اطلاعات، و نصب و بهینه‌سازی سیستم‌های نظارتی با بالاترین استانداردهای جهانی است.
          </p>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-3">
            <h3 className="text-xl font-semibold text-cyan-400">ماموریت ما</h3>
            <p className="text-neutral-300 text-sm leading-relaxed">
              تضمین امنیت فضای دیجیتال مشتریان با ارائه سرویس‌های دقیق، سریع و قابل اعتماد، و ارتقای سطح حفاظتی در دنیای مدرن فناوری.
            </p>
          </div>
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-3">
            <h3 className="text-xl font-semibold text-cyan-400">چشم‌انداز ما</h3>
            <p className="text-neutral-300 text-sm leading-relaxed">
              تبدیل شدن به معتبرترین مرجع ارائه‌دهنده خدمات تخصصی امنیت دیجیتال و هوش مصنوعی با تکیه بر استانداردهای پیشرفته فنی.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

