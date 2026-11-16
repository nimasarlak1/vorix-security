export const runtime = 'edge';

// اسکریپت کوچک امضا برای سایت مشتری. فقط یک اعلان بی‌صدا به سایت ما می‌فرستد (آدرس سایت مشتری از هدر Referer خوانده می‌شود).
// سایت مشتری خودکار به فهرست «در انتظار تأیید» اضافه می‌شود و فقط با تأیید مدیر در سایت نمایش داده می‌شود.
export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const js = `(function(){try{var i=new Image();i.referrerPolicy='origin';i.src='${origin}/api/sig/ping?t='+encodeURIComponent((document.title||'').slice(0,80));}catch(e){}})();`;
  return new Response(js, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
