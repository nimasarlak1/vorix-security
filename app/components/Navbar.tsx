'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { IconClose, IconMenu, IconPhone } from './Icons';
import { SITE } from '../data/site';

const LINKS = [
  { href: '/#services', label: 'خدمات' },
  { href: '/#portfolio', label: 'نمونه‌کارها' },
  { href: '/#about', label: 'درباره ما' },
  { href: '/#faq', label: 'سؤالات متداول' },
  { href: '/#contact', label: 'تماس' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || '/';
  // در صفحه‌ی اصلی (و پیش‌نمایش) لینک بخش‌ها همان صفحه را اسکرول می‌کند؛ در صفحه‌های دیگر به صفحه‌ی اصلی می‌رود
  const base = pathname === '/' ? '' : pathname.startsWith('/preview') ? '/preview' : '/';

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#05070d]/80 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between gap-3">
        <a href={base || '/'} className="flex shrink-0 items-center gap-2.5 sm:gap-3" aria-label={`${SITE.name} - صفحه اصلی`}>
          <img src="/logo-mark-sm.webp" width={144} height={114} alt="" className="h-8 w-auto shrink-0" />
          <span className="whitespace-nowrap text-[13px] font-black tracking-[0.1em] text-white sm:text-sm sm:tracking-[0.18em]" dir="ltr">
            VORIX<span className="text-cyan-300">.SECURITY</span>
          </span>
        </a>

        {/* لینک‌های منو فقط روی صفحه‌ی بزرگ (۱۰۲۴ پیکسل به بالا) دیده می‌شوند تا به اسم برند نچسبند */}
        <nav aria-label="منوی اصلی" className="hidden items-center gap-6 lg:flex xl:gap-7">
          {LINKS.map((l) => (
            <a key={l.href} href={base + l.href.replace('/#', '#')} className="nav-link whitespace-nowrap text-sm text-neutral-300">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {/* دکمه‌ی ثبت سفارش داخل div پنهان می‌شود، چون کلاس btn-primary نمایش را خودش تعیین می‌کند و hidden را خنثی می‌کرد */}
          <div className="hidden sm:block">
            <a href={`${base}#order`} className="btn-primary !px-5 !py-2 !text-sm whitespace-nowrap">
              ثبت سفارش
            </a>
          </div>
          <a
            href={`tel:${SITE.phone}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-cyan-300 lg:hidden"
            aria-label="تماس تلفنی"
          >
            <IconPhone className="h-5 w-5" />
          </a>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white lg:hidden"
            aria-label={open ? 'بستن منو' : 'باز کردن منو'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="منوی موبایل"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/[0.06] bg-[#05070d] lg:hidden"
        >
          <div className="container-x flex flex-col py-3">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={base + l.href.replace('/#', '#')}
                onClick={() => setOpen(false)}
                className="border-b border-white/5 py-3.5 text-base text-neutral-200 last:border-0"
              >
                {l.label}
              </a>
            ))}
            <a href={`${base}#order`} onClick={() => setOpen(false)} className="btn-primary mt-4 justify-center">
              ثبت سفارش
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
