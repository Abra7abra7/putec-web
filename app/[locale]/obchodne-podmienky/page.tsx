import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Obchodné podmienky | Putec Vinosady | E-shop vína",
  description: "Obchodné podmienky pre nákup vína v e-shope rodinného vinárstva Putec vo Vinosadoch. Dodacie podmienky, reklamácie, vrátenie tovaru.",
  keywords: "obchodné podmienky, Putec, Vinosady, e-shop, víno, dodacie podmienky, reklamácie",
  openGraph: {
    title: "Obchodné podmienky | Putec Vinosady",
    description: "Obchodné podmienky pre nákup vína v e-shope",
    type: "website",
    locale: "sk_SK",
  },
  alternates: {
    canonical: "https://vinoputec.sk/obchodne-podmienky",
  },
};

export default function TermsConditionsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Obchodné podmienky
        </h1>
        
        <div className="prose prose-lg max-w-none text-foreground">
          <p className="text-foreground-muted mb-6">
            <strong>Účinnosť od:</strong> 1. januára 2025<br />
            <strong>Posledná aktualizácia:</strong> 1. januára 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Úvodné ustanovenia</h2>
            <p className="mb-4">
              Tieto obchodné podmienky upravujú vzájomné práva a povinnosti medzi spoločnosťou 
              <strong> Putec s.r.o.</strong> (ďalej len &quot;predávajúci&quot;) a kupujúcim pri predaji vína 
              prostredníctvom internetového obchodu.
            </p>
            <p className="mb-4">
              <strong>Identifikačné údaje predávajúceho:</strong><br />
              Putec s.r.o.<br />
              Pezinská 154, 902 01 Vinosady, Slovensko<br />
              IČO: [IČO]<br />
              Email: info@vinoputec.sk<br />
              Telefón: +421 903465666
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Predmet obchodu</h2>
            <p className="mb-4">
              Predávajúci predáva vína vlastnej výroby a súvisiace služby (degustácie, ubytovanie) 
              prostredníctvom internetového obchodu na adrese vinoputec.sk.
            </p>
            <p className="mb-4">
              <strong>Vekové obmedzenia:</strong> Predaj alkoholických nápojov je zakázaný osobám mladším ako 18 rokov. 
              Kupujúci potvrdzuje, že má 18 a viac rokov.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Ceny a platby</h2>
            <p className="mb-4">
              <strong>Ceny:</strong> Všetky ceny sú uvedené v eurách vrátane DPH. Ceny sú platné v čase objednávky.
            </p>
            <p className="mb-4">
              <strong>Spôsoby platby:</strong>
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Kreditná karta (Stripe)</li>
              <li>Bankový prevod</li>
              <li>Dobierka (len pre Slovensko)</li>
            </ul>
            <p className="mb-4">
              <strong>Dodacie podmienky:</strong> Platba je splatná v čase objednávky alebo pri dodaní tovaru.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Objednávky</h2>
            <p className="mb-4">
              <strong>Proces objednávky:</strong>
            </p>
            <ol className="list-decimal pl-6 mb-4">
              <li>Výber tovaru a pridanie do košíka</li>
              <li>Vyplnenie dodacích údajov</li>
              <li>Výber spôsobu platby</li>
              <li>Potvrdenie objednávky</li>
              <li>Zaslanie potvrdenia na email</li>
            </ol>
            <p className="mb-4">
              <strong>Potvrdenie objednávky:</strong> Objednávka je záväzná po jej potvrdení predávajúcim.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Dodanie tovaru</h2>
            <p className="mb-4">
              <strong>Dodacia lehota:</strong> 3-5 pracovných dní (Slovensko), 5-7 pracovných dní (ČR).
            </p>
            <p className="mb-4">
              <strong>Dodacie náklady:</strong>
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Slovensko: 5,90 € (nad 50 € zdarma)</li>
              <li>Česká republika: 8,90 € (nad 80 € zdarma)</li>
            </ul>
            <p className="mb-4">
              <strong>Riziko poškodenia:</strong> Prechádza na kupujúceho v čase prevzatia tovaru.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Reklamácie a záruka</h2>
            <p className="mb-4">
              <strong>Záručná doba:</strong> 24 mesiacov od dodania tovaru.
            </p>
            <p className="mb-4">
              <strong>Reklamačné práva:</strong> Kupujúci má právo na bezplatné opravy, výmenu alebo vrátenie tovaru 
              v prípade vady.
            </p>
            <p className="mb-4">
              <strong>Reklamačný postup:</strong> Reklamáciu je potrebné podať do 2 rokov od dodania tovaru 
              na email info@vinoputec.sk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Odstúpenie od zmluvy</h2>
            <p className="mb-4">
              <strong>Odstúpenie od zmluvy:</strong> Kupujúci má právo odstúpiť od zmluvy do 14 dní od prevzatia tovaru.
            </p>
            <p className="mb-4">
              <strong>Výnimky:</strong> Právo na odstúpenie sa nevzťahuje na:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Alkoholické nápoje (ak boli otvorené)</li>
              <li>Tovar vyrobený podľa individuálnych požiadaviek</li>
              <li>Degustačné balíčky</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Ochrana osobných údajov</h2>
            <p className="mb-4">
              Spracovanie osobných údajov sa riadi našimi Zásadami ochrany osobných údajov, 
              ktoré sú dostupné na stránke.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Finálne ustanovenia</h2>
            <p className="mb-4">
              <strong>Právny poriadok:</strong> Tieto podmienky sa riadia právom Slovenskej republiky.
            </p>
            <p className="mb-4">
              <strong>Riešenie sporov:</strong> Spory sa riešia pred príslušnými súdmi Slovenskej republiky.
            </p>
            <p className="mb-4">
              <strong>Zmeny podmienok:</strong> Predávajúci si vyhradzuje právo zmeniť tieto podmienky. 
              O zmene bude kupujúci informovaný.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Kontakt</h2>
            <p className="mb-4">
              Pre otázky týkajúce sa týchto obchodných podmienok nás kontaktujte:
            </p>
            <p className="mb-4">
              <strong>Email:</strong> info@vinoputec.sk<br />
              <strong>Telefón:</strong> +421 903465666<br />
              <strong>Adresa:</strong> Pezinská 154, 902 01 Vinosady, Slovensko
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
