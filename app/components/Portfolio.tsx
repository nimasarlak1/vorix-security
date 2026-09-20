import Reveal from './Reveal';
import { ServiceIconView } from './Icons';
import { PROJECTS } from '../data/portfolio';

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
                <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-[#0b1a3a] via-[#08121f] to-[#06202b]">
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
