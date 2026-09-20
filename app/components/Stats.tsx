'use client';

import { useEffect, useRef, useState } from 'react';
import { COMPLETED_JOBS } from '../data/stats';

const fa = (n: number) => n.toLocaleString('fa-IR');

const R = 112;
const C = 2 * Math.PI * R;
const TICKS = 72;

const css = `
.st{position:relative;overflow:hidden;border-block:1px solid rgba(255,255,255,.08);padding:4rem 0;background:radial-gradient(60% 140% at 50% 0%,rgba(34,211,238,.11),transparent 70%),linear-gradient(180deg,rgba(255,255,255,.025),transparent)}
@media(min-width:640px){.st{padding:5rem 0}}
.st-in{display:flex;flex-direction:column;align-items:center;gap:2.2rem;text-align:center}
@media(min-width:768px){.st-in{flex-direction:row;justify-content:center;gap:5rem;text-align:start}}
.st-ring{position:relative;width:260px;height:260px;flex:none}
.st-ring svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.st-pulse{position:absolute;inset:-4px;border-radius:50%;border:1px solid rgba(34,211,238,.35);animation:stp 3.4s ease-out infinite;pointer-events:none}
.st-pulse.b{animation-delay:1.7s}
@keyframes stp{0%{transform:scale(.92);opacity:.8}100%{transform:scale(1.28);opacity:0}}
.st-num{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1}
.st-num b{font-size:4.4rem;font-weight:900;background:linear-gradient(90deg,#60a5fa,#22d3ee);-webkit-background-clip:text;background-clip:text;color:transparent;font-variant-numeric:tabular-nums}
.st-num span{margin-top:.6rem;font-size:.9rem;font-weight:700;color:#9fb0cf;letter-spacing:.04em}
.st-text{max-width:30rem}
.st-text h2{margin:.9rem 0 0}
.st-text p{margin-top:.9rem;color:#a3aec2;line-height:2}
.st-text .btn-primary{margin-top:1.6rem}
@media(prefers-reduced-motion:reduce){.st-pulse{animation:none;opacity:0}}
`;

export default function Stats() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [targetJobs, setTargetJobs] = useState(COMPLETED_JOBS);
  const [value, setValue] = useState(COMPLETED_JOBS);

  // ۱. دریافت عدد زنده از دیتابیس
  useEffect(() => {
    fetch('/api/get-order-count')
      .then((res) => res.json())
      .then((data) => {
        if (data?.count && typeof data.count === 'number') {
          setTargetJobs(data.count);
        }
      })
      .catch((err) => console.error('Error fetching stats count:', err));
  }, []);

  // ۲. انیمیشن شمارش تا رسیدن به targetJobs
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') {
      setValue(targetJobs);
      return;
    }

    setValue(0);
    let raf = 0;
    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (started || !entries.some((e) => e.isIntersecting)) return;
        started = true;
        io.disconnect();
        const t0 = performance.now();
        const dur = 2200;
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(Math.round(targetJobs * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [targetJobs]);

  const progress = targetJobs > 0 ? value / targetJobs : 0;

  return (
    <section className="st" aria-label="آمار کارهای انجام‌شده">
      <style>{css}</style>
      <div className="container-x">
        <div className="st-in">
          <div ref={ref} className="st-ring" role="img" aria-label={`${fa(targetJobs)} کار انجام‌شده`}>
            <span className="st-pulse" aria-hidden="true" />
            <span className="st-pulse b" aria-hidden="true" />
            <svg viewBox="0 0 260 260" aria-hidden="true">
              <defs>
                <linearGradient id="st-g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
              {Array.from({ length: TICKS }).map((_, i) => {
                const lit = i / TICKS < progress;
                return (
                  <line
                    key={i}
                    x1="130"
                    y1="4"
                    x2="130"
                    y2={i % 6 === 0 ? 16 : 11}
                    transform={`rotate(${(i * 360) / TICKS} 130 130)`}
                    stroke={lit ? '#22d3ee' : 'rgba(255,255,255,.14)'}
                    strokeWidth={i % 6 === 0 ? 2.4 : 1.6}
                    strokeLinecap="round"
                  />
                );
              })}
              <circle cx="130" cy="130" r={R} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="10" />
              <circle
                cx="130"
                cy="130"
                r={R}
                fill="none"
                stroke="url(#st-g)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - progress)}
                transform="rotate(-90 130 130)"
              />
            </svg>
            <div className="st-num" aria-hidden="true">
              <b>{fa(value)}</b>
              <span>کار انجام‌شده</span>
            </div>
          </div>

          <div className="st-text">
            <p className="eyebrow">تا امروز</p>
            <h2 className="section-title">کارهایی که تا امروز انجام داده‌ایم</h2>
            <p>
              از ریکاوری اطلاعات و نصب دوربین تا طراحی سایت و امنیت حساب‌ها؛ هر کار با بررسی نیاز شما شروع
              شد.
            </p>
            <a href="#order" className="btn-primary">
              ثبت درخواست
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
