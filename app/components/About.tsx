import Reveal from './Reveal';
import { IconClock, IconPin } from './Icons';
import { SITE } from '../data/site';

export default function About() {
  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <div className="relative mx-auto max-w-sm">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-blue-500/25 to-cyan-400/10 blur-2xl" aria-hidden="true" />
            <img
              src="/about-nima.webp"
              width={800}
              height={1000}
              alt={`${SITE.owner}، مدیر ${SITE.name}`}
              loading="lazy"
              decoding="async"
              className="relative block h-auto w-full rounded-3xl border border-cyan-400/20"
            />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <p className="eyebrow">۰۳ — درباره ما</p>
          <h2 className="section-title mt-4">دفتر خدمات دیجیتال VORIX.SECURITY</h2>
          <p className="mt-5 leading-9 text-neutral-300">
            من {SITE.owner} هستم؛ {SITE.ownerTitle}. VORIX.SECURITY یک دفتر خدمات دیجیتال در {SITE.city} است که
            ریکاوری اطلاعات، دوربین مداربسته، امنیت دیجیتال، برنامه‌نویسی و هوش مصنوعی را در یک مجموعه ارائه
            می‌کند.
          </p>
          <p className="mt-4 leading-9 text-neutral-400">
            می‌توانید به‌صورت حضوری به دفتر مراجعه کنید، تلفنی مشاوره بگیرید یا از طریق فرم سفارش همین صفحه
            درخواست خود را ثبت کنید.
          </p>

          <ul className="mt-8 grid gap-3 text-sm text-neutral-300 sm:grid-cols-2">
            <li className="card flex items-start gap-3 p-4">
              <IconPin className="mt-1 h-5 w-5 shrink-0 text-cyan-300" />
              <span>{SITE.address}</span>
            </li>
            <li className="card flex items-start gap-3 p-4">
              <IconClock className="mt-1 h-5 w-5 shrink-0 text-cyan-300" />
              <span>{SITE.hours}</span>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
