export default function Home() {
  return (
    <main className="relative min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center overflow-hidden px-4 pt-36 pb-16">
      {/* افکت پس‌زمینه نوری و شبکه‌ای سایبری */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.12)_0,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* محتوای اصلی بخش هیرو */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center space-y-6">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-relaxed">
          حفاظت از دارایی‌های دیجیتال با <br />
          <span className="text-cyan-400 drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]">
            VORIX.SECURITY
          </span>
        </h1>
        
        <p className="text-neutral-300 text-sm md:text-lg max-w-2xl leading-relaxed">
          ریکاوری پیشرفته اطلاعات، نصب و بهینه‌سازی دوربین‌های مداربسته و راهکارهای هوش مصنوعی در استان لرستان و پشتیبانی آنلاین.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-6 w-full justify-center">
          <a
            href="#contact"
            className="bg-cyan-400 hover:bg-cyan-500 text-neutral-950 font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 text-center"
          >
            درخواست مشاوره فوری و ثبت سفارش
          </a>
          <a
            href="#services"
            className="bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 font-semibold px-8 py-3.5 rounded-xl transition-all text-center"
          >
            مشاهده خدمات تخصصی
          </a>
        </div>
      </div>
    </main>
  );
}
