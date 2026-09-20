import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '../../../lib/session';

export const runtime = 'edge';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  return res;
}
