import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parseSessionToken, SESSION_COOKIE } from './app/lib/session';

export const config = {
  matcher: ['/admin/:path*'],
};

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  const secret = process.env.SESSION_SECRET || '';
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!(await parseSessionToken(secret, token))) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
