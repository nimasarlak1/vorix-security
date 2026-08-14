export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-100 flex" dir="rtl">

      {/* منوی کناری */}
      <aside className="w-64 bg-black text-white p-6">
        <h2 className="text-2xl font-bold mb-8">
          Vorix Security
        </h2>

        <nav className="space-y-5 text-right">
          <p>داشبورد</p>
          <p>وضعیت امنیت</p>
          <p>تهدیدها</p>
          <p>گزارش‌ها</p>
          <p>تنظیمات</p>
        </nav>
      </aside>


      {/* محتوای اصلی */}
      <section className="flex-1 p-8">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-bold">
            پنل امنیتی مشتری
          </h1>

          <button className="bg-black text-white px-5 py-2 rounded">
            حساب کاربری
          </button>

        </div>


        {/* کارت‌ها */}
        <div className="grid md:grid-cols-3 gap-6">


          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold">
              وضعیت حفاظت
            </h3>
            <p className="mt-3 text-green-600">
              فعال و محافظت شده
            </p>
          </div>


          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold">
              تهدیدهای شناسایی شده
            </h3>
            <p className="mt-3">
              ۰ مورد
            </p>
          </div>


          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold">
              وضعیت سرویس
            </h3>
            <p className="mt-3">
              آنلاین
            </p>
          </div>


        </div>


        {/* گزارش‌ها */}
        <div className="bg-white rounded-xl shadow p-6 mt-8">

          <h2 className="text-xl font-bold">
            گزارش امنیتی
          </h2>

          <p className="mt-3">
            تاکنون هیچ رویداد امنیتی ثبت نشده است.
          </p>

        </div>


        {/* اطلاعات مشتری */}
        <div className="bg-white rounded-xl shadow p-6 mt-8">

          <h2 className="text-xl font-bold">
            اطلاعات سرویس
          </h2>

          <div className="mt-4 space-y-2">
            <p>سطح حفاظت: پیشرفته</p>
            <p>وضعیت اشتراک: فعال</p>
            <p>آخرین بررسی: امروز</p>
          </div>

        </div>


      </section>

    </main>
  );
}
