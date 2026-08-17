'use client';

import React, { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const service = formData.get('service');
    const details = formData.get('details');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, service, details })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert('سفارش شما با موفقیت ثبت شد و به ادمین ارسال گردید!');
        (e.target as HTMLFormElement).reset();
      } else {
        alert('خطا در ثبت سفارش: ' + (data.error || 'لطفاً دوباره تلاش کنید'));
      }
    } catch (err) {
      alert('خطا در ارتباط با سرور. لطفاً اینترنت خود را بررسی کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-cyan-500 selection:text-neutral-950" dir="rtl">
      {/* بخش هیرو (بالای صفحه) */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pt-40 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.12),_transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center space-y-6">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-loose">
            حفاظت از دارایی‌های دیجیتال با <br />
            <span className="text-cyan-400 drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]">
              VORIX.SECURITY
            </span>
          </h1>
          <p className="text-neutral-300 text-xs sm:text-sm md:text-lg max-w-2xl leading-relaxed px-2">
            ریکاوری پیشرفته اطلاعات، نصب و بهینه‌سازی دوربین‌های مداربسته و راهکارهای هوش مصنوعی در استان لرستان و پشتیبانی آنلاین
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-6 w-full justify-center px-4">
            <a
              href="#contact"
              className="bg-cyan-400 hover:bg-cyan-500 text-neutral-950 font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 text-center"
            >
              درخواست مشاوره و ثبت سفارش
            </a>
            <a
              href="#services"
              className="bg-neutral-900/95 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 font-semibold px-6 py-3.5 rounded-xl transition-all text-center"
            >
              مشاهده خدمات تخصصی
            </a>
          </div>
        </div>
      </section>

      {/* بخش خدمات تخصصی */}
      <section id="services" className="py-24 px-4 bg-neutral-900/40 border-t border-neutral-800/60 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-extrabold text-cyan-400 mb-4">خدمات تخصصی VORIX</h2>
            <p className="text-neutral-400 text-sm md:text-base">ارائه راهکارهای امنیت دیجیتال و فناوری در استان لرستان</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800 hover:border-cyan-500/50 transition-all">
              <h3 className="text-xl font-bold mb-2 text-cyan-400">01 / ریکاوری پیشرفته اطلاعات</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">ریکاوری گوشی، هارد، دوربین و تجهیزات دیجیتال با بالاترین ضریب موفقیت.</p>
            </div>
            <div className="bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800 hover:border-cyan-500/50 transition-all">
              <h3 className="text-xl font-bold mb-2 text-cyan-400">02 / دوربین‌های مداربسته</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">مکانیابی حرفه‌ای و افزایش کیفیت و بررسی فیلم‌های دوربین مداربسته.</p>
            </div>
            <div className="bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800 hover:border-cyan-500/50 transition-all">
              <h3 className="text-xl font-bold mb-2 text-cyan-400">03 / امنیت و راهکارهای هوش مصنوعی</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">امنیت، ریکاوری پیج‌های از دست رفته و راهکارهای نوین هوش مصنوعی.</p>
            </div>
          </div>
        </div>
      </section>

      {/* بخش ثبت سفارش و ارتباط با ما */}
      <section id="contact" className="py-24 px-4 border-t border-neutral-850/60 scroll-mt-20">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-extrabold text-cyan-400 mb-4">ثبت سفارش و ارتباط با ما</h2>
          <p className="text-neutral-400 text-sm md:text-base mb-10">برای دریافت مشاوره یا ثبت درخواست خدمات، فرم زیر را پر کنید:</p>

          <form onSubmit={handleSubmit} className="bg-neutral-900/90 p-8 rounded-3xl border border-neutral-800 shadow-2xl flex flex-col gap-5 text-right">
            <div>
              <label className="block text-sm text-neutral-300 mb-2">نام و نام خانوادگی:</label>
              <input 
                type="text" 
                name="name" 
                required 
                placeholder="مثلاً: علی رضایی" 
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-300 mb-2">شماره تماس:</label>
              <input 
                type="tel" 
                name="phone" 
                required 
                placeholder="0916XXXXXXX" 
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all text-left"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-300 mb-2">انتخاب خدمت:</label>
              <select 
                name="service" 
                required 
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all"
              >
                <option value="">یک خدمت را انتخاب کنید...</option>
                <option value="ریکاوری اطلاعات هارد">ریکاوری اطلاعات هارد و گوشی</option>
                <option value="نصب دوربین مداربسته">نصب و تنظیم دوربین مداربسته</option>
                <option value="امنیت پیج و شبکه">امنیت پیج و شبکه / OSINT</option>
                <option value="سایر خدمات دیجیتال">سایر خدمات دیجیتال</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-neutral-300 mb-2">توضیحات درخواست:</label>
              <textarea 
                name="details" 
                rows={4}
                placeholder="توضیحات کامل درباره مشکل یا سفارش خود را بنویسید..." 
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-cyan-400 hover:bg-cyan-500 text-neutral-950 font-bold py-4 rounded-xl transition-all shadow-lg shadow-cyan-500/20 mt-2 disabled:opacity-50"
            >
              {loading ? 'در حال ثبت سفارش...' : 'ثبت نهایی سفارش'}
            </button>
          </form>

          <div className="mt-8 text-neutral-400 text-sm">
            شماره پشتیبانی مستقیم: <a href="tel:09357781529" className="text-cyan-400 font-mono font-bold hover:underline">09357781529</a>
          </div>
        </div>
      </section>
    </main>
  );
}
