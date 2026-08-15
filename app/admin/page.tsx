// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);

  const [orders, setOrders] = useState([
    {
      id: 1,
      name: 'رضا مرادی',
      phone: '09161234567',
      service: 'ریکاوری اطلاعات هارد',
      status: 'در حال بررسی',
      created_at: '۱۴۰۵/۰۵/۲۴',
      message: 'هارد اکسترنال فرمت شده و اطلاعات کاری مهم روی آن بوده است.'
    }
  ]);

  useEffect(() => {
    const auth = sessionStorage.getItem('vorix_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingLogin(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('vorix_admin_auth', 'true');
      } else {
        setLoginError(data.error || 'رمز عبور اشتباه است!');
      }
    } catch (err) {
      setLoginError('خطا در ارتباط با سرور. لطفاً مطمئن شوید فایل API روی گیت‌هاب قرار گرفته است.');
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('vorix_admin_auth');
    setPasswordInput('');
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
        <div className="bg-neutral-900/80 border border-neutral-800 p-8 rounded-2xl max-w-md w-full shadow-2xl">
          <h1 className="text-2xl font-extrabold text-cyan-400 mb-2 text-center">ورود به پنل مدیریت</h1>
          <p className="text-neutral-400 text-xs text-center mb-6">VORIX.SECURITY - دسترسی امنیتی محدود</p>

          <div className="bg-amber-950/40 border border-amber-800/60 p-3.5 rounded-xl mb-6 flex items-start gap-3">
            <span className="text-amber-400 text-base">⚠️</span>
            <div className="text-xs leading-relaxed text-amber-200">
              <strong className="block font-bold mb-0.5 text-amber-300">هشدار امنیتی سیستم:</strong>
              این بخش کاملاً اختصاصی و محافظت‌شده است. تلاش‌های غیرمجاز برای ورود مانیتور و لاگ خواهند شد.
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-2">رمز عبور مدیریت</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="رمز عبور را وارد کنید..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 text-sm"
                required
              />
            </div>

            {loginError && (
              <p className="text-red-400 text-xs text-center bg-red-950/40 p-2 rounded-lg border border-red-900">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loadingLogin}
              className="w-full bg-cyan-400 hover:bg-cyan-500 text-neutral-950 font-bold py-3 rounded-xl transition shadow-lg shadow-cyan-500/20 text-sm disabled:opacity-50"
            >
              {loadingLogin ? 'در حال بررسی...' : 'ورود به داشبورد'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-xs text-neutral-500 hover:text-cyan-400 transition">
              ← بازگشت به صفحه اصلی سایت
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-4 md:p-12 pt-36">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-neutral-800 pb-4 gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-extrabold text-cyan-400">
              داشبورد مدیریت VORIX.SECURITY
            </h1>
            <p className="text-neutral-400 text-xs mt-1">مدیریت کامل درخواست‌ها، سفارشات و اطلاعات کاربران</p>
          </div>
          
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-xs bg-neutral-900 px-4 py-2.5 rounded-xl border border-neutral-800 text-neutral-300 hover:text-cyan-400 transition"
            >
              مشاهده سایت
            </a>
            <button
              onClick={handleLogout}
              className="text-xs bg-red-950/40 hover:bg-red-900/60 text-red-300 px-4 py-2.5 rounded-xl border border-red-900 transition"
            >
              خروج از حساب
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-neutral-900/60 rounded-2xl border border-neutral-800 shadow-2xl">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 text-xs md:text-sm">
                <th className="p-4">شناسه</th>
                <th className="p-4">نام مشتری</th>
                <th className="p-4">شماره تماس</th>
                <th className="p-4">نوع خدمت</th>
                <th className="p-4">وضعیت</th>
                <th className="p-4">توضیحات</th>
                <th className="p-4">تاریخ ثبت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-xs md:text-sm">
              {orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-neutral-800/40 transition">
                  <td className="p-4 font-mono text-cyan-400">#{order.id}</td>
                  <td className="p-4 font-bold text-neutral-100">{order.name}</td>
                  <td className="p-4 font-mono text-neutral-300">{order.phone}</td>
                  <td className="p-4 text-cyan-300">{order.service}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs bg-amber-950/60 text-amber-400 border border-amber-800">
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-neutral-300 max-w-xs truncate">{order.message}</td>
                  <td className="p-4 text-neutral-400 font-mono text-xs">{order.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
