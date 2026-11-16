// نمونه‌کارها فقط از پنل مدیریت وارد می‌شوند (هیچ نمونه‌ی پیش‌فرضی در کد نیست).
// حریم خصوصی مشتری را رعایت کنید: اطلاعات، تصویر افراد، پلاک و اسم مشتری بدون رضایت‌ش نمایش داده نشود.

import { imgSrc } from '../lib/itemspec';
import type { ServiceIcon } from './site';

export type Project = {
  title: string;
  category: string;
  icon: ServiceIcon;
  description: string;
  points?: string[];
  image?: string;
  url?: string;
  sample: boolean;
};

const ICON_BY_KEYWORD: [string, ServiceIcon][] = [
  ['ریکاوری', 'drive'],
  ['بازیابی', 'drive'],
  ['دوربین', 'camera'],
  ['امنیت', 'shield'],
  ['هک', 'shield'],
  ['هوش', 'ai'],
  ['مشاوره', 'chat'],
];

export function toProject(item: Record<string, any>): Project {
  const category = String(item.category || '');
  const icon = ICON_BY_KEYWORD.find(([k]) => category.includes(k))?.[1] || 'code';
  return {
    title: String(item.title || ''),
    category: category || 'نمونه‌کار',
    icon,
    description: String(item.description || ''),
    points: Array.isArray(item.points) && item.points.length ? item.points : undefined,
    image: item.image ? imgSrc(item.image) : undefined,
    url: item.url ? String(item.url) : undefined,
    sample: false,
  };
}
