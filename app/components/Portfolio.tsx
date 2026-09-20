import Reveal from './Reveal';
import { ServiceIconView } from './Icons';
import { PROJECTS } from '../data/portfolio';
import type { ServiceIcon } from '../data/site';

// هر دسته‌ی خدمت یک ترکیب رنگی مخصوص به خودش می‌گیرد تا کارت‌ها حتی بدون عکس واقعی
// از هم متمایز باشند و ظاهر یک‌دست و تکراری نداشته باشند.
const COVER_STYLE: Record<ServiceIcon, string> = {
  drive: 'from-[#0b1a3a] via-[#08121f] to-[#06202b]',
  camera: 'from-[#1a0b3a] via-[#12081f] to-[#200626]',
  shield: 'from-[#0b3a1e] via-[#081f16] to-[#062b20]',
  code: 'from-[#3a230b] via-[#1f1508] to-[#2b1e06]',
  ai: 'from-[#3a0b2a] via-[#1f0817] to-[#2b0620]',
  chat: 'from-[#0b2a3a] via-[#081a1f] to-[#062028]',
};

export default function Portfolio() {
  const hasSamples = PROJECTS.some((p) => p.sample);

  return (
    <section id="portfolio" className="relative py-20 sm:py-28">
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

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.title} delay={(i % 2) * 100}>
              <article className="card group h-full overflow-hidden">
                <div className={`relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br ${COVER_STYLE[p.icon]}`}>
                  {p.image ? (
                    <img src={p.image} alt={p.title} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  ) : (
                    <>
                      <div className="grid-bg absolute inset-0 opacity-70" aria-hidden="true" />
                      <ServiceIconView
                        name={p.icon}
                        className="relative h-16 w-16 text-cyan-300/80 transition duration-500 group-hover:scale-110 group-hover:text-cyan-200"
                      />
                    </>
                  )}
                  {p.sample && (
                    <span className="absolute left-3 top-3 rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-0.5 text-[11px] font-bold text-amber-200">
                      نمونه
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-xs font-bold text-cyan-300">{p.category}</p>
                  <h3 className="mt-2 text-lg font-bold text-white">{p.title}</h3>
                  <p className="mt-2 text-sm leading-8 text-neutral-400">{p.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
