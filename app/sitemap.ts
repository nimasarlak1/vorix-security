import type { MetadataRoute } from 'next';
import { SITE } from './data/site';

export const dynamic = 'force-static';

// وقتی صفحه‌ی جدیدی (مثلاً بلاگ یا صفحه‌ی خدمت) اضافه شد، آدرسش را اینجا اضافه کنید.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE.url}/`,
      lastModified: new Date('2026-09-20'),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
