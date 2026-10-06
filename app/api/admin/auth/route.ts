import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const CONFIG_FILE_PATH = path.join(process.cwd(), "data", "admin-config.json");

async function getAdminPassword(): Promise<string> {
  try {
    const raw = await fs.readFile(CONFIG_FILE_PATH, "utf-8");
    const json = JSON.parse(raw);
    return json.password || "admin123";
  } catch {
    return "admin123";
  }
}

async function setAdminPassword(newPass: string): Promise<void> {
  let existing: Record<string, any> = {};
  try {
    const raw = await fs.readFile(CONFIG_FILE_PATH, "utf-8");
    existing = JSON.parse(raw);
  } catch {}
  existing.password = newPass;
  await fs.writeFile(
    CONFIG_FILE_PATH,
    JSON.stringify(existing, null, 2),
    "utf-8"
  );
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { password } = await req.json();
    const adminPassword = await getAdminPassword();

    if (!password || password !== adminPassword) {
      return NextResponse.json(
        { error: "Incorrect password. Access denied." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Authenticated successfully.",
    });

    // Set cookie without persistent maxAge (session cookie only)
    response.cookies.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: req.nextUrl.protocol === "https:",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failed." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const session = req.cookies.get("admin_session")?.value;
    if (session !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();
    const currentStored = await getAdminPassword();

    if (!currentPassword || currentPassword !== currentStored) {
      return NextResponse.json(
        { error: "Current password does not match." },
        { status: 400 }
      );
    }

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 4) {
      return NextResponse.json(
        { error: "New password must be at least 4 characters long." },
        { status: 400 }
      );
    }

    await setAdminPassword(newPassword);

    return NextResponse.json({
      success: true,
      message: "Password changed successfully! You must use this new password on your next login.",
    });
  } catch (error) {
    console.error("Failed to update admin password:", error);
    return NextResponse.json(
      { error: "Failed to update password." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = req.cookies.get("admin_session")?.value;
  const isAuthenticated = session === "authenticated";

  return NextResponse.json({ authenticated: isAuthenticated });
}

export async function DELETE(): Promise<NextResponse> {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("admin_session");
  return response;
}
