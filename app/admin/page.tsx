'use client';

import React, { useState } from 'react';

export default function AdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async (currentPassword: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { 'x-admin-password': currentPassword },
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('خطا در دریافت اطلاعات');
    }
  };

  const updateStatus = async (orderId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'در حال بررسی' ? 'تایید و انجام شد' : 'در حال بررسی';
    
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: {
          'x-admin-password': password,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (res.ok) {
        fetchOrders(password);
      }
    } catch (err) {
      console.error('خطا در بروزرسانی وضعیت');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { 'x-admin-password': password },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(data.orders || []);
        setAuthed(true);
      } else {
        alert(data.error || 'رمز عبور اشتباه است');
      }
    } catch (err) {
      alert('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  if (!authed) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4" dir="rtl">
        <form onSubmit={handleLogin} className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl w-full max-w-sm space-y-4 shadow-2xl">
          <h1 className="text-xl font-bold text-cyan-400 text-center">ورود به پنل مدیریت</h1>
          <p className="text-neutral-400 text-xs text-center">VORIX.SECURITY - دسترسی امن</p>
          <input
            type="password"
            placeholder="رمز عبور مدیریت"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-400 hover:bg-cyan-500 text-neutral-950 font-bold py-3 rounded-xl text-xs transition disabled:opacity-50"
          >
            {loading ? 'در حال بررسی...' : 'ورود به داشبورد'}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-10" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl">
          <div>
            <h1 className="text-2xl font-extrabold text-cyan-400">داشبورد مدیریت VORIX.SECURITY</h1>
            <p className="text-neutral-400 text-xs mt-1">مدیریت سفارش‌ها و درخواست‌های کاربران</p>
          </div>
          <button
            onClick={() => setAuthed(false)}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl text-xs font-bold transition"
          >
            خروج از حساب
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 p-12 rounded-2xl text-center text-neutral-400 text-xs">
            هیچ سفارشی در دیتابیس ثبت نشده است.
          </div>
        ) : (
          <div className="overflow-x-auto bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 text-xs">
                  <th className="p-4">کد</th>
                  <th className="p-4">نام مشتری</th>
                  <th className="p-4">شماره تماس</th>
                  <th className="p-4">نوع خدمت</th>
                  <th className="p-4">توضیحات</th>
                  <th className="p-4">وضعیت</th>
                  <th className="p-4">تاریخ ثبت</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord: any, index: number) => {
                  const orderData = ord.data || ord;
                  const currentStatus = ord.status || 'در حال بررسی';
                  const isChecked = currentStatus === 'تایید و انجام شد';

                  return (
                    <tr key={ord.id || index} className="border-b border-neutral-800/60 hover:bg-neutral-850 transition text-xs">
                      <td className="p-4 text-cyan-400 font-mono">{index + 1}</td>
                      <td className="p-4 font-semibold text-white">{orderData.name || '---'}</td>
                      <td className="p-4 font-mono text-neutral-300" dir="ltr">{orderData.phone || '---'}</td>
                      <td className="p-4 text-cyan-300">{orderData.service || '---'}</td>
                      <td className="p-4 text-neutral-300 max-w-xs truncate">{orderData.description || 'بدون توضیحات'}</td>
                      <td className="p-4">
                        <button
                          onClick={() => updateStatus(ord.id, currentStatus)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                            isChecked
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                          }`}
                        >
                          {currentStatus}
                        </button>
                      </td>
                      <td className="p-4 text-neutral-500 text-xs font-mono">
                        {new Date(ord.created_at || Date.now()).toLocaleString('fa-IR')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
