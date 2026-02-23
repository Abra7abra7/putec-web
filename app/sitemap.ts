import { MetadataRoute } from "next";
import { getWines, getDegustacie } from "./utils/getProducts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://vinoputec.sk";
  const locales = ["sk", "en"];

  // Pages to include in sitemap
  const pages = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/vina", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/degustacie", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/ubytovanie", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/o-nas", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/kontakt", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/galeria", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/zasady-ochrany-osobnych-udajov", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/obchodne-podmienky", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/reklamacny-poriadok", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/nastroje-ochrany-sukromia", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  const staticEntries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    staticEntries.push({
      url: `${baseUrl}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: {
          sk: `${baseUrl}${page.path}`,
          en: `${baseUrl}/en${page.path}`,
        },
      },
    });

    // Also add the EN version explicitly as its own entry
    staticEntries.push({
      url: `${baseUrl}/en${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: {
          sk: `${baseUrl}${page.path}`,
          en: `${baseUrl}/en${page.path}`,
        },
      },
    });
  }

  // Dynamic products (wines + degustacie)
  const wines = await getWines("sk");
  const degustacie = await getDegustacie("sk");

  const productEntries: MetadataRoute.Sitemap = [];

  // Add wines
  for (const wine of wines) {
    const slug = wine.Slug || wine.ID;
    const path = `/vina/${slug}`;

    productEntries.push({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          sk: `${baseUrl}${path}`,
          en: `${baseUrl}/en${path}`,
        },
      },
    });

    productEntries.push({
      url: `${baseUrl}/en${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          sk: `${baseUrl}${path}`,
          en: `${baseUrl}/en${path}`,
        },
      },
    });
  }

  // Add degustacie
  for (const degustacia of degustacie) {
    const slug = degustacia.Slug || degustacia.ID;
    const path = `/degustacie/${slug}`;

    productEntries.push({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          sk: `${baseUrl}${path}`,
          en: `${baseUrl}/en${path}`,
        },
      },
    });

    productEntries.push({
      url: `${baseUrl}/en${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          sk: `${baseUrl}${path}`,
          en: `${baseUrl}/en${path}`,
        },
      },
    });
  }

  // Add gallery categories
  const categories = ["degustacie", "ubytovanie", "rodina"];
  for (const category of categories) {
    const path = `/galeria/${category}`;

    productEntries.push({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: {
        languages: {
          sk: `${baseUrl}${path}`,
          en: `${baseUrl}/en${path}`,
        },
      },
    });

    productEntries.push({
      url: `${baseUrl}/en${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: {
        languages: {
          sk: `${baseUrl}${path}`,
          en: `${baseUrl}/en${path}`,
        },
      },
    });
  }

  return [...staticEntries, ...productEntries];
}
