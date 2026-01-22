import { promises as fs } from "fs";
import path from "path";
import { Product } from "../../types/Product";

export async function getWines(): Promise<Product[]> {
    const filePath = path.join(process.cwd(), "configs", "wines.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileContents);
}

export async function getActiveWines(): Promise<Product[]> {
    const wines = await getWines();
    return wines.filter(w => w.CatalogVisible && w.Enabled);
}
