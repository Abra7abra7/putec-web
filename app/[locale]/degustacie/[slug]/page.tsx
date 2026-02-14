import { notFound } from "next/navigation";
import { getProductBySlug } from "../../../utils/getProducts";
import type { Metadata } from "next";
import Image from "next/image";
import ReservationForm from "../../../components/degustacie/ReservationForm";
import { getCurrencySymbol } from "../../../utils/getCurrencySymbol";
import Script from "next/script";
import BackButton from "../../../components/BackButton";
import DegustationGallery from "../../../components/degustacie/DegustationGallery";

// Generate metadata for each degustation
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || product.ProductType !== 'degustation') {
    return {
      title: "Degustácia nenájdená | Putec Vinosady",
      description: "Požadovaná degustácia nebola nájdená.",
    };
  }

  return {
    title: `${product.Title} | Putec Vinosady | Degustácie vína`,
    description: product.ShortDescription,
    keywords: "degustácie vína, ochutnávky vína, Putec, Vinosady, Pezinok, Bratislava, Senec, Trnava",
    openGraph: {
      title: `${product.Title} | Putec Vinosady`,
      description: product.ShortDescription,
      type: "website",
      locale: "sk_SK",
    },
    alternates: {
      canonical: `https://vinoputec.sk/degustacie/${product.Slug}`,
    },
  };
}

export default async function DegustationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || product.ProductType !== 'degustation') {
    notFound();
  }

  const currencySymbol = getCurrencySymbol(product.Currency);
  const hasDiscount = parseFloat(product.SalePrice) < parseFloat(product.RegularPrice);

  const priceBlock = (
    <div className="text-2xl font-bold text-foreground">
      {hasDiscount ? (
        <div className="flex items-center gap-2">
          <span className="text-red-600">
            {currencySymbol}
            {product.SalePrice}
          </span>
          <span className="text-foreground-muted line-through text-lg">
            {currencySymbol}
            {product.RegularPrice}
          </span>
        </div>
      ) : (
        <span>
          {currencySymbol}
          {product.RegularPrice}
        </span>
      )}
    </div>
  );

  return (
    <section className="py-12 bg-background">
      <Script id="ld-json-breadcrumbs-degust-detail" type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Domov", "item": "https://vinoputec.sk/" },
              { "@type": "ListItem", "position": 2, "name": "Degustácie", "item": "https://vinoputec.sk/degustacie" },
              { "@type": "ListItem", "position": 3, "name": product.Title, "item": `https://vinoputec.sk/degustacie/${product.Slug}` }
            ]
          })
        }} />
      <Script id="ld-json-product-degust" type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org", "@type": "Product",
            "name": product.Title,
            "image": [product.FeatureImageURL, ...(product.ProductImageGallery || [])],
            "description": product.ShortDescription,
            "sku": product.ID,
            "brand": { "@type": "Brand", "name": "Vino Putec" },
            "offers": {
              "@type": "Offer",
              "priceCurrency": product.Currency,
              "price": product.SalePrice || product.RegularPrice,
              "availability": "https://schema.org/InStock",
              "url": `https://vinoputec.sk/degustacie/${product.Slug}`
            }
          })
        }} />
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton fallbackHref="/degustacie" />
        </div>

        <h1 className="text-3xl font-bold text-center text-foreground mb-8">{product.Title}</h1>
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 text-sm text-foreground">
            <span aria-hidden>★</span>
            <span className="font-semibold">5.0</span>
            <span className="opacity-70">(31 recenzií)</span>
          </span>
        </div>

        <div className="grid mt-2 grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          {/* LEFT COLUMN: IMAGES */}
          <div className="space-y-4">
            <DegustationGallery
              featureImage={product.FeatureImageURL}
              title={product.Title}
              galleryImages={product.ProductImageGallery}
            />

            {/* Description moved here on mobile/tablet */}
            <div className="lg:hidden">
              <p className="text-lg text-foreground-muted">{product.ShortDescription}</p>
            </div>
          </div>

          {/* RIGHT COLUMN: RESERVATION FORM */}
          <div className="space-y-6">
            {/* Short description visible only on desktop */}
            <p className="hidden lg:block text-lg text-foreground-muted">{product.ShortDescription}</p>

            {/* Degustation specific info */}
            <div className="p-4 bg-background border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-foreground mb-3">Informácie o degustácii</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Kapacita:</span>
                  <span className="text-foreground font-medium">{product.Capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Trvanie:</span>
                  <span className="text-foreground font-medium">{product.Duration}</span>
                </div>
                {product.Deposit && (
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Vratná záloha:</span>
                    <span className="text-foreground font-medium">{currencySymbol}{product.Deposit}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {priceBlock}
            </div>

            {/* Reservation Form - MOVED HERE */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-accent/20 p-6">
              <h3 className="text-2xl font-bold text-foreground mb-2 text-center">Rezervujte si termín</h3>
              <p className="text-sm text-foreground-muted text-center mb-6">
                Vyplňte formulár a my vás budeme kontaktovať do 24 hodín
              </p>
              <ReservationForm product={product} />
            </div>
          </div>
        </div>

        {/* Features for degustations */}
        {product.Features && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Zahrnuté v balíku</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.Features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-background border border-gray-200 rounded-lg">
                  <span className="text-accent font-bold text-lg">✓</span>
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LONG DESCRIPTION */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-foreground mb-4">O degustácii</h2>
          <p className="text-foreground-muted leading-relaxed">{product.LongDescription}</p>
        </div>
      </div>
    </section>
  );
}
