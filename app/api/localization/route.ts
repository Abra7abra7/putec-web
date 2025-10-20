import { NextResponse } from "next/server";
import { getLocalization } from "../../utils/getLocalization";

export const revalidate = 3600; // Cache for 1 hour

/**
 * GET /api/localization
 * Returns localization strings for the application
 */
export async function GET() {
  try {
    const jsonData = getLocalization();
    
    return NextResponse.json(jsonData, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("[API Error - Localization]", error);
    
    return NextResponse.json(
      { 
        error: "Failed to load localization file",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

