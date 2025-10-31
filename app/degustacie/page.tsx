import type { Metadata } from "next";
import DegustationProducts from "./DegustationProducts";
import Hero from "../components/Hero";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Degustácie Vinosady | Firemné akcie Pezinok | Ochutnávky vína | Víno Pútec",
  description: "Degustácie vína vo Vinosadoch pri Pezinku - firemné akcie, teambuildingy, ochutnávky prémiových vín. Rezervujte si degustáciu v rodinnom vinárstve Putec pre Bratislavu, Senec, Trnavu. Skupinové degustácie až 17 osôb.",
  keywords: "degustácie Vinosady, degustácie Pezinok, firemné akcie, teambuildingy, ochutnávky vína, degustácie vína, skupinové degustácie, degustačné balíky, víno Vinosady, vinárstvo Putec, Bratislava, Senec, Trnava, Malé Karpaty, degustačné miestnosti, catering degustácie",
  openGraph: {
    title: "Degustácie Vinosady | Firemné akcie a Ochutnávky vína",
    description: "Degustácie vína vo Vinosadoch - firemné akcie, teambuildingy, ochutnávky prémiových vín v srdci Malých Karpát",
    type: "website",
    locale: "sk_SK",
    images: [
      {
        url: "/galeria/degustacie/degustacia-skupina.jpg",
        width: 1200,
        height: 630,
        alt: "Degustácie vína vo Vinosadoch - skupinové ochutnávky",
      },
    ],
  },
  alternates: {
    canonical: "https://vinoputec.sk/degustacie",
  },
};

export default function DegustaciePage() {
  return (
    <div className="min-h-screen bg-background">
      <Hero
        title="Degustácie vína"
        subtitle="Nezabudnuteľné zážitky s našimi prémiovými vínami v srdci Malých Karpát"
        backgroundImageUrl="/galeria/degustacie/degustacia-skupina.jpg"
        primaryCta={{ label: "Rezervovať degustáciu", href: "#baliky" }}
        secondaryCta={{ label: "Galéria", href: "/galeria/degustacie" }}
        heightClass="h-[60vh]"
      />

      {/* Main Content */}
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
                src="/galeria/degustacie/degustacia-skupina.jpg"
                alt="Degustácie vína vo Vinosadoch - skupinové ochutnávky"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
                priority
              />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent rounded-full flex items-center justify-center">
                <span className="text-3xl">🍷</span>
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-foreground mb-8">Prečo si vybrať naše degustácie?</h3>
              
              <div className="space-y-6">
                <div className="bg-accent/10 p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-lg">17</span>
                    </div>
                    <h4 className="text-xl font-semibold text-foreground">Kapacita až 17 osôb</h4>
                  </div>
                  <p className="text-foreground-muted">Ideálne pre firemné akcie, teambuildingy a skupinové pobyty</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-background border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">🏢</span>
                      <h5 className="font-semibold text-foreground">Firemné akcie</h5>
                    </div>
                    <p className="text-foreground-muted text-sm">Profesionálne zorganizované pre firmy</p>
                  </div>
                  
                  <div className="bg-background border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">🤝</span>
                      <h5 className="font-semibold text-foreground">Teambuildingy</h5>
                    </div>
                    <p className="text-foreground-muted text-sm">Kombinácia vínovej kultúry s tímovou prácou</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-accent mr-3">✓</span>
                    <span className="text-foreground">Profesionálny sprievodca degustáciou</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-accent mr-3">✓</span>
                    <span className="text-foreground">Catering služby a občerstvenie</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-accent mr-3">✓</span>
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
              Rezervujte si degustáciu vína
            </h3>
            <p className="text-xl text-foreground-muted mb-8 max-w-2xl mx-auto">
              Ideálne pre firemné akcie, teambuildingy, rodinné oslavy a skupinové pobyty s ochutnávkami vína
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#baliky"
                className="bg-accent hover:bg-accent-dark text-foreground px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Rezervovať degustáciu
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

      {/* Degustation Packages */}
      <div id="baliky">
        <DegustationProducts />
      </div>
    </div>
  );
}
