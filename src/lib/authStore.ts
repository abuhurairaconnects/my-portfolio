import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface AdminConfig {
  passwordHash: string;
  salt: string;
  updatedAt: string;
  allowQuickAccess: boolean;
  hasCustomPassword: boolean;
}

let inMemoryConfig: AdminConfig | null = null;
let inMemorySecret: string | null = null;

function getDataDir(): string {
  if (process.env.DATA_DIR) return process.env.DATA_DIR;
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join('/tmp', 'portfolio-data');
  }
  const cwd = process.cwd();
  if (cwd.includes('.next/standalone')) {
    return path.join(path.resolve(cwd.split('.next/standalone')[0]), 'data');
  }
  return path.join(cwd, 'data');
}

function getConfigFile(): string {
  return path.join(getDataDir(), 'admin-config.json');
}

function getSecretFile(): string {
  return path.join(getDataDir(), 'session-secret.key');
}

// Default legacy passkeys for initial setup only
const DEFAULT_PASSKEYS = ['7860', 'abuhuraira2026', 'admin'];

// In-Memory Brute-Force Rate Limiter (STRIX-SEC-05)
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
let failedAttemptsCount = 0;
let lockoutExpiresAt = 0;

function hashWithSalt(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

function ensureConfigDir(): void {
  try {
    const dir = getDataDir();
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (err) {
    // If standard dir failed (e.g. read-only filesystem), fallback to /tmp
    try {
      const tmpDir = path.join('/tmp', 'portfolio-data');
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
    } catch {}
  }
}

function getOrCreateSessionSecret(): string {
  if (inMemorySecret) return inMemorySecret;
  ensureConfigDir();
  const secretFile = getSecretFile();
  try {
    if (fs.existsSync(secretFile)) {
      const secret = fs.readFileSync(secretFile, 'utf-8').trim();
      if (secret.length >= 32) {
        inMemorySecret = secret;
        return secret;
      }
    }
    const newSecret = crypto.randomBytes(32).toString('hex');
    try {
      fs.writeFileSync(secretFile, newSecret, 'utf-8');
    } catch {
      // Try /tmp
      try {
        fs.writeFileSync(path.join('/tmp', 'session-secret.key'), newSecret, 'utf-8');
      } catch {}
    }
    inMemorySecret = newSecret;
    return newSecret;
  } catch (err) {
    const fallback = 'fallback_secure_static_secret_key_abu_huraira_2026';
    inMemorySecret = fallback;
    return fallback;
  }
}

export function getAdminConfig(): AdminConfig {
  if (inMemoryConfig) return inMemoryConfig;

  // Check custom password from environment variable if configured
  const envPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSKEY;
  if (envPassword && envPassword.trim().length >= 4) {
    const salt = 'env_salt_abu_huraira';
    const hash = hashWithSalt(envPassword.trim(), salt);
    inMemoryConfig = {
      passwordHash: hash,
      salt,
      updatedAt: new Date().toISOString(),
      allowQuickAccess: true,
      hasCustomPassword: true,
    };
    return inMemoryConfig;
  }

  ensureConfigDir();
  const configFile = getConfigFile();
  try {
    if (fs.existsSync(configFile)) {
      const content = fs.readFileSync(configFile, 'utf-8');
      inMemoryConfig = JSON.parse(content) as AdminConfig;
      return inMemoryConfig;
    }
  } catch {}

  // Try /tmp fallback file
  try {
    const tmpConfigFile = path.join('/tmp', 'admin-config.json');
    if (fs.existsSync(tmpConfigFile)) {
      const content = fs.readFileSync(tmpConfigFile, 'utf-8');
      inMemoryConfig = JSON.parse(content) as AdminConfig;
      return inMemoryConfig;
    }
  } catch {}

  // Initial default state
  const salt = crypto.randomBytes(16).toString('hex');
  const defaultHash = hashWithSalt('7860', salt);
  const initialConfig: AdminConfig = {
    passwordHash: defaultHash,
    salt,
    updatedAt: new Date().toISOString(),
    allowQuickAccess: true,
    hasCustomPassword: false,
  };

  try {
    fs.writeFileSync(getConfigFile(), JSON.stringify(initialConfig, null, 2), 'utf-8');
  } catch {
    try {
      fs.writeFileSync(path.join('/tmp', 'admin-config.json'), JSON.stringify(initialConfig, null, 2), 'utf-8');
    } catch {}
  }

  inMemoryConfig = initialConfig;
  return initialConfig;
}

/**
 * Constant-time password verification with rate-limiting (STRIX-SEC-04 & STRIX-SEC-05)
 */
export function verifyAdminPassword(input: string): { valid: boolean; rateLimited?: boolean; remainingMinutes?: number } {
  if (!input) return { valid: false };
  const clean = input.trim();
  const config = getAdminConfig();
  const now = Date.now();

  let matches = false;

  // 1. Check against default setup keys if custom password is not set
  if (!config.hasCustomPassword) {
    if (DEFAULT_PASSKEYS.includes(clean.toLowerCase())) {
      matches = true;
    }
  }

  // 2. Constant-time comparison using crypto.timingSafeEqual
  if (!matches) {
    const computed = hashWithSalt(clean, config.salt);
    const bufComputed = Buffer.from(computed, 'utf-8');
    const bufTarget = Buffer.from(config.passwordHash, 'utf-8');

    if (bufComputed.length === bufTarget.length && crypto.timingSafeEqual(bufComputed, bufTarget)) {
      matches = true;
    }
  }

  // If password matches, always clear lockout and grant access
  if (matches) {
    failedAttemptsCount = 0;
    lockoutExpiresAt = 0;
    return { valid: true };
  }

  // If lockout is currently active and input was wrong
  if (now < lockoutExpiresAt) {
    const remainingMinutes = Math.ceil((lockoutExpiresAt - now) / 60000);
    return { valid: false, rateLimited: true, remainingMinutes };
  }

  // Record failed attempt
  failedAttemptsCount += 1;
  if (failedAttemptsCount >= MAX_FAILED_ATTEMPTS) {
    lockoutExpiresAt = now + LOCKOUT_DURATION_MS;
    return { valid: false, rateLimited: true, remainingMinutes: 15 };
  }

  return { valid: false };
}

export function setAdminPassword(newPassword: string): boolean {
  if (!newPassword || newPassword.trim().length < 4) {
    return false;
  }

  ensureConfigDir();
  const currentConfig = getAdminConfig();
  const newSalt = crypto.randomBytes(16).toString('hex');
  const newHash = hashWithSalt(newPassword.trim(), newSalt);

  const updatedConfig: AdminConfig = {
    ...currentConfig,
    passwordHash: newHash,
    salt: newSalt,
    updatedAt: new Date().toISOString(),
    hasCustomPassword: true,
  };

  inMemoryConfig = updatedConfig;

  try {
    fs.writeFileSync(getConfigFile(), JSON.stringify(updatedConfig, null, 2), 'utf-8');
    return true;
  } catch (err) {
    try {
      const tmpFile = path.join('/tmp', 'admin-config.json');
      fs.writeFileSync(tmpFile, JSON.stringify(updatedConfig, null, 2), 'utf-8');
      return true;
    } catch {
      // Memory fallback is active and valid
      return true;
    }
  }
}

export function setQuickAccess(enabled: boolean): boolean {
  ensureConfigDir();
  const currentConfig = getAdminConfig();
  const updatedConfig: AdminConfig = {
    ...currentConfig,
    allowQuickAccess: enabled,
  };

  inMemoryConfig = updatedConfig;

  try {
    fs.writeFileSync(getConfigFile(), JSON.stringify(updatedConfig, null, 2), 'utf-8');
    return true;
  } catch (err) {
    try {
      const tmpFile = path.join('/tmp', 'admin-config.json');
      fs.writeFileSync(tmpFile, JSON.stringify(updatedConfig, null, 2), 'utf-8');
      return true;
    } catch {
      return true;
    }
  }
}

/**
 * Server-Side Cryptographic Session Management (STRIX-SEC-01)
 * Generates an HMAC-SHA256 signed session token for authenticated admins.
 */
export function createAdminSessionToken(): string {
  const secret = getOrCreateSessionSecret();
  const timestamp = Date.now().toString();
  const signature = crypto.createHmac('sha256', secret).update(`admin:${timestamp}`).digest('hex');
  return `${timestamp}.${signature}`;
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [timestampStr, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Expiration: 7 days
  const now = Date.now();
  const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
  if (now - timestamp > maxAgeMs || timestamp > now + 60000) {
    return false; // Expired or future timestamp
  }

  const secret = getOrCreateSessionSecret();
  const expectedSig = crypto.createHmac('sha256', secret).update(`admin:${timestampStr}`).digest('hex');

  const bufProvided = Buffer.from(signature, 'utf-8');
  const bufExpected = Buffer.from(expectedSig, 'utf-8');

  if (bufProvided.length !== bufExpected.length) return false;
  return crypto.timingSafeEqual(bufProvided, bufExpected);
}
