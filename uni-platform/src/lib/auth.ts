import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'uni_admin_session';
const JWT_SECRET = process.env.JWT_SECRET || 'uni-employment-organization-secret-key-2026';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface AdminSessionPayload {
  id: string;
  email: string;
  name: string;
  role: string;
  exp: number;
}

// Generate a signed token using crypto HMAC
export function signSessionToken(payload: Omit<AdminSessionPayload, 'exp'>): string {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 days
  const data: AdminSessionPayload = { ...payload, exp };
  const encodedData = Buffer.from(JSON.stringify(data)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(encodedData)
    .digest('base64url');
  return `${encodedData}.${signature}`;
}

export function verifySessionToken(token: string): AdminSessionPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [encodedData, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(encodedData)
      .digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const data: AdminSessionPayload = JSON.parse(Buffer.from(encodedData, 'base64url').toString('utf-8'));
    if (data.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return data;
  } catch (err) {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      // Fallback check for legacy admin_auth cookie during transition
      const legacyAuth = cookieStore.get('admin_auth')?.value;
      if (legacyAuth === 'true') {
        return {
          id: 'legacy-admin',
          email: 'admin@uni.org',
          name: 'Administrator',
          role: 'ADMIN',
          exp: Math.floor(Date.now() / 1000) + 86400
        };
      }
      return null;
    }
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function setAdminSessionCookie(payload: Omit<AdminSessionPayload, 'exp'>) {
  const token = signSessionToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  });
  // Also set legacy cookie for backwards compatibility
  cookieStore.set('admin_auth', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete('admin_auth');
}
