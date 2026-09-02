import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete('admin_auth');
  
  // Redirect to login page
  return NextResponse.redirect(new URL('/admin/login', request.url), {
    status: 302,
  });
}
