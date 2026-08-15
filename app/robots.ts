import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://vorix-security.nimasarlak380.workers.dev';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/admin/login'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

