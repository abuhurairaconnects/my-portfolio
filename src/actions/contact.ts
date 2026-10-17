'use server';

import { headers } from 'next/headers';
import { saveInquiry } from '../lib/inquiriesStore';

export interface ContactActionResult {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

// In-Memory Rate Limiting for Public Form Submissions (STRIX-SEC-08: Anti-Flooding)
interface RateRecord {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateRecord>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_SUBMISSIONS_PER_WINDOW = 5;

async function checkSubmissionRateLimit(): Promise<boolean> {
  try {
    const headersList = await headers();
    const forwarded = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const clientKey = (forwarded ? forwarded.split(',')[0].trim() : realIp) || 'client-default';
    const now = Date.now();

    const record = rateLimitMap.get(clientKey);
    if (!record || now > record.resetAt) {
      rateLimitMap.set(clientKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
      return true;
    }

    if (record.count >= MAX_SUBMISSIONS_PER_WINDOW) {
      return false;
    }

    record.count += 1;
    return true;
  } catch {
    return true;
  }
}

/**
 * Lightweight HTML entity escaping & length clamp to prevent stored XSS and payload flooding (STRIX-SEC-07)
 */
function sanitizeInput(val: string, maxLength = 2000): string {
  if (!val) return '';
  return val
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .slice(0, maxLength);
}

export async function submitContactInquiry(
  prevState: ContactActionResult | null,
  formData: FormData
): Promise<ContactActionResult> {
  const allowed = await checkSubmissionRateLimit();
  if (!allowed) {
    return {
      success: false,
      message: 'Too many submissions received. Please wait a few minutes before submitting another inquiry.',
    };
  }
  const rawName = formData.get('name')?.toString() || '';
  const rawEmail = formData.get('email')?.toString() || '';
  const rawMessage = formData.get('message')?.toString() || '';

  const name = sanitizeInput(rawName, 100);
  const email = rawEmail.trim().toLowerCase().slice(0, 150);
  const message = sanitizeInput(rawMessage, 3000);

  const errors: Record<string, string> = {};

  if (!name || name.length < 2) {
    errors.name = 'Please provide your full name (at least 2 characters).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!message || message.length < 10) {
    errors.message = 'Please include a message describing your project or inquiry (minimum 10 characters).';
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: 'Validation failed. Please correct the fields above.',
      errors,
    };
  }

  // Persist inquiry to server store
  try {
    await saveInquiry({
      name,
      email,
      message,
      inquiryType: 'contact',
    });
  } catch (err) {
    console.error('[Contact Submission] Failed to persist to store:', err);
  }

  return {
    success: true,
    message: 'JazakAllah Khair / Thank you! Your message has been received. Abu Huraira will respond shortly within 24 hours.',
  };
}

export async function submitHireInquiry(
  prevState: ContactActionResult | null,
  formData: FormData
): Promise<ContactActionResult> {
  const allowed = await checkSubmissionRateLimit();
  if (!allowed) {
    return {
      success: false,
      message: 'Too many submissions received. Please wait a few minutes before submitting another inquiry.',
    };
  }
  const rawName = formData.get('name')?.toString() || '';
  const rawEmail = formData.get('email')?.toString() || '';
  const rawServiceType = formData.get('serviceType')?.toString() || 'Custom Software Development';
  const rawBudget = formData.get('budget')?.toString() || 'Flexible / To be discussed';
  const rawTimeline = formData.get('timeline')?.toString() || 'Flexible';
  const rawMessage = formData.get('message')?.toString() || '';

  const name = sanitizeInput(rawName, 100);
  const email = rawEmail.trim().toLowerCase().slice(0, 150);
  const serviceType = sanitizeInput(rawServiceType, 100);
  const budget = sanitizeInput(rawBudget, 100);
  const timeline = sanitizeInput(rawTimeline, 100);
  const message = sanitizeInput(rawMessage, 3000);

  const errors: Record<string, string> = {};

  if (!name || name.length < 2) {
    errors.name = 'Please provide your full name (at least 2 characters).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!message || message.length < 10) {
    errors.message = 'Please describe your project scope or requirement (minimum 10 characters).';
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: 'Validation failed. Please correct the highlighted fields.',
      errors,
    };
  }

  // Persist hire inquiry to server store
  try {
    await saveInquiry({
      name,
      email,
      message,
      serviceType,
      budget,
      timeline,
      inquiryType: 'hire',
    });
  } catch (err) {
    console.error('[Hire Submission] Failed to persist to store:', err);
  }

  return {
    success: true,
    message: 'Thank you! Your project inquiry has been received directly by Abu Huraira. You will receive an architectural proposal and delivery schedule within 24 hours.',
  };
}
