'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function OrderPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'امنیت و ریکاوری پیج اینستاگرام',
    description: '',
  });

  const [status, setStatus] = useState({ loading: false, message: '', error: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: false });

    try {
      const res = await fetch('/api/send-order/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setStatus({ loading: false, message: 'سفارش شما با موفقیت در دیتابیس ثبت شد و به زودی بررسی می‌گردد.', error: false });
        setFormData({ name: '', phone: '', service: 'امنیت و ریکاوری پیج اینستاگرام', description: '' });
      } else {
        setStatus({ loading: false, message: data.error || 'خطایی در ثبت سفارش رخ داد.', error: true });
      }
    } catch (err) {
      setStatus({ loading: false, message: 'خطا در ارتباط با سرور.', error: true });
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-12" dir="rtl">
      <div className="max-w-2xl mx-auto space-y-8">
        
        <div className="text-center space-y-3">
          <div className="inline-block bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold px-4 py-1.5 rounded-full">
            ثبت سفارش آنلاین VORIX.SECURITY
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white">درخواست خدمات و مشاوره تخصصی</h1>
          <p className="text-neutral-400 text-xs md:text-sm">
            فرم زیر را تکمیل کنید تا اطلاعات مستقیماً برای بررسی و اقدام ثبت شود.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-neutral-900/40 border border-neutral-800/80 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
          
          {status.message && (
            <div className={`p-4 rounded-xl text-xs font-medium ${status.error ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'}`}>
              {status.message}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-300">نام و نام خانوادگی</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="مثال: علی رضایی" 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-300">شماره تماس (موبایل)</label>
            <input 
              type="tel" 
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="09123456789" 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white font-mono focus:outline-none focus:border-cyan-500 transition"
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-300">انتخاب خدمت مورد نظر</label>
            <select 
              value={formData.service}
              onChange={(e) => setFormData({...formData, service: e.target.value})}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 transition"
            >
              <option value="امنیت و ریکاوری پیج اینستاگرام">امنیت و ریکاوری پیج اینستاگرام</option>
              <option value="نصب و بهینه‌سازی دوربین مداربسته">نصب و بهینه‌سازی دوربین مداربسته</option>
              <option value="ریکاوری اطلاعات (هارد، گوشی، دوربین)">ریکاوری اطلاعات (هارد، گوشی، دوربین)</option>
              <option value="راهکارها و برنامه‌نویسی هوش مصنوعی">راهکارها و برنامه‌نویسی هوش مصنوعی</option>
              <option value="سایر خدمات فنی و امنیتی">سایر خدمات فنی و امنیتی</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-300">توضیحات تکمیلی (اختیاری)</label>
            <textarea 
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="جزئیات درخواست خود را بنویسید..." 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 transition resize-none"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={status.loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold py-3.5 rounded-xl text-xs transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            {status.loading ? 'در حال ثبت...' : 'ثبت نهایی و ارسال سفارش'}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-neutral-400 hover:text-cyan-400 transition">
            ← بازگشت به صفحه اصلی
          </Link>
        </div>

      </div>
    </main>
  );
}
