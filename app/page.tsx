const css = `
.vx-grid {
  background-image:
    linear-gradient(to right, rgba(0, 174, 255, 0.07) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 174, 255, 0.07) 1px, transparent 1px);
  background-size: 56px 56px;
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 45%, #000 30%, transparent 100%);
  mask-image: radial-gradient(ellipse 70% 60% at 50% 45%, #000 30%, transparent 100%);
}
.vx-glow {
  background: radial-gradient(circle at 50% 42%, rgba(0, 120, 255, 0.28), transparent 60%);
  animation: vx-pulse 5s ease-in-out infinite;
}
.vx-logo {
  filter: drop-shadow(0 0 18px rgba(0, 170, 255, 0.55));
}
.vx-edge {
  fill: none;
  stroke: #7fdcff;
  stroke-width: 0.8;
  stroke-linejoin: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: vx-draw 1.6s ease-out 0.2s forwards;
}
.vx-fill {
  opacity: 0;
  animation: vx-fade 1s ease-out 1.3s forwards;
}
.vx-rise {
  opacity: 0;
  transform: translateY(10px);
  animation: vx-up 0.9s ease-out forwards;
}
.vx-bar {
  position: relative;
  height: 3px;
  width: 200px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
}
.vx-bar span {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 40%;
  border-radius: 999px;
  background: linear-gradient(90deg, #0066ff, #00d4ff);
  animation: vx-slide 1.8s ease-in-out infinite;
}
@keyframes vx-draw { to { stroke-dashoffset: 0; } }
@keyframes vx-fade { to { opacity: 1; } }
@keyframes vx-up { to { opacity: 1; transform: none; } }
@keyframes vx-pulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
@keyframes vx-slide { 0% { left: -40%; } 100% { left: 100%; } }
@media (prefers-reduced-motion: reduce) {
  .vx-glow, .vx-bar span { animation: none; }
  .vx-bar span { left: 30%; }
  .vx-edge { animation: none; stroke-dashoffset: 0; }
  .vx-fill { animation: none; opacity: 1; }
  .vx-rise { animation: none; opacity: 1; transform: none; }
}
`;

export default function MaintenancePage() {
  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-[#05070d] px-6 py-10 text-white"
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="vx-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="vx-glow pointer-events-none absolute inset-0" aria-hidden="true" />

      <main className="relative z-10 flex w-full max-w-lg flex-col items-center text-center">
        <svg
          className="vx-logo mb-6 h-24 w-auto"
          viewBox="-2 -2 104 84"
          role="img"
          aria-label="لوگوی VORIX.SECURITY"
        >
          <defs>
            <linearGradient id="vxL" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#1f6bff" />
              <stop offset="1" stopColor="#0033b8" />
            </linearGradient>
            <linearGradient id="vxR" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2af0ff" />
              <stop offset="1" stopColor="#00a2ff" />
            </linearGradient>
          </defs>
          <polygon className="vx-fill" points="0,0 16,8 50,62 50,80" fill="url(#vxL)" />
          <polygon className="vx-fill" points="100,0 84,8 50,62 50,80" fill="url(#vxR)" />
          <polygon className="vx-edge" pathLength={1} points="0,0 16,8 50,62 50,80" />
          <polygon className="vx-edge" pathLength={1} points="100,0 84,8 50,62 50,80" />
        </svg>

        <p
          className="vx-rise text-lg font-bold tracking-[0.35em] text-cyan-300"
          style={{ animationDelay: "1.1s" }}
          dir="ltr"
        >
          VORIX.SECURITY
        </p>

        <h1
          className="vx-rise mt-6 text-3xl font-black leading-relaxed sm:text-4xl"
          style={{ animationDelay: "1.4s" }}
        >
          سایت در حال بروزرسانی است
        </h1>

        <p
          className="vx-rise mt-4 max-w-md text-sm leading-8 text-neutral-400 sm:text-base"
          style={{ animationDelay: "1.6s" }}
        >
          در حال ساخت نسخه‌ای جدید، سریع‌تر و امن‌تر هستیم. به‌زودی برمی‌گردیم.
        </p>

        <div
          className="vx-rise vx-bar mt-8"
          style={{ animationDelay: "1.8s" }}
          role="status"
          aria-label="در حال بروزرسانی"
        >
          <span />
        </div>

        <div
          className="vx-rise mt-12 w-full rounded-2xl border border-cyan-500/20 bg-white/[0.03] p-5 text-sm text-neutral-300"
          style={{ animationDelay: "2s" }}
        >
          <p className="mb-3 text-neutral-400">
            برای ثبت سفارش و مشاوره در این مدت با ما در ارتباط باشید:
          </p>

          <div className="flex flex-col items-center gap-2">
            <a
              href="tel:09357781529"
              dir="ltr"
              className="font-mono text-lg font-bold text-cyan-300 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
            >
              09357781529
            </a>
            <a
              href="https://instagram.com/vorix.security"
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              className="text-neutral-200 hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
            >
              @vorix.security
            </a>
          </div>

          <p className="mt-4 text-xs leading-7 text-neutral-500">
            الیگودرز، میدان امام، پاساژ سینا، طبقه دوم
            <br />
            شنبه تا پنجشنبه، ۹ صبح تا ۸ شب
          </p>
        </div>
      </main>
    </div>
  );
}
