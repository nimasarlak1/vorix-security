// نمونه‌کارها. هر پروژه را که واقعی شد اینجا جایگزین کنید.
// - sample: true  → روی کارت برچسب «نمونه» نمایش داده می‌شود. برای پروژه‌ی واقعی false کنید.
// - image: (اختیاری) مسیر عکس، مثلاً '/projects/hard.webp' (فایل را داخل پوشه public/projects بگذارید).
// حریم خصوصی مشتری را رعایت کنید: اطلاعات، تصویر افراد، پلاک و اسم مشتری بدون رضایت‌ش نمایش داده نشود.

import type { ServiceIcon } from './site';

export type Project = {
  title: string;
  category: string;
  icon: ServiceIcon;
  description: string;
  image?: string;
  sample: boolean;
};

export const PROJECTS: Project[] = [
  {
    title: 'بازیابی اطلاعات از هارد اکسترنال',
    category: 'ریکاوری اطلاعات',
    icon: 'drive',
    description: 'بررسی سلامت دستگاه، تشخیص علت خرابی و بازیابی فایل‌ها بدون آسیب بیشتر به هارد.',
    sample: true,
  },
  {
    title: 'نصب دوربین مداربسته برای فروشگاه',
    category: 'دوربین مداربسته',
    icon: 'camera',
    description: 'انتخاب نقاط دید، نصب دوربین‌ها و تنظیم دسترسی از راه دور روی موبایل.',
    sample: true,
  },
  {
    title: 'طراحی سایت شرکتی',
    category: 'طراحی سایت',
    icon: 'code',
    description: 'سایت معرفی سریع و ریسپانسیو با فرم سفارش و سئوی پایه.',
    sample: true,
  },
  {
    title: 'امن‌سازی پیج اینستاگرام',
    category: 'امنیت دیجیتال',
    icon: 'shield',
    description: 'بررسی تنظیمات امنیتی، فعال‌سازی تأیید دومرحله‌ای و آموزش نکات پیشگیری.',
    sample: true,
  },
];
