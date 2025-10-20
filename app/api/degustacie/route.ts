import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const revalidate = 3600;

/**
 * GET /api/degustacie
 * Returns list of wine tastings/degustations
 */
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "configs", "degustacie.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    const degustacie = JSON.parse(fileContents);

    return NextResponse.json(
      { degustacie },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("[API Error - Degustacie]", error);
    
    return NextResponse.json(
      {
        degustacie: [],
        error: "Failed to load degustations",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

