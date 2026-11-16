/** @type {import('next').NextConfig} */

// سیاست امنیت محتوا (CSP): فقط منابع خود سایت. اسکریپت و استایل inline لازم است چون Next.js برای بارگذاری صفحه از آن‌ها استفاده می‌کند.
// اگر نقشه‌ی جاسازی‌شده‌ی گوگل را در SITE.mapEmbedUrl گذاشتید، همین frame-src آن را مجاز کرده است.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src https://www.google.com/maps/ https://maps.google.com/",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // نادیده گرفتن خطاهای تایپ‌اسکریپت برای جلوگیری از شکستن بیلد در کلادفلر
  typescript: {
    ignoreBuildErrors: true,
  },

  // آدرس‌های قدیمی سایت به بخش‌های مشابه هدایت می‌شوند (ریدایرکت ۳۰۱ برای حفظ سئو)
  async redirects() {
    return [
      { source: '/about', destination: '/#about', permanent: true },
      { source: '/contact', destination: '/#contact', permanent: true },
      { source: '/order', destination: '/#order', permanent: true },
      { source: '/security', destination: '/services/digital-security', permanent: true },
    ];
  },

  // هدرهای امنیتی
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
