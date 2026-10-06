import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendContactEmail } from "@/lib/email";
import { saveMessage } from "@/lib/server/messages";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // 1. IP extraction for Rate Limiting
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "127.0.0.1";

    // 2. Sliding Window Rate Limiting (5 requests / 1 hour per IP)
    const rateLimitResult = await checkRateLimit(ip);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later or reach out directly via email.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // 3. Payload parsing & Zod Validation
    const rawBody = await req.json();
    const parseResult = contactFormSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const fieldErrors = parseResult.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          error: "Validation failed. Please correct the fields.",
          details: fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, message, website_hp, formLoadTimestamp } =
      parseResult.data;

    // 4. Honeypot Bot Detection
    // If honeypot is filled, silently return HTTP 200 without dispatching email
    if (website_hp && website_hp.length > 0) {
      console.warn(`[Spam Detected] Honeypot triggered by IP: ${ip}`);
      return NextResponse.json(
        { success: true, message: "Message received." },
        { status: 200 }
      );
    }

    // 5. Minimum Submission Time Check (Protection against automated scripts)
    if (formLoadTimestamp) {
      const elapsedMs = Date.now() - formLoadTimestamp;
      if (elapsedMs < 300) {
        console.warn(`[Spam Detected] Form submitted too quickly (${elapsedMs}ms) by IP: ${ip}`);
        // Silent success to fool script
        return NextResponse.json(
          { success: true, message: "Message received." },
          { status: 200 }
        );
      }
    }

    // 6. Header Injection Prevention & Sanitization
    const sanitizedName = name.replace(/[\r\n]/g, " ").trim();
    const sanitizedEmail = email.replace(/[\r\n]/g, " ").trim();

    // 7. Persist immediately to Admin Inbox (Zero Data Loss)
    try {
      await saveMessage({
        name: sanitizedName,
        email: sanitizedEmail,
        message,
      });
    } catch (saveErr) {
      console.warn("Failed to persist message to inbox file:", saveErr);
    }

    // 8. Dispatch real-time email notification
    await sendContactEmail({
      name: sanitizedName,
      email: sanitizedEmail,
      message,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been safely delivered.",
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
        },
      }
    );
  } catch (error: unknown) {
    console.error("Contact API unhandled error:", error);
    return NextResponse.json(
      {
        error: "Internal server error. Please use direct email contact.",
      },
      { status: 500 }
    );
  }
}
