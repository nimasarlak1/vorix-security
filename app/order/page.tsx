'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function OrderPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'امنیت سایبری و ریکاوری',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setFormData({ name: '', phone: '', service: 'امنیت سایبری و ریکاوری', description: '' });
      } else {
        setError(data.message || 'خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.');
      }
    } catch (err) {
      setError('خطا در ارتباط با سرور.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-12 flex items-center justify-center" dir="rtl">
      <div className="max-w-xl w-full bg-neutral-900/60 backdrop-blur-xl border border-neutral-800/80 p-8 rounded-3xl shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="inline-block bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold px-3 py-1 rounded-full">
            VORIX.SECURITY
          </div>
          <h1 className="text-2xl font-bold text-white">ثبت سفارش و درخواست مشاوره</h1>
          <p className="text-xs text-neutral-400">اطلاعات خود را وارد کنید تا در سریع‌ترین زمان با شما تماس بگیریم.</p>
        </div>

        {success ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-6 rounded-2xl text-center space-y-3">
            <div className="font-bold text-sm">سفارش شما با موفقیت ثبت شد!</div>
            <p className="text-xs text-neutral-300">پیام شما مستقیماً برای مدیریت ارسال شد. به زودی با شما ارتباط خواهیم گرفت.</p>
            <button 
              onClick={() => setSuccess(false)}
              className="mt-2 bg-emerald-500 text-neutral-950 font-bold text-xs px-4 py-2 rounded-xl transition hover:bg-emerald-400"
            >
              ثبت سفارش جدید
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">نام و نام خانوادگی</label>
              <input 
                type="text" 
                required
                placeholder="مثال: علی رضایی"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">شماره تماس (موبایل)</label>
              <input 
                type="tel" 
                required
                placeholder="09123456789"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition text-left"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">انتخاب خدمت مورد نظر</label>
              <select 
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
              >
                <option value="امنیت سایبری و ارزیابی فایل">امنیت سایبری و ارزیابی فایل</option>
                <option value="ریکاوری پیج اینستاگرام">ریکاوری پیج اینستاگرام</option>
                <option value="نصب و بهینه‌سازی دوربین مداربسته">نصب و بهینه‌سازی دوربین مداربسته</option>
                <option value="بازیابی اطلاعات (هارد و گوشی)">بازیابی اطلاعات (هارد و گوشی)</option>
                <option value="مشاوره هوش مصنوعی و سئو">مشاوره هوش مصنوعی و سئو</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">توضیحات یا شرح پروژه</label>
              <textarea 
                rows={3}
                placeholder="جزئیات درخواست خود را بنویسید..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition resize-none"
              />
            </div>

            {error && (
              <div className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/30 py-2 rounded-xl">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold py-3.5 rounded-xl transition duration-300 shadow-lg shadow-cyan-500/20 text-sm disabled:opacity-50"
            >
              {loading ? 'در حال ارسال اطلاعات...' : 'ثبت نهایی سفارش'}
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-neutral-800/60">
          <Link href="/" className="text-xs text-cyan-400 hover:underline">
            ← بازگشت به صفحه اصلی سایت
          </Link>
        </div>

      </div>
    </main>
  );
}
