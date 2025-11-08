import { NextResponse } from "next/server";
import { getCheckoutSettings } from "../../utils/getCheckout";

export const revalidate = 3600;

/**
 * GET /api/checkout
 * Returns checkout configuration (countries, payment methods, shipping options)
 */
export async function GET() {
  try {
    const checkoutData = getCheckoutSettings();
    
    return NextResponse.json(checkoutData, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("[API Error - Checkout]", error);
    
    return NextResponse.json(
      {
        error: "Failed to load checkout configuration",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

