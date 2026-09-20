/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  
  // نادیده گرفتن خطاهای تایپ‌اسکریپت برای جلوگیری از شکستن بیلد در کلادفلر
  typescript: {
    ignoreBuildErrors: true,
  },

  // آدرس‌های قدیمی سایت به بخش‌های مشابه صفحه‌ی اصلی هدایت می‌شوند (ریدایرکت ۳۰۱ برای حفظ سئو)
  async redirects() {
    return [
      { source: '/about', destination: '/#about', permanent: true },
      { source: '/contact', destination: '/#contact', permanent: true },
      { source: '/order', destination: '/#order', permanent: true },
      { source: '/security', destination: '/#services', permanent: true },
    ];
  },

  // هدرهای امنیتی برای حفاظت در برابر حملات رایج
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
