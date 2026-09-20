import { SITE } from '../data/site';

const LINKS = [
  { href: '#services', label: 'خدمات' },
  { href: '#portfolio', label: 'نمونه‌کارها' },
  { href: '#about', label: 'درباره ما' },
  { href: '#order', label: 'ثبت سفارش' },
  { href: '#faq', label: 'سؤالات متداول' },
  { href: '#contact', label: 'تماس' },
];

export default function Footer() {
  const year = new Date().toLocaleDateString('fa-IR', { year: 'numeric' });

  return (
    <footer className="border-t border-white/[0.06] bg-[#04060b]">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src="/logo-mark.png" width={512} height={404} alt="" className="h-9 w-auto" loading="lazy" />
            <span className="font-black tracking-[0.18em]" dir="ltr">
              VORIX<span className="text-cyan-300">.SECURITY</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-8 text-neutral-500">
            {SITE.legalName}؛ ریکاوری اطلاعات، دوربین مداربسته، امنیت دیجیتال، طراحی سایت و هوش مصنوعی در {SITE.city}.
          </p>
        </div>

        <nav aria-label="پیوندهای فوتر">
          <p className="text-sm font-bold text-white">دسترسی سریع</p>
          <ul className="mt-4 space-y-2 text-sm text-neutral-400">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="nav-link">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-sm font-bold text-white">ارتباط با ما</p>
          <ul className="mt-4 space-y-2 text-sm text-neutral-400">
            <li>
              <a href={`tel:${SITE.phone}`} dir="ltr" className="nav-link">
                {SITE.phone}
              </a>
            </li>
            <li>
              <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer" className="nav-link">
                واتساپ
              </a>
            </li>
            <li>
              <a href={SITE.telegramUrl} target="_blank" rel="noopener noreferrer" dir="ltr" className="nav-link">
                @{SITE.telegram}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} dir="ltr" className="nav-link">
                {SITE.email}
              </a>
            </li>
            <li>
              <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" dir="ltr" className="nav-link">
                @{SITE.instagram}
              </a>
            </li>
            <li>{SITE.address}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.05] py-5 text-center text-xs text-neutral-600">
        © {year} {SITE.legalName}. تمامی حقوق محفوظ است.
      </div>
    </footer>
  );
}
