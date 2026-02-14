import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reklamačný poriadok | Putec Vinosady | Reklamácie vína",
  description: "Reklamačný poriadok pre vína z rodinného vinárstva Putec vo Vinosadoch. Postup pri reklamácii vín, záručné podmienky, vrátenie tovaru.",
  keywords: "reklamačný poriadok, reklamácie vína, Putec, Vinosady, záruka, vrátenie tovaru",
  openGraph: {
    title: "Reklamačný poriadok | Putec Vinosady",
    description: "Reklamačný poriadok pre vína z vinárstva Putec",
    type: "website",
    locale: "sk_SK",
  },
  alternates: {
    canonical: "https://vinoputec.sk/reklamacny-poriadok",
  },
};

export default function ComplaintProcedurePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Reklamačný poriadok
        </h1>
        
        <div className="prose prose-lg max-w-none text-foreground">
          <p className="text-foreground-muted mb-6">
            <strong>Účinnosť od:</strong> 1. januára 2025<br />
            <strong>Posledná aktualizácia:</strong> 1. januára 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Základné informácie</h2>
            <p className="mb-4">
              Tento reklamačný poriadok upravuje postup pri reklamácii tovaru predávaného spoločnosťou 
              <strong> Putec s.r.o.</strong> prostredníctvom internetového obchodu.
            </p>
            <p className="mb-4">
              <strong>Kontaktné údaje pre reklamácie:</strong><br />
              Email: info@vinoputec.sk<br />
              Telefón: +421 903465666<br />
              Adresa: Pezinská 154, 902 01 Vinosady, Slovensko
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Záručné podmienky</h2>
            <p className="mb-4">
              <strong>Záručná doba:</strong> 24 mesiacov od dodania tovaru kupujúcemu.
            </p>
            <p className="mb-4">
              <strong>Predmet záruky:</strong> Záruka sa vzťahuje na vady tovaru, ktoré sa prejavia v záručnej dobe 
              a ktoré súvisia s kvalitou alebo funkčnosťou tovaru.
            </p>
            <p className="mb-4">
              <strong>Výnimky zo záruky:</strong>
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Poškodenie spôsobené nesprávnym používaním</li>
              <li>Poškodenie spôsobené vplyvom vonkajších faktorov</li>
              <li>Prirodzené opotrebovanie</li>
              <li>Poškodenie spôsobené otvorením fľaše</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Postup pri reklamácii</h2>
            <p className="mb-4">
              <strong>Krok 1: Kontaktovanie predávajúceho</strong><br />
              Reklamáciu je potrebné podať do 2 rokov od dodania tovaru na email info@vinoputec.sk 
              alebo telefonicky na +421 903465666.
            </p>
            <p className="mb-4">
              <strong>Krok 2: Poskytnutie informácií</strong><br />
              Pri reklamácii uveďte:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Číslo objednávky</li>
              <li>Popis vady</li>
              <li>Dátum objednávky</li>
              <li>Fotografiu vady (ak je to možné)</li>
            </ul>
            <p className="mb-4">
              <strong>Krok 3: Vyriešenie reklamácie</strong><br />
              Reklamáciu vyriešime do 30 dní od jej podania.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Spôsoby vyriešenia reklamácie</h2>
            <p className="mb-4">
              <strong>Oprava tovaru:</strong> Ak je tovar opraviteľný, opravíme ho bezplatne.
            </p>
            <p className="mb-4">
              <strong>Výmena tovaru:</strong> Ak oprava nie je možná, vymeníme tovar za nový.
            </p>
            <p className="mb-4">
              <strong>Vrátenie tovaru:</strong> Ak ani výmena nie je možná, vrátime kupnú cenu.
            </p>
            <p className="mb-4">
              <strong>Zľava z ceny:</strong> V prípade menších vád môžeme poskytnúť zľavu z ceny.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Náklady na reklamáciu</h2>
            <p className="mb-4">
              <strong>Oprávnená reklamácia:</strong> Všetky náklady spojené s reklamáciou hradí predávajúci.
            </p>
            <p className="mb-4">
              <strong>Neoprávnená reklamácia:</strong> Náklady hradí kupujúci.
            </p>
            <p className="mb-4">
              <strong>Doprava:</strong> Náklady na dopravu tovaru pri reklamácii hradí predávajúci.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Špeciálne podmienky pre vína</h2>
            <p className="mb-4">
              <strong>Alkoholické nápoje:</strong> Reklamácia vína je možná len v prípade, že fľaša nie je otvorená 
              a vada je viditeľná z vonku.
            </p>
            <p className="mb-4">
              <strong>Chuťové vady:</strong> Chuťové vady vína nie sú predmetom reklamácie, pokiaľ nie sú spôsobené 
              vadou tovaru.
            </p>
            <p className="mb-4">
              <strong>Skladovanie:</strong> Víno musí byť skladované podľa pokynov na etikete.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Reklamačný formulár</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-4">
              <h3 className="text-lg font-semibold mb-4">Informácie potrebné pre reklamáciu:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Meno a priezvisko</li>
                <li>Email a telefón</li>
                <li>Číslo objednávky</li>
                <li>Dátum objednávky</li>
                <li>Názov tovaru</li>
                <li>Popis vady</li>
                <li>Fotografia vady (príloha)</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Práva spotrebiteľa</h2>
            <p className="mb-4">
              <strong>Právo na reklamáciu:</strong> Spotrebiteľ má právo na reklamáciu vady tovaru do 2 rokov 
              od dodania tovaru.
            </p>
            <p className="mb-4">
              <strong>Právo na informácie:</strong> Spotrebiteľ má právo na informácie o postupe reklamácie 
              a jej vyriešení.
            </p>
            <p className="mb-4">
              <strong>Právo na náhradu:</strong> V prípade nevyriešenia reklamácie má spotrebiteľ právo na náhradu.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Kontakt a podpora</h2>
            <p className="mb-4">
              Pre otázky týkajúce sa reklamácií nás kontaktujte:
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
              <p className="mb-2">
                <strong>Pracovné hodiny:</strong> Po-Pia 8:00-16:00
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Finálne ustanovenia</h2>
            <p className="mb-4">
              Tento reklamačný poriadok je súčasťou obchodných podmienok a je záväzný pre obe strany.
            </p>
            <p className="mb-4">
              V prípade sporov sa postupuje podľa právneho poriadku Slovenskej republiky.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
