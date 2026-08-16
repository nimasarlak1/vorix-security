// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // بررسی وضعیت ورود از جلسه قبلی مرورگر
  useEffect(() => {
    const auth = sessionStorage.getItem('vorix_admin_auth');
    const savedPass = sessionStorage.getItem('vorix_admin_pass');
    if (auth === 'true' && savedPass) {
      setIsAuthenticated(true);
      fetchOrders(savedPass);
    }
  }, []);

  // دریافت لیست سفارش‌ها از سرور با ارسال رمز عبور در هدر امن
  const fetchOrders = async (password: string) => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/admin/orders', {
        headers: {
          'x-admin-password': password
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(data.orders || []);
      } else {
        // اگر رمز منقضی یا اشتباه شد، خارج شود
        handleLogout();
      }
    } catch (err) {
      console.error('خطا در دریافت سفارش‌ها');
    } finally {
      setLoadingOrders(false);
    }
  };

  // عملیات ورود ادمین
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingLogin(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/orders', {
        headers: {
          'x-admin-password': passwordInput
        }
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('vorix_admin_auth', 'true');
        sessionStorage.setItem('vorix_admin_pass', passwordInput);
        fetchOrders(passwordInput);
      } else {
        setLoginError('رمز عبور مدیریت اشتباه است!');
      }
    } catch (err) {
      setLoginError('خطا در ارتباط با سرور.');
    } finally {
      setLoadingLogin(false);
    }
  };

  // خروج امن از حساب
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('vorix_admin_auth');
    sessionStorage.removeItem('vorix_admin_pass');
    setPasswordInput('');
  };

  // تغییر وضعیت سفارش به صورت زنده و امن
  const toggleOrderStatus = async (orderId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'در حال بررسی' ? 'بررسی شد' : 'در حال بررسی';
    const password = sessionStorage.getItem('vorix_admin_pass');

    if (!password) {
      handleLogout();
      return;
    }

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password
        },
        body: JSON.stringify({ orderId, newStatus })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // به‌روزرسانی سریع وضعیت در جدول بدون نیاز به رفرش صفحه
        setOrders(orders.map((o: any) => o.id === orderId ? { ...o, status: newStatus } : o));
      } else {
        alert(data.error || 'خطا در تغییر وضعیت');
      }
    } catch (err) {
      alert('خطا در ارتباط با سرور');
    }
  };

  // نمای صفحه ورود (اگر ادمین لاگین نکرده باشد)
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
        <div className="bg-neutral-900/80 border border-neutral-800 p-8 rounded-2xl w-full max-w-md shadow-2xl backdrop-blur-md">
          <div className="mb-6 text-center">
            <span className="text-cyan-400 font-mono text-xs tracking-widest uppercase">VORIX.SECURITY</span>
            <h1 className="text-2xl font-extrabold text-white mt-1">پنل مدیریت امن</h1>
            <p className="text-neutral-400 text-xs mt-1">لطفاً رمز عبور ادمین را وارد کنید.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="رمز عبور ادمین..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                required
              />
            </div>
            {loginError && <p className="text-red-400 text-xs text-center">{loginError}</p>}
            <button
              type="submit"
              disabled={loadingLogin}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold py-3 rounded-xl transition text-sm cursor-pointer shadow-lg shadow-cyan-500/10"
            >
              {loadingLogin ? 'در حال بررسی احراز هویت...' : 'ورود به داشبورد'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <a href="/" className="text-xs text-neutral-500 hover:text-neutral-300 transition">← بازگشت به صفحه اصلی سایت</a>
          </div>
        </div>
      </main>
    );
  }

  // نمای اصلی داشبورد مدیریت بعد از ورود موفق
  return (
    <main className="min-h-screen bg-neutral-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 backdrop-blur-md">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-neutral-400 font-mono">SECURE ADMIN SESSION ACTIVE</span>
            </div>
            <h1 className="text-xl md:text-3xl font-extrabold text-cyan-400 mt-1">داشبورد مدیریت VORIX.SECURITY</h1>
            <p className="text-neutral-400 text-xs mt-1">مدیریت و پایش امن درخواست‌ها و سفارش‌های کاربران</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-xs bg-neutral-900 px-4 py-2.5 rounded-xl border border-neutral-800 hover:bg-neutral-800 transition">مشاهده سایت</a>
            <button onClick={handleLogout} className="text-xs bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/50 px-4 py-2.5 rounded-xl transition cursor-pointer">خروج از حساب</button>
          </div>
        </header>

        <section className="bg-neutral-900/60 rounded-2xl border border-neutral-800 p-4 md:p-6 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-neutral-200">لیست سفارش‌های ثبت شده</h2>
            <button 
              onClick={() => fetchOrders(sessionStorage.getItem('vorix_admin_pass') || '')} 
              className="text-xs bg-neutral-800 hover:bg-neutral-700 text-cyan-400 px-3 py-1.5 rounded-lg transition"
            >
              🔄 به‌روزرسانی لیست
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 text-xs">
                  <th className="p-4">شناسه</th>
                  <th className="p-4">نام مشتری</th>
                  <th className="p-4">شماره تماس</th>
                  <th className="p-4">نوع خدمت</th>
                  <th className="p-4">وضعیت (قابل تغییر)</th>
                  <th className="p-4">توضیحات</th>
                  <th className="p-4">تاریخ ثبت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-sm">
                {loadingOrders ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-neutral-500">در حال بارگذاری امن اطلاعات...</td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-neutral-500">هیچ سفارشی در دیتابیس ثبت نشده است.</td>
                  </tr>
                ) : (
                  orders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-neutral-800/30 transition">
                      <td className="p-4 font-mono text-cyan-400 text-xs">#{order.id.slice(-6)}</td>
                      <td className="p-4 font-bold text-neutral-100">{order.name}</td>
                      <td className="p-4 font-mono text-neutral-300 text-xs">{order.phone}</td>
                      <td className="p-4 text-cyan-300 font-medium">{order.service}</td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleOrderStatus(order.id, order.status)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border transition cursor-pointer ${
                            order.status === 'بررسی شد'
                              ? 'bg-green-950/40 text-green-400 border-green-800/60 hover:bg-green-900/40'
                              : 'bg-amber-950/40 text-amber-400 border-amber-800/60 hover:bg-amber-900/40'
                          }`}
                          title="برای تغییر وضعیت کلیک کنید"
                        >
                          {order.status || 'در حال بررسی'} 🔄
                        </button>
                      </td>
                      <td className="p-4 text-neutral-400 text-xs max-w-xs truncate">{order.details || 'بدون توضیحات'}</td>
                      <td className="p-4 text-neutral-500 font-mono text-xs">{order.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
