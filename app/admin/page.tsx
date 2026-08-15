// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.orders || []);
        } else {
          setOrders([
            { id: 1, message: 'درخواست ریکاوری هارد و اطلاعات - استان لرستان', created_at: '۱۴۰۵/۰۵/۲۴' },
            { id: 2, message: 'نصب دوربین مداربسته مجتمع تجاری', created_at: '۱۴۰۵/۰۵/۲۵' }
          ]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setOrders([
          { id: 1, message: 'نمونه سفارش ثبت شده (حالت آفلاین)', created_at: 'امروز' }
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6 md:p-12 pt-36">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-neutral-800 pb-4 gap-4">
          <h1 className="text-xl md:text-3xl font-extrabold text-cyan-400">
            داشبورد مدیریت VORIX.SECURITY
          </h1>
          <span className="text-xs md:text-sm bg-neutral-900 px-4 py-2 rounded-xl border border-neutral-800 text-neutral-300">
            مدیریت سفارشات و درخواست‌ها
          </span>
        </div>

        {loading && (
          <div className="text-center py-20 text-neutral-400 text-lg">
            در حال بارگذاری اطلاعات...
          </div>
        )}

        <div className="overflow-x-auto bg-neutral-900/60 rounded-2xl border border-neutral-800 shadow-2xl">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 text-xs md:text-sm">
                <th className="p-4">شناسه</th>
                <th className="p-4">جزئیات سفارش / پیام</th>
                <th className="p-4">تاریخ ثبت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-xs md:text-sm">
              {orders.map((order: any) => (
                <tr key={order.id || Math.random()} className="hover:bg-neutral-800/40 transition">
                  <td className="p-4 font-mono text-cyan-400">#{order.id || '---'}</td>
                  <td className="p-4 text-neutral-200">{order.message || 'سفارش جدید ثبت شد'}</td>
                  <td className="p-4 text-neutral-400 font-mono text-xs">{order.created_at || 'ثبت شده'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

