import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '../../../lib/session';
import { isAllowedOrigin } from '../../../lib/security';

export const runtime = 'edge';

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ success: false, error: 'درخواست نامعتبر است.' }, { status: 403, headers: { 'Cache-Control': 'no-store' } });
  }
  const res = NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
  res.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  return res;
}
