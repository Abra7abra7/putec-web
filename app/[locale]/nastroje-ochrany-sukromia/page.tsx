import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nástroje na ochranu súkromia | Putec Vinosady | Cookies, GDPR",
  description: "Nástroje na ochranu súkromia pre webovú stránku rodinného vinárstva Putec. Správa cookies, nastavenia súkromia, GDPR compliance.",
  keywords: "nástroje ochrany súkromia, cookies, GDPR, Putec, Vinosady, súkromie, nastavenia",
  openGraph: {
    title: "Nástroje na ochranu súkromia | Putec Vinosady",
    description: "Nástroje na ochranu súkromia a správa cookies",
    type: "website",
    locale: "sk_SK",
  },
  alternates: {
    canonical: "https://vinoputec.sk/nastroje-ochrany-sukromia",
  },
};

export default function PrivacyToolsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Nástroje na ochranu súkromia
        </h1>
        
        <div className="prose prose-lg max-w-none text-foreground">
          <p className="text-foreground-muted mb-6">
            <strong>Účinnosť od:</strong> 1. januára 2025<br />
            <strong>Posledná aktualizácia:</strong> 1. januára 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Správa cookies</h2>
            <p className="mb-4">
              Na tejto stránke môžete spravovať svoje nastavenia cookies a súkromia. 
              Cookies sú malé textové súbory, ktoré sa ukladajú vo vašom prehliadači 
              a pomáhajú nám zlepšovať vašu skúsenosť na webe.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Aktuálne nastavenia cookies</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Nevyhnutné cookies</h4>
                    <p className="text-sm text-foreground-muted">
                      Zabezpečujú základnú funkčnosť webovej stránky
                    </p>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Vždy aktívne
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Analytické cookies</h4>
                    <p className="text-sm text-foreground-muted">
                      Pomáhajú nám analyzovať návštevnosť a zlepšovať web
                    </p>
                  </div>
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    Môžete spravovať
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Marketingové cookies</h4>
                    <p className="text-sm text-foreground-muted">
                      Používajú sa na personalizáciu reklám a obsahu
                    </p>
                  </div>
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    Môžete spravovať
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Typy cookies</h2>
            
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-foreground">Nevyhnutné cookies</h3>
                <p className="mb-3 text-foreground-muted">
                  Tieto cookies sú nevyhnutné pre fungovanie webovej stránky a nemožno ich vypnúť.
                </p>
                <ul className="list-disc pl-6 text-sm text-foreground-muted">
                  <li>Udržiavanie prihlásenia</li>
                  <li>Zabezpečenie bezpečnosti</li>
                  <li>Funkčnosť košíka</li>
                  <li>Základné nastavenia stránky</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-foreground">Analytické cookies</h3>
                <p className="mb-3 text-foreground-muted">
                  Pomáhajú nám pochopiť, ako návštevníci používajú našu webovú stránku.
                </p>
                <ul className="list-disc pl-6 text-sm text-foreground-muted">
                  <li>Google Analytics</li>
                  <li>Štatistiky návštevnosti</li>
                  <li>Analýza správania používateľov</li>
                  <li>Optimalizácia výkonu</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-foreground">Marketingové cookies</h3>
                <p className="mb-3 text-foreground-muted">
                  Používajú sa na zobrazovanie relevantných reklám a personalizáciu obsahu.
                </p>
                <ul className="list-disc pl-6 text-sm text-foreground-muted">
                  <li>Personalizácia reklám</li>
                  <li>Meranie efektivity kampaní</li>
                  <li>Retargeting</li>
                  <li>Sociálne médiá</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Správa súhlasu</h2>
            <p className="mb-4">
              Môžete kedykoľvek zmeniť svoje nastavenia cookies. Váš súhlas je dobrovoľný 
              a môžete ho kedykoľvek odvolať.
            </p>
            
            <div className="bg-accent/10 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Ako zmeniť nastavenia</h3>
              <ol className="list-decimal pl-6 space-y-2 text-foreground-muted">
                <li>Kliknite na tlačidlo &quot;Nastavenia cookies&quot; v footeri stránky</li>
                <li>Vyberte si, ktoré typy cookies chcete povoliť</li>
                <li>Uložte svoje nastavenia</li>
                <li>Zmeny sa prejavia okamžite</li>
              </ol>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Vaše práva</h2>
            <p className="mb-4">
              Podľa GDPR máte nasledovné práva týkajúce sa vašich osobných údajov:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-foreground">Právo na prístup</h3>
                <p className="text-sm text-foreground-muted">
                  Môžete požiadať o informácie o tom, aké osobné údaje o vás spracovávame.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-foreground">Právo na opravu</h3>
                <p className="text-sm text-foreground-muted">
                  Môžete požiadať o opravu nepresných alebo neúplných údajov.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-foreground">Právo na vymazanie</h3>
                <p className="text-sm text-foreground-muted">
                  Môžete požiadať o vymazanie vašich osobných údajov.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-foreground">Právo na obmedzenie</h3>
                <p className="text-sm text-foreground-muted">
                  Môžete požiadať o obmedzenie spracovania vašich údajov.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Tretie strany</h2>
            <p className="mb-4">
              Naša webová stránka môže obsahovať odkazy na tretie strany alebo používať služby tretích strán. 
              Tieto služby majú svoje vlastné zásady ochrany súkromia.
            </p>
            
            <div className="space-y-4">
              <div className="border-l-4 border-accent pl-4">
                <h3 className="font-semibold text-foreground">Google Analytics</h3>
                <p className="text-sm text-foreground-muted">
                  Používame Google Analytics na analýzu návštevnosti. 
                  <a href="https://policies.google.com/privacy" className="text-accent hover:underline ml-1">
                    Zásady ochrany súkromia Google
                  </a>
                </p>
              </div>
              
              <div className="border-l-4 border-accent pl-4">
                <h3 className="font-semibold text-foreground">Stripe</h3>
                <p className="text-sm text-foreground-muted">
                  Pre platby používame Stripe. 
                  <a href="https://stripe.com/privacy" className="text-accent hover:underline ml-1">
                    Zásady ochrany súkromia Stripe
                  </a>
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Kontakt</h2>
            <p className="mb-4">
              Pre otázky týkajúce sa ochrany súkromia alebo spravovania cookies nás kontaktujte:
            </p>
            
            <div className="bg-accent/10 p-6 rounded-lg">
              <p className="mb-2">
                <strong>Email:</strong> info@vinoputec.sk
              </p>
              <p className="mb-2">
                <strong>Telefón:</strong> +421 903465666
              </p>
              <p className="mb-2">
                <strong>Adresa:</strong> Pezinská 154, 902 01 Vinosady, Slovensko
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Zmeny v nastaveniach</h2>
            <p className="mb-4">
              Tieto nástroje na ochranu súkromia môžeme aktualizovať. O významných zmenách 
              vás budeme informovať prostredníctvom webovej stránky alebo emailu.
            </p>
            <p className="mb-4">
              Odporúčame vám pravidelne kontrolovať túto stránku, aby ste zostali informovaní 
              o našich praktikách ochrany súkromia.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
