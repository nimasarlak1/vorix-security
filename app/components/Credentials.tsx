import Reveal from './Reveal';
import { imgSrc } from '../lib/itemspec';

type Cred = {
  id: string;
  title: string;
  group?: string;
  issuer?: string;
  number?: string;
  date?: string;
  image?: string;
  link?: string;
};

// فقط مواردی که مدیر در پنل «تأییدشده» کرده نمایش داده می‌شوند. اگر هیچ موردی نباشد، این بخش اصلاً دیده نمی‌شود.
// سه گروه: مجوز/تأییدیه (کارت)، نماد اعتماد و همکاری (کاشی‌های لوگو). مواردی که گروه ندارند مجوز حساب می‌شوند.
function Logo({ c }: { c: Cred }) {
  const inner = (
    <>
      <div className="flex h-20 w-full items-center justify-center rounded-xl bg-white p-3">
        {c.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imgSrc(c.image)} alt={c.title} loading="lazy" decoding="async" className="max-h-full max-w-full object-contain" />
        ) : (
          <span className="text-center text-sm font-black leading-6 text-slate-800">{c.title}</span>
        )}
      </div>
      <p className="mt-3 text-center text-sm font-bold leading-6 text-neutral-200">{c.title}</p>
      {c.link && <p className="mt-1 text-center text-sm font-bold text-cyan-300">مشاهده و استعلام ↗</p>}
    </>
  );
  return c.link ? (
    <a href={c.link} target="_blank" rel="noopener noreferrer" className="card block p-4">
      {inner}
    </a>
  ) : (
    <div className="card p-4">{inner}</div>
  );
}

function Group({ title, items }: { title: string; items: Cred[] }) {
  if (!items.length) return null;
  return (
    <div className="mt-10 sm:mt-12">
      <h3 className="text-lg font-black text-white">{title}</h3>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {items.map((c) => (
          <li key={c.id}>
            <Logo c={c} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Credentials({ items }: { items: Cred[] }) {
  if (!items.length) return null;
  const licenses = items.filter((c) => !c.group || c.group === 'license');
  const trust = items.filter((c) => c.group === 'trust');
  const partners = items.filter((c) => c.group === 'partner');

  return (
    <section id="credentials" className="relative scroll-mt-24 py-12 sm:py-20">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">اعتبار و اعتماد</p>
          <h2 className="section-title mt-4">مجوزها، نمادهای اعتماد و همکاری‌ها</h2>
        </Reveal>

        {licenses.length > 0 && (
          <ul className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {licenses.map((c) => (
              <li key={c.id} className="card flex flex-col p-5">
                {c.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imgSrc(c.image)} alt={c.title} loading="lazy" decoding="async" className="mb-4 h-40 w-full rounded-xl bg-white/5 object-contain" />
                )}
                <h3 className="font-bold text-white">{c.title}</h3>
                {c.issuer && <p className="mt-1 text-sm text-neutral-400">صادرکننده: {c.issuer}</p>}
                {c.number && (
                  <p className="text-sm text-neutral-400">
                    شماره: <span dir="ltr">{c.number}</span>
                  </p>
                )}
                {c.date && <p className="text-sm text-neutral-400">تاریخ: {c.date}</p>}
                {c.link && (
                  <a href={c.link} target="_blank" rel="noopener noreferrer" className="mt-auto inline-block py-2 pt-3 text-sm font-bold text-cyan-300">
                    مشاهده و استعلام ↗
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}

        <Group title="نمادهای اعتماد" items={trust} />
        <Group title="همکاری‌ها" items={partners} />
      </div>
    </section>
  );
}
