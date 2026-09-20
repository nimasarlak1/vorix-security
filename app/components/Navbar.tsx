'use client';

import { useEffect, useState } from 'react';
import { IconClose, IconMenu, IconPhone } from './Icons';
import { SITE } from '../data/site';

const LINKS = [
  { href: '#services', label: 'خدمات' },
  { href: '#portfolio', label: 'نمونه‌کارها' },
  { href: '#about', label: 'درباره ما' },
  { href: '#faq', label: 'سؤالات متداول' },
  { href: '#contact', label: 'تماس' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

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
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-3" aria-label={`${SITE.name} - صفحه اصلی`}>
          <img src="/logo-mark.png" width={512} height={404} alt="" className="h-8 w-auto" />
          <span className="text-sm font-black tracking-[0.18em] text-white" dir="ltr">
            VORIX<span className="text-cyan-300">.SECURITY</span>
          </span>
        </a>

        <nav aria-label="منوی اصلی" className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="nav-link text-sm text-neutral-300">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href="#order" className="btn-primary hidden !py-2 text-sm sm:inline-flex">
            ثبت سفارش
          </a>
          <a
            href={`tel:${SITE.phone}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-cyan-300 md:hidden"
            aria-label="تماس تلفنی"
          >
            <IconPhone className="h-5 w-5" />
          </a>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white md:hidden"
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
          className="border-t border-white/[0.06] bg-[#05070d] md:hidden"
        >
          <div className="container-x flex flex-col py-3">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/5 py-3.5 text-base text-neutral-200 last:border-0"
              >
                {l.label}
              </a>
            ))}
            <a href="#order" onClick={() => setOpen(false)} className="btn-primary mt-4 justify-center">
              ثبت سفارش
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
