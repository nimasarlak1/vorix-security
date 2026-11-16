import Reveal from './Reveal';
import { imgSrc } from '../lib/itemspec';

type Cred = { id: string; title: string; issuer?: string; number?: string; date?: string; image?: string; link?: string };

// فقط مجوزها و تأییدیه‌هایی که مدیر در پنل «تأییدشده» کرده نمایش داده می‌شوند. اگر موردی نباشد، این بخش اصلاً دیده نمی‌شود.
export default function Credentials({ items }: { items: Cred[] }) {
  if (!items.length) return null;
  return (
    <section id="credentials" className="relative py-16 sm:py-20">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">مجوزها و تأییدیه‌ها</p>
          <h2 className="section-title mt-4">مجوزها، تأییدیه‌ها و همکاری‌ها</h2>
        </Reveal>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <li key={c.id} className="card p-5">
              {c.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imgSrc(c.image)} alt={c.title} loading="lazy" decoding="async" className="mb-4 h-40 w-full rounded-xl bg-white/5 object-contain" />
              )}
              <h3 className="font-bold text-white">{c.title}</h3>
              {c.issuer && <p className="mt-1 text-sm text-neutral-400">صادرکننده: {c.issuer}</p>}
              {c.number && <p className="text-sm text-neutral-400">شماره: <span dir="ltr">{c.number}</span></p>}
              {c.date && <p className="text-sm text-neutral-400">تاریخ: {c.date}</p>}
              {c.link && (
                <a href={c.link} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-bold text-cyan-300">
                  مشاهده و استعلام ↗
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
