import Hero from "../../components/Hero";
import WineGrid from "../../components/products/WineGrid";
import AgeVerification from "../../components/AgeVerification";
import { getLocalization } from "../../utils/getLocalization";
import type { Metadata } from "next";
import { ReduxProvider } from "@/app/providers";
import Script from "next/script";
import RatingBadge from "../../components/RatingBadge";
import { getGoogleRating } from "../../utils/getGoogleRating";
import { getWines } from "../../utils/getProducts"; // Updated import

import { getMediaUrl } from "../../utils/media";

// Generate metadata dynamically
export async function generateMetadata(): Promise<Metadata> {
  const localeData = await getLocalization();

  return {
    title: `${localeData.siteName} - Vína`,
    description: "Prémiové vína z rodinného vinárstva Putec vo Vinosadoch pri Pezinku. Biele, červené a ružové vína najvyššej kvality.",
  };
}

export default async function VinaPage() {
  const [wines, googleRating] = await Promise.all([getWines(), getGoogleRating()]);

  const schemaProducts = wines.map((wine, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "Product",
      "name": wine.Title,
      "description": wine.ShortDescription || wine.Title,
      "image": wine.FeatureImageURL,
      "url": `https://vinoputec.sk/vina/${wine.Slug || wine.ID}`,
      "offers": {
        "@type": "Offer",
        "priceCurrency": wine.Currency || "EUR",
        "price": wine.RegularPrice,
        "availability": "https://schema.org/InStock"
      }
    }
  }));

  return (
    <>
      <Script id="ld-json-breadcrumbs-vina" type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Domov", "item": "https://vinoputec.sk/" },
              { "@type": "ListItem", "position": 2, "name": "Vína", "item": "https://vinoputec.sk/vina" }
            ]
          })
        }} />
      <Script id="ld-json-itemlist-vina" type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": schemaProducts
          })
        }} />
      <AgeVerification />
      <Hero
        title="Naše vína"
        subtitle="Prémiové vína z rodinného vinárstva Putec"
        backgroundImageUrl={getMediaUrl("/vineyard-banner.webp")}
        secondaryCta={{ label: "Zobraziť všetky", href: "#vsetky-vina" }}
        heightClass="h-[50vh]"
      />
      <div className="container mx-auto px-4 -mt-10">
        <RatingBadge ratingValue={googleRating.rating} reviewCount={googleRating.totalReviews} />
      </div>
      <section id="vsetky-vina" className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="mt-2">
            <ReduxProvider>
              <WineGrid initialWines={wines} />
            </ReduxProvider>
          </div>
        </div>
      </section>
    </>
  );
}
