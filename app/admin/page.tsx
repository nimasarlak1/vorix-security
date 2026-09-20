'use client';

import { useEffect, useState } from 'react';

type Order = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  service: string;
  description: string;
  status: string;
};

const STATUS_CYCLE = ['جدید', 'در حال بررسی', 'انجام شد', 'لغو شد'];

const STATUS_COLOR: Record<string, string> = {
  'جدید': '#22d3ee',
  'در حال بررسی': '#fbbf24',
  'انجام شد': '#34d399',
  'لغو شد': '#f87171',
};

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState('');

  async function load() {
    try {
      const res = await fetch('/api/admin/orders', { cache: 'no-store' });
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json();
      if (data.success) setOrders(data.orders);
      else setError(data.error || 'خطا در دریافت اطلاعات.');
    } catch {
      setError('خطا در اتصال.');
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function cycleStatus(order: Order) {
    const idx = STATUS_CYCLE.indexOf(order.status);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    setOrders((prev) => (prev ? prev.map((o) => (o.id === order.id ? { ...o, status: next } : o)) : prev));
    try {
      await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
    } catch {
      load();
    }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  return (
    <div style={{ minHeight: '100vh', background: '#05070d', color: '#e6eefc', fontFamily: 'Tahoma, sans-serif' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>سفارش‌ها</h1>
          <button onClick={logout} style={{ fontSize: 13, color: '#f87171', background: 'none', border: 'none', cursor: 'pointer' }}>
            خروج
          </button>
        </div>

        <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 16 }}>برای تغییر وضعیت هر سفارش، روی نشان وضعیت آن ضربه بزنید.</p>

        {error && <p style={{ color: '#f87171' }}>{error}</p>}
        {!orders && !error && <p style={{ color: '#9ca3af' }}>در حال بارگذاری...</p>}
        {orders && orders.length === 0 && <p style={{ color: '#9ca3af' }}>هنوز سفارشی ثبت نشده.</p>}

        <div style={{ display: 'grid', gap: 12 }}>
          {orders?.map((o) => (
            <div key={o.id} style={{ background: '#0b1220', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <p style={{ fontWeight: 700 }}>{o.name}</p>
                  <p style={{ fontSize: 13, color: '#9ca3af', direction: 'ltr', textAlign: 'right' }}>{o.phone}</p>
                </div>
                <button
                  onClick={() => cycleStatus(o)}
                  title="برای تغییر وضعیت ضربه بزنید"
                  style={{
                    alignSelf: 'flex-start',
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '6px 12px',
                    borderRadius: 999,
                    border: `1px solid ${STATUS_COLOR[o.status] || '#9ca3af'}`,
                    color: STATUS_COLOR[o.status] || '#9ca3af',
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  {o.status}
                </button>
              </div>
              <p style={{ marginTop: 8, fontSize: 13, color: '#9ca3af' }}>خدمت: {o.service}</p>
              {o.description && <p style={{ marginTop: 4, fontSize: 13, lineHeight: 1.8 }}>{o.description}</p>}
              <p style={{ marginTop: 8, fontSize: 11, color: '#6b7280' }}>{new Date(o.created_at).toLocaleString('fa-IR')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
