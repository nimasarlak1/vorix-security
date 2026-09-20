import TypingCode from './TypingCode';
import { IconArrow, IconClock, IconPhone, IconPin } from './Icons';
import { SITE } from '../data/site';

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="container-x relative grid items-center gap-16 pb-24 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-32 lg:pt-20">
        <div>
          <p className="eyebrow">{SITE.legalName}</p>

          <h1 className="mt-5 text-[2.1rem] font-black leading-[1.45] sm:text-5xl sm:leading-[1.4] lg:text-[3.3rem]">
            امنیت دیجیتال و <span className="text-grad">ریکاوری اطلاعات</span> در الیگودرز
          </h1>

          <p className="rise mt-6 max-w-xl text-base leading-9 text-neutral-300 sm:text-lg" style={{ animationDelay: '0.15s' }}>
            بازیابی اطلاعات هارد و گوشی، نصب دوربین مداربسته، امنیت پیج و حساب‌ها، طراحی سایت و راهکارهای
            هوش مصنوعی؛ همه در یک دفتر حضوری.
          </p>

          <div className="rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: '0.3s' }}>
            <a href="#order" className="btn-primary">
              ثبت سفارش آنلاین
              <IconArrow className="h-4 w-4" />
            </a>
            <a href={`tel:${SITE.phone}`} className="btn-ghost">
              <IconPhone className="h-4 w-4 text-cyan-300" />
              <span dir="ltr">{SITE.phone}</span>
            </a>
          </div>

          <ul className="rise mt-10 flex flex-col gap-3 text-sm text-neutral-400 sm:flex-row sm:flex-wrap sm:gap-x-7" style={{ animationDelay: '0.45s' }}>
            <li className="flex items-center gap-2">
              <IconPin className="h-4 w-4 text-cyan-300" />
              دفتر حضوری: میدان امام، پاساژ سینا
            </li>
            <li className="flex items-center gap-2">
              <IconClock className="h-4 w-4 text-cyan-300" />
              {SITE.hours}
            </li>
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-sm pb-14 lg:max-w-md">
          <div className="scan relative overflow-hidden rounded-3xl border border-cyan-400/25 shadow-[0_0_70px_-12px_rgba(34,211,238,0.35)]">
            <img
              src="/hero-nima.webp"
              width={800}
              height={1000}
              alt={`${SITE.owner}، ${SITE.ownerTitle}`}
              fetchPriority="high"
              decoding="async"
              className="block h-auto w-full"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#05070d] via-[#05070d]/60 to-transparent" />
            <div className="absolute right-4 top-4 rounded-2xl border border-cyan-400/30 bg-[#05070d]/75 px-4 py-2 backdrop-blur">
              <p className="text-sm font-black leading-6 text-white">{SITE.owner}</p>
              <p className="text-[11px] leading-5 text-cyan-200">{SITE.ownerTitle}</p>
            </div>
          </div>

          <div className="float absolute -bottom-2 -right-2 w-[92%] sm:-right-6 sm:w-[96%]">
            <TypingCode />
          </div>
        </div>
      </div>
    </section>
  );
}
