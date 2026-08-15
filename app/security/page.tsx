import React from 'react';
import Link from 'next/link';

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-12" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-block bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold px-4 py-1.5 rounded-full">
            خدمات تخصصی VORIX.SECURITY
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white">راهکارهای پیشرفته امنیت و مهندسی</h1>
          <p className="text-neutral-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            با بهره‌گیری از به‌روزترین ابزارها و تخصص فنی در استان لرستان، از دارایی‌های دیجیتال و تجهیزات شما محافظت می‌کنیم.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-neutral-900/50 border border-neutral-800/80 p-8 rounded-3xl space-y-4 hover:border-cyan-500/50 transition group shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xl font-black group-hover:scale-110 transition">
              01
            </div>
            <h3 className="text-xl font-bold text-white">امنیت شبکه و ریکاوری پیج اینستاگرام</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              ارزیابی ایمن فایل‌های مشکوک دریافتی، ردیابی منشأ بدافزارها و بازیابی فوق‌العاده تخصصی اکانت‌های از دست رفته با پروتکل‌های حفاظتی.
            </p>
            <div className="pt-2">
              <Link href="/order" className="inline-block bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-neutral-950 font-bold px-5 py-2.5 rounded-xl text-xs transition">
                ثبت سفارش این خدمت
              </Link>
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800/80 p-8 rounded-3xl space-y-4 hover:border-cyan-500/50 transition group shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xl font-black group-hover:scale-110 transition">
              02
            </div>
            <h3 className="text-xl font-bold text-white">دوربین مداربسته و ارتقای کیفیت تصویر</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              طراحی، نصب و جانمایی ایمن سیستم‌های نظارتی همراه با بررسی و افزایش کیفیت فیلم‌های دوربین مداربسته با استانداردهای رمزنگاری.
            </p>
            <div className="pt-2">
              <Link href="/order" className="inline-block bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-neutral-950 font-bold px-5 py-2.5 rounded-xl text-xs transition">
                ثبت سفارش این خدمت
              </Link>
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800/80 p-8 rounded-3xl space-y-4 hover:border-cyan-500/50 transition group shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xl font-black group-hover:scale-110 transition">
              03
            </div>
            <h3 className="text-xl font-bold text-white">ریکاوری پیشرفته اطلاعات دیجیتال</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              بازیابی امن اطلاعات حذف‌شده از روی انواع گوشی‌های هوشمند، هارد اکسترنال، دوربین و تجهیزات دیجیتال با حفظ محرمانگی داده‌ها.
            </p>
            <div className="pt-2">
              <Link href="/order" className="inline-block bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-neutral-950 font-bold px-5 py-2.5 rounded-xl text-xs transition">
                ثبت سفارش این خدمت
              </Link>
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800/80 p-8 rounded-3xl space-y-4 hover:border-cyan-500/50 transition group shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xl font-black group-hover:scale-110 transition">
              04
            </div>
            <h3 className="text-xl font-bold text-white">راهکارهای هوش مصنوعی و اتوماسیون</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              طراحی و پیاده‌سازی ابزارهای هوش مصنوعی امن، پرامپت‌های سینمایی و ساخت وب‌سایت‌های مدرن شرکتی مقاوم در برابر نفوذ.
            </p>
            <div className="pt-2">
              <Link href="/order" className="inline-block bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-neutral-950 font-bold px-5 py-2.5 rounded-xl text-xs transition">
                ثبت سفارش این خدمت
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center pt-6">
          <Link href="/" className="text-xs text-cyan-400 hover:underline">
            ← بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </main>
  );
}
