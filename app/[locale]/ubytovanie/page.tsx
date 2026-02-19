import Hero from "../../components/Hero";
import Link from "next/link";
import PrevioBookingClient from "../../components/PrevioBookingClient";
import InquiryForm from "../../components/ubytovanie/InquiryForm";
import { Slider } from "../../components/business/Slider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ubytovanie Vinosady | Penzión Malé Karpaty | Firemné akcie Teambuildingy | Víno Pútec",
  description: "Ubytovanie vo vinárstve Vinosady - 15 osôb, 6 izieb s vlastnou kúpeľňou. Firemné akcie, teambuildingy, ochutnávky vína v srdci Malých Karpát. Rezervácia ubytovania Pezinok, Bratislava.",
  keywords: "ubytovanie Vinosady, ubytovanie Malé Karpaty, penzión Vinosady, firemné akcie, teambuildingy, ochutnávky vína, ubytovanie Pezinok, ubytovanie Bratislava, ubytovanie vinárstvo, skupinové ubytovanie, catering Vinosady, degustácie vína, rodinné oslavy",
  openGraph: {
    title: "Ubytovanie vo vinárstve Vinosady | Firemné akcie a Teambuildingy",
    description: "Jedinečné ubytovanie priamo vo vinárstve - 15 osôb, firemné akcie, teambuildingy, ochutnávky vína v srdci Malých Karpát",
    type: "website",
    locale: "sk_SK",
    images: [
      {
        url: "/galeria/ubytovanie/vyhlad-na-vinohrad-x.jpg",
        width: 1200,
        height: 630,
        alt: "Ubytovanie vo vinárstve Vinosady - výhľad na vinohrady",
      },
    ],
  },
  alternates: {
    canonical: "https://vinoputec.sk/ubytovanie",
  },
};

export default function AccommodationPage() {
  // Slider slides - fotky z ubytovania
  const accommodationSlides = [
    { src: "/galeria/ubytovanie/izba-interier-x.jpg", alt: "Interiér ubytovania vo vinárstve Vinosady" },
    { src: "/galeria/ubytovanie/altanok-krb-x.jpg", alt: "Altánok s krbom" },
    { src: "/galeria/ubytovanie/altanok-x.jpg", alt: "Altánok" },
    { src: "/galeria/ubytovanie/kuchyna-x.jpg", alt: "Kuchyňa" },
    { src: "/galeria/ubytovanie/kupelna-x.jpg", alt: "Kúpeľňa" },
    { src: "/galeria/ubytovanie/veranda-na-poschodi-x.jpg", alt: "Veranda na poschodí" },
    { src: "/galeria/ubytovanie/dvor-so-sudom-x.jpg", alt: "Dvor so sudom" },
    { src: "/galeria/ubytovanie/vyhlad-na-vinohrad-x.jpg", alt: "Výhľad na vinohrad" },
  ];

  return (
    <div className="min-h-screen bg-background selection:bg-accent/30">
      <Hero
        title="Ubytovanie vo vinárstve"
        subtitle="Jedinečné ubytovanie priamo vo vinárstve s neopakovateľnými vínnymi a gastronomickými zážitkami v srdci Malých Karpát"
        backgroundImageUrl="/galeria/ubytovanie/vyhlad-na-vinohrad-x.jpg"
        primaryCta={{ label: "Rezervovať ubytovanie", href: "#rezervacia" }}
        secondaryCta={{ label: "Galéria", href: "/galeria/ubytovanie" }}
        heightClass="h-[80vh]"
      />

      {/* Main Content */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-6">

          {/* Introduction */}
          <div className="text-center mb-24 max-w-4xl mx-auto">
            <span className="text-accent font-bold uppercase tracking-[0.2em] text-sm mb-4 block">Vitajte u nás</span>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-10 leading-tight">
              Ubytovanie vo vinárstve Vinosady
            </h2>
            <p className="text-xl md:text-2xl text-foreground-muted leading-relaxed mb-8">
              Víno Pútec ponúka jedinečné ubytovanie priamo vo vinárstve, kde spájajú pohodlie s neopakovateľnými vínnymi a gastronomickými zážitkami v srdci Malých Karpát.
            </p>
            <div className="w-24 h-1 bg-accent mx-auto mb-8 opacity-50"></div>
            <p className="text-lg text-foreground-muted leading-relaxed">
              Ideálne pre firemné akcie, teambuildingy, rodinné oslavy a skupinové pobyty s možnosťou ochutnávok vína a catering služieb.
            </p>
          </div>

          {/* Capacity and Rooms */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
            <div className="relative group">
              <div className="absolute -inset-4 bg-accent/5 rounded-[2rem] blur-2xl group-hover:bg-accent/10 transition-colors"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-accent/10">
                <Slider slides={accommodationSlides} height="h-[450px] md:h-[600px]" />
              </div>
            </div>

            <div>
              <span className="text-accent font-bold uppercase tracking-widest text-sm mb-4 block">Parametre</span>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-10">Kapacita a komfort</h3>

              <div className="space-y-8">
                <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 bg-accent text-white rounded-xl flex items-center justify-center mr-5 shadow-lg shadow-accent/20">
                      <span className="font-bold text-2xl">15</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-foreground">Celková kapacita</h4>
                      <p className="text-accent text-sm font-medium">Rodinný dom pri vinárstve</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-gray-50 mt-4">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">🛏️</div>
                      <div>
                        <p className="font-bold text-foreground">3 izby</p>
                        <p className="text-xs text-foreground-muted uppercase tracking-tighter">Trojlôžkové</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">🛏️</div>
                      <div>
                        <p className="font-bold text-foreground">3 izby</p>
                        <p className="text-xs text-foreground-muted uppercase tracking-tighter">Dvojlôžkové</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 px-4">
                  <div className="flex items-center group">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-4 group-hover:bg-accent transition-colors">
                      <span className="text-accent group-hover:text-white transition-colors">✓</span>
                    </div>
                    <span className="text-foreground text-lg font-medium group-hover:text-accent transition-colors">Každá izba disponuje vlastnou kúpeľňou</span>
                  </div>
                  <div className="flex items-center group">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-4 group-hover:bg-accent transition-colors">
                      <span className="text-accent group-hover:text-white transition-colors">✓</span>
                    </div>
                    <span className="text-foreground text-lg font-medium group-hover:text-accent transition-colors">Maximálny komfort a osobný priestor</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Equipment and Facilities */}
          <div className="mb-32">
            <div className="text-center mb-16">
              <span className="text-accent font-bold uppercase tracking-widest text-sm mb-4 block">Čo ponúkame</span>
              <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-6">Vybavenie a priestory</h3>
              <div className="w-20 h-1 bg-accent/30 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex items-center mb-8">
                  <div className="w-20 h-20 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mr-6 group-hover:bg-accent group-hover:text-white transition-all transform group-hover:rotate-6">
                    <span className="text-4xl">🍳</span>
                  </div>
                  <h4 className="text-2xl md:text-3xl font-bold text-foreground">Spoločná Kuchyňa</h4>
                </div>
                <div className="space-y-4">
                  {['Plne vybavená pre všetkých hostí', 'Všetko potrebné pre gastro zážitky', 'Možnosť vlastnej prípravy jedla', 'Coworking priestor na oddych'].map((text) => (
                    <div key={text} className="flex items-start">
                      <span className="text-accent mr-3 mt-1 font-bold">→</span>
                      <span className="text-foreground-muted text-lg">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex items-center mb-8">
                  <div className="w-20 h-20 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mr-6 group-hover:bg-accent group-hover:text-white transition-all transform group-hover:-rotate-6">
                    <span className="text-4xl">📍</span>
                  </div>
                  <h4 className="text-2xl md:text-3xl font-bold text-foreground">Lokácia & Okolie</h4>
                </div>
                <div className="space-y-4 text-lg">
                  <div className="flex items-start">
                    <span className="text-accent mr-3 mt-1">📍</span>
                    <span className="text-foreground-muted underline decoration-accent/30">Pezinská 154, Vinosady</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-accent mr-3 mt-1">🏔️</span>
                    <span className="text-foreground-muted">V srdci Malých Karpát</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-accent mr-3 mt-1">🍇</span>
                    <span className="text-foreground-muted">Priamo medzi vinohradmi</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-accent mr-3 mt-1">🏠</span>
                    <span className="text-foreground-muted">Autentický rodinný dom</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="mb-32">
            <div className="text-center mb-16">
              <span className="text-accent font-bold uppercase tracking-widest text-sm mb-4 block">Boutique Služby</span>
              <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-6">Služby s ubytovaním</h3>
              <p className="text-xl text-foreground-muted max-w-3xl mx-auto">
                Kompletné zabezpečenie pre firemné akcie, teambuildingy a rodinné oslavy
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Catering */}
              <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-accent/5 text-accent rounded-full flex items-center justify-center mr-5 group-hover:bg-accent group-hover:text-white transition-all">
                    <span className="text-3xl">🍽️</span>
                  </div>
                  <h4 className="text-2xl font-bold text-foreground">Catering a stravovanie</h4>
                </div>
                <div className="space-y-4">
                  {[
                    'Raňajky dostupné pre firemné akcie a skupiny',
                    'Catering služby pre teambuildingy',
                    'Rodinné oslavy a špeciálne príležitosti',
                    'Kompletné zabezpečenie menu',
                    'Prispôsobenie podľa vašich požiadaviek'
                  ].map((text) => (
                    <div key={text} className="flex items-center group/item">
                      <span className="w-2 h-2 rounded-full bg-accent/30 mr-4 group-hover/item:scale-150 group-hover/item:bg-accent transition-all"></span>
                      <span className="text-foreground-muted text-lg">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Corporate Services */}
              <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-accent/5 text-accent rounded-full flex items-center justify-center mr-5 group-hover:bg-accent group-hover:text-white transition-all">
                    <span className="text-3xl">🏢</span>
                  </div>
                  <h4 className="text-2xl font-bold text-foreground">Firmy a teambuilding</h4>
                </div>
                <div className="space-y-4">
                  {[
                    'Exkluzívny priestor v srdci Malých Karpát',
                    'Kapacita až 17 osôb pre odborné degustácie',
                    'Kombinácia vínovej kultúry s prácou',
                    'Profesionálny prístup k organizácii',
                    'Nezabudnuteľné zážitky v prírode'
                  ].map((text) => (
                    <div key={text} className="flex items-center group/item">
                      <span className="w-2 h-2 rounded-full bg-accent/30 mr-4 group-hover/item:scale-150 group-hover/item:bg-accent transition-all"></span>
                      <span className="text-foreground-muted text-lg">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Form Section */}
          <div id="teambuilding" className="mt-32">
            <InquiryForm />
          </div>

          {/* CTA Section */}
          <div className="bg-accent text-white rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/putec-logo.jpg')] opacity-5 mix-blend-overlay"></div>
            <div className="relative z-10">
              <h3 className="text-3xl md:text-5xl font-bold mb-8">
                Rezervujte si ubytovanie vo vinárstve
              </h3>
              <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto opacity-90">
                Ideálne pre firemné akcie, teambuildingy, rodinné oslavy a skupinové pobyty s ochutnávkami vína
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href="#rezervacia"
                  className="bg-white text-accent hover:bg-gray-100 px-10 py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl"
                >
                  Rezervovať ubytovanie
                </a>
                <Link
                  href="/galeria/ubytovanie"
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-5 rounded-2xl font-bold text-lg transition-all"
                >
                  Pozrieť galériu
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation Section */}
      <section id="rezervacia" className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Rezervácia ubytovania</h2>
              <p className="text-lg text-foreground-muted">
                Vyplňte formulár nižšie pre rezerváciu ubytovania vo vinárstve
              </p>
            </div>

            <div className="bg-background rounded-lg shadow-lg p-8">
              <PrevioBookingClient />
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
              <summary className="font-semibold text-foreground">Koľko osôb môžeme ubytovať?</summary>
              <p className="text-foreground-muted mt-2">Závisí od obsadenosti – napíšte nám a preveríme dostupnosť.</p>
            </details>
            <details className="bg-background border border-gray-200 rounded-lg p-4">
              <summary className="font-semibold text-foreground">Sú k dispozícii raňajky?</summary>
              <p className="text-foreground-muted mt-2">Áno, po dohode vieme zabezpečiť raňajky aj občerstvenie.</p>
            </details>
            <details className="bg-background border border-gray-200 rounded-lg p-4">
              <summary className="font-semibold text-foreground">Je možné spojiť pobyt s degustáciou?</summary>
              <p className="text-foreground-muted mt-2">Samozrejme – odporúčame rezervovať degustáciu vopred.</p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
