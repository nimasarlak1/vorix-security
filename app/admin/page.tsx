'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { 'x-admin-password': password }
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        // اینجا دقیقاً همون چیزی که از سرور میاد رو میذاریم، بدون هیچ داده فیک یا هاردکدی!
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
        <form onSubmit={handleLogin} className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 w-full max-w-md shadow-2xl">
          <h1 className="text-xl font-bold text-cyan-400 mb-2">ورود به پنل مدیریت</h1>
          <p className="text-neutral-400 text-sm mb-6">VORIX.SECURITY - دسترسی ادمین</p>
          <input 
            type="password" 
            placeholder="رمز عبور مدیریت..." 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white mb-4 focus:outline-none focus:border-cyan-400"
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-cyan-400 hover:bg-cyan-500 text-neutral-950 font-bold py-3 rounded-xl transition-all"
          >
            {loading ? 'در حال بررسی...' : 'ورود به داشبورد'}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6 md:p-10" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-neutral-800 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-cyan-400">داشبورد مدیریت VORIX.SECURITY</h1>
            <p className="text-neutral-400 text-sm mt-1">مدیریت سفارش‌ها و درخواست‌های کاربران</p>
          </div>
          <button 
            onClick={() => setAuthed(false)}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl text-sm transition-all"
          >
            خروج از حساب
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-neutral-900/80 p-12 rounded-2xl border border-neutral-800 text-center text-neutral-400">
            هیچ سفارشی در دیتابیس ثبت نشده است.
          </div>
        ) : (
          <div className="overflow-x-auto bg-neutral-900/60 rounded-2xl border border-neutral-800 shadow-xl">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 text-sm">
                  <th className="p-4">شناسه</th>
                  <th className="p-4">نام مشتری</th>
                  <th className="p-4">شماره تماس</th>
                  <th className="p-4">نوع خدمت</th>
                  <th className="p-4">توضیحات</th>
                  <th className="p-4">وضعیت</th>
                  <th className="p-4">تاریخ ثبت</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord: any) => (
                  <tr key={ord.id || ord.name} className="border-b border-neutral-900/80 hover:bg-neutral-900 transition-all">
                    <td className="p-4 font-mono text-cyan-400">#{ord.id || '---'}</td>
                    <td className="p-4 font-semibold">{ord.name}</td>
                    <td className="p-4 font-mono text-neutral-300" dir="ltr">{ord.phone}</td>
                    <td className="p-4 text-cyan-300">{ord.service}</td>
                    <td className="p-4 text-neutral-300 max-w-xs truncate">{ord.message || ord.description}</td>
                    <td className="p-4 text-cyan-400">{ord.status || 'در حال بررسی'}</td>
                    <td className="p-4 text-neutral-500 text-xs font-mono">{ord.created_at || 'ثبت شده'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
