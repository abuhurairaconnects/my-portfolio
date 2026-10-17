'use server';

import { cookies } from 'next/headers';
import { getInquiries, updateInquiryStatus, deleteInquiry, saveInquiry, Inquiry } from '../lib/inquiriesStore';
import {
  verifyAdminPassword,
  setAdminPassword,
  getAdminConfig,
  setQuickAccess,
  createAdminSessionToken,
  verifyAdminSessionToken,
} from '../lib/authStore';

const SESSION_COOKIE_NAME = 'ah_admin_session';

/**
 * Server-Side Access Control Guard (STRIX-SEC-01)
 * Checks server-side cryptographic cookie or explicit client token.
 */
async function assertAdminAuthenticated(clientToken?: string): Promise<void> {
  // 1. Check explicit client token if supplied
  if (clientToken && verifyAdminSessionToken(clientToken)) {
    return;
  }

  // 2. Check HTTP session cookie
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (sessionToken && verifyAdminSessionToken(sessionToken)) {
      return;
    }
  } catch {}

  throw new Error('Access Denied: Valid administrator session required.');
}

export async function checkAdminSessionAction(clientToken?: string): Promise<{ authenticated: boolean }> {
  if (clientToken && verifyAdminSessionToken(clientToken)) {
    return { authenticated: true };
  }

  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (sessionToken && verifyAdminSessionToken(sessionToken)) {
      return { authenticated: true };
    }
  } catch {}

  return { authenticated: false };
}

export async function verifyAdminPasswordAction(password: string): Promise<{
  success: boolean;
  message?: string;
  token?: string;
  rateLimited?: boolean;
}> {
  const result = verifyAdminPassword(password);

  if (result.rateLimited) {
    return {
      success: false,
      rateLimited: true,
      message: `Security Lockout: Too many failed passkey attempts. Please wait ${result.remainingMinutes || 15} minutes.`,
    };
  }

  if (result.valid) {
    // Generate secure session token
    const sessionToken = createAdminSessionToken();

    try {
      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: false, // Ensures cookie functions properly on http://localhost:3000 and behind reverse proxies
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    } catch (err) {
      console.error('[Admin Auth] Error setting cookie:', err);
    }

    return { success: true, token: sessionToken };
  }

  return { success: false, message: 'Invalid Admin Security Passkey.' };
}

export async function logoutAdminAction(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (err) {
    console.error('[Admin Logout] Error clearing cookie:', err);
  }
  return { success: true };
}

export async function fetchInquiriesAction(token?: string): Promise<Inquiry[]> {
  await assertAdminAuthenticated(token);
  return await getInquiries();
}

export async function updateInquiryStatusAction(
  id: string,
  status: 'new' | 'replied' | 'archived',
  token?: string
): Promise<{ success: boolean }> {
  await assertAdminAuthenticated(token);
  const success = await updateInquiryStatus(id, status);
  return { success };
}

export async function deleteInquiryAction(id: string, token?: string): Promise<{ success: boolean }> {
  await assertAdminAuthenticated(token);
  const success = await deleteInquiry(id);
  return { success };
}

export async function submitTestInquiryAction(token?: string): Promise<{ success: boolean; inquiry?: Inquiry; message?: string }> {
  await assertAdminAuthenticated(token);
  const sampleInquiry = await saveInquiry({
    name: 'Demo Client (System Generated)',
    email: 'client@democompany.com',
    message: 'We are testing the Admin Dashboard inquiry receipt pipeline. The Next.js 15 standalone server is handling live incoming client data seamlessly.',
    budget: '$2,500 MVP',
  });
  return { success: true, inquiry: sampleInquiry };
}

export async function getSystemTelemetryAction(token?: string) {
  await assertAdminAuthenticated(token);
  const memUsage = process.memoryUsage();
  return {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    uptimeSeconds: Math.floor(process.uptime()),
    heapUsedMb: (memUsage.heapUsed / 1024 / 1024).toFixed(1),
    rssMb: (memUsage.rss / 1024 / 1024).toFixed(1),
    timestamp: new Date().toISOString(),
  };
}

export async function changeAdminPasswordAction(
  currentPassword: string,
  newPassword: string,
  token?: string
): Promise<{ success: boolean; message: string }> {
  await assertAdminAuthenticated(token);

  // Verify current password with constant-time equality
  const currentVerification = verifyAdminPassword(currentPassword);
  if (!currentVerification.valid) {
    return { success: false, message: 'Current password does not match.' };
  }

  if (!newPassword || newPassword.trim().length < 4) {
    return { success: false, message: 'New password must be at least 4 characters.' };
  }

  const success = setAdminPassword(newPassword.trim());
  if (success) {
    return { success: true, message: 'Admin password updated successfully!' };
  }
  return { success: false, message: 'Failed to write updated password to secure storage.' };
}

export async function getAdminSecurityInfoAction(): Promise<{
  hasCustomPassword: boolean;
  updatedAt: string;
  allowQuickAccess: boolean;
}> {
  const config = getAdminConfig();
  return {
    hasCustomPassword: config.hasCustomPassword,
    updatedAt: config.updatedAt,
    allowQuickAccess: config.allowQuickAccess,
  };
}

export async function toggleQuickAccessAction(enabled: boolean, token?: string): Promise<{ success: boolean }> {
  await assertAdminAuthenticated(token);
  const success = setQuickAccess(enabled);
  return { success };
}
