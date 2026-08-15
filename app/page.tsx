import React from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-12" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* هدر داشبورد */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-800 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">داشبورد مدیریت و امنیت</h1>
            <p className="text-neutral-400 text-sm mt-1">پنل کنترل اختصاصی خدمات VORIX.SECURITY</p>
          </div>
          <Link 
            href="/" 
            className="bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-200 px-4 py-2 rounded-xl text-sm transition duration-300"
          >
            بازگشت به سایت
          </Link>
        </div>

        {/* کارت‌های آمار و وضعیت */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl shadow-lg">
            <div className="text-neutral-400 text-sm">وضعیت سامانه امنیتی</div>
            <div className="text-2xl font-bold text-cyan-400 mt-2">فعال و ایمن</div>
            <div className="text-xs text-neutral-500 mt-1">بدون تهدید فعال در شبکه</div>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl shadow-lg">
            <div className="text-neutral-400 text-sm">درخواست‌های ثبت‌شده</div>
            <div className="text-2xl font-bold text-white mt-2">۳ مورد فعال</div>
            <div className="text-xs text-cyan-400 mt-1">در حال پردازش و بررسی</div>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl shadow-lg">
            <div className="text-neutral-400 text-sm">پشتیبانی استان لرستان</div>
            <div className="text-2xl font-bold text-emerald-400 mt-2">آنلاین</div>
            <div className="text-xs text-neutral-500 mt-1">آماده ارائه خدمات حضوری و غیرحضوری</div>
          </div>
        </div>

        {/* بخش مدیریت خدمات */}
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-lg">
          <h2 className="text-lg font-semibold text-white">مدیریت سریع خدمات VORIX</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-1">
              <div className="font-medium text-cyan-400 text-sm">ارزیابی فایل و امنیت اکانت</div>
              <p className="text-xs text-neutral-400 leading-relaxed">بررسی فایل‌های مشکوک دریافتی و بازیابی پیج‌های از دست رفته اینستاگرام.</p>
            </div>

            <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-1">
              <div className="font-medium text-cyan-400 text-sm">دوربین مداربسته و ریکاوری</div>
              <p className="text-xs text-neutral-400 leading-relaxed">تنظیمات تخصصی دوربین، افزایش کیفیت فیلم‌ها و بازیابی اطلاعات هارد و موبایل.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}import React from 'react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6" dir="rtl">
      <div className="max-w-md w-full bg-neutral-900/50 border border-neutral-800 p-8 rounded-3xl space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-block bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            VORIX.SECURITY
          </div>
          <h1 className="text-2xl font-bold text-white">ورود یا ثبت‌نام</h1>
          <p className="text-sm text-neutral-400">برای دسترسی به پنل مدیریت خدمات وارد شوید</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">شماره موبایل یا ایمیل</label>
            <input 
              type="text" 
              placeholder="09357781529" 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">رمز عبور</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold py-3 rounded-xl transition duration-300 shadow-lg shadow-cyan-500/20 text-sm"
          >
            تایید و ورود به سامانه
          </button>
        </form>

        <div className="text-center text-xs text-neutral-500 pt-2">
          ثبت‌نام به صورت خودکار با ورود اطلاعات معتبر انجام می‌شود.
        </div>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-cyan-400 hover:underline">
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </main>
  );
}

