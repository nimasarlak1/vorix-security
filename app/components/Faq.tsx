import Reveal from './Reveal';
import { IconPlus } from './Icons';
import { FAQS } from '../data/site';

export default function Faq() {
  return (
    <section id="faq" className="relative py-20 sm:py-28">
      <div className="container-x max-w-3xl">
        <Reveal>
          <p className="eyebrow">۰۵ — سؤالات متداول</p>
          <h2 className="section-title mt-4">پاسخ به سؤالات پرتکرار</h2>
        </Reveal>

        <div className="mt-10 space-y-3">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <details className="faq card group">
                <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 text-base font-bold text-white">
                  <span>{f.q}</span>
                  <IconPlus className="faq-icon h-5 w-5 shrink-0 text-cyan-300 transition-transform duration-300" />
                </summary>
                <p className="px-5 pb-5 leading-8 text-neutral-400">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
