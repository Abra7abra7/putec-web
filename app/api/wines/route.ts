import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";

export const revalidate = 3600;
export const dynamic = 'force-dynamic';

// Validačná schéma pre query parametre
const WinesQuerySchema = z.object({
  category: z.string().optional(),
  enabled: z.enum(["true", "false"]).optional(),
}).optional();

// Interface pre Wine objekt
interface Wine {
  ID: string;
  Title: string;
  Enabled: boolean;
  CatalogVisible: boolean;
  ProductCategories?: string[];
  [key: string]: unknown;
}

/**
 * GET /api/wines
 * Vráti zoznam vín s podporou filtrovania
 * 
 * Query params:
 * - category: string (optional) - Filter by category
 * - enabled: "true" | "false" (optional) - Filter by enabled status
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters (convert null to undefined for Zod)
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      category: searchParams.get("category") || undefined,
      enabled: searchParams.get("enabled") || undefined,
    };

    // Validate query parameters
    const validatedParams = WinesQuerySchema.safeParse(queryParams);
    
    if (!validatedParams.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: validatedParams.error.issues,
        },
        { status: 400 }
      );
    }
    
    const params = validatedParams.data;

    // Read wines data (async)
    const filePath = path.join(process.cwd(), "configs", "wines.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    let wines: Wine[] = JSON.parse(fileContents);

    // Filter by CatalogVisible by default (only show catalog items)
    wines = wines.filter((wine) => wine.CatalogVisible === true);

    // Apply additional filters if provided
    if (params?.enabled !== undefined) {
      const enabledFilter = params.enabled === "true";
      wines = wines.filter((wine) => wine.Enabled === enabledFilter);
    }

    if (params?.category) {
      wines = wines.filter((wine) =>
        wine.ProductCategories?.includes(params.category!)
      );
    }

    // Return with proper caching headers
    return NextResponse.json(
      { wines, count: wines.length },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    // Zod validation error
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    // File system or JSON parse error
    if (error instanceof Error) {
      console.error("[API Error - Wines]", {
        message: error.message,
        stack: error.stack,
      });

      return NextResponse.json(
        {
          error: "Failed to load wines data",
          message: process.env.NODE_ENV === "development" ? error.message : undefined,
        },
        { status: 500 }
      );
    }

    // Unknown error
    console.error("[API Error - Wines] Unknown error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

