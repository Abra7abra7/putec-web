# Vino Putec - E-shop pre prémiové vína

**Vino Putec** je moderný e-shop pre prémiové vína z rodinnej vinárne vo Vinosadoch. Postavený na Next.js 15, TypeScript, Tailwind CSS a Redux, optimalizovaný pre malé obchody s až 200 produktmi.

## Architektúra a štruktúra projektu (aktualizované 2025-09)

- Framework: Next.js App Router (15.x), TypeScript, TailwindCSS
- Stav: Redux Toolkit (košík, checkout stav)
- Úložisko produktov: JSON súbory v `configs/` (bez databázy)
- Platby: Stripe Payment Element + Webhook (fakturácia)
- Emaily: Resend (potvrdenia objednávok)
- Fakturácia: SuperFaktúra (právne platné faktúry)
- Hosting: Vercel (Node runtime pre webhook)

### Novinky (SEO, výkon, obsah)
- Výkon: optimalizované obrázky (`npm run images:optimize`), LCP/CLS fix (hero cez `next/image` s `priority`, `sizes`), lazy-load pod‑fold sekcií, `prefers-reduced-motion`.
- SEO: JSON‑LD pre `Organization`, `Winery (LocalBusiness)`, `WebSite`, `BreadcrumbList`, `ItemList`, `Product` (detail vína/degustácie) + canonical/OG.
- Interné prelinkovanie: posilnené odkazy na hlavné stránky `Degustácie` a `Ubytovanie` v menu, footeri, homepage a `o-nas`.
- UI dôveryhodnosť: rating badge (5.0/31) v hero a na kartách/detailoch.

### Strom adresárov (výber)
- `app/`
  - `page.tsx` – domovská stránka
  - `products/` a `vina/` – listing a detail produktov
  - `pokladna/` – checkout (Shipping/Billing, Stripe element)
  - `ordersummary/` – zhrnutie po platbe
  - `api/` – API routy (Stripe, newsletter, kontakty…)
    - `stripe/create-payment-intent` – vytvorenie PI + prenesenie metadát
    - `stripe/webhook` – vystavenie a odoslanie faktúry (finalize → send → paid)
    - `checkout/placeorder` – odoslanie e-mailov cez Resend
  - `degustacie/` – hlavná stránka degustácií
  - `ubytovanie/` – hlavná stránka ubytovania
- `configs/` – konfigurácie (wines.json, checkout.json, locale…)
- `public/` – obrázky (`/vina`, galérie, logá…)
- `store/` – Redux store, slices
- `docs/` – operatívny návod (`OPERATIONS.md`)

## Dátový model produktov (JSON)

- Zdroj pravdy: `configs/wines.json`
- Povinné polia: `Id`, `Name`, `Slug`, `RegularPrice`/`SalePrice`, `Currency`, `Image`, `Category`
- Obrázky: `public/vina/...` a v JSON sa referencujú cestou `/vina/xyz.jpg`

Pridanie produktu:
1. Nahraj obrázok do `public/vina/`
2. Pridaj záznam do `configs/wines.json`
3. Deploy (Vercel) – produkt sa zobrazí v liste a má detail cez `Slug`

## O nás

Putec s.r.o. je rodinná vinárňa s dlhoročnou tradíciou vo Vinosadoch, ktorá sa špecializuje na výrobu prémiových vín. Naša história sa začala s láskou k vinohradníctvu a túžbou vytvoriť vína, ktoré odrážajú jedinečnú chuť našej krajiny.

## Kontakt

- **Adresa**: Pezinská 154, 902 01 Vinosady, Slovensko
- **Telefón**: +421 903465666
- **Email**: brano.putec@gmail.com
- **IČO**: 36658774
- **DIČ**: 2022219430
- **IČ DPH**: SK2022219430
- **IBAN**: SK08 7500 0000 0040 3035 3200

## Funkcie

- **Bez databázy** – Produkty sú uložené v JSON súboroch
- **Rýchly a ľahký** – Postavený na Next.js a optimalizovaný pre výkon
- **Košík a objednávka** – LocalStorage košík s Stripe a dobierkou
- **Newsletter integrácia** – Prihlásenie na newsletter
- **Kontaktný formulár s Google reCAPTCHA v3** – Ochrana pred spamom
- **Spracovanie objednávok cez email** – Používa Resend na odosielanie notifikácií
- **Automatická fakturácia** – SuperFaktúra pre právne platné faktúry
- **SEO optimalizovaný** – Rýchle, indexovateľné stránky produktov
- **Nasadenie kdekoľvek** – Funguje na Vercel alebo akomkoľvek statickom hostingu

## Technológie

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Redux
- **Úložisko**: JSON-based súborový systém (bez databázy)
- **Platby**:
  - **Stripe Payment Element** – Online platby (Google Pay, Apple Pay, kreditné/debetné karty)
  - **Dobierka** – Platba kurierovi pri dodaní
  - **Osobný odber** – Platba na prevádzke vo Vinosadoch
- **Fakturácia**:
  - **SuperFaktúra** – Automatické generovanie právne platných faktúr (len pri online platbe)
- **Hosting**: Vercel

## Optimalizácia obrázkov (výkon a SEO)

- Používame `next/image` s optimalizáciou zapnutou v `next.config.ts` (formáty `AVIF`/`WebP`).
- Všetky obrázky v `public/` sú zmenšované in‑place skriptom (zachovaná logická štruktúra priečinkov):

Skripty:

```bash
# náhľad bez zmien (DRY RUN)
npm run images:dry

# ostrá optimalizácia (prepíše pôvodné súbory menšími a recompressnutými)
npm run images:optimize
```

Čo skript robí:
- obmedzí šírku veľkých fotiek na max 1600 px a recompressne podľa prípony:
  - JPEG → mozjpeg ~75
  - PNG → compressionLevel 9 + paleta
  - WebP/AVIF → primeraná kvalita
- logo `public/putec-logo.jpg` zmenšuje na 160 px pre malé použitie.
- DRY RUN: nastav `DRY_RUN=1` (používa `cross-env`) alebo `npm run images:dry`.

Poznámky k komponentom:
- `Hero` má `sizes="100vw"` a používa `fill`.
- Karty produktov používajú validné `width/height` + `sizes` pre responzívne načítanie.

Poznámka: odporúča sa spúšťať pred produkčným buildom, aby sa do buildu dostali už optimalizované assety.

## Next/Image konfigurácia
- Používa sa `images.remotePatterns` (namiesto deprecated `images.domains`) pre: `localhost`, `vino-putec-web.vercel.app`, `vinoputec.sk`.

## JSON‑LD schémy
- V `app/layout.tsx`: `Winery (LocalBusiness)`, `Organization`, `WebSite` + `aggregateRating` (5.0/31)
- Listingy (`/vina`, `/degustacie`): `BreadcrumbList`, `ItemList`
- Detaily (`/vina/[slug]`, `/degustacie/[slug]`): `Product` + `Offer` + `BreadcrumbList`

## Landingy a interné linky
- Landingy: `degustacie/pezinok`, `ubytovanie/vinosady`
- Menu a Footer doplnené o priame odkazy; homepage CTA smerujú na landingy
- `sitemap.ts` obsahuje nové cesty; po deploy požiadať o indexáciu v GSC

## Platobný proces a fakturácia

### Platobné metódy

1. **Stripe (Online platba)**
   - Google Pay, Apple Pay, kreditné/debetné karty
   - Okamžité spracovanie platby
   - Automatická SuperFaktúra faktúra odoslaná emailom

2. **Dobierka (Cash on Delivery)**
   - Platba kurierovi pri doručení
   - Bez online platby
   - Faktúru vystaví kurier

3. **Osobný odber**
   - Platba na prevádzke vo Vinosadoch
   - Bez online platby
   - Faktúru vystavia na prevádzke

### Emailová logika

- **Potvrdenie objednávky (Resend)** – Posielané **VŽDY** všetkým zákazníkom po úspešnej objednávke
- **Faktúra (SuperFaktúra)** – Posielané **len pri online platbe** cez Stripe
- **Dobierka/osobný odber** – Faktúru vystavuje kurier alebo prevádzka neskôr

### Nákupný proces – sekvenčný diagram

#### Online platba (Stripe):
```mermaid
sequenceDiagram
  autonumber
  actor U as Užívateľ
  participant FE as Next.js (frontend)
  participant API as Next.js API routes
  participant S as Stripe
  participant SF as SuperFaktúra
  participant R as Resend

  U->>FE: Vyplní dodacie/fakturačné údaje + vyberie "Stripe"
  FE->>API: POST /api/stripe/create-payment-intent (paymentMethod: "stripe")
  API->>S: Vytvor Customer + PaymentIntent (metadata)
  S-->>API: client_secret
  API-->>FE: client_secret

  U->>FE: Potvrdí platbu (Google Pay/Apple Pay/Karta)
  FE->>S: confirmPayment
  S-->>FE: redirect /ordersummary?payment_intent=…

  FE->>API: POST /api/checkout/placeorder
  API->>R: send admin + customer confirmation email
  R-->>API: OK

  Note over S,API: Webhook
  S-->>API: payment_intent.succeeded
  API->>SF: create SuperFaktura invoice + send email
  SF-->>API: invoice created & sent
```

#### Dobierka / Osobný odber:
```mermaid
sequenceDiagram
  autonumber
  actor U as Užívateľ
  participant FE as Next.js (frontend)
  participant API as Next.js API routes
  participant R as Resend

  U->>FE: Vyplní dodacie/fakturačné údaje + vyberie "Dobierka" alebo "Osobný odber"
  U->>FE: Klikne "Dokončiť objednávku"
  FE->>API: POST /api/checkout/placeorder
  API->>R: send admin + customer confirmation email
  R-->>API: OK
  
  Note over U,FE: Faktúru vystaví kurier (dobierka) alebo prevádzka (osobný odber)
```

## Stripe integrácia (platobná brána)

- **Produkčná Webhook URL**: `https://vino-putec-web.vercel.app/api/stripe/webhook`
- **Primárny event**: `payment_intent.succeeded`
- **Podporované platobné metódy**: Google Pay, Apple Pay, kreditné/debetné karty
- **Lokalizácia**: `customer.preferred_locales: ['sk', 'sk-SK']`

### Aké údaje sa prenášajú do Stripe metadata
- `PaymentIntent.metadata` obsahuje:
  - `orderId`, `paymentMethod` (stripe/cod/pickup)
  - `item_{i}_title`, `item_{i}_qty`, `item_{i}_price_cents`
  - `shippingMethod`, `shippingPriceCents`
  - billing_* a shipping_* polia (meno, adresa, e‑mail)
  - firemné údaje: `billing_company_name`, `billing_company_ico`, `billing_company_dic`, `billing_company_icdph`

### Testovanie (lokálne)
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
# nastav STRIPE_WEBHOOK_SECRET podľa výstupu listen
npm run dev
```
V logu uvidíš SuperFaktúra správy o vytvorení a odoslaní faktúry.

### Produkčný checklist
- [ ] `STRIPE_SECRET_KEY` v `.env` (Vercel Environment Variables)
- [ ] `STRIPE_PUBLISHABLE_KEY` v `.env` 
- [ ] `STRIPE_WEBHOOK_SECRET` pre webhook endpoint
- [ ] Webhook events: `payment_intent.succeeded`
- [ ] Test platba: Google Pay / Apple Pay / Karta → SuperFaktúra email

## SuperFaktúra integrácia - Primárny fakturačný systém

- **Automatická fakturácia**: Po úspešnej Stripe platbe sa vytvorí právne platná faktúra v SuperFaktúre
- **Podmienečné emailovanie**: Faktúra sa vytvorí a odošle **len pri online platbe** cez Stripe
- **Dobierka/osobný odber**: Faktúru netvoria automaticky (vystaví ju kurier/prevádzka)
- **Environment premenné**: 
  - `SUPERFAKTURA_EMAIL` - Email pre API autentifikáciu
  - `SUPERFAKTURA_API_KEY` - API kľúč
  - `SUPERFAKTURA_SEND_EMAILS=1` - Povoliť automatické odosielanie emailov
- **Podporované meny**: EUR, CZK
- **DPH sadzba**: 20% (nastaviteľné v `app/utils/superfaktura.ts`)

### ✅ Overené funkcie:
- **Produkčná URL**: `https://moja.superfaktura.sk`
- **API autentifikácia**: Funguje s produkčným kľúčom
- **Vytvorenie faktúry**: Úspešné vytvorenie s položkami + doprava
- **DPH kalkulácia**: 20% DPH správne vypočítané
- **Číslovanie faktúr**: Automatické
- **Email odosielanie**: Automatický email zákazníkovi pri online platbe
- **Firemné údaje**: IČO, DIČ, IČ DPH správne prenesené

### SuperFaktúra flow (len pri online platbe):
1. Zákazník zaplatí cez Stripe (Google Pay/Apple Pay/Karta)
2. Stripe webhook prijme `payment_intent.succeeded`
3. Kontrola `metadata.paymentMethod === 'stripe'`
4. SuperFaktúra vytvorí faktúru s položkami a dopravou
5. SuperFaktúra automaticky odošle email zákazníkovi
6. Resend odošle potvrdenie objednávky

### Dokumentácia:
- Podrobný návod: `docs/SUPERFAKTURA_INTEGRATION.md`
- Testovanie: Lokálne cez Stripe CLI alebo produkčne na Vercel

## API prehľad

- `GET /api/wines` – načítanie produktov z `configs/wines.json`
- `POST /api/stripe/create-payment-intent` – vytvorenie PaymentIntent, uloženie metadát (položky košíka, doprava, billing/shipping, firemné údaje, paymentMethod)
- `POST /api/stripe/webhook` – prijíma `payment_intent.succeeded`, vytvára SuperFaktúra faktúru (len pri online platbe)
- `POST /api/checkout/placeorder` – odošle potvrdenie objednávky cez Resend (volá sa vždy)

## Checkout UX

- Platobné metódy sa aktivujú hneď po vyplnení dopravy (billing sa predvyplní ako shipping, ak nie je zvolené „iná fakturačná adresa")
- Podpora firmy (IČO/DIČ/IČ DPH) – prenášané do Stripe metadata a SuperFaktúra faktúry

## Správa produktov (vína)

### Aktuálny stav
- **31 aktívnych produktov**: 
  - **28 vín**: Cabernet Franc, Cabernet Sauvignon (Rosé, Frizzante), Müller Thurgau, Dunaj, Frankovka Modrá, Chardonnay, Muškát Žltý, Pálava, Pesecká Leánka, Rizling (Rýnsky, Vlašský, Battonage), Pinot (Blanc, Gris), Veltlínske Zelené, Tramín Červený, Váh
  - **3 špeciálne sety**: Jarné Osvieženie, Parížske Zlato, Ročník 2023
- **Úložisko**: `configs/wines.json`
- **Obrázky**: `public/vina/` (optimalizované)
- **Kategórie**: Biele, Červené, Ružové, Perlivé, Suché, Polosuché, Polosladké, Sladké, Akcia, Výpredaj, Ocenené vína, Špeciálne Sety, Darčeky

### Ocenené vína
- **Cabernet Sauvignon Rosé 2024**: Zlatá medaila Paris Vinalies 2025
- **Chardonnay 2023**: Zlatá medaila Paris Vinalies 2024
- **Muškát Žltý 2020**: Zlatá medaila Grand Prix VINEX

### Ako pridať nové víno

1. **Nahrajte obrázok**
   ```bash
   # Skopírujte obrázok vína do:
   public/vina/nazov-vina-2024.jpg
   
   # Spustite optimalizáciu obrázkov:
   npm run images:optimize
   ```

2. **Pridajte položku do `configs/wines.json`**
   - Otvorte súbor `configs/wines.json`
   - Skopírujte existujúce víno ako šablónu
   - Upravte všetky polia:
     - `ID` - Unikátne ID (napr. "wine-032")
     - `Title` - Názov vína (napr. "Veltlínske zelené 2024")
     - `Slug` - URL slug (napr. "veltlinske-zelene-2024")
     - `ShortDescription` - Krátky popis (max 200 znakov)
     - `LongDescription` - Podrobný popis vína
     - `RegularPrice` - Bežná cena (napr. "12.90")
     - `SalePrice` - Akciová cena (rovnaká ako RegularPrice ak nie je akcia)
     - `FeatureImageURL` - Cesta k obrázku (napr. "/vina/veltlinske-zelene-2024.jpg")
     - `ProductCategories` - Kategórie (napr. ["Biele vína", "Suché vína"])
     - `WineDetails` - Všetky vinárske údaje (ročník, farba, chuť, aróma, alkohol, ...)

3. **Aktivujte víno**
   ```json
   "Enabled": true,
   "CatalogVisible": true
   ```

4. **Commit a deploy**
   ```bash
   git add .
   git commit -m "Pridané víno: Názov vína"
   git push
   ```
   Vercel automaticky nasadí zmeny na produkciu.

### Príklad štruktúry vína

Použite ktorékoľvek z existujúcich vín v `wines.json` (wine-001 až wine-028) ako predlohu. Všetky položky majú rovnakú štruktúru s detailnými vinárskymi údajmi.

### Poznámka o placeholder obrázkoch
Niektoré vína majú dočasné placeholder obrázky. Nahraďte ich skutočnými fotografiami vín:
- `cabernet-franc-2022.jpg`
- `muskat-zlty-2020.jpg`
- `tramin-cerveny-2023.jpg`
- `vah-2020.jpg`

## Nastavenie prostredia

- `.env.local` (lokálne), Vercel Env (produkcia)
- Kľúče (výber):
  - `STRIPE_SECRET_KEY` – test/live podľa režimu
  - `STRIPE_WEBHOOK_SECRET` – podľa Stripe endpointu (test/live)
  - `RESEND_API_KEY` – pre odosielanie potvrdení
  - `SUPERFAKTURA_EMAIL` – e-mail pre SuperFaktúra API
  - `SUPERFAKTURA_API_KEY` – API kľúč pre SuperFaktúra

## Nasadenie (Vercel)

- Webhook route beží na Node runtime (nie edge): `export const runtime='nodejs'`
- Webhook endpoint v Stripe: `https://vino-putec.vercel.app/api/stripe/webhook`, event: `payment_intent.succeeded`
- Pre produkciu použi LIVE kľúče a LIVE webhook secret

## Prečo nevyužívame Stripe Products

- Zdroj pravdy ostáva v JSON (`configs/wines.json`) kvôli kontrole vizuálu, rýchlosti a jednoduchosti
- Jednoduchá správa produktov bez nutnosti synchro nizácie s external API
- V budúcnosti je možné doplniť paralelne Stripe Products/Prices pre reporting/Tax bez zmeny UI (voliteľné)

## Poznámky k implementácii

- **Faktúry**: SuperFaktúra faktúry sa vytvoria len pri online platbe (Stripe), dobierka a osobný odber faktúru nevytvárajú
- **Emaily**: Resend odosiela potvrdenie objednávky vždy, SuperFaktúra odosiela faktúru len pri online platbe
- **Zber dát**: billing/shipping + firma/IČO/DIČ/IČ DPH → PI.metadata → SuperFaktúra faktúra
- **Idempotencia**: SuperFaktúra kontroluje `metadata.paymentMethod` pred vytvorením faktúry

## Spustenie

### Klonovanie repozitára
```sh
git clone https://github.com/Abra7abra7/vino-putec-web.git
cd vino-putec-web
```

### Inštalácia závislostí
```sh
npm install
```

### Konfigurácia

**/configs/products.json** - Obsahuje všetky údaje o produktoch pre váš obchod. Každý produkt obsahuje polia ako:
- ID, Názov, Slug, Krátky popis, Dlhý popis
- Bežná cena, Zľavová cena, Mena, Obrázok produktu
- Galéria obrázkov, Kategória, Typ predplatného, atď.

**/configs/locale.en.json** - Spravuje všetok lokalizovaný obsah pre rozhranie vášho obchodu vrátane:
- UI labely (tlačidlá, správy)
- Položky navigačného menu
- Footer a kontaktné informácie
- Sociálne médiá
- Obsah domovskej a o nás stránky

**/configs/checkout.json** - Definuje všetky nastavenia súvisiace s checkout skúsenosťou:
- Spôsoby dopravy: Názvy, ceny a meny
- Dostupné krajiny: Samostatné zoznamy pre krajiny dopravy a fakturácie
- Spôsoby platby: Zahŕňa Stripe a dobierku s možnosťami zapnúť/vypnúť

**/.env.local** – Ukladá citlivé premenné prostredia a konfiguráciu runtime pre váš obchod

### Nastavenie environment premenných
```sh
# Skopírujte príklad súboru
cp env.example .env.local

# Upravte .env.local s vašimi skutočnými API kľúčmi
# Všetky služby sú voliteľné - e-shop funguje aj bez nich
```

### Spustenie development servera
```sh
npm run dev
```

Potom otvorte http://localhost:3000 vo vašom prehliadači.

**Poznámka:** E-shop funguje aj bez nastavenia API kľúčov. Platobné metódy a newsletter budú dostupné až po nastavení príslušných služieb.

## Licencia

Vino Putec je vydaný pod MIT licenciou.

## Podpora

Ak nájdete tento projekt užitočný, zvážte podporu našej práce. Vaša podpora nám pomáha udržiavať tento projekt nažive a ďalej ho zlepšovať.

Ďakujeme! ❤️

---

### Administrátor: Operácie a podpora
- Podrobný operatívny návod pre Stripe a fakturáciu: `docs/OPERATIONS.md`