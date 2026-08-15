'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function OrderPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    service: 'امنیت شبکه و ریکاوری پیج',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // در اینجا اطلاعات به سمت سرور یا سرویس اطلاع‌رسانی شما ارسال می‌شود
      // برای مثال می‌توانید از ربات تلگرام یا وب‌سرویس خود استفاده کنید
      
      // شبیه‌سازی ارسال موفق و ثبت نام خودکار کاربر
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // نکته: برای دریافت پیام در تلگرام، می‌توانید توکن بات و چت‌آیدی خود را در یک API Route قرار دهید.
      
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-12 flex items-center justify-center" dir="rtl">
      <div className="max-w-xl w-full bg-neutral-900/60 backdrop-blur-xl border border-neutral-800/80 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="inline-block bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold px-3 py-1 rounded-full">
            VORIX.SECURITY | ثبت سفارش اختصاصی
          </div>
          <h1 className="text-2xl font-bold text-white">ثبت درخواست کار و مشاوره</h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            مشخصات خود را وارد کنید. با ثبت سفارش، حساب کاربری شما ایجاد شده و جزئیات پروژه مستقیماً برای مدیریت VORIX ارسال می‌شود.
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-cyan-500/10 border border-cyan-500/30 p-6 rounded-2xl text-center space-y-4">
            <div className="text-cyan-400 font-bold text-lg">سفارش شما با موفقیت ثبت شد!</div>
            <p className="text-xs text-neutral-300">
              حساب کاربری شما ایجاد گردید و مشخصات درخواست شما به تیم فنی VORIX.SECURITY در لرستان ارسال شد. به زودی با شما تماس خواهیم گرفت.
            </p>
            <Link 
              href="/" 
              className="inline-block bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold px-6 py-2.5 rounded-xl text-xs transition"
            >
              بازگشت به صفحه اصلی
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">نام و نام خانوادگی</label>
              <input 
                type="text" 
                required 
                placeholder="نام کامل شما"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">شماره تماس (نام کاربری ورود)</label>
              <input 
                type="text" 
                required 
                placeholder="09357781529"
                value={form.phone}
                onChange={(e) => setForm({...form, phone: e.target.value})}
                className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">نوع خدمت مورد نیاز</label>
              <select 
                value={form.service}
                onChange={(e) => setForm({...form, service: e.target.value})}
                className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
              >
                <option value="امنیت شبکه و پیج">امنیت شبکه و ریکاوری پیج اینستاگرام</option>
                <option value="دوربین مداربسته">نصب، تنظیم و افزایش کیفیت دوربین مداربسته</option>
                <option value="ریکاوری اطلاعات">ریکاوری اطلاعات هارد، موبایل و تجهیزات دیجیتال</option>
                <option value="هوش مصنوعی و ارزیابی فایل">ارزیابی فایل‌های مشکوک و راهکارهای هوش مصنوعی</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">شرح کامل پروژه یا مشکل</label>
              <textarea 
                rows={4}
                required
                placeholder="توضیحات در مورد پروژه، نوع دستگاه یا مشکل امنیتی..."
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
                className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-neutral-950 font-bold py-3.5 rounded-xl transition duration-300 shadow-lg shadow-cyan-500/20 text-sm flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                <span className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                'ثبت سفارش و ارسال مشخصات برای مدیریت'
              )}
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-neutral-800/60">
          <Link href="/" className="text-xs text-cyan-400 hover:underline">
            ← بازگشت به صفحه اصلی
          </Link>
        </div>

      </div>
    </main>
  );
}

