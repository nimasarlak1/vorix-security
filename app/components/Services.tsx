import Reveal from './Reveal';
import { ServiceIconView } from './Icons';
import { SERVICES } from '../data/site';

export default function Services() {
  return (
    <section id="services" className="relative py-20 sm:py-28">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">۰۱ — خدمات</p>
          <h2 className="section-title mt-4">هر آنچه برای امنیت و سلامت دنیای دیجیتال شما لازم است</h2>
          <p className="mt-4 max-w-2xl text-neutral-400">
            از بازیابی اطلاعات تا نصب دوربین و ساخت سایت؛ هر خدمت با بررسی نیاز شما شروع می‌شود.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 90}>
              <article className="card group h-full p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/25 to-cyan-400/20 text-cyan-300 ring-1 ring-cyan-400/20 transition group-hover:from-blue-500/40 group-hover:to-cyan-400/35">
                  <ServiceIconView name={s.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-8 text-neutral-400">{s.text}</p>
                <ul className="mt-4 space-y-1.5 border-t border-white/5 pt-4 text-sm text-neutral-300">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
