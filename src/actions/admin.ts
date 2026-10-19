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
  syncInMemoryConfig,
  encodeConfigCookie,
  decodeConfigCookie,
  AdminConfig,
} from '../lib/authStore';

const SESSION_COOKIE_NAME = 'ah_admin_session';
const CONFIG_COOKIE_NAME = 'ah_admin_config';

/**
 * Sync server in-memory configuration from cryptographically signed client cookie
 * to prevent serverless Lambda instance fragmentation.
 */
async function syncConfigFromCookies(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const configCookie = cookieStore.get(CONFIG_COOKIE_NAME)?.value;
    if (configCookie) {
      const synced = decodeConfigCookie(configCookie);
      if (synced) {
        syncInMemoryConfig(synced);
      }
    }
  } catch {}
}

/**
 * Persist updated configuration into a secure, signed cookie.
 */
async function saveConfigToCookies(config: AdminConfig): Promise<void> {
  try {
    const cookieStore = await cookies();
    const encoded = encodeConfigCookie(config);
    cookieStore.set(CONFIG_COOKIE_NAME, encoded, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 365 * 24 * 60 * 60, // 1 year
    });
  } catch {}
}

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
  await syncConfigFromCookies();
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
  await syncConfigFromCookies();
  const result = verifyAdminPassword(password);

  if (result.rateLimited) {
    return {
      success: false,
      rateLimited: true,
      message: `Security Lockout: Too many failed passkey attempts. Please wait ${result.remainingMinutes || 15} minutes.`,
    };
  }

  if (result.valid) {
    const sessionToken = createAdminSessionToken();

    try {
      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
      await saveConfigToCookies(getAdminConfig());
    } catch (err) {
      console.error('[Admin Auth] Error setting cookie:', err);
    }

    return { success: true, token: sessionToken };
  }

  return { success: false, message: 'Invalid Admin Security Passkey.' };
}

/**
 * Instant One-Click Login for the Founder/Owner if enabled in Admin settings
 * (Restricted to non-production environments to prevent unauthenticated access)
 */
export async function quickAccessLoginAction(): Promise<{
  success: boolean;
  message?: string;
  token?: string;
}> {
  try {
    if (process.env.NODE_ENV === 'production') {
      return {
        success: false,
        message: 'One-Click Founder Access is disabled in production for security. Please enter your admin passkey.',
      };
    }

    await syncConfigFromCookies();
    const config = getAdminConfig();
    if (!config.allowQuickAccess) {
      return {
        success: false,
        message: 'One-Click Founder Access is disabled. Please enter your passkey.',
      };
    }

    const sessionToken = createAdminSessionToken();
    try {
      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: false, // Development only
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });
    } catch {}

    return { success: true, token: sessionToken };
  } catch (err) {
    console.error('[quickAccessLoginAction] Error:', err);
    return { success: false, message: 'Server error during quick login.' };
  }
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
  try {
    // 1. Enforce active administrator authentication session (STRIX-SEC-01)
    await assertAdminAuthenticated(token);
    await syncConfigFromCookies();

    // 2. Strictly verify current passkey to prevent session hijacking / CSRF takeovers (STRIX-SEC-02)
    const currentVerification = verifyAdminPassword(currentPassword);
    if (!currentVerification.valid) {
      return { success: false, message: 'Current administrator passkey is incorrect.' };
    }

    if (!newPassword || newPassword.trim().length < 6) {
      return { success: false, message: 'New password must be at least 6 characters.' };
    }

    const success = setAdminPassword(newPassword.trim());
    if (success) {
      const updatedConfig = getAdminConfig();
      try {
        const cookieStore = await cookies();
        const newToken = createAdminSessionToken();
        cookieStore.set(SESSION_COOKIE_NAME, newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 7 * 24 * 60 * 60,
        });
        await saveConfigToCookies(updatedConfig);
      } catch {}
      return { success: true, message: 'Admin password updated successfully!' };
    }
    return { success: false, message: 'Failed to write updated password to secure storage.' };
  } catch (err) {
    console.error('[changeAdminPasswordAction] Error:', err);
    return { success: false, message: 'Access Denied: Valid administrator session and correct passkey required.' };
  }
}

export async function getAdminSecurityInfoAction(): Promise<{
  hasCustomPassword: boolean;
  updatedAt: string;
  allowQuickAccess: boolean;
}> {
  await syncConfigFromCookies();
  const config = getAdminConfig();
  const isProd = process.env.NODE_ENV === 'production';
  return {
    hasCustomPassword: config.hasCustomPassword,
    updatedAt: config.updatedAt,
    allowQuickAccess: isProd ? false : config.allowQuickAccess,
  };
}

export async function toggleQuickAccessAction(
  enabled: boolean,
  token?: string
): Promise<{ success: boolean; allowQuickAccess: boolean }> {
  try {
    await assertAdminAuthenticated(token);
    await syncConfigFromCookies();
    const success = setQuickAccess(enabled);
    const updated = getAdminConfig();
    await saveConfigToCookies(updated);
    return { success, allowQuickAccess: updated.allowQuickAccess };
  } catch (err) {
    console.error('[toggleQuickAccessAction] Error:', err);
    return { success: false, allowQuickAccess: !enabled };
  }
}

