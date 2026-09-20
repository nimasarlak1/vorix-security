'use client';

import { useCallback, useEffect, useState } from 'react';

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

// پاسخ سرور را امن می‌خواند؛ اگر JSON نبود (مثلاً صفحه‌ی خطای ۵۰۰) به‌جای کرش، پیام مناسب می‌دهد
async function callApi(path: string, init?: RequestInit) {
  const res = await fetch(path, { credentials: 'same-origin', cache: 'no-store', ...init });
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { res, data };
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    try {
      const { res, data } = await callApi('/api/admin/orders');
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      if (res.ok && data?.success) {
        setOrders(data.orders);
        if (!silent) setError('');
      } else if (!silent) {
        setError(
          (data?.error || `خطا در دریافت اطلاعات (کد ${res.status}). تنظیمات Cloudflare را بررسی کنید.`) +
            (data?.detail ? ` — جزئیات فنی: ${data.detail}` : '')
        );
      }
    } catch {
      if (!silent) setError('خطا در اتصال به سرور.');
    }
  }, []);

  useEffect(() => {
    load();
    // هر ۴۵ ثانیه سفارش‌های جدید را بی‌صدا بارگیری می‌کند
    const t = setInterval(() => {
      if (document.visibilityState === 'visible') load(true);
    }, 45000);
    return () => clearInterval(t);
  }, [load]);

  async function cycleStatus(order: Order) {
    if (savingId) return;
    const idx = STATUS_CYCLE.indexOf(order.status);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    const prev = order.status;

    setSavingId(order.id);
    setError('');
    setOrders((list) => (list ? list.map((o) => (o.id === order.id ? { ...o, status: next } : o)) : list));

    try {
      const { res, data } = await callApi(`/api/admin/orders/${encodeURIComponent(order.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      if (!res.ok || !data?.success) throw new Error((data?.error || `کد ${res.status}`) + (data?.detail ? ` — ${data.detail}` : ''));
    } catch (e: any) {
      // اگر ذخیره نشد، وضعیت قبلی را برگردان تا چیزی اشتباه نمایش داده نشود
      setOrders((list) => (list ? list.map((o) => (o.id === order.id ? { ...o, status: prev } : o)) : list));
      setError(`تغییر وضعیت ذخیره نشد: ${e?.message || 'خطای ناشناخته'}`);
    } finally {
      setSavingId(null);
    }
  }

  async function logout() {
    try {
      await callApi('/api/admin/logout', { method: 'POST' });
    } finally {
      window.location.href = '/admin/login';
    }
  }

  const waLink = (phone: string) => `https://wa.me/98${phone.replace(/^0/, '')}`;

  return (
    <div style={{ minHeight: '100vh', background: '#05070d', color: '#e6eefc', fontFamily: 'Tahoma, sans-serif' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 12 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>سفارش‌ها</h1>
          <div style={{ display: 'flex', gap: 16 }}>
            <button onClick={() => load()} style={{ fontSize: 13, color: '#22d3ee', background: 'none', border: 'none', cursor: 'pointer' }}>
              بروزرسانی
            </button>
            <button onClick={logout} style={{ fontSize: 13, color: '#f87171', background: 'none', border: 'none', cursor: 'pointer' }}>
              خروج
            </button>
          </div>
        </div>

        <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 16 }}>برای تغییر وضعیت هر سفارش، روی نشان وضعیت آن ضربه بزنید.</p>

        {error && (
          <p role="alert" style={{ color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 10, padding: '10px 12px', marginBottom: 16, fontSize: 13, lineHeight: 1.9 }}>
            {error}
          </p>
        )}
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
                  disabled={savingId === o.id}
                  title="برای تغییر وضعیت ضربه بزنید"
                  style={{
                    alignSelf: 'flex-start',
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '8px 14px',
                    borderRadius: 999,
                    border: `1px solid ${STATUS_COLOR[o.status] || '#9ca3af'}`,
                    color: STATUS_COLOR[o.status] || '#9ca3af',
                    background: 'transparent',
                    cursor: savingId === o.id ? 'default' : 'pointer',
                    opacity: savingId === o.id ? 0.6 : 1,
                  }}
                >
                  {o.status}
                </button>
              </div>
              <p style={{ marginTop: 8, fontSize: 13, color: '#9ca3af' }}>خدمت: {o.service}</p>
              {o.description && <p style={{ marginTop: 4, fontSize: 13, lineHeight: 1.8 }}>{o.description}</p>}
              <div style={{ marginTop: 10, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                <a href={`tel:${o.phone}`} style={{ fontSize: 12, color: '#22d3ee' }}>تماس</a>
                <a href={waLink(o.phone)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#34d399' }}>واتساپ</a>
                <span style={{ fontSize: 11, color: '#6b7280' }}>{new Date(o.created_at).toLocaleString('fa-IR')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
