import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-12" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-10">
        
        <div className="text-center space-y-3">
          <div className="inline-block bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold px-4 py-1.5 rounded-full">
            درباره VORIX.SECURITY
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white">پیشرو در امنیت دیجیتال و خدمات مهندسی</h1>
          <p className="text-neutral-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            مجموعه تخصصی VORIX با تمرکز بر امنیت شبکه، بازیابی پیشرفته اطلاعات، سیستم‌های نظارتی و راهکارهای هوش مصنوعی فعالیت می‌کند.
          </p>
        </div>

        <div className="bg-neutral-900/40 border border-neutral-800/80 p-8 rounded-3xl space-y-6 shadow-xl">
          <h2 className="text-xl font-bold text-white border-b border-neutral-800 pb-4">ماموریت و حوزه فعالیت ما</h2>
          <p className="text-sm text-neutral-300 leading-relaxed">
            ما در <span className="text-cyan-400 font-semibold">VORIX.SECURITY</span> با بهره‌گیری از به‌روزترین متدها و تخصص فنی، به کسب‌وکارها و اشخاص کمک می‌کنیم تا دارایی‌های دیجیتال خود را ایمن نگه دارند. فعالیت‌های اصلی ما شامل ارزیابی امنیت فایل‌ها و شبکه‌ها، ریکاوری تخصصی پیج‌های اینستاگرام و تجهیزات دیجیتال، و نصب و بهینه‌سازی سیستم‌های مداربسته است.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-neutral-950/60 border border-neutral-800/60 p-4 rounded-2xl space-y-1">
              <div className="font-bold text-white text-sm">موقعیت فعالیت</div>
              <div className="text-xs text-neutral-400">استان لرستان و پشتیبانی آنلاین سراسری</div>
            </div>
            <div className="bg-neutral-950/60 border border-neutral-800/60 p-4 rounded-2xl space-y-1">
              <div className="font-bold text-white text-sm">تخصص اصلی</div>
              <div className="text-xs text-neutral-400">امنیت سایبری، ریکاوری و نظارت تصویری</div>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link href="/" className="text-xs text-cyan-400 hover:underline">
            ← بازگشت به صفحه اصلی
          </Link>
        </div>

      </div>
    </main>
  );
}
