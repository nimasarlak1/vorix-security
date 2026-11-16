import { imgSrc } from '../lib/itemspec';

type Item = { id: string; title: string; image?: string };

// نوار باریک اعتماد زیر بخش اول صفحه (اول گوشی): روی گوشی یک ردیف قابل کشیدن به چپ و راست، روی صفحه‌های بزرگ‌تر چیدمان معمولی.
// فقط اگر مجوز/نماد/همکاری تأییدشده‌ای در پنل باشد دیده می‌شود.
export default function TrustBar({ items }: { items: Item[] }) {
  if (!items.length) return null;
  const shown = items.slice(0, 8);
  return (
    <div className="border-y border-white/10 bg-white/[0.02]">
      <div className="container-x py-4 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:py-5">
        <a href="#credentials" className="block py-1 text-sm font-bold text-neutral-300 hover:text-cyan-300 sm:shrink-0">
          مجوزها و همکاری‌ها ↓
        </a>
        <ul className="-mx-5 mt-3 flex snap-x items-center gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:mt-0 sm:flex-wrap sm:justify-end sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
          {shown.map((c) => (
            <li key={c.id} className="shrink-0 snap-start">
              <a
                href="#credentials"
                title={c.title}
                className="flex h-12 min-w-[5.5rem] items-center justify-center rounded-xl bg-white px-3"
              >
                {c.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imgSrc(c.image)} alt={c.title} loading="lazy" decoding="async" className="max-h-8 w-auto max-w-[6rem] object-contain" />
                ) : (
                  <span className="whitespace-nowrap text-xs font-black text-slate-800">{c.title}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
