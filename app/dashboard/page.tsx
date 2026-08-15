import React from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const recentVisitors = [
    { ip: '5.120.14.22', location: 'لرستان، خرم‌آباد', time: 'لحظاتی پیش', path: '/' },
    { ip: '37.152.88.9', location: 'تهران، ایران', time: '۲ دقیقه پیش', path: '/order' },
    { ip: '2.181.45.11', location: 'لرستان، بروجرد', time: '۵ دقیقه پیش', path: '/security' },
    { ip: '78.38.190.4', location: 'اصفهان، ایران', time: '۱۲ دقیقه پیش', path: '/' },
  ];

  const recentOrders = [
    { name: 'علی رضایی', service: 'ریکاوری پیج اینستاگرام', phone: '0935******29', status: 'در حال بررسی' },
    { name: 'محمد مرادی', service: 'نصب دوربین مداربسته', phone: '0916******11', status: 'تایید شده' },
    { name: 'سارا کریمی', service: 'ریکاوری هارد آسیب‌دیده', phone: '0912******88', status: 'تکمیل شده' },
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-10" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-900 pb-6">
          <div>
            <div className="inline-block bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold px-3 py-1 rounded-full mb-2">
              پنل مدیریت امنیتی VORIX (محافظت‌شده)
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">داشبورد بررسی دسترسی، ترافیک و فایروال</h1>
          </div>
          <Link 
            href="/" 
            className="bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-200 px-5 py-2.5 rounded-xl text-xs font-semibold transition"
          >
            مشاهده سایت اصلی
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-neutral-900/50 border border-neutral-800/80 p-6 rounded-3xl space-y-2 shadow-lg">
            <div className="text-neutral-400 text-xs font-medium">بازدیدکنندگان آنلاین امروز</div>
            <div className="text-3xl font-black text-cyan-400">۴۲ نفر</div>
            <div className="text-[11px] text-emerald-400">↑ ترافیک کاملاً ایمن و نرمال</div>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800/80 p-6 rounded-3xl space-y-2 shadow-lg">
            <div className="text-neutral-400 text-xs font-medium">درخواست‌های سفارش جدید</div>
            <div className="text-3xl font-black text-white">۳ مورد</div>
            <div className="text-[11px] text-cyan-400">آماده بررسی فنی</div>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800/80 p-6 rounded-3xl space-y-2 shadow-lg">
            <div className="text-neutral-400 text-xs font-medium">وضعیت دیواره آتش (Cloudflare WAF)</div>
            <div className="text-3xl font-black text-emerald-400">فعال و مسدودساز</div>
            <div className="text-[11px] text-neutral-500">حملات لایه ۷ و بات‌ها مسدود شدند</div>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800/80 p-6 rounded-3xl space-y-2 shadow-lg">
            <div className="text-neutral-400 text-xs font-medium">کل بازدیدهای ماهانه</div>
            <div className="text-3xl font-black text-white">۱,۲۸۰</div>
            <div className="text-[11px] text-neutral-500">منطقه اصلی: استان لرستان</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                لاگ دسترسی و ترافیک مانیتور شده
              </h2>
              <span className="text-xs text-neutral-500">رمزنگاری شده</span>
            </div>

            <div className="space-y-3">
              {recentVisitors.map((visitor, idx) => (
                <div key={idx} className="bg-neutral-950/60 border border-neutral-800/60 p-4 rounded-2xl flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <div className="font-mono text-cyan-400 font-semibold">{visitor.ip}</div>
                    <div className="text-neutral-400">{visitor.location} • مسیر: <span className="text-white font-mono">{visitor.path}</span></div>
                  </div>
                  <div className="text-neutral-500 text-[11px] bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800">
                    {visitor.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">مدیریت سفارش‌ها و مانیتورینگ مشتریان</h2>
              <Link href="/order" className="text-xs text-cyan-400 hover:underline">ثبت سفارش جدید</Link>
            </div>

            <div className="space-y-3">
              {recentOrders.map((order, idx) => (
                <div key={idx} className="bg-neutral-950/60 border border-neutral-800/60 p-4 rounded-2xl flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <div className="font-bold text-white text-sm">{order.name} <span className="text-neutral-400 font-normal text-xs">({order.phone})</span></div>
                    <div className="text-cyan-400 font-medium">{order.service}</div>
                  </div>
                  <div>
                    <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
