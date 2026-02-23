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
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.wines" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: "https://vinoputec.sk/vina",
      languages: {
        "sk-SK": "/vina",
        "en-US": "/en/vina",
      },
    },
  };
}

export default async function VinaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [wines, googleRating, t, common] = await Promise.all([
    getWines(locale),
    getGoogleRating(),
    getTranslations({ locale, namespace: "pages.wines" }),
    getTranslations({ locale, namespace: "pages.common" }),
  ]);

  const schemaProducts = wines.map((wine, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "Product",
      "name": wine.Title,
      "description": wine.ShortDescription || wine.Title,
      "image": wine.FeatureImageURL,
      "url": `https://vinoputec.sk/${locale === "en" ? "en/" : ""}vina/${wine.Slug || wine.ID}`,
      "offers": {
        "@type": "Offer",
        "priceCurrency": wine.Currency || "EUR",
        "price": wine.RegularPrice,
        "availability": "https://schema.org/InStock",
      },
    },
  }));

  return (
    <>
      <Script
        id="ld-json-breadcrumbs-vina"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": common("home"), "item": `https://vinoputec.sk/${locale === "en" ? "en" : ""}` },
              { "@type": "ListItem", "position": 2, "name": t("title"), "item": `https://vinoputec.sk/${locale === "en" ? "en/" : ""}vina` },
            ],
          }),
        }}
      />
      <Script
        id="ld-json-itemlist-vina"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": schemaProducts,
          }),
        }}
      />
      <AgeVerification />
      <Hero
        title={t("title")}
        subtitle={t("subtitle")}
        backgroundImageUrl={getMediaUrl("/vineyard-banner.webp")}
        secondaryCta={{ label: t("cta"), href: "#vsetky-vina" }}
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
