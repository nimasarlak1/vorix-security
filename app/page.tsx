'use client';

/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  اطلاعات ثابت سایت (برای تغییر متن‌ها و شماره‌ها فقط همین بخش)        */
/* ------------------------------------------------------------------ */

const PHONE = '09357781519';
const PHONE_SHOW = '۰۹۳۵ ۷۷۸ ۱۵۱۹';
const PHONE_INTL = '989357781519';
const EMAIL = 'vorixsecurity@gmail.com';
const INSTAGRAM = 'vorix.security';
const ADDRESS = 'لرستان، الیگودرز، میدان امام، پاساژ سینا، طبقه دوم';
const MAP_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('الیگودرز میدان امام پاساژ سینا');

const HEADLINE = 'اطلاعات از دست رفته؟ اول بررسی می‌کنیم.';

const SERVICES = [
  {
    title: 'بازیابی اطلاعات',
    text: 'بررسی و بازیابی فایل‌های پاک‌شده یا غیرقابل دسترس از هارد، فلش، مموری و گوشی.',
  },
  {
    title: 'امنیت دیجیتال',
    text: 'بررسی امنیت دستگاه‌ها و حساب‌ها، بکاپ‌گیری و جلوگیری از تکرار از دست رفتن اطلاعات.',
  },
  {
    title: 'دوربین مداربسته',
    text: 'مشاوره، نصب و راه‌اندازی سیستم نظارت تصویری برای خانه، مغازه و محل کار.',
  },
  {
    title: 'طراحی سایت',
    text: 'سایت معرفی و فروشگاهی سریع، فارسی و سازگار با موبایل.',
  },
];

const STEPS = [
  { title: 'ثبت درخواست', text: 'فرم پایین صفحه را پر کنید یا تماس بگیرید.' },
  { title: 'گفتگو', text: 'می‌شنویم چه اتفاقی افتاده و وضعیت را می‌پرسیم.' },
  { title: 'بررسی', text: 'دستگاه یا سیستم شما را بررسی می‌کنیم.' },
  { title: 'اقدام و تحویل', text: 'بعد از بررسی، روش کار را می‌گوییم و انجام می‌دهیم.' },
];

const SERVICE_OPTIONS = [
  'بازیابی اطلاعات',
  'امنیت دیجیتال',
  'دوربین مداربسته',
  'طراحی سایت',
  'سایر',
];

/* ------------------------------------------------------------------ */
/*  تیتر اصلی: کلمه‌ها اول «خراب» هستند و یکی‌یکی بازیابی می‌شوند       */
/* ------------------------------------------------------------------ */

const GLYPHS = '0123456789ABCDEF#%&@$<>/';

function noise(n: number) {
  let s = '';
  for (let i = 0; i < n; i++) s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  return s;
}

function RecoverHeadline({ text }: { text: string }) {
  const words = text.split(' ');
  const [ready, setReady] = useState(false);
  const [revealed, setRevealed] = useState(words.length);
  const [, setTick] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setReady(true);
      return;
    }
    setRevealed(0);
    setReady(true);

    let count = 0;
    let step: ReturnType<typeof setInterval> | undefined;
    const shuffle = setInterval(() => setTick((t) => t + 1), 70);
    const start = setTimeout(() => {
      step = setInterval(() => {
        count += 1;
        setRevealed(count);
        if (count >= words.length) {
          if (step) clearInterval(step);
          clearInterval(shuffle);
        }
      }, 380);
    }, 800);

    return () => {
      clearTimeout(start);
      clearInterval(shuffle);
      if (step) clearInterval(step);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <h1 className={`vx-h1 ${ready ? 'is-ready' : ''}`} aria-label={text}>
      {words.map((w, i) => {
        const done = i < revealed;
        return (
          <React.Fragment key={i}>
            <span
              aria-hidden="true"
              className={done ? 'w ok' : i === revealed ? 'w lost front' : 'w lost'}
            >
              {done ? w : noise(Math.max(2, w.length))}
            </span>{' '}
          </React.Fragment>
        );
      })}
    </h1>
  );
}

/* ------------------------------------------------------------------ */
/*  نمایش تدریجی بخش‌ها هنگام رسیدن اسکرول                              */
/* ------------------------------------------------------------------ */

function useWipeReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.wipe'));
    if (!('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

/* ------------------------------------------------------------------ */
/*  فرم ثبت درخواست                                                    */
/* ------------------------------------------------------------------ */

function toLatinDigits(s: string) {
  return s
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

type Status = 'idle' | 'sending' | 'ok' | 'error';

function OrderForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(SERVICE_OPTIONS[0]);
  const [description, setDescription] = useState('');
  const [trap, setTrap] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [msg, setMsg] = useState('');
  const lastSent = useRef(0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;

    const cleanPhone = toLatinDigits(phone).replace(/[\s-]/g, '');
    if (name.trim().length < 2) {
      setStatus('error');
      setMsg('نام خود را وارد کنید.');
      return;
    }
    if (!/^09\d{9}$/.test(cleanPhone)) {
      setStatus('error');
      setMsg('شماره موبایل را به‌صورت ۰۹۱۲۳۴۵۶۷۸۹ وارد کنید.');
      return;
    }
    // ربات‌های اسپم معمولاً فیلد مخفی را پر می‌کنند
    if (trap) {
      setStatus('ok');
      setMsg('درخواست شما ثبت شد.');
      return;
    }
    if (Date.now() - lastSent.current < 15000) {
      setStatus('error');
      setMsg('چند لحظه صبر کنید و دوباره تلاش کنید.');
      return;
    }

    setStatus('sending');
    setMsg('');
    try {
      const res = await fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: cleanPhone,
          service,
          description: description.trim(),
        }),
      });
      if (!res.ok) throw new Error('bad status');
      lastSent.current = Date.now();
      setStatus('ok');
      setMsg('درخواست شما ثبت شد. به‌زودی با شما تماس می‌گیریم.');
      setName('');
      setPhone('');
      setDescription('');
    } catch {
      setStatus('error');
      setMsg(`ثبت درخواست انجام نشد. لطفاً دوباره تلاش کنید یا با ${PHONE_SHOW} تماس بگیرید.`);
    }
  };

  return (
    <form className="form" onSubmit={submit} noValidate>
      <label>
        <span>نام و نام خانوادگی</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          maxLength={80}
        />
      </label>
      <label>
        <span>شماره موبایل</span>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          inputMode="tel"
          autoComplete="tel"
          dir="ltr"
          placeholder="09xxxxxxxxx"
          maxLength={14}
        />
      </label>
      <label>
        <span>خدمت مورد نظر</span>
        <select value={service} onChange={(e) => setService(e.target.value)}>
          {SERVICE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>توضیحات</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          maxLength={800}
          placeholder="مثلاً: هارد اکسترنال شناسایی نمی‌شود و عکس‌های خانوادگی روی آن است."
        />
      </label>

      {/* فیلد مخفی ضد اسپم */}
      <input
        className="trap"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={trap}
        onChange={(e) => setTrap(e.target.value)}
        name="website"
      />

      <button type="submit" className="btn primary" disabled={status === 'sending'}>
        {status === 'sending' ? 'در حال ارسال...' : 'ثبت درخواست'}
      </button>

      <p className={`note ${status}`} role="status" aria-live="polite">
        {msg}
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  صفحه اصلی                                                          */
/* ------------------------------------------------------------------ */

export default function Home() {
  useWipeReveal();

  return (
    <div className="vx" dir="rtl">
      <style>{css}</style>

      <header className="top">
        <a href="#top" className="brand" aria-label="VORIX SECURITY">
          <img src="/logo-mark.png" alt="" width={40} height={29} />
          <span>VORIX SECURITY</span>
        </a>
        <nav aria-label="منوی اصلی">
          <a href="#services">خدمات</a>
          <a href="#about">درباره ما</a>
          <a href="#office">دفتر</a>
          <a href="#order" className="navcta">
            ثبت درخواست
          </a>
        </nav>
      </header>

      <main id="top">
        {/* ---------- هیرو ---------- */}
        <section className="hero">
          <div className="hero-in">
            <div className="hero-text">
              <RecoverHeadline text={HEADLINE} />
              <p className="lead">
                ریکاوری اطلاعات، امنیت دیجیتال، دوربین مداربسته و طراحی سایت در الیگودرز.
              </p>
              <div className="actions">
                <a href="#order" className="btn primary">
                  ثبت درخواست
                </a>
                <a href={`tel:${PHONE}`} className="btn ghost">
                  تماس با {PHONE_SHOW}
                </a>
              </div>
            </div>

            <figure className="frame hero-photo">
              <img
                src="/hero.jpg"
                alt="نیما سرلک، مؤسس VORIX.SECURITY"
                width={1200}
                height={1141}
              />
              <span className="scan" aria-hidden="true" />
              <figcaption>
                <strong>نیما سرلک</strong>
                <span>متخصص ریکاوری اطلاعات و امنیت دیجیتال</span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ---------- خدمات ---------- */}
        <section id="services" className="sec">
          <div className="wrap">
            <h2 className="wipe">خدمات</h2>
            <div className="svc-grid">
              {SERVICES.map((s) => (
                <article key={s.title} className="svc wipe">
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- روند کار ---------- */}
        <section className="sec alt">
          <div className="wrap">
            <h2 className="wipe">روند کار</h2>
            <ol className="steps">
              {STEPS.map((s, i) => (
                <li key={s.title} className="wipe">
                  <span className="n" aria-hidden="true">
                    {['۱', '۲', '۳', '۴'][i]}
                  </span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- درباره ---------- */}
        <section id="about" className="sec">
          <div className="wrap about">
            <figure className="frame about-photo wipe">
              <img
                src="/about.jpg"
                alt="نیما سرلک"
                width={1000}
                height={1333}
                loading="lazy"
              />
            </figure>
            <div className="about-text">
              <h2 className="wipe">درباره ما</h2>
              <p className="wipe">
                VORIX.SECURITY یک دفتر تخصصی ریکاوری اطلاعات و امنیت دیجیتال در الیگودرز است. مدیریت
                فنی مجموعه با نیما سرلک است.
              </p>
              <p className="wipe">
                کار را از شنیدن مشکل شروع می‌کنیم. اول وضعیت دستگاه یا سیستم را بررسی می‌کنیم و بعد
                از بررسی، روش کار را به شما می‌گوییم. فایل‌های شما اطلاعات شخصی و کاری شماست و با
                همین حساسیت با آن‌ها برخورد می‌کنیم.
              </p>
            </div>
          </div>
        </section>

        {/* ---------- دفتر ---------- */}
        <section id="office" className="sec alt">
          <div className="wrap">
            <h2 className="wipe">دفتر ما</h2>
            <figure className="frame office-photo wipe">
              <img
                src="/office.jpg"
                alt="دفتر VORIX.SECURITY در الیگودرز"
                width={1500}
                height={1125}
                loading="lazy"
              />
            </figure>
            <p className="addr">
              {ADDRESS}
              <a href={MAP_URL} target="_blank" rel="noopener noreferrer">
                مسیریابی روی نقشه
              </a>
            </p>
          </div>
        </section>

        {/* ---------- ثبت درخواست و تماس ---------- */}
        <section id="order" className="sec">
          <div className="wrap contact">
            <div className="contact-info">
              <h2 className="wipe">ثبت درخواست</h2>
              <p className="wipe">
                فرم را پر کنید تا با شما تماس بگیریم، یا مستقیم پیام بدهید.
              </p>
              <ul className="channels wipe">
                <li>
                  <span>تلفن</span>
                  <a href={`tel:${PHONE}`} dir="ltr">
                    {PHONE_SHOW}
                  </a>
                </li>
                <li>
                  <span>واتساپ</span>
                  <a
                    href={`https://wa.me/${PHONE_INTL}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    پیام در واتساپ
                  </a>
                </li>
                <li>
                  <span>تلگرام</span>
                  <a
                    href={`https://t.me/+${PHONE_INTL}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    پیام در تلگرام
                  </a>
                </li>
                <li>
                  <span>اینستاگرام</span>
                  <a
                    href={`https://instagram.com/${INSTAGRAM}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    dir="ltr"
                  >
                    @{INSTAGRAM}
                  </a>
                </li>
                <li>
                  <span>ایمیل</span>
                  <a href={`mailto:${EMAIL}`} dir="ltr">
                    {EMAIL}
                  </a>
                </li>
              </ul>
            </div>
            <div className="contact-form wipe">
              <OrderForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <span>© VORIX.SECURITY</span>
        <span>{ADDRESS}</span>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  استایل‌ها                                                          */
/* ------------------------------------------------------------------ */

const css = `
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600;800&display=swap');

:root{
  --ink:#040a18;
  --deep:#071230;
  --panel:#0b1a3d;
  --line:#183063;
  --blue:#1f6bff;
  --cyan:#22e5ff;
  --text:#e9f0ff;
  --mute:#9aaad0;
  --red:#ff5a5a;
}
html{scroll-behavior:smooth}
.vx *{box-sizing:border-box}
.vx{
  min-height:100vh;
  background:var(--ink);
  color:var(--text);
  font-family:'Vazirmatn',Tahoma,'Segoe UI',sans-serif;
  line-height:1.9;
  overflow-x:hidden;
}
.vx a{color:inherit;text-decoration:none}
.vx :focus-visible{outline:2px solid var(--cyan);outline-offset:3px;border-radius:6px}
.vx img{max-width:100%;height:auto;display:block}

/* هدر */
.top{
  position:fixed;inset:0 0 auto 0;z-index:20;
  display:flex;align-items:center;justify-content:space-between;
  padding:12px clamp(16px,4vw,48px);
  background:rgba(4,10,24,.72);
  backdrop-filter:blur(12px);
  -webkit-backdrop-filter:blur(12px);
  border-bottom:1px solid rgba(24,48,99,.6);
}
.brand{display:flex;align-items:center;gap:10px;font-weight:800;letter-spacing:.12em;font-size:15px;direction:ltr}
.brand img{filter:drop-shadow(0 0 10px rgba(34,229,255,.45))}
.top nav{display:flex;align-items:center;gap:clamp(12px,2.4vw,30px);font-size:14px;color:var(--mute)}
.top nav a:hover{color:var(--text)}
.top nav .navcta{
  color:var(--ink);background:var(--cyan);padding:6px 16px;border-radius:999px;font-weight:600;
}
.top nav .navcta:hover{color:var(--ink);background:#7af1ff}
@media (max-width:640px){
  .top nav a:not(.navcta){display:none}
}

/* هیرو */
.hero{
  position:relative;
  min-height:100vh;
  display:flex;align-items:center;
  padding:110px clamp(16px,4vw,48px) 64px;
  background:
    radial-gradient(60% 55% at 22% 50%, rgba(31,107,255,.22), transparent 70%),
    linear-gradient(rgba(24,48,99,.28) 1px, transparent 1px) 0 0/44px 44px,
    linear-gradient(90deg, rgba(24,48,99,.28) 1px, transparent 1px) 0 0/44px 44px,
    var(--ink);
}
.hero-in{
  width:100%;max-width:1180px;margin:0 auto;
  display:grid;grid-template-columns:1.1fr .9fr;gap:clamp(28px,5vw,64px);align-items:center;
}
.vx-h1{
  margin:0 0 20px;
  font-size:clamp(32px,4.8vw,58px);
  line-height:1.35;font-weight:800;
  opacity:0;
}
.vx-h1.is-ready{opacity:1}
.vx-h1 .w.ok{color:var(--text)}
.vx-h1 .w.lost{
  color:var(--red);opacity:.85;
  direction:ltr;unicode-bidi:isolate;
  font-family:ui-monospace,Consolas,monospace;font-weight:400;
  font-size:.82em;letter-spacing:.04em;
}
.vx-h1 .w.front{color:var(--cyan);opacity:1;text-shadow:0 0 16px rgba(34,229,255,.7)}
.vx .lead{margin:0 0 30px;font-size:clamp(16px,1.9vw,20px);color:var(--mute);max-width:34em}
.actions{display:flex;flex-wrap:wrap;gap:12px}

.btn{
  display:inline-flex;align-items:center;justify-content:center;
  padding:12px 26px;border-radius:12px;font-weight:600;font-size:15px;
  font-family:inherit;cursor:pointer;border:1px solid transparent;
  transition:transform .15s ease, background .2s ease, border-color .2s ease;
}
.btn:active{transform:scale(.97)}
.btn.primary{background:var(--cyan);color:var(--ink)}
.btn.primary:hover{background:#7af1ff}
.btn.primary:disabled{opacity:.6;cursor:wait}
.btn.ghost{border-color:var(--line);color:var(--text);background:rgba(11,26,61,.6)}
.btn.ghost:hover{border-color:var(--cyan)}

.frame{
  position:relative;margin:0;overflow:hidden;
  border-radius:22px;border:1px solid var(--line);
  background:var(--panel);
  box-shadow:0 0 60px rgba(31,107,255,.18);
}
.hero-photo figcaption{
  position:absolute;inset:auto 0 0 0;
  padding:60px 20px 18px;
  background:linear-gradient(transparent, rgba(4,10,24,.92));
  display:flex;flex-direction:column;
}
.hero-photo figcaption strong{font-size:18px}
.hero-photo figcaption span{font-size:13px;color:var(--mute)}
.scan{
  position:absolute;top:0;bottom:0;right:0;width:26%;pointer-events:none;
  background:linear-gradient(90deg,transparent,rgba(34,229,255,.38),transparent);
  transform:translateX(120%);
  animation:sweep 2.6s .7s ease-in-out 1 both;
}
@keyframes sweep{
  from{transform:translateX(120%)}
  to{transform:translateX(-420%)}
}

/* بخش‌ها */
.sec{padding:clamp(64px,9vw,120px) clamp(16px,4vw,48px)}
.sec.alt{background:var(--deep);border-block:1px solid var(--line)}
.wrap{max-width:1180px;margin:0 auto}
.vx h2{margin:0 0 36px;font-size:clamp(26px,3.6vw,40px);font-weight:800;line-height:1.5}
.vx h3{margin:0 0 8px;font-size:19px;font-weight:600}
.vx p{margin:0}

.svc-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:0 clamp(24px,5vw,72px)}
.svc{padding:26px 0;border-top:1px solid var(--line);transition:padding .25s ease}
.svc p{color:var(--mute);max-width:32em}
.svc:hover{padding-inline-start:12px}
.svc:hover h3{color:var(--cyan)}
.svc h3{transition:color .2s ease}

.steps{
  list-style:none;margin:0;padding:0;
  display:grid;grid-template-columns:repeat(4,1fr);gap:28px;
  position:relative;
}
.steps li{position:relative;padding-top:8px}
.steps .n{
  display:inline-flex;align-items:center;justify-content:center;
  width:44px;height:44px;border-radius:50%;
  border:1px solid var(--cyan);color:var(--cyan);font-weight:800;margin-bottom:14px;
  background:var(--deep);
}
.steps p{color:var(--mute);font-size:15px}

.about{display:grid;grid-template-columns:.8fr 1.2fr;gap:clamp(28px,5vw,72px);align-items:center}
.about-photo img{filter:saturate(.9)}
.about-text p{color:var(--mute);max-width:36em}
.about-text p + p{margin-top:16px}

.office-photo{max-width:900px}
.vx .addr{margin-top:20px;color:var(--mute);display:flex;flex-wrap:wrap;gap:8px 20px;align-items:center}
.addr a{color:var(--cyan);border-bottom:1px solid rgba(34,229,255,.4)}

.contact{display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,5vw,72px);align-items:start}
.contact-info p{color:var(--mute);margin-bottom:24px}
.channels{list-style:none;margin:0;padding:0}
.channels li{
  display:flex;justify-content:space-between;gap:16px;
  padding:14px 0;border-top:1px solid var(--line);
}
.channels li span{color:var(--mute)}
.channels a{color:var(--text)}
.channels a:hover{color:var(--cyan)}

.form{
  display:grid;gap:16px;padding:clamp(20px,3vw,32px);
  background:var(--panel);border:1px solid var(--line);border-radius:20px;
}
.form label{display:grid;gap:6px;font-size:14px;color:var(--mute)}
.form input,.form select,.form textarea{
  width:100%;padding:12px 14px;border-radius:12px;
  background:var(--ink);color:var(--text);
  border:1px solid var(--line);font:inherit;font-size:15px;
}
.form input:focus,.form select:focus,.form textarea:focus{outline:none;border-color:var(--cyan)}
.form textarea{resize:vertical;min-height:110px}
.form{position:relative}
.trap{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;border:0!important;overflow:hidden!important;clip-path:inset(50%)!important;opacity:0!important;pointer-events:none!important}
.note{min-height:1.6em;font-size:14px}
.note.ok{color:#5df2a8}
.note.error{color:var(--red)}

.foot{
  display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px 24px;
  padding:28px clamp(16px,4vw,48px);border-top:1px solid var(--line);
  color:var(--mute);font-size:13px;
}

/* نمایش تدریجی با «اسکن» از راست به چپ */
.wipe{clip-path:inset(0 0 0 100%);transition:clip-path .9s cubic-bezier(.2,.7,.2,1)}
.wipe.in{clip-path:inset(0 0 0 0)}
@media (scripting:none){.wipe{clip-path:none}}

@media (max-width:900px){
  .hero-in,.about,.contact{grid-template-columns:1fr}
  .steps{grid-template-columns:repeat(2,1fr)}
  .svc-grid{grid-template-columns:1fr}
  .hero{min-height:auto}
}
@media (max-width:480px){
  .steps{grid-template-columns:1fr}
}
@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  .wipe{clip-path:none;transition:none}
  .scan{display:none}
  .btn,.svc{transition:none}
}
`;
