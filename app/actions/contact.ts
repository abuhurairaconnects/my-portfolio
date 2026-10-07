"use server";

import { contactFormSchema, ContactFormData } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limit";
import { saveMessage } from "@/lib/server/messages";
import { sendContactEmail } from "@/lib/email";
import { headers } from "next/headers";

export interface ContactActionResult {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function submitContactAction(
  data: ContactFormData
): Promise<ContactActionResult> {
  try {
    // 1. IP extraction for Rate Limiting
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    const realIp = headerList.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "127.0.0.1";

    // 2. Sliding Window Rate Limiting (15 requests / 1 hour per IP)
    const rateLimitResult = await checkRateLimit(ip);
    if (!rateLimitResult.success) {
      return {
        success: false,
        error: "Rate limit exceeded. Please try again later or reach out directly via email.",
      };
    }

    // 3. Zod Payload Validation
    const parseResult = contactFormSchema.safeParse(data);
    if (!parseResult.success) {
      const fieldErrors = parseResult.error.flatten().fieldErrors;
      return {
        success: false,
        error: "Validation failed. Please correct the fields.",
        fieldErrors,
      };
    }

    const { name, email, message, website_hp, formLoadTimestamp } =
      parseResult.data;

    // 4. Honeypot Bot Detection
    if (website_hp && website_hp.length > 0) {
      return { success: true, message: "Message received." };
    }

    // 5. Minimum Submission Time Check
    if (formLoadTimestamp) {
      const elapsedMs = Date.now() - formLoadTimestamp;
      if (elapsedMs < 300) {
        return { success: true, message: "Message received." };
      }
    }

    // 6. Sanitization
    const sanitizedName = name.replace(/[\r\n]/g, " ").trim();
    const sanitizedEmail = email.replace(/[\r\n]/g, " ").trim();

    // 7. Persist immediately to Admin Inbox
    try {
      await saveMessage({
        name: sanitizedName,
        email: sanitizedEmail,
        message,
      });
    } catch (saveErr) {
      console.warn("Failed to persist message to inbox file:", saveErr);
    }

    // 8. Real-time email dispatch via Resend
    await sendContactEmail({
      name: sanitizedName,
      email: sanitizedEmail,
      message,
    });

    return {
      success: true,
      message: "Your message has been safely delivered.",
    };
  } catch (err: unknown) {
    console.error("Contact Server Action unexpected error:", err);
    return {
      success: false,
      error: "Failed to dispatch message. Please reach out directly.",
    };
  }
}
