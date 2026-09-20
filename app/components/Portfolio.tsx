'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import Reveal from './Reveal';
import { ServiceIconView } from './Icons';
import { PROJECTS } from '../data/portfolio';
import type { ServiceIcon } from '../data/site';

// رنگ مخصوص هر دسته‌ی خدمت (به‌صورت r,g,b)
const ACCENT: Record<ServiceIcon, string> = {
  drive: '56,189,248',
  camera: '167,139,250',
  shield: '74,222,128',
  code: '251,191,36',
  ai: '232,121,249',
  chat: '34,211,238',
};

const TOP = 84; // فاصله از بالای صفحه (زیر نوار منو)
const STEP = 14; // فاصله‌ی لبه‌ی کارت‌های روی هم

const css = `
.pf{position:relative;padding:5rem 0 6rem}
@media(min-width:640px){.pf{padding:7rem 0 8rem}}
.pf-list{margin-top:3rem;display:flex;flex-direction:column}
.pf-wrap{position:sticky;margin-bottom:1.6rem}
.pf-card{position:relative;overflow:hidden;transform-origin:50% 0;will-change:transform;border-radius:1.75rem;border:1px solid rgba(var(--rgb),.28);background:linear-gradient(155deg,rgba(var(--rgb),.16),#0a1020 46%,#070b14);box-shadow:0 34px 70px -34px rgba(0,0,0,.95),0 0 90px -46px rgb(var(--rgb));display:grid;grid-template-columns:1fr}
@media(min-width:900px){.pf-card{grid-template-columns:1fr 1.35fr}}
.pf-body{position:relative;padding:1.4rem 1.3rem 1.6rem;display:flex;flex-direction:column;justify-content:center;gap:.85rem}
@media(min-width:900px){.pf-body{padding:2.4rem 2.4rem 2.4rem 2rem;gap:1.05rem}}
.pf-num{position:absolute;top:.6rem;inset-inline-end:1.1rem;font-size:2.6rem;font-weight:900;line-height:1;color:transparent;-webkit-text-stroke:1px rgba(var(--rgb),.4);pointer-events:none}
@media(min-width:900px){.pf-num{top:1.4rem;inset-inline-end:2rem;font-size:3.6rem}}
.pf-cat{display:inline-flex;align-items:center;gap:.5rem;align-self:flex-start;padding:.25rem .9rem .25rem .8rem;border-radius:999px;font-size:.8rem;font-weight:800;color:rgb(var(--rgb));background:rgba(var(--rgb),.1);border:1px solid rgba(var(--rgb),.32)}
.pf-cat svg{width:1rem;height:1rem;display:block}
.pf-title{margin:0;font-size:1.3rem;line-height:1.7;font-weight:900;color:#fff}
@media(min-width:900px){.pf-title{font-size:1.75rem}}
.pf-desc{margin:0;color:#a9b4c9;font-size:.92rem;line-height:2}
@media(min-width:900px){.pf-desc{font-size:1rem}}
.pf-points{margin:0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:.5rem}
.pf-points li{display:flex;align-items:center;gap:.4rem;padding:.2rem .75rem;border-radius:999px;font-size:.78rem;color:#d3dbea;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09)}
.pf-points li::before{content:'';width:.4rem;height:.4rem;border-radius:50%;background:rgb(var(--rgb))}
.pf-cta{align-self:flex-start;margin-top:.3rem;font-size:.9rem;font-weight:800;color:rgb(var(--rgb));border-bottom:1px solid rgba(var(--rgb),.45);padding-bottom:.1rem;transition:letter-spacing .25s ease,opacity .2s}
.pf-cta:hover{opacity:.85}
.pf-media{position:relative;order:-1;aspect-ratio:16/10;overflow:hidden;background:#060912}
@media(min-width:900px){.pf-media{order:0}}
.pf-media img{position:absolute;inset:0;width:100%;height:100%;max-width:none;object-fit:cover;display:block;will-change:transform;transform:scale(1.08)}
.pf-media::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(to bottom,transparent 60%,rgba(7,11,20,.55))}
@media(min-width:900px){.pf-media::after{background:linear-gradient(to right,transparent 70%,rgba(9,14,26,.7))}}
.pf-badge{position:absolute;top:.8rem;left:.8rem;z-index:2;padding:.15rem .8rem;border-radius:999px;font-size:.72rem;font-weight:800;color:#fde68a;background:rgba(251,191,36,.12);border:1px solid rgba(252,211,77,.42);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
.pf-dim{position:absolute;inset:0;z-index:3;background:#02040a;opacity:0;pointer-events:none}
@media(prefers-reduced-motion:reduce){
  .pf-wrap{position:static!important}
  .pf-card{transform:none!important}
  .pf-media img{transform:none!important}
  .pf-dim{display:none}
}
`;

const fa = (n: number) => n.toLocaleString('fa-IR', { minimumIntegerDigits: 2 });

export default function Portfolio() {
  const hasSamples = PROJECTS.some((p) => p.sample);
  const wraps = useRef<(HTMLDivElement | null)[]>([]);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const dims = useRef<(HTMLDivElement | null)[]>([]);
  const imgs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const list = wraps.current;

      for (let i = 0; i < list.length; i++) {
        const w = list[i];
        const card = cards.current[i];
        const dim = dims.current[i];
        const img = imgs.current[i];
        if (!w || !card) continue;

        // چند کارت بعدی روی این کارت آمده‌اند؟ (عدد بین ۰ تا تعداد کارت‌ها، پیوسته)
        let depth = 0;
        for (let j = i + 1; j < list.length; j++) {
          const wj = list[j];
          if (!wj) continue;
          const stuck = parseFloat(getComputedStyle(wj).top) || 0;
          const top = wj.getBoundingClientRect().top;
          const q = Math.min(1, Math.max(0, 1 - (top - stuck) / (wj.offsetHeight || 1)));
          depth += q;
        }
        const d = Math.min(depth, 5);
        card.style.transform = `scale(${(1 - d * 0.035).toFixed(4)})`;
        if (dim) dim.style.opacity = String(Math.min(0.6, d * 0.13));

        // پارالاکس عکس داخل کارت
        if (img) {
          const r = w.getBoundingClientRect();
          const p = Math.max(-1.2, Math.min(1.2, (r.top + r.height / 2 - vh / 2) / vh));
          img.style.transform = `translate3d(0, ${(-p * 16).toFixed(1)}px, 0) scale(1.08)`;
        }
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="portfolio" className="pf">
      <style>{css}</style>
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">۰۲ — نمونه‌کارها</p>
          <h2 className="section-title mt-4">نمونه‌ای از کارهایی که انجام می‌دهیم</h2>
          {hasSamples && (
            <p className="mt-4 max-w-2xl text-sm text-neutral-500">
              کارت‌های دارای برچسب «نمونه» برای معرفی نوع خدمات است و به‌زودی با پروژه‌های واقعی جایگزین می‌شود.
            </p>
          )}
        </Reveal>

        <div className="pf-list">
          {PROJECTS.map((p, i) => (
            <div
              key={p.title}
              ref={(el) => {
                wraps.current[i] = el;
              }}
              className="pf-wrap"
              style={{ top: TOP + i * STEP, zIndex: i + 1 }}
            >
              <article
                ref={(el) => {
                  cards.current[i] = el;
                }}
                className="pf-card"
                style={{ '--rgb': ACCENT[p.icon] } as CSSProperties}
              >
                <div className="pf-body">
                  <span className="pf-num" aria-hidden="true">
                    {fa(i + 1)}
                  </span>
                  <span className="pf-cat">
                    <ServiceIconView name={p.icon} />
                    {p.category}
                  </span>
                  <h3 className="pf-title">{p.title}</h3>
                  <p className="pf-desc">{p.description}</p>
                  {p.points && (
                    <ul className="pf-points">
                      {p.points.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                  )}
                  <a href="#order" className="pf-cta">
                    درخواست کاری مشابه این ←
                  </a>
                </div>

                <div className="pf-media">
                  {p.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      ref={(el) => {
                        imgs.current[i] = el;
                      }}
                      src={p.image}
                      alt={p.title}
                      width={1200}
                      height={750}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  )}
                  {p.sample && <span className="pf-badge">نمونه</span>}
                </div>

                <div
                  className="pf-dim"
                  aria-hidden="true"
                  ref={(el) => {
                    dims.current[i] = el;
                  }}
                />
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
