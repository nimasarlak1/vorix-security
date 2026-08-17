'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);

  // تابع گرفتن لیست سفارش‌ها
  const fetchOrders = async () => {
    const res = await fetch('/api/admin/orders', {
      headers: { 'x-admin-password': password }
    });
    const data = await res.json();
    if (data.success) setOrders(data.orders);
  };

  // تابع تغییر وضعیت به "بررسی شد"
  const updateStatus = async (orderId: any) => {
    const res = await fetch('/api/admin/orders', {
      method: 'POST',
      headers: { 
        'x-admin-password': password,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orderId, newStatus: 'بررسی شد' })
    });
    if (res.ok) fetchOrders(); // بعد از آپدیت، لیست رو رفرش می‌کنیم
  };

  if (!authed) {
    return (
      <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
        <form onSubmit={(e) => { e.preventDefault(); fetchOrders().then(() => setAuthed(true)); }} className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 w-full max-w-md">
          <h1 className="text-xl font-bold text-cyan-400 mb-4">ورود به مدیریت</h1>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white mb-4" placeholder="رمز عبور..." required />
          <button className="w-full bg-cyan-400 text-neutral-950 font-bold py-3 rounded-xl">ورود</button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6" dir="rtl">
      <table className="w-full text-right border-collapse bg-neutral-900 rounded-xl overflow-hidden">
        <thead><tr className="border-b border-neutral-800 text-neutral-400 text-sm"><th className="p-4">شناسه</th><th className="p-4">نام</th><th className="p-4">وضعیت</th></tr></thead>
        <tbody>
          {orders.map((ord: any) => (
            <tr key={ord.id} className="border-b border-neutral-800">
              <td className="p-4 text-cyan-400">#{ord.id}</td>
              <td className="p-4">{ord.name}</td>
              <td className="p-4">
                <button 
                  onClick={() => updateStatus(ord.id)}
                  className={`px-3 py-1 rounded-lg text-xs ${ord.status === 'بررسی شد' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}
                >
                  {ord.status || 'در حال بررسی'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
