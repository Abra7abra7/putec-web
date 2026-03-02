# Project Context & AI Agent System Prompt (agents.md)

Tento dokument slúži ako primárny kontextový súbor a "System Prompt" pre všetkých AI agentov pracujúcich v tomto repozitári. Jeho dodržiavanie je **kritické** pre zachovanie konzistencie architektúry a zamedzenie halucináciám (napríklad použitiu zastaraného Pages Routera alebo neexistujúcich knižníc). Očakáva sa prísne dodržiavanie týchto konvencií.

## 1. Tech Stack a kľúčové knižnice
Tento projekt je postavený na modernom stacku. Nepridávaj nové závislosti, pokiaľ to nie je absolútne nevyhnutné, a vždy používaj verzie kompatibilné s tými, ktoré sú uvedené v `package.json`.

*   **Framework:** Next.js 16.1.6
*   **Architektúra:** App Router (žiadny Pages Router!)
*   **React:** 19.2.3
*   **Jazyk:** TypeScript 5.9.3 (prísne typovanie)
*   **Styling a UI:** Tailwind CSS v4, Framer Motion (v12), Radix UI komponenty, `lucide-react`, `react-icons`, `yet-another-react-lightbox`, `sonner` (na notifikácie).
*   **Správa stavu:** Redux Toolkit 2.8.2 (`@reduxjs/toolkit`, `react-redux`).
*   **Spracovanie platieb:** Stripe (`stripe` 18.4.0, `@stripe/stripe-js`, `@stripe/react-stripe-js`).
*   **E-mailové notifikácie:** Resend 6.0.1, React Email (`@react-email/components`, `@react-email/render`).
*   **Lokalizácia (i18n):** `next-intl` 4.8.2.
*   **Validácia a Utility:** Zod (validácia dát), Axios, `clsx`, `tailwind-merge`, `uuid`.
*   **Iné:** `sharp` pre optimalizáciu obrázkov.
*   **Vývoj a build:** Turbopack podporovaný v dev prostredí, ESLint 9, knip.

## 2. Architektúra a Routing
Projekt striktne využíva **Next.js App Router**:

*   **Štruktúra zložiek:** Všetky routy sa nachádzajú v adresári `app/[locale]/`, pretože aplikácia je plne lokalizovaná cez `next-intl`. Zložka `src` neobsahuje root aplikácie.
*   **Konfigurácia a Layouts:** Koreňový layout poskytuje kontext a tému, zatiaľ čo vnorené layouty sa starajú o špecifiká domén (napr. navigácia, footer).
*   **Route Handlers (API):** Všetky backendové API endpointy sú v zložke `app/api/` (napr. webhooky pre Stripe v `app/api/stripe/webhook/route.ts`).
*   **Dáta a Mutácie (Server Actions):** Zložka `app/actions/` obsahuje server-side logiku spúšťanú z klientských alebo serverových komponentov (napríklad spájanie so SuperFaktúrou, kontaktné formuláre).
*   **Utility a Služby:** Sú v zložke `app/utils/` a obsahujú logiku pre e-maily, SuperFaktúru, Stripe integráciu atď.

## 3. Konvencie komponentov
*   **Komponenty sú implicitne Server Components.** Ak komponent potrebuje React hooks (`useState`, `useEffect`, `useRef`), event listenery (onClick), alebo Redux integráciu, musí na samom vrchu obsahovať direktívu `"use client"`. Snaž sa logiku a state pushovať čo najnižšie do stromu (tzv. "leaves"), aby zostala väčšina aplikácie server-rendered.
*   **Zložka komponentov (`app/components/`):**
    *   Sú zoradené podľa kontextu alebo featur (napr. `checkout/`, `homepage/`, `products/`, `ui/`, `ordersummary/`).
    *   UI knižnica (Radix / shadcn-like) má svoje striktné zložky, väčšinou pod `app/components/ui/`.
*   **Redux Store (`app/store/`):** Obsahuje globálny stav pre veci ako je košík (MiniCart). Redux je udržiavaný v `slices` na klientskej strane.
*   **Typy (`types/`):** Všetky globálne modely dát (Order, CartItem, atď.) sú definované tu. Striktne ich používaj pri vývoji pre zabezpečenie typovej bezpečnosti.

## 4. Získavanie údajov a mutácie
*   **Absencia dedikovanej vlastnej databázy pre objednávky:** Aplikácia **nepoužíva** žiadne tradičné ORM ako Prisma alebo Drizzle na ukladanie e-shopových dát. Žiadna definícia Schémy.
*   **Stripe ako "Source of Truth":** Objednávky sú viazané a uložené priamo v Stripes cez `PaymentIntent` objekty a ich `metadata`.
*   **Server Actions:** Mutácie (odosielanie formulárov, fakturácia) sú implementované ako asymptotické funkcie v `app/actions/`. Tieto formy poskytujú prísnu typovú kontrolu, a lepšie UX pre užívateľov (neukazujú priamu API cestu).
*   **Client Fetching:** Axios sa používa z redusových thunkov, resp. z explicitných klientských operácií pre integráciu externých dát. Nie je použitý React Query.

## 5. Spracovanie platieb a objednávok
Flow spracovania objednávok je úzko prepojený s webhookmi (Stripe):

1.  **Checkout Front-End:** Klient vyplní košík, fakturačné a dodacie údaje na strane klienta.
2.  **Payment Intent:** Vytvorí sa Stripe PaymentIntent. Komplexné dáta (JSON s položkami v košíku, shipping/billing adresa) sú uložené do `metadata` tohto PaymentIntentu kvôli absencii inej backend databázy.
3.  **Webhook (`app/api/stripe/webhook/route.ts`):** 
    *   Počúva udalosť `payment_intent.succeeded`.
    *   Je "chrbticou" e-shopu po zaplatení. Pri zachytení udalosti prečíta uložené `metadata`, z ktorých vybuduje lokálny `OrderBody` objekt.
    *   *Idempotencia* je kritická: Webhook spracováva requesty asynchrónne a je robustne napísaný tak, že pri pochybnosti nevytvára duplicitné faktúry.
4.  Následne triggeruje tvorbu faktúry a zasielanie e-mailov priamo zo Server prostredia aplikácie.

## 6. Generovanie faktúr
Fakturácia funguje výlučne cez slovenskú integráciu **SuperFaktúra**:

*   **Logika:** Keď prejde platba, webhook zavolá akciu `createSuperFakturaInvoice` umiestnenú v `app/actions/superfaktura.ts`.
*   Tá transformuje Stripe metadata do zrozumiteľných dátových štruktúr a pošle ich do API SuperFaktúry cez utilitu `app/utils/superFakturaApi.ts`.
*   SuperFaktúra vráti `invoiceId` a samotné PDF, ktoré sa následne použije v sekcii e-mailov a stiahne do buffera pre priloženie do mailu pomocou funkcie `downloadInvoicePDF`.
*   PDF generovanie frontendovými knižnicami ako puppeteer/react-pdf **nie je** prítomné. Fakturácia je delegovaná na SaaS.

## 7. E-mailové notifikácie
Komunikácia je realizovaná pomocou **Resend** a **React Email**:

*   **Logika a Odoslanie:** Centrálny bod je v `app/utils/emailUtilities.tsx` (obsahuje `sendAdminEmail` a `sendCustomerEmail`). Odosiela sa cez React Email objekt transformovaný do HTML.
*   **Šablóny:** E-mailové šablóny sú plnohodnotné React komponenty uložené v zložke `app/emails/` (napr. `OrderConfirmationCustomer`, `OrderConfirmationAdmin`). Sú štylizované tak, aby podporovali R2 (Cloudflare) storage pre obrázky loga.
*   **Proces (Triggers):** Akonáhle webhook overí úspešnú platbu v Stripe a zavolá sa vytvorenie faktúry, e-mailový systém sa natriggeruje. Aj v prípade, že faktúra sa zlyhá vytvoriť na strane SaaS služby, systém je dizajnovaný ako "best-effort failover", čiže samotný potvrdzovací e-mail musí zákazníkovi vždy spoľahlivo prísť. Vygenerovaná faktúra je pripojená ako `.pdf` príloha (ak sa úspešne stiahne do `pdfBuffer`).

## 8. Styling a UI
Projek obsahuje prísne estetické a kódovacie pravidlá pre dizajn:

*   **Tailwind CSS:** Používa sa verzia v4 zadefinovaná predovšetkým prostredníctvom pomocných tried v tsx komponentoch.
*   **Zlučovač tried `cn()`:** Každý komponent vyžadujúci zlučovanie CSS class by mal importovať funkciu `cn()` z `app/utils/utils.ts`. Toto spája funkcionalitu knižníc `clsx` a `tailwind-merge` predovšetkým na predchádzanie konfliktov vlastností (napr. pri prepise paddingov).
*   **Motion:** Mikroanimácie (napr. modálne okná, plynulé načítavanie obrázkov, posuvy v galériách) implementuj výhradne pomocou `framer-motion`.

## 9. Kódovací štýl a TypeScript
*   **Strict Mode:** TypeScript je silne obmedzený pre presnosť. Vyhýbaj sa typu `any` na úplné minimum. Využívaj interfaces špecifikované v `types/`.
*   **Error Handling:** Rieši sa najmä v backendových Actions/Routach zachytávaním `try/catch`. Ak chyba nastane, na klienta sa musí vrátiť objekt typu `{ error: "User friendly znenie chýbajúce logiky" }` a nesmie dochádzať k padnutiu frontendu. Konzola pre detailné chybové hlášky, klienti pre pekné Toast notifikácie (`sonner`).
*   **Naming Conventions:**
    *   **Komponenty:** `PascalCase` (`AgeVerification.tsx`, `MiniCart.tsx`).
    *   **Akcie / Utility:** `camelCase` (`createSuperFakturaInvoice`, `emailUtilities.tsx`).
    *   **Typy / Interface:** Prefixovanie písmenom `I` sa tu nepoužíva (`OrderBody`, nie `IOrderBody`).
*   **Žiadne placeholdery:** Nepoužívaj všeobecné názvy vo farbách dizajn systému a nerob zjednodušené verzie. Každý kód od AI by mal prinášať final-ready, produkčnú kvalitu.

---
**Inštrukcia pre AI Agentov pri riešení taskov:** Pred akoukoľvek zmenou štruktúry najprv zváž existujúce postupy. Zvlášť dbaj na to, že obchod nemá SQL/NoSQL databázu pre objednávky a všetko spravuje Stripe vo svojich webhookoch a Superfaktúra v externej správe. Ak pridávaš funkcie upravuj metadata štruktúry prúdiace zo Stripe po dohovore klienta!
