import React from 'react';
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
