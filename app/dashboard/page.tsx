'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // بررسی وضعیت ورود قبلی در حافظه مرورگر
  useEffect(() => {
    const auth = sessionStorage.getItem('vorix_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchOrders();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // رمز عبور دلخواه ادمین (می‌توانید این را تغییر دهید)
    if (password === '@Nimaslk1020') {
      sessionStorage.setItem('vorix_admin_auth', 'true');
      setIsAuthenticated(true);
      setError('');
      fetchOrders();
    } else {
      setError('رمز عبور وارد شده اشتباه است.');
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('خطا در دریافت اطلاعات');
    }
    setLoading(false);
  };

  // اگر ادمین هنوز وارد نشده است، صفحه ورود نمایش داده می‌شود
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6" dir="rtl">
        <div className="max-w-md w-full bg-neutral-900/40 border border-neutral-800 p-8 rounded-3xl space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="inline-block bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold px-3 py-1 rounded-full">
              بخش امنیتی VORIX.SECURITY
            </div>
            <h1 className="text-xl font-black text-white">ورود به پنل مدیریت</h1>
            <p className="text-neutral-400 text-xs">برای مشاهده اطلاعات مشتریان رمز عبور را وارد کنید.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-300">رمز عبور مدیریت</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور را وارد کنید..." 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 transition"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-cyan-500/20"
            >
              تایید و ورود به پنل
            </button>
          </form>

          <div className="text-center">
            <Link href="/" className="text-xs text-neutral-500 hover:text-cyan-400 transition">
              ← بازگشت به صفحه اصلی سایت
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // پنل مدیریت پس از ورود موفق
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-12" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* هدر پنل */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-neutral-900 pb-6">
          <div>
            <div className="inline-block bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold px-3 py-1 rounded-full mb-2">
              پنل مدیریت امن VORIX.SECURITY
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">جزئیات کامل درخواست‌های مشتریان</h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { sessionStorage.removeItem('vorix_admin_auth'); setIsAuthenticated(false); }}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl text-xs transition"
            >
              خروج از پنل
            </button>
            <Link 
              href="/" 
              className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 px-4 py-2 rounded-xl text-xs transition"
            >
              سایت اصلی ←
            </Link>
          </div>
        </div>

        {/* لیست کامل اطلاعات */}
        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">کل درخواست‌های ثبت شده: ({orders.length})</h2>
            <button 
              onClick={fetchOrders}
              className="text-xs text-cyan-400 hover:underline bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20"
            >
              {loading ? 'در حال بروزرسانی...' : 'بروزرسانی لیست ⟳'}
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16 text-neutral-500 text-xs">
              هنوز هیچ سفارشی در دیتابیس ثبت نشده است.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-neutral-950 border border-neutral-800/80 rounded-2xl p-5 space-y-4 hover:border-cyan-500/40 transition">
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 border-b border-neutral-900 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs px-2.5 py-1 rounded-lg">
                        #{order.id}
                      </span>
                      <h3 className="text-sm font-bold text-white">{order.name}</h3>
                    </div>
                    <div className="text-xs text-neutral-400 font-mono">
                      تاریخ ثبت: {order.created_at}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1 bg-neutral-900/30 p-3 rounded-xl border border-neutral-900">
                      <span className="text-neutral-500 block">شماره تماس مشتری:</span>
                      <span className="font-mono text-white text-sm font-bold" dir="ltr">{order.phone}</span>
                    </div>
                    <div className="space-y-1 bg-neutral-900/30 p-3 rounded-xl border border-neutral-900">
                      <span className="text-neutral-500 block">خدمت درخواستی:</span>
                      <span className="text-cyan-400 font-bold">{order.service}</span>
                    </div>
                  </div>

                  <div className="space-y-1 bg-neutral-900/30 p-3 rounded-xl border border-neutral-900 text-xs">
                    <span className="text-neutral-500 block mb-1">توضیحات و جزئیات ارسالی از طرف مشتری:</span>
                    <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">{order.description || 'بدون توضیحات تکمیلی'}</p>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
