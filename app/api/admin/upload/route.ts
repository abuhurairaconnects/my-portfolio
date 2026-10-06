import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = req.cookies.get("admin_session")?.value;
    if (session !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Determine target filename & path
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || ".jpg";
    const fileName = `upload-${Date.now()}${ext}`;
    const filePath = path.join(process.cwd(), "public", fileName);

    await fs.writeFile(filePath, buffer);

    try {
      revalidatePath("/", "layout");
      revalidatePath("/");
      revalidatePath("/admin");
      revalidatePath("/projects/[slug]", "page");
    } catch (e) {
      console.warn("Upload revalidate error:", e);
    }

    return NextResponse.json({
      success: true,
      url: `/${fileName}`,
    });
  } catch (error) {
    console.error("Image upload failed:", error);
    return NextResponse.json(
      { error: "Image upload failed." },
      { status: 500 }
    );
  }
}
