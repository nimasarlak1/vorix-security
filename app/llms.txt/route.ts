import { SERVICES } from '../data/services';
import { SITE } from '../data/site';

export const dynamic = 'force-static';

// فایل llms.txt: معرفی کوتاه و ساخت‌یافته‌ی سایت برای هوش مصنوعی‌ها و موتورهای پاسخ‌گو
export function GET() {
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.tagline}. دفتر فیزیکی در ${SITE.address}. بیشتر خدمات به‌صورت آنلاین برای همه‌ی شهرهای ایران انجام می‌شود.`,
    '',
    '## اطلاعات تماس',
    `- تلفن، واتساپ و تلگرام: ${SITE.phone}`,
    `- ایمیل: ${SITE.email}`,
    `- اینستاگرام: ${SITE.instagramUrl}`,
    `- ساعت کاری: ${SITE.hours}`,
    '',
    '## خدمات',
    ...SERVICES.map((s) => `- [${s.title}](${SITE.url}/services/${s.slug}): ${s.text}`),
    '',
    '## صفحات مهم',
    `- [صفحه‌ی اصلی](${SITE.url}/)`,
    `- [محصولات دوربین مداربسته](${SITE.url}/products)`,
    `- [درخواست همکاری](${SITE.url}/cooperation)`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
