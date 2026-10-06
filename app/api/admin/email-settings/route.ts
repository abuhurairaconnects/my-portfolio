import { NextRequest, NextResponse } from "next/server";
import { getEmailConfig, saveEmailConfig } from "@/lib/server/email-config";

function isAuthenticated(req: NextRequest): boolean {
  const session = req.cookies.get("admin_session")?.value;
  return session === "authenticated";
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const config = await getEmailConfig();
    return NextResponse.json({
      provider: config.provider,
      toEmail: config.toEmail,
      hasResendKey: Boolean(config.resendApiKey && config.resendApiKey.length > 5),
      resendKeyMasked: config.resendApiKey
        ? `${config.resendApiKey.slice(0, 4)}••••••••${config.resendApiKey.slice(-4)}`
        : "",
      hasSmtp: Boolean(config.smtpUser && config.smtpPass),
      smtpUser: config.smtpUser || "",
      smtpHost: config.smtpHost || "smtp.gmail.com",
      smtpPort: config.smtpPort || 465,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load email settings";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { provider, toEmail, resendApiKey, smtpHost, smtpPort, smtpUser, smtpPass } = body;

    await saveEmailConfig({
      provider,
      toEmail,
      resendApiKey: resendApiKey !== undefined ? resendApiKey : undefined,
      smtpHost,
      smtpPort: smtpPort ? Number(smtpPort) : undefined,
      smtpUser,
      smtpPass: smtpPass !== undefined ? smtpPass : undefined,
    });

    return NextResponse.json({ success: true, message: "Email settings saved successfully!" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save email settings";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
