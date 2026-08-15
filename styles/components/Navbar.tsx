import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-900" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* برند و آیدی */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-sm">
            VX
          </div>
          <div>
            <div className="font-bold text-white text-sm tracking-wide">VORIX.SECURITY</div>
            <div className="text-[11px] text-cyan-400 font-mono">ID: nimaslk0</div>
          </div>
        </Link>

        {/* منوی ناوبری اصلی */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-neutral-300">
          <Link href="/" className="hover:text-cyan-400 transition">صفحه اصلی</Link>
          <Link href="/security" className="hover:text-cyan-400 transition">خدمات تخصصی</Link>
          <Link href="/about" className="hover:text-cyan-400 transition">درباره ما</Link>
          <Link href="/admin/login" className="hover:text-cyan-400 transition text-cyan-400 font-semibold">ورود ادمین</Link>
        </nav>

        {/* دکمه ثبت سفارش */}
        <div>
          <Link 
            href="/order" 
            className="bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-lg shadow-cyan-500/20"
          >
            ثبت سفارش آنلاین
          </Link>
        </div>

      </div>
    </header>
  );
}
