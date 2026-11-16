import type { MetadataRoute } from 'next';
import { SITE } from './data/site';
import { SERVICES } from './data/services';

export const dynamic = 'force-static';

// وقتی صفحه‌ی جدیدی اضافه شد، آدرسش را اینجا اضافه کنید. صفحه‌های خدمت از فهرست خدمات ثابت ساخته می‌شوند.
export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date('2026-11-16');
  return [
    { url: `${SITE.url}/`, lastModified: updated, changeFrequency: 'weekly', priority: 1 },
    ...SERVICES.map((s) => ({ url: `${SITE.url}/services/${s.slug}`, lastModified: updated, changeFrequency: 'monthly' as const, priority: 0.8 })),
    { url: `${SITE.url}/cooperation`, lastModified: updated, changeFrequency: 'monthly', priority: 0.5 },
  ];
}
