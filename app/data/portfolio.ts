// نمونه‌کارها. هر پروژه را که واقعی شد اینجا جایگزین کنید.
// - sample: true  → روی کارت برچسب «نمونه» نمایش داده می‌شود. برای پروژه‌ی واقعی false کنید.
// - image: مسیر عکس؛ فایل‌ها داخل پوشه‌ی public/projects هستند. برای پروژه‌ی واقعی عکس واقعی را جایگزین کنید.
// حریم خصوصی مشتری را رعایت کنید: اطلاعات، تصویر افراد، پلاک و اسم مشتری بدون رضایت‌ش نمایش داده نشود.

import type { ServiceIcon } from './site';

export type Project = {
  title: string;
  category: string;
  icon: ServiceIcon;
  description: string;
  points?: string[];
  image?: string;
  sample: boolean;
};

export const PROJECTS: Project[] = [
  {
    title: 'بازیابی اطلاعات از هارد اکسترنال',
    category: 'ریکاوری اطلاعات',
    icon: 'drive',
    description: 'بررسی سلامت دستگاه، تشخیص علت خرابی و بازیابی فایل‌ها بدون آسیب بیشتر به هارد.',
    points: ['تشخیص علت خرابی', 'بازیابی فایل‌های مهم', 'تحویل دسته‌بندی‌شده'],
    image: '/projects/recovery.webp',
    sample: true,
  },
  {
    title: 'نصب دوربین مداربسته برای فروشگاه',
    category: 'دوربین مداربسته',
    icon: 'camera',
    description: 'انتخاب نقاط دید، نصب دوربین‌ها و تنظیم دسترسی از راه دور روی موبایل.',
    points: ['انتخاب نقاط دید', 'نصب و کابل‌کشی اصولی', 'مشاهده‌ی زنده روی موبایل'],
    image: '/projects/cctv.webp',
    sample: true,
  },
  {
    title: 'طراحی سایت شرکتی',
    category: 'طراحی سایت',
    icon: 'code',
    description: 'سایت معرفی سریع و ریسپانسیو با فرم سفارش و سئوی پایه.',
    points: ['سازگار با موبایل', 'فرم سفارش و تماس', 'سئوی پایه'],
    image: '/projects/website.webp',
    sample: true,
  },
  {
    title: 'امن‌سازی پیج اینستاگرام',
    category: 'امنیت دیجیتال',
    icon: 'shield',
    description: 'بررسی تنظیمات امنیتی، فعال‌سازی تأیید دومرحله‌ای و آموزش نکات پیشگیری.',
    points: ['تأیید دومرحله‌ای', 'بررسی نشست‌ها و دستگاه‌ها', 'آموزش پیشگیری'],
    image: '/projects/instagram.webp',
    sample: true,
  },
  {
    title: 'دستیار هوشمند پاسخ‌گویی به مشتریان',
    category: 'هوش مصنوعی',
    icon: 'ai',
    description: 'راه‌اندازی دستیار هوش مصنوعی برای پاسخ به سؤالات پرتکرار و ثبت خودکار درخواست‌ها.',
    points: ['پاسخ به سؤالات پرتکرار', 'ثبت خودکار درخواست', 'اعلان در تلگرام'],
    image: '/projects/ai.webp',
    sample: true,
  },
  {
    title: 'مشاوره انتخاب تجهیزات قبل از خرید',
    category: 'مشاوره فنی',
    icon: 'chat',
    description: 'بررسی نیاز و بودجه، مقایسه‌ی گزینه‌ها و پیشنهاد مناسب‌ترین انتخاب پیش از خرید.',
    points: ['بررسی نیاز و بودجه', 'مقایسه‌ی گزینه‌ها', 'پیشنهاد شفاف'],
    image: '/projects/consulting.webp',
    sample: true,
  },
];
