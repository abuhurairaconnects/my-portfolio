import { NextRequest, NextResponse } from "next/server";
import { sendTestEmail } from "@/lib/email";

function isAuthenticated(req: NextRequest): boolean {
  const session = req.cookies.get("admin_session")?.value;
  return session === "authenticated";
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const targetEmail = body.email;

    const result = await sendTestEmail(targetEmail);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to dispatch test email." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Test email dispatched successfully! Please check your inbox or spam folder.",
      messageId: result.messageId,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Test email failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
