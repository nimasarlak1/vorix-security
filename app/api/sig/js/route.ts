import { getDBSafe } from '../../../lib/db';
import { registerSignature } from '../../../lib/sig';

export const runtime = 'edge';

// اسکریپت کوچک امضا برای سایت مشتری. سایت مشتری از خود همین درخواست (هدر Referer) به فهرست «در انتظار تأیید» اضافه می‌شود
// و فقط با تأیید مدیر در سایت نمایش داده می‌شود. بیکن عکس فقط برای گرفتن عنوان صفحه است و اگر CSP سایت مشتری ببندد، مشکلی ایجاد نمی‌کند.
export async function GET(request: Request) {
  const db = getDBSafe(); // کانتکست Cloudflare قبل از هر await
  const origin = new URL(request.url).origin;
  await registerSignature(db, request, null);
  const js = `(function(){try{var i=new Image();i.referrerPolicy='origin';i.src='${origin}/api/sig/ping?t='+encodeURIComponent((document.title||'').slice(0,80));}catch(e){}})();`;
  return new Response(js, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=0',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
