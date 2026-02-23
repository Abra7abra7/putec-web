import fs from "fs/promises";
import path from "path";
import { cache } from "react";
import { Product } from "../../types/Product";

/**
 * Get all products (wines + degustacie)
 * Cached async function with automatic request deduplication
 */
const getProducts = cache(async (locale: string = "sk"): Promise<Product[]> => {
  try {
    const isEn = locale === "en";
    const winesFile = isEn ? "wines.en.json" : "wines.json";
    const degustacieFile = isEn ? "degustacie.en.json" : "degustacie.json";

    const winesPath = path.join(process.cwd(), "configs", winesFile);
    const degustaciePath = path.join(process.cwd(), "configs", degustacieFile);

    let allProducts: Product[] = [];

    // Load wines
    try {
      const winesData = await fs.readFile(winesPath, "utf-8");
      const wines: Product[] = JSON.parse(winesData);
      allProducts = [...allProducts, ...wines];
    } catch {
      console.warn("Wines file not found or invalid:", winesPath);
    }

    // Load degustacie
    try {
      const degustacieData = await fs.readFile(degustaciePath, "utf-8");
      const degustacie: Product[] = JSON.parse(degustacieData);
      allProducts = [...allProducts, ...degustacie];
    } catch {
      console.warn("Degustacie file not found or invalid:", degustaciePath);
    }

    return allProducts.filter((product) => product.CatalogVisible);
  } catch (error) {
    console.error("Error loading products files:", error);
    return [];
  }
});

export default getProducts;

/**
 * Get wines only
 * Cached async function for wine products
 */
export const getWines = cache(async (locale: string = "sk"): Promise<Product[]> => {
  try {
    const isEn = locale === "en";
    const winesFile = isEn ? "wines.en.json" : "wines.json";
    const winesPath = path.join(process.cwd(), "configs", winesFile);
    const winesData = await fs.readFile(winesPath, "utf-8");
    const wines: Product[] = JSON.parse(winesData);
    return wines.filter((product) => product.CatalogVisible);
  } catch (error) {
    console.error("Error loading wines file:", error);
    return [];
  }
});

/**
 * Get degustacie only
 * Cached async function for degustation products
 */
export const getDegustacie = cache(async (locale: string = "sk"): Promise<Product[]> => {
  try {
    const isEn = locale === "en";
    const degustacieFile = isEn ? "degustacie.en.json" : "degustacie.json";
    const degustaciePath = path.join(process.cwd(), "configs", degustacieFile);
    const degustacieData = await fs.readFile(degustaciePath, "utf-8");
    const degustacie: Product[] = JSON.parse(degustacieData);
    return degustacie.filter((product) => product.CatalogVisible);
  } catch (error) {
    console.error("Error loading degustacie file:", error);
    return [];
  }
});

/**
 * Get a product by slug
 * Cached async function to find a specific product
 */
export const getProductBySlug = cache(async (slug: string, locale: string = "sk"): Promise<Product | undefined> => {
  try {
    const allProducts = await getProducts(locale);
    return allProducts.find((product) => product.Slug === slug);
  } catch (error) {
    console.error(`Error fetching product with slug "${slug}":`, error);
    return undefined;
  }
});
