export const revalidate = 3600;
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Product } from "../../../types/Product";

export async function GET() {
  try {
    const winesPath = path.join(process.cwd(), "configs", "wines.json");
    const degustaciePath = path.join(process.cwd(), "configs", "degustacie.json");
    
    let allProducts: Product[] = [];

    // Load wines
    if (fs.existsSync(winesPath)) {
      const wines: Product[] = JSON.parse(fs.readFileSync(winesPath, "utf-8"));
      allProducts = [...allProducts, ...wines];
    }

    // Load degustacie
    if (fs.existsSync(degustaciePath)) {
      const degustacie: Product[] = JSON.parse(fs.readFileSync(degustaciePath, "utf-8"));
      allProducts = [...allProducts, ...degustacie];
    }

    const visibleProducts = allProducts.filter((product) => product.CatalogVisible);
    
    return NextResponse.json({ products: visibleProducts });
  } catch (error) {
    console.error("Error loading products files:", error);
    return NextResponse.json({ products: [] });
  }
}
