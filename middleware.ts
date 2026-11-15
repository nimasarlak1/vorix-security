import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, SESSION_COOKIE } from './app/lib/session';

export const config = {
  matcher: ['/admin/:path*'],
};

// صفحات پنل هرگز کش یا ایندکس نمی‌شوند
function protect(res: NextResponse) {
  res.headers.set('Cache-Control', 'no-store');
  res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return res;
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin/login')) {
    return protect(NextResponse.next());
  }

  const secret = process.env.SESSION_SECRET || '';
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!(await verifySessionToken(secret, token))) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return protect(NextResponse.redirect(url));
  }

  return protect(NextResponse.next());
}
