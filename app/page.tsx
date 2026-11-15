// صفحه‌ی موقت «در حال بروزرسانی».
// برای برگشت به سایت اصلی، همین فایل را با نسخه‌ی قبلی page.tsx جایگزین کنید.

const css = `
.mt{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:24px;overflow:hidden;text-align:center;color:#e9f0ff;
background:radial-gradient(60% 55% at 50% 38%,rgba(31,107,255,.28),transparent 70%),
linear-gradient(rgba(24,48,99,.28) 1px,transparent 1px) 0 0/44px 44px,
linear-gradient(90deg,rgba(24,48,99,.28) 1px,transparent 1px) 0 0/44px 44px,#040a18}
.mt-in{max-width:34rem}
.mt-logo{width:132px;height:auto;margin:0 auto 28px;display:block;filter:drop-shadow(0 0 26px rgba(34,229,255,.5));animation:mtf 3.4s ease-in-out infinite}
.mt-brand{font-size:14px;font-weight:800;letter-spacing:.38em;color:#9aaad0;direction:ltr;margin-bottom:22px}
.mt h1{margin:0;font-size:clamp(26px,5.2vw,42px);line-height:1.7;font-weight:900}
.mt h1 span{background:linear-gradient(90deg,#60a5fa,#22e5ff);-webkit-background-clip:text;background-clip:text;color:transparent}
.mt p{margin:16px 0 0;color:#9aaad0;font-size:clamp(15px,2.4vw,18px);line-height:2}
.mt-bar{position:relative;height:4px;width:200px;margin:30px auto 0;border-radius:99px;background:rgba(255,255,255,.08);overflow:hidden}
.mt-bar i{position:absolute;top:0;bottom:0;width:40%;border-radius:99px;background:linear-gradient(90deg,#1f6bff,#22e5ff);animation:mts 1.8s ease-in-out infinite}
.mt-links{margin-top:30px;display:flex;flex-wrap:wrap;justify-content:center;gap:10px}
.mt-links a{padding:9px 20px;border-radius:999px;font-size:14px;font-weight:700;color:#e9f0ff;text-decoration:none;border:1px solid #183063;background:rgba(11,26,61,.7)}
.mt-links a:hover{border-color:#22e5ff}
@keyframes mtf{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes mts{0%{inset-inline-start:-40%}100%{inset-inline-start:100%}}
@media(prefers-reduced-motion:reduce){.mt-logo,.mt-bar i{animation:none}.mt-bar i{inset-inline-start:30%}}
`;

export default function MaintenancePage() {
  return (
    <div className="mt" role="main">
      <style>{css}</style>
      <div className="mt-in">
        <svg className="mt-logo" viewBox="0 0 120 88" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="mtg" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#1f6bff" />
              <stop offset="1" stopColor="#22e5ff" />
            </linearGradient>
          </defs>
          <path d="M2 4 L40 14 L60 58 L60 86 Z" fill="url(#mtg)" fillOpacity=".55" stroke="url(#mtg)" strokeWidth="2" strokeLinejoin="round" />
          <path d="M118 4 L80 14 L60 58 L60 86 Z" fill="url(#mtg)" stroke="url(#mtg)" strokeWidth="2" strokeLinejoin="round" />
        </svg>

        <div className="mt-brand">VORIX SECURITY</div>

        <h1>
          سایت در حال <span>بروزرسانی‌های جدید</span> می‌باشد
        </h1>
        <p>خبرهای خوبی در راه است.</p>

        <div className="mt-bar" aria-hidden="true">
          <i />
        </div>

        <div className="mt-links">
          <a href="tel:09357781529" dir="ltr">
            ۰۹۳۵ ۷۷۸ ۱۵۲۹
          </a>
          <a href="https://instagram.com/vorix.security" target="_blank" rel="noopener noreferrer" dir="ltr">
            @vorix.security
          </a>
        </div>
      </div>
    </div>
  );
}
