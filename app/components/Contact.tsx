import Reveal from './Reveal';
import { IconClock, IconInstagram, IconMail, IconPhone, IconPin } from './Icons';
import { SITE } from '../data/site';

const ITEMS = [
  { icon: IconPhone, label: 'تلفن', value: SITE.phone, href: `tel:${SITE.phone}`, ltr: true },
  { icon: IconInstagram, label: 'اینستاگرام', value: `@${SITE.instagram}`, href: SITE.instagramUrl, ltr: true, external: true },
  { icon: IconMail, label: 'ایمیل', value: SITE.email, href: `mailto:${SITE.email}`, ltr: true },
  { icon: IconPin, label: 'آدرس دفتر', value: SITE.address, href: SITE.mapsUrl, external: true },
  { icon: IconClock, label: 'ساعت کاری', value: SITE.hours },
];

export default function Contact() {
  return (
    <section id="contact" className="relative py-20 sm:py-28">
      <div className="container-x grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">۰۶ — تماس</p>
          <h2 className="section-title mt-4">راه‌های ارتباط با ما</h2>
          <p className="mt-4 text-neutral-400">
            {SITE.legalName}؛ {SITE.address}
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {ITEMS.map((it) => {
              const Icon = it.icon;
              const body = (
                <>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-400/20">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-neutral-500">{it.label}</span>
                    <span className={`block break-words text-sm font-bold text-white ${it.ltr ? 'text-right' : ''}`} dir={it.ltr ? 'ltr' : undefined}>
                      {it.value}
                    </span>
                  </span>
                </>
              );
              return (
                <li key={it.label}>
                  {it.href ? (
                    <a
                      href={it.href}
                      {...(it.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="card flex h-full items-center gap-3 p-4"
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="card flex h-full items-center gap-3 p-4">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative mx-auto max-w-sm">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-tr from-cyan-400/15 to-blue-500/20 blur-2xl" aria-hidden="true" />
            <img
              src="/office.webp"
              width={900}
              height={820}
              alt={`دفتر ${SITE.legalName} در ${SITE.city}`}
              loading="lazy"
              decoding="async"
              className="relative block h-auto w-full rounded-3xl border border-cyan-400/20"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
