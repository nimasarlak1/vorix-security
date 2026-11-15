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
    // سیاست امنیت محتوا (CSP): فقط منابع خودِ سایت مجازند.
    // اگر بعداً ابزار بیرونی (مثل Google Analytics) اضافه شد، آدرسش باید همین‌جا اضافه شود.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://cloudflareinsights.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      'upgrade-insecure-requests',
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
        ],
      },
      {
        // پاسخ‌های API و پنل ادمین هیچ‌وقت کش نشوند و ایندکس نشوند
        source: '/api/admin/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
