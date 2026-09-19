'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    identifier: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // شبیه‌سازی عملیات ارسال داده
    setTimeout(() => {
      setIsLoading(false);
      alert(isLogin ? 'ورود با موفقیت انجام شد.' : 'حساب کاربری جدید با موفقیت ساخته شد.');
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4 sm:p-6" dir="rtl">
      {/* نور پس‌زمینه نئونی */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative max-w-md w-full bg-neutral-900/60 backdrop-blur-xl border border-neutral-800/80 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
        
        {/* لوگو و عنوان */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center group-hover:border-cyan-400 transition">
              <span className="font-black text-cyan-400 text-lg">V</span>
            </div>
            <span className="font-black text-xl tracking-wider text-white">
              VORIX<span className="text-cyan-400">.SECURITY</span>
            </span>
          </Link>
          <p className="text-xs sm:text-sm text-neutral-400">
            {isLogin ? 'ورود به پنل کاربری و خدمات امنیتی' : 'ایجاد حساب کاربری جدید در VORIX'}
          </p>
        </div>

        {/* دکمه‌های جابه‌جایی (ورود / ثبت‌نام) */}
        <div className="flex bg-neutral-950 p-1 rounded-2xl border border-neutral-800">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 ${
              isLogin
                ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            ورود به حساب
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 ${
              !isLogin
                ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            ثبت‌نام جدید
          </button>
        </div>

        {/* فرم اصلی */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                نام و نام خانوادگی
              </label>
              <input
                type="text"
                required
                placeholder="نام کامل شما"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              شماره موبایل یا ایمیل
            </label>
            <input
              type="text"
              required
              placeholder="09357781529"
              value={formData.identifier}
              onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
              className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition text-right"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium text-neutral-300">رمز عبور</label>
              {isLogin && (
                <a href="#" className="text-[11px] text-cyan-400 hover:underline">
                  فراموشی رمز؟
                </a>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition text-right pl-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-cyan-400 transition"
              >
                {showPassword ? 'پنهان' : 'نمایش'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-neutral-950 font-bold py-3.5 rounded-xl transition duration-300 shadow-lg shadow-cyan-500/20 text-sm flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
            ) : isLogin ? (
              'ورود به سامانه'
            ) : (
              'تکمیل ثبت‌نام و ساخت حساب'
            )}
          </button>
        </form>

        {/* پایین فرم */}
        <div className="pt-2 border-t border-neutral-800/60 text-center space-y-3">
          <p className="text-[11px] text-neutral-500">
            با ورود یا ثبت‌نام، تمامی قوانین و ضوابط امنیتی VORIX.SECURITY را می‌پذیرید.
          </p>
          <Link
            href="/"
            className="inline-block text-xs text-cyan-400 hover:text-cyan-300 transition font-medium"
          >
            ← بازگشت به صفحه اصلی
          </Link>
        </div>

      </div>
    </main>
  );
}
