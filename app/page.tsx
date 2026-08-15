export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-cyan-500 selection:text-neutral-950">
      {/* بخش هیرو (بالای صفحه) */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pt-40 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.12)_0,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center space-y-6">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-loose">
            حفاظت از دارایی‌های دیجیتال با <br />
            <span className="text-cyan-400 drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]">
              VORIX.SECURITY
            </span>
          </h1>
          
          <p className="text-neutral-300 text-xs sm:text-sm md:text-lg max-w-2xl leading-relaxed px-2">
            ریکاوری پیشرفته اطلاعات، نصب و بهینه‌سازی دوربین‌های مداربسته و راهکارهای هوش مصنوعی در استان لرستان و پشتیبانی آنلاین.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 w-full justify-center px-4">
            <a
              href="#contact"
              className="bg-cyan-400 hover:bg-cyan-500 text-neutral-950 font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 text-center text-sm sm:text-base"
            >
              درخواست مشاوره فوری و ثبت سفارش
            </a>
            <a
              href="#services"
              className="bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 font-semibold px-6 py-3.5 rounded-xl transition-all text-center text-sm sm:text-base"
            >
              مشاهده خدمات تخصصی
            </a>
          </div>
        </div>
      </section>

      {/* بخش خدمات تخصصی */}
      <section id="services" className="py-24 px-4 bg-neutral-900/40 border-t border-neutral-800/60 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-extrabold text-cyan-400 mb-4">خدمات تخصصی VORIX</h2>
            <p className="text-neutral-400 text-sm md:text-base">ارائه راهکارهای حرفه‌ای امنیت دیجیتال و فناوری در استان لرستان</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800 hover:border-cyan-500/50 transition">
              <div className="text-cyan-400 text-2xl mb-4 font-bold">01</div>
              <h3 className="text-xl font-bold mb-2">ریکاوری پیشرفته اطلاعات</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">بازیابی اطلاعات از دست رفته گوشی، هارد، دوربین و تجهیزات دیجیتال با بالاترین ضریب موفقیت.</p>
            </div>
            
            <div className="bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800 hover:border-cyan-500/50 transition">
              <div className="text-cyan-400 text-2xl mb-4 font-bold">02</div>
              <h3 className="text-xl font-bold mb-2">دوربین‌های مداربسته</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">نصب، مکان‌یابی حرفه‌ای و افزایش کیفیت و بررسی فیلم‌های دوربین مداربسته.</p>
            </div>

            <div className="bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800 hover:border-cyan-500/50 transition">
              <div className="text-cyan-400 text-2xl mb-4 font-bold">03</div>
              <h3 className="text-xl font-bold mb-2">امنیت و راهکارهای هوش مصنوعی</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">امنیت حساب‌ها، ریکاوری پیج‌های از دست رفته و راهکارهای نوین هوش مصنوعی.</p>
            </div>
          </div>
        </div>
      </section>

      {/* بخش تماس و ثبت سفارش */}
      <section id="contact" className="py-24 px-4 border-t border-neutral-800/60 scroll-mt-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-extrabold text-cyan-400 mb-4">ثبت سفارش و ارتباط با ما</h2>
          <p className="text-neutral-400 text-sm md:text-base mb-8">برای دریافت مشاوره تخصصی یا ثبت درخواست خدمات با ما در ارتباط باشید.</p>
          
          <div className="bg-neutral-900/60 p-8 rounded-3xl border border-neutral-800 shadow-2xl flex flex-col items-center space-y-6">
            <p className="text-neutral-300">شماره تماس پشتیبانی و مشاوره:</p>
            <a href="tel:09357781529" className="text-2xl md:text-3xl font-mono font-bold text-cyan-400 hover:underline">
              09357781529
            </a>
            <p className="text-sm text-neutral-500">استان لرستان - پشتیبانی آنلاین و حضوری</p>
          </div>
        </div>
      </section>
    </main>
  );
}
