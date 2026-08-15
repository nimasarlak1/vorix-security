import React from 'react';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 py-20 px-6" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-cyan-400">ارتباط با Vorix Security</h1>
          <p className="text-neutral-400 text-lg">
            برای مشاوره تخصصی، ثبت سفارش یا پیگیری خدمات با ما در ارتباط باشید
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Phone / WhatsApp */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8 space-y-4 shadow-xl">
            <h3 className="text-xl font-semibold text-cyan-400">تماس مستقیم و واتساپ</h3>
            <p className="text-neutral-300 text-sm leading-relaxed">
              جهت هماهنگی فوری و مشاوره خدمات امنیت دیجیتال و ریکاوری:
            </p>
            <div className="pt-2">
              <a 
                href="tel:09357781529" 
                className="inline-block bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-semibold px-6 py-3 rounded-xl transition duration-300"
              >
                ۰۹۳۵۷۷۸۱۵۲۹
              </a>
            </div>
          </div>

          {/* Location / Info */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8 space-y-4 shadow-xl">
            <h3 className="text-xl font-semibold text-cyan-400">موقعیت و خدمات حضوری</h3>
            <p className="text-neutral-300 text-sm leading-relaxed">
              ارائه خدمات تخصصی در استان لرستان و پشتیبانی آنلاین سراسری.
            </p>
            <div className="pt-2 text-neutral-200 font-medium">
              موقعیت: <span className="text-cyan-400">ایران، لرستان</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

