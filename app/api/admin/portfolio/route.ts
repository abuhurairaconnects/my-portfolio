import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import { portfolioSchema } from "@/lib/validations";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "portfolio.json");

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = req.cookies.get("admin_session")?.value;
    if (session !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fileContent = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read portfolio data." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = req.cookies.get("admin_session")?.value;
    if (session !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedData = await req.json();

    // Validate with Zod
    const parseResult = portfolioSchema.safeParse(updatedData);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Write formatted JSON to disk
    await fs.writeFile(
      DATA_FILE_PATH,
      JSON.stringify(parseResult.data, null, 2),
      "utf-8"
    );

    // Purge Next.js cache so the live website instantly updates
    try {
      revalidatePath("/", "layout");
      revalidatePath("/");
      revalidatePath("/admin");
      revalidatePath("/projects/[slug]", "page");
    } catch (e) {
      console.warn("revalidatePath error:", e);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Portfolio data successfully saved and updated live!",
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Failed to write portfolio data:", error);
    return NextResponse.json(
      { error: "Failed to update portfolio data." },
      { status: 500 }
    );
  }
}
