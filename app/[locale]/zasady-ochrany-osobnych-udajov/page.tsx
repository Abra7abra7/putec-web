import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zásady ochrany osobných údajov | Putec Vinosady | GDPR",
  description: "Zásady ochrany osobných údajov pre rodinné vinárstvo Putec vo Vinosadoch. Informácie o spracovaní osobných údajov podľa GDPR.",
  keywords: "zásady ochrany osobných údajov, GDPR, Putec, Vinosady, súkromie, cookies",
  openGraph: {
    title: "Zásady ochrany osobných údajov | Putec Vinosady",
    description: "Zásady ochrany osobných údajov pre rodinné vinárstvo Putec",
    type: "website",
    locale: "sk_SK",
  },
  alternates: {
    canonical: "https://vinoputec.sk/zasady-ochrany-osobnych-udajov",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Zásady ochrany osobných údajov
        </h1>
        
        <div className="prose prose-lg max-w-none text-foreground">
          <p className="text-foreground-muted mb-6">
            <strong>Účinnosť od:</strong> 1. januára 2025<br />
            <strong>Posledná aktualizácia:</strong> 1. januára 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Správca osobných údajov</h2>
            <p className="mb-4">
              Správcom osobných údajov je spoločnosť <strong>Putec s.r.o.</strong> so sídlom Pezinská 154, 902 01 Vinosady, Slovensko, IČO: [IČO], zapísaná v Obchodnom registri Okresného súdu Trnava.
            </p>
            <p className="mb-4">
              <strong>Kontaktné údaje:</strong><br />
              Email: info@vinoputec.sk<br />
              Telefón: +421 903465666<br />
              Adresa: Pezinská 154, 902 01 Vinosady, Slovensko
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Spracovávané osobné údaje</h2>
            <p className="mb-4">Spracovávame nasledovné kategórie osobných údajov:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Identifikačné údaje:</strong> meno, priezvisko, email, telefón</li>
              <li><strong>Adresné údaje:</strong> dodacia a fakturačná adresa</li>
              <li><strong>Údaje o objednávkach:</strong> číslo objednávky, dátum, obsah, suma</li>
              <li><strong>Technické údaje:</strong> IP adresa, cookies, údaje o zariadení</li>
              <li><strong>Marketingové údaje:</strong> súhlas s odberom newslettera</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Účely spracovania</h2>
            <p className="mb-4">Osobné údaje spracovávame na tieto účely:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Vykonávanie objednávok a dodávok vína</li>
              <li>Komunikácia s zákazníkmi</li>
              <li>Fakturácia a účtovníctvo</li>
              <li>Marketingové aktivity (len so súhlasom)</li>
              <li>Zabezpečenie webovej stránky</li>
              <li>Splnenie zákonných povinností</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Právny základ spracovania</h2>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Vykonanie zmluvy:</strong> objednávky, dodávky, fakturácia</li>
              <li><strong>Súhlas:</strong> marketingové komunikácie, cookies</li>
              <li><strong>Oprávnený záujem:</strong> zabezpečenie webovej stránky</li>
              <li><strong>Zákonná povinnosť:</strong> účtovníctvo, daňové povinnosti</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Doba uchovávania</h2>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Objednávky:</strong> 10 rokov (účtovné záznamy)</li>
              <li><strong>Marketingové údaje:</strong> do odvolania súhlasu</li>
              <li><strong>Cookies:</strong> podľa typu (1 rok - 2 roky)</li>
              <li><strong>Technické údaje:</strong> 1 rok</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Práva subjektov údajov</h2>
            <p className="mb-4">Máte právo na:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Prístup k svojim osobným údajom</li>
              <li>Opravu nepresných údajov</li>
              <li>Vymazanie údajov (&quot;právo byť zabudnutý&quot;)</li>
              <li>Obmedzenie spracovania</li>
              <li>Prenosnosť údajov</li>
              <li>Námitku proti spracovaniu</li>
              <li>Odvolanie súhlasu</li>
            </ul>
            <p className="mb-4">
              Tieto práva môžete uplatniť na email: <strong>info@vinoputec.sk</strong>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Cookies</h2>
            <p className="mb-4">
              Naša webová stránka používa cookies na zlepšenie používateľskej skúsenosti a analýzu návštevnosti. 
              Cookies sú malé textové súbory ukladané vo vašom prehliadači.
            </p>
            <p className="mb-4">
              <strong>Typy cookies:</strong>
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Nevyhnutné:</strong> zabezpečenie funkčnosti stránky</li>
              <li><strong>Analytické:</strong> analýza návštevnosti (Google Analytics)</li>
              <li><strong>Marketingové:</strong> personalizácia obsahu</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Zabezpečenie údajov</h2>
            <p className="mb-4">
              Implementovali sme vhodné technické a organizačné opatrenia na ochranu vašich osobných údajov pred 
              neoprávneným prístupom, zmenou, zničením alebo stratou.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Kontakt</h2>
            <p className="mb-4">
              Pre otázky týkajúce sa spracovania osobných údajov nás kontaktujte:
            </p>
            <p className="mb-4">
              <strong>Email:</strong> info@vinoputec.sk<br />
              <strong>Telefón:</strong> +421 903465666<br />
              <strong>Adresa:</strong> Pezinská 154, 902 01 Vinosady, Slovensko
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Zmeny zásad</h2>
            <p className="mb-4">
              Tieto zásady môžeme aktualizovať. O významných zmenách vás budeme informovať prostredníctvom 
              webovej stránky alebo emailu.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
