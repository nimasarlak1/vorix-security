'use client';

import { useState } from 'react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = '/admin';
      } else {
        setError(data.error || 'ورود ناموفق بود.');
      }
    } catch {
      setError('خطا در اتصال. دوباره امتحان کنید.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '90vh', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#05070d' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 360,
          background: '#0b1220',
          border: '1px solid rgba(34,211,238,0.2)',
          borderRadius: 16,
          padding: 24,
          color: '#e6eefc',
          fontFamily: 'Tahoma, sans-serif',
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>ورود به پنل مدیریت</h1>
        <label style={{ display: 'block', fontSize: 13, color: '#9ca3af', marginBottom: 6 }}>رمز عبور</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '10px 12px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.15)',
            background: '#05070d',
            color: '#e6eefc',
            marginBottom: 12,
            fontSize: 15,
          }}
        />
        {error && <p style={{ color: '#f87171', fontSize: 13, marginBottom: 12 }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 10,
            background: '#22d3ee',
            color: '#03101a',
            fontWeight: 700,
            border: 'none',
            cursor: loading ? 'default' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'در حال ورود...' : 'ورود'}
        </button>
      </form>
    </div>
  );
}
