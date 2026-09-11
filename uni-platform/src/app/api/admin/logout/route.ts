import { NextResponse } from 'next/server';
import { clearAdminSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    await clearAdminSessionCookie();
    
    // Check if the request expects HTML redirect or JSON
    const acceptHeader = request.headers.get('accept') || '';
    if (acceptHeader.includes('text/html')) {
      return NextResponse.redirect(new URL('/admin/login', request.url), 303);
    }

    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  await clearAdminSessionCookie();
  return NextResponse.redirect(new URL('/admin/login', request.url), 303);
}
