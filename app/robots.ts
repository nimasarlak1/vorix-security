import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://vorixsecurity.ir';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/admin/login'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

