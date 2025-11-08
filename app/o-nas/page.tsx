import type { Metadata } from "next";
import Image from "next/image";
import Hero from "../components/Hero";

export const metadata: Metadata = {
  title: "O nás | Rodinné vinárstvo Putec Vinosady | Vízia a misia | Tradícia vína",
  description: "Víno Pútec je malé rodinné vinárstvo vo Vinosadoch na úpätí Malých Karpát. Naša vízia: ochrániť budúcnosť vinohradov, prilákať turistov do Malých Karpát a zachovať vinohradnícku tradíciu. Výrobe vín sa s láskou venujeme už niekoľko generácií.",
  keywords: "vinárstvo Putec, Vinosady, Malé Karpaty, rodinné vinárstvo, tradícia vína, kvalitné víno, vízia vinárstva, misia vinárstva, ochrana vinohradov, turizmus Malé Karpaty, slovenské víno, Branislav Pútec, Natali, francúzske sudy, remeselné víno, Bratislava, Pezinok",
  openGraph: {
    title: "O nás | Rodinné vinárstvo Putec Vinosady",
    description: "Rodinné vinárstvo s tradíciou už niekoľko generácií vo Vinosadoch na úpätí Malých Karpát",
    type: "website",
    locale: "sk_SK",
    images: [
      {
        url: "/o-nas/rodina2.jpg",
        width: 1200,
        height: 630,
        alt: "Rodinné vinárstvo Putec Vinosady - tradícia a kvalita",
      },
    ],
  },
  alternates: {
    canonical: "https://vinoputec.sk/o-nas",
  },
};


export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero
        title="O vinárstve"
        subtitle="Rodinné vinárstvo s tradíciou už niekoľko generácií vo Vinosadoch na úpätí Malých Karpát"
        backgroundImageUrl="/o-nas/rodina2.jpg"
        secondaryCta={{ label: "Degustácie Pezinok", href: "/degustacie/pezinok" }}
        heightClass="h-[60vh]"
      />

      {/* Main Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          
          {/* Introduction Section */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
              Víno Pútec - Tradícia a kvalita
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-foreground-muted leading-relaxed mb-6">
                Víno Pútec je malé rodinné vinárstvo vo Vinosadoch na úpätí Malých Karpát. 
                Výrobe vín sa s láskou venujeme už niekoľko generácií a sme hrdí na svetové úspechy našich vín.
              </p>
              <p className="text-lg text-foreground-muted leading-relaxed">
                Sme malé rodinné vinárstvo vo Vinosadoch – naša rodina sa výrobe vína venuje už niekoľko generácií. 
                Žijeme vínom a chceme vám priniesť skvelý pôžitok z tohto unikátneho umenia, ktorým víno je.
              </p>
            </div>
          </div>

          {/* History Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="relative">
              <Image
                src="/o-nas/rodina1.JPG"
                alt="História vinárstva Putec - rodinná tradícia"
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
              <h3 className="text-3xl font-bold text-foreground mb-6">História a založenie</h3>
              <div className="space-y-4 text-foreground-muted">
                <p>
                  Vinárstvo <strong className="text-foreground">Branislav Pútec – Natali</strong> bolo oficiálne založené v roku 2012, 
                  avšak rodinná tradícia siaha oveľa ďalej do minulosti. Rodina sa výrobe vína venuje už niekoľko generácií, 
                  pričom pestovanie hrozna a výroba vína je hlboko zakorenená v rodinnej tradícii.
                </p>
                <p>
                  Po nadobudnutí skúseností pri pestovaní hrozna a výrobe vína sme založili vinárstvo. 
                  Po šetrnom spracovaní hrozna mušty prechádzajú riadeným spôsobom fermentácie. 
                  Vyrábame vína, ktoré dozrievajú v kvalitných francúzskych drevených sudoch a nerezových cisternách.
                </p>
                <p>
                  Víno tak získava špecifickú arómu a chuť. Modernizáciou technologických zariadení a ekologickými postupmi 
                  vyrábame kvalitné víno.
                </p>
              </div>
            </div>
          </div>

          {/* Philosophy Section */}
          <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-3xl p-12 mb-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-6">Rodinná filozofia a hodnoty</h3>
              <p className="text-xl text-foreground-muted max-w-3xl mx-auto">
                O víno sa staráme ako o ďalšieho člena rodiny, spájame rodinné postupy s modernými technológiami, 
                čím tvoríme kvalitné, remeselné víno, na ktoré sme hrdí.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">❤️</span>
                </div>
                            <h4 className="text-xl font-semibold text-foreground mb-3">&quot;Žijeme vínom&quot;</h4>
                <p className="text-foreground-muted">Víno je pre rodinu nielen profesiou, ale spôsobom života</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👨‍👩‍👧‍👦</span>
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-3">Rodinný prístup</h4>
                <p className="text-foreground-muted">Osobný, láskavý prístup k výrobe vína</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚙️</span>
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-3">Moderné technológie</h4>
                <p className="text-foreground-muted">Kombinujeme rodinné postupy s modernými technológiami</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⭐</span>
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-3">Remeselné víno</h4>
                <p className="text-foreground-muted">Vytvárajú kvalitné, remeselné víno, na ktoré sú hrdí</p>
              </div>
            </div>
          </div>

          {/* Technology Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-6">Technológie a výrobné postupy</h3>
              <p className="text-xl text-foreground-muted max-w-3xl mx-auto">
                Moderné zariadenia a postupy zaručujú najvyššiu kvalitu našich vín
              </p>
              <div className="mt-6">
                <a href="/ubytovanie/vinosady" className="border-2 border-accent text-accent hover:bg-accent hover:text-foreground px-6 py-3 rounded-lg font-semibold inline-block">Ubytovanie Vinosady</a>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-background border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl">🌱</span>
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-4">Najmodernejšia technológia</h4>
                <p className="text-foreground-muted">Používame najmodernejšiu vinohradnícku technológiu pre optimálnu kvalitu</p>
              </div>
              
              <div className="bg-background border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl">🍇</span>
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-4">Šetrné spracovanie</h4>
                <p className="text-foreground-muted">Šetrné spracovanie hrozna s dôrazom na zachovanie kvality</p>
              </div>
              
              <div className="bg-background border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="text-xl font-semibold text-foreground mb-4">Riadená fermentácia</div>
                <p className="text-foreground-muted">Kontrolovaný proces fermentácie pre konzistentnú kvalitu</p>
              </div>
              
              <div className="bg-background border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="text-xl font-semibold text-foreground mb-4">Francúzske sudy</div>
                <p className="text-foreground-muted">Kvalitné francúzske drevené sudy pre dozrievanie vín</p>
              </div>
              
              <div className="bg-background border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="text-xl font-semibold text-foreground mb-4">Nerezové cisterny</div>
                <p className="text-foreground-muted">Nerezové cisterny pre optimálne uskladnenie</p>
              </div>
              
              <div className="bg-background border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="text-xl font-semibold text-foreground mb-4">Enologické postupy</div>
                <p className="text-foreground-muted">Profesionálne enologické postupy aplikované pri výrobe</p>
              </div>
            </div>
          </div>

          {/* Vision and Mission */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-6">Vízia a misia</h3>
              <p className="text-xl text-foreground-muted max-w-3xl mx-auto">
                Našimi produktmi a aktivitami chceme ochrániť budúcnosť vinohradov a prilákať nových turistov do Malých Karpát
              </p>
            </div>

            <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-3xl p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🌱</span>
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-4">Ochrániť budúcnosť vinohradov</h4>
                  <p className="text-foreground-muted">Vinohrady sú neustále zmršťované, my ich chceme zachovať pre budúce generácie</p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🏔️</span>
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-4">Prilákať turistov do Malých Karpát</h4>
                  <p className="text-foreground-muted">Chceme prilákať nových turistov do krásneho prostredia Malých Karpát</p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🍷</span>
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-4">Priniesť zážitok zo skvelého vína</h4>
                  <p className="text-foreground-muted">Chceme vám priniesť nezabudnuteľný zážitok z kvalitného vína</p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">📜</span>
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-4">Zachovať vinohradnícku tradíciu</h4>
                  <p className="text-foreground-muted">Tradícia, ktorá formuje región už tisícročia, musí pokračovať</p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🌍</span>
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-4">Zvýrazniť Slovensko na svetovej mape</h4>
                  <p className="text-foreground-muted">Prostredníctvom kvalitných vín chceme reprezentovať Slovensko vo svete</p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🤝</span>
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-4">Podporovať malých slovenských vinárov</h4>
                  <p className="text-foreground-muted">Ďakujeme všetkým partnerom, ktorí podporujú malých slovenských vinárov</p>
                </div>
              </div>

              {/* Thank you message */}
              <div className="mt-12 text-center">
                <div className="bg-background/50 rounded-2xl p-8 max-w-4xl mx-auto">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">Ďakujeme našim partnerom</h4>
                  <p className="text-lg text-foreground-muted leading-relaxed">
                    Všetkým našim partnerom a podnikom, ktoré ponúkajú naše vína srdečne ďakujeme za to, 
                    že sa rozhodli podporovať malých slovenských vinárov.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Family Gallery */}
          <div className="text-center">
            <h3 className="text-3xl font-bold text-foreground mb-8">Naša rodina</h3>
            <p className="text-xl text-foreground-muted mb-12 max-w-3xl mx-auto">
              Pozrite si fotky našej rodiny, ktorá už generácie buduje tradíciu vo vinohradníctve
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="group">
                <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  <Image
                    src="/o-nas/rodina1.JPG"
                    alt="Rodina Pútec - tradícia a vášeň pre víno"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h4 className="text-white font-semibold text-xl">Naša rodina</h4>
                    <p className="text-white/90">Tradícia a vášeň pre víno</p>
                  </div>
                </div>
              </div>
              
              <div className="group">
                <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  <Image
                    src="/o-nas/rodina2.jpg"
                    alt="Rodina Pútec - dedičstvo a láska k vinohradníctvu"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h4 className="text-white font-semibold text-xl">Rodinná tradícia</h4>
                    <p className="text-white/90">Dedičstvo a láska k vinohradníctvu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
