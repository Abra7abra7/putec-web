import Hero from "../components/Hero";
import ProductGrid from "../components/products/ProductGrid";
import { getLocalization } from "../utils/getLocalization";
import type { Metadata } from "next";
import { ReduxProvider } from "../providers";

// Generate metadata dynamically
export async function generateMetadata(): Promise<Metadata> {
  const localeData = await getLocalization();
  
  return {
    title: `${localeData.siteName} - ${localeData.labels.products}`,
    description: localeData.siteTagline,
  };
}

export default async function ProductsPage() {
  const localeData = await getLocalization();
  
  return (
    <>
      <Hero
        title={localeData.labels.products}
        subtitle={localeData.siteTagline}
        backgroundImageUrl="/vineyard-banner.webp"
        secondaryCta={{ label: "Zobraziť všetko", href: "#produkty" }}
        heightClass="h-[50vh]"
      />
      <section id="produkty" className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="mt-2">
            <ReduxProvider>
              <ProductGrid />
            </ReduxProvider>
          </div>
        </div>
      </section>
    </>
  );
}
