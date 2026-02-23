import type { Metadata } from "next";
import { Trophy, Users, ChefHat, Wine as WineIcon, Check } from "lucide-react";
import DegustationProducts from "./DegustationProducts";
import Hero from "../../components/Hero";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import RatingBadge from "../../components/RatingBadge";
import { getGoogleRating } from "../../utils/getGoogleRating";

import { getMediaUrl } from "../../utils/media";
import { getDegustacie } from "../../utils/getProducts";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.tastings" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: "https://vinoputec.sk/degustacie",
      languages: {
        "sk-SK": "/degustacie",
        "en-US": "/en/degustacie",
      },
    },
  };
}

export default async function DegustaciePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [googleRating, degustationProducts, t, common] = await Promise.all([
    getGoogleRating(),
    getDegustacie(locale),
    getTranslations({ locale, namespace: "pages.tastings" }),
    getTranslations({ locale, namespace: "pages.common" }),
  ]);

  const schemaProducts = degustationProducts.map((product, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "Product",
      "name": product.Title,
      "description": product.ShortDescription || product.Title,
      "image": product.FeatureImageURL,
      "offers": {
        "@type": "Offer",
        "priceCurrency": "EUR",
        "price": product.SalePrice,
        "availability": "https://schema.org/InStock",
      },
    },
  }));

  return (
    <div className="min-h-screen bg-background">
      <Script
        id="ld-json-breadcrumbs-degust"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": common("home"), "item": `https://vinoputec.sk/${locale === "en" ? "en" : ""}` },
              { "@type": "ListItem", "position": 2, "name": t("breadcrumb"), "item": `https://vinoputec.sk/${locale === "en" ? "en/" : ""}degustacie` },
            ],
          }),
        }}
      />
      <Script
        id="ld-json-itemlist-degust"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": schemaProducts,
          }),
        }}
      />
      <Hero
        title={t("title")}
        subtitle={t("subtitle")}
        backgroundImageUrl={getMediaUrl("galeria/degustacie/degustacia-skupina.jpg")}
        primaryCta={{ label: t("reservation.cta"), href: "#rezervacia" }}
        secondaryCta={{ label: t("cta.gallery"), href: "/galeria/degustacie" }}
        heightClass="h-[60vh]"
      />
      <div className="container mx-auto px-6 -mt-10">
        <RatingBadge ratingValue={googleRating.rating} reviewCount={googleRating.totalReviews} />
      </div>

      {/* Quick Reservation Section - Localized */}
      <section id="rezervacia" className="py-12 bg-gradient-to-b from-background to-gray-50">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-accent/20">
            <div className="text-center mb-8">
              <div className="inline-block bg-accent/10 rounded-full px-6 py-2 mb-4">
                <span className="text-accent font-semibold">{t("reservation.badge")}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("reservation.title")}</h2>
              <p className="text-lg text-foreground-muted max-w-2xl mx-auto">{t("reservation.subtitle")}</p>
            </div>

            <div id="baliky" className="mb-8">
              <DegustationProducts initialProducts={degustationProducts} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <h4 className="font-semibold text-foreground mb-2">{t("whyUs.awards.title")}</h4>
                <p className="text-sm text-foreground-muted">{t("whyUs.awards.desc")}</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <h4 className="font-semibold text-foreground mb-2">{t("whyUs.guide.title")}</h4>
                <p className="text-sm text-foreground-muted">{t("whyUs.guide.desc")}</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <ChefHat className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <h4 className="font-semibold text-foreground mb-2">{t("whyUs.catering.title")}</h4>
                <p className="text-sm text-foreground-muted">{t("whyUs.catering.desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Localized */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">{t("intro.title")}</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-foreground-muted leading-relaxed mb-6">{t("intro.p1")}</p>
              <p className="text-lg text-foreground-muted leading-relaxed">{t("intro.p2")}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="relative">
              <Image
                src={getMediaUrl("galeria/degustacie/degustacia-skupina.jpg")}
                alt={`${t("intro.title")} - subgroup`}
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
                priority
              />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent rounded-full flex items-center justify-center shadow-xl">
                <WineIcon className="w-12 h-12 text-foreground" />
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-foreground mb-8">{t("whyUs.title")}</h3>
              <div className="space-y-6">
                <div className="bg-accent/10 p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-foreground" />
                    </div>
                    <h4 className="text-xl font-semibold text-foreground">{t("whyUs.capacity.title")}</h4>
                  </div>
                  <p className="text-foreground-muted">{t("whyUs.capacity.desc")}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-background border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                        <Users className="w-5 h-5 text-accent" />
                      </div>
                      <h5 className="font-semibold text-foreground">{t("whyUs.corporate.title")}</h5>
                    </div>
                    <p className="text-foreground-muted text-sm">{t("whyUs.corporate.desc")}</p>
                  </div>

                  <div className="bg-background border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                        <Users className="w-5 h-5 text-accent" />
                      </div>
                      <h5 className="font-semibold text-foreground">{t("whyUs.teambuildings.title")}</h5>
                    </div>
                    <p className="text-foreground-muted text-sm">{t("whyUs.teambuildings.desc")}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-accent flex-shrink-0" />
                      <span className="text-foreground">{t(`whyUs.checkpoints.${i}`)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-6">{t("services.title")}</h3>
              <p className="text-xl text-foreground-muted max-w-3xl mx-auto">{t("services.subtitle")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">🍽️</span>
                  </div>
                  <h4 className="text-2xl font-semibold text-foreground">{t("services.catering.title")}</h4>
                </div>
                <div className="space-y-3">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start">
                      <span className="text-accent mr-3 mt-1">✓</span>
                      <span className="text-foreground-muted">{t(`services.catering.items.${i}`)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <h4 className="text-2xl font-semibold text-foreground">{t("services.guide.title")}</h4>
                </div>
                <div className="space-y-3">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start">
                      <span className="text-accent mr-3 mt-1">✓</span>
                      <span className="text-foreground-muted">{t(`services.guide.items.${i}`)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-3xl p-12 text-center">
            <h3 className="text-3xl font-bold text-foreground mb-6">{t("cta.title")}</h3>
            <p className="text-xl text-foreground-muted mb-8 max-w-2xl mx-auto">{t("cta.subtitle")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#rezervacia"
                className="bg-accent hover:bg-accent-dark text-foreground px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                {t("cta.back")}
              </a>
              <Link
                href="/galeria/degustacie"
                className="border-2 border-accent text-accent hover:bg-accent hover:text-foreground px-8 py-4 rounded-lg font-semibold transition-all"
              >
                {t("cta.gallery")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ - Localized */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-foreground mb-6">{t("faq.title")}</h2>
          <div className="space-y-4">
            <details className="bg-background border border-gray-200 rounded-lg p-4">
              <summary className="font-semibold text-foreground">{t("faq.q1")}</summary>
              <p className="text-foreground-muted mt-2">{t("faq.a1")}</p>
            </details>
            <details className="bg-background border border-gray-200 rounded-lg p-4">
              <summary className="font-semibold text-foreground">{t("faq.q2")}</summary>
              <p className="text-foreground-muted mt-2">{t("faq.a2")}</p>
            </details>
            <details className="bg-background border border-gray-200 rounded-lg p-4">
              <summary className="font-semibold text-foreground">{t("faq.q3")}</summary>
              <p className="text-foreground-muted mt-2">{t("faq.a3")}</p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
