import { NextResponse } from "next/server";
import { testSuperFakturaConnection } from "../../../utils/superFakturaApi";

export async function GET() {
  try {
    if (!process.env.SUPERFAKTURA_API_KEY) {
      return NextResponse.json(
        { 
          error: "SuperFaktúra API key not configured",
          message: "Nastavte SUPERFAKTURA_API_KEY v .env.local"
        }, 
        { status: 500 }
      );
    }

    const isConnected = await testSuperFakturaConnection();

    if (isConnected) {
      return NextResponse.json({ 
        success: true,
        message: "SuperFaktúra API pripojenie funguje správne! ✅"
      });
    } else {
      return NextResponse.json(
        { 
          success: false,
          message: "SuperFaktúra API pripojenie zlyhalo. Skontrolujte API kľúč."
        }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ SuperFaktúra test error:", error);
    return NextResponse.json(
      { 
        error: "Test connection failed",
        details: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    );
  }
}


