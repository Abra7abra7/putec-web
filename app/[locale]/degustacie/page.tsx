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

// ... (metadata unchanged)

export default async function DegustaciePage() {
  const [googleRating, degustationProducts] = await Promise.all([
    getGoogleRating(),
    getDegustacie(),
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
        "availability": "https://schema.org/InStock"
      }
    }
  }));

  return (
    <div className="min-h-screen bg-background">
      <Script id="ld-json-breadcrumbs-degust" type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Domov", "item": "https://vinoputec.sk/" },
              { "@type": "ListItem", "position": 2, "name": "Degustácie", "item": "https://vinoputec.sk/degustacie" }
            ]
          })
        }} />
      <Script id="ld-json-itemlist-degust" type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": schemaProducts
          })
        }} />
      <Hero
        title="Degustácie vína"
        subtitle="Nezabudnuteľné zážitky s našimi prémiovými vínami v srdci Malých Karpát"
        backgroundImageUrl={getMediaUrl("galeria/degustacie/degustacia-skupina.jpg")}
        primaryCta={{ label: "Rezervovať teraz", href: "#rezervacia" }}
        secondaryCta={{ label: "Galéria", href: "/galeria/degustacie" }}
        heightClass="h-[60vh]"
      />
      <div className="container mx-auto px-6 -mt-10">
        <RatingBadge ratingValue={googleRating.rating} reviewCount={googleRating.totalReviews} />
      </div>

      {/* Quick Reservation Section - Moved to top */}
      <section id="rezervacia" className="py-12 bg-gradient-to-b from-background to-gray-50">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-accent/20">
            <div className="text-center mb-8">
              <div className="inline-block bg-accent/10 rounded-full px-6 py-2 mb-4">
                <span className="text-accent font-semibold">⚡ Rýchla rezervácia</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Rezervujte si degustáciu vína
              </h2>
              <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
                Vyberte si degustačný balík a rezervujte termín. Odpovieme vám do 24 hodín.
              </p>
            </div>

            {/* Degustation Packages - Compact View */}
            <div id="baliky" className="mb-8">
              <DegustationProducts initialProducts={degustationProducts} />
            </div>

            {/* Why Choose Us - Quick bullets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <h4 className="font-semibold text-foreground mb-2">Ocenené vína</h4>
                <p className="text-sm text-foreground-muted">Prémiová kvalita potvrdená medzinárodnými oceneniami</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <h4 className="font-semibold text-foreground mb-2">Profesionálny výklad</h4>
                <p className="text-sm text-foreground-muted">Odborný sprievodca s letitými skúsenosťami</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <ChefHat className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <h4 className="font-semibold text-foreground mb-2">Catering na mieru</h4>
                <p className="text-sm text-foreground-muted">Občerstvenie prispôsobené vašim požiadavkám</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Details moved below */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">

          {/* Introduction */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
              Degustácie vína vo Vinosadoch
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-foreground-muted leading-relaxed mb-6">
                Ponúkame jedinečné degustácie vína priamo vo vinárstve, kde spájame tradíciu s modernými technológiami.
                Ideálne pre firemné akcie, teambuildingy, rodinné oslavy a skupinové pobyty.
              </p>
              <p className="text-lg text-foreground-muted leading-relaxed">
                Naša degustačná miestnosť má kapacitu až 17 osôb a ponúka kompletný zážitok s ochutnávkami vína,
                catering službami a profesionálnym sprievodcom.
              </p>
            </div>
          </div>

          {/* Why Choose Our Tastings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="relative">
              <Image
                src={getMediaUrl("galeria/degustacie/degustacia-skupina.jpg")}
                alt="Degustácie vína vo Vinosadoch - skupinové ochutnávky"
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
              <h3 className="text-3xl font-bold text-foreground mb-8">Prečo si vybrať naše degustácie?</h3>

              <div className="space-y-6">
                <div className="bg-accent/10 p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-foreground" />
                    </div>
                    <h4 className="text-xl font-semibold text-foreground">Kapacita až 17 osôb</h4>
                  </div>
                  <p className="text-foreground-muted">Ideálne pre firemné akcie, teambuildingy a skupinové pobyty</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-background border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                        <Users className="w-5 h-5 text-accent" />
                      </div>
                      <h5 className="font-semibold text-foreground">Firemné akcie</h5>
                    </div>
                    <p className="text-foreground-muted text-sm">Profesionálne zorganizované pre firmy</p>
                  </div>

                  <div className="bg-background border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                        <Users className="w-5 h-5 text-accent" />
                      </div>
                      <h5 className="font-semibold text-foreground">Teambuildingy</h5>
                    </div>
                    <p className="text-foreground-muted text-sm">Kombinácia vínovej kultúry s tímovou prácou</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">Profesionálny sprievodca degustáciou</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">Catering služby a občerstvenie</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">Degustačná miestnosť priamo vo vinárstve</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services and Features */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-6">Služby a vybavenie</h3>
              <p className="text-xl text-foreground-muted max-w-3xl mx-auto">
                Kompletné zabezpečenie pre nezabudnuteľné degustačné zážitky
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">🍽️</span>
                  </div>
                  <h4 className="text-2xl font-semibold text-foreground">Catering a občerstvenie</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-accent mr-3 mt-1">✓</span>
                    <span className="text-foreground-muted">Profesionálne pripravené občerstvenie k vínu</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-accent mr-3 mt-1">✓</span>
                    <span className="text-foreground-muted">Miestne produkty a špeciality</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-accent mr-3 mt-1">✓</span>
                    <span className="text-foreground-muted">Prispôsobenie podľa požiadaviek klientov</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-accent mr-3 mt-1">✓</span>
                    <span className="text-foreground-muted">Kompletné zabezpečenie stravovania</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <h4 className="text-2xl font-semibold text-foreground">Profesionálny sprievodca</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-accent mr-3 mt-1">✓</span>
                    <span className="text-foreground-muted">Odborné vedenie degustácie</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-accent mr-3 mt-1">✓</span>
                    <span className="text-foreground-muted">Vysvetlenie techniky degustácie</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-accent mr-3 mt-1">✓</span>
                    <span className="text-foreground-muted">História a tradície vinárstva</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-accent mr-3 mt-1">✓</span>
                    <span className="text-foreground-muted">Odpovede na otázky o víne</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-3xl p-12 text-center">
            <h3 className="text-3xl font-bold text-foreground mb-6">
              Máte záujem o degustáciu?
            </h3>
            <p className="text-xl text-foreground-muted mb-8 max-w-2xl mx-auto">
              Ideálne pre firemné akcie, teambuildingy, rodinné oslavy a skupinové pobyty s ochutnávkami vína
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#rezervacia"
                className="bg-accent hover:bg-accent-dark text-foreground px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Späť na rezerváciu
              </a>
              <Link
                href="/galeria/degustacie"
                className="border-2 border-accent text-accent hover:bg-accent hover:text-foreground px-8 py-4 rounded-lg font-semibold transition-all"
              >
                Pozrieť galériu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-foreground mb-6">Často kladené otázky (FAQ)</h2>
          <div className="space-y-4">
            <details className="bg-background border border-gray-200 rounded-lg p-4">
              <summary className="font-semibold text-foreground">Koľko ľudí môžeme priniesť?</summary>
              <p className="text-foreground-muted mt-2">Od 2 do približne 17 osôb podľa balíka a priestorov.</p>
            </details>
            <details className="bg-background border border-gray-200 rounded-lg p-4">
              <summary className="font-semibold text-foreground">Je možné zabezpečiť občerstvenie?</summary>
              <p className="text-foreground-muted mt-2">Áno, zabezpečíme studenú misu či catering podľa dohody.</p>
            </details>
            <details className="bg-background border border-gray-200 rounded-lg p-4">
              <summary className="font-semibold text-foreground">Kde sa nachádzame?</summary>
              <p className="text-foreground-muted mt-2">Pezinská 154, 902 01 Vinosady – pár minút od Pezinku.</p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
