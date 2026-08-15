
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      localStorage.setItem('vorix_admin_auth', 'true');
      router.push('/dashboard');
    } else {
      setError(true);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-neutral-900 p-8 rounded-3xl space-y-4">
        <h1 className="text-white text-xl font-bold text-center">ورود مدیریت</h1>
        <input 
          type="text" placeholder="نام کاربری" required
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white"
        />
        <input 
          type="password" placeholder="رمز عبور" required
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white"
        />
        {error && <p className="text-red-400 text-xs text-center">اطلاعات نادرست است</p>}
        <button disabled={loading} className="w-full bg-cyan-500 py-3 rounded-xl font-bold">
          {loading ? 'در حال بررسی...' : 'ورود'}
        </button>
      </form>
    </main>
  );
}
