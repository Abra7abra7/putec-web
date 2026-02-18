# 🍷 Projektová Príručka: Vino Pútec (A - Z)

Tento dokument slúži ako kompletný návod na replikáciu, údržbu a škálovanie projektu `putec-web`. Obsahuje technickú architektúru, biznis logiku a postupy pre produkčné nasadenie.

---

## 1. Technologický Stack
Projekt je postavený na najnovších technológiách (2026), ktoré zabezpečujú extrémnu rýchlosť a moderný vývojový zážitok.

- **Framework**: [Next.js 16.1.6](https://nextjs.org/) (App Router, Turbopack)
- **Frontend**: [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/)
- **Lokalizácia**: `next-intl` (cez dynamic routing a server-side proxy)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) (pre košík a perzistenciu)
- **Animácie**: [Framer Motion](https://www.framer.com/motion/)
- **Emaily**: [Resend](https://resend.com/) + `@react-email` (React komponenty pre emaily)
- **Platby**: [Stripe](https://stripe.com/)
- **Fakturácia**: [SuperFaktúra API](https://www.superfaktura.sk/)

---

## 2. Priečinková Štruktúra
```text
putec-web/
├── app/                  # Hlavná aplikačná logika (Next.js App Router)
│   ├── [locale]/         # Lokalizované cesty (sk, en...)
│   ├── api/              # Backendové API endpoints (Stripe webhooky, rezervácie)
│   ├── actions/          # Server Actions (napr. superfaktura.ts)
│   └── emails/           # React-email šablóny
├── components/           # UI komponenty
│   ├── ui/               # Základné atómy (Button, Input...)
│   ├── business/         # Komponenty so sémantickým významom (FeatureIcon, SectionHeader)
│   ├── homepage/         # Špecifické sekcie pre domovskú stránku
│   └── shop/             # Komponenty súvisiace s obchodom a košíkom
├── configs/              # Konfiguračné JSON súbory (Checkout, Ceny dopravy)
├── messages/             # Prekladové súbory (sk.json, en.json)
├── public/               # Statické assety (obrázky, ikony, dokumenty)
├── types/                # Globálne TypeScript definície
├── utils/                # Pomocné funkcie a klientske fetchery
├── proxy.ts              # Kritický súbor pre lokalizáciu a redirecty
└── next.config.ts        # Konfigurácia Next.js a obrázkov
```

---

## 3. Lokalizácia & Smerovanie (Routing)
Používame pokročilý i18n systém, ktorý umožňuje lokalizované URL bez straty SEO hodnoty.

- **Middleware / Proxy**: Súbor `proxy.ts` v root-e funguje ako inteligentný filter. Rieši:
    1.  **301 Redirecty**: Zachováva SEO kontinuitu starých adries.
    2.  **Locale detection**: Deteguje jazyk prehliadača a smeruje na `/[locale]`.
- **Preklady**: Všetky texty sú v `messages/*.json`. Nepoužívajte hardcoded texty v komponentoch; vždy využite `getLocalization()` (server) alebo `useLocalization()` (client).

---

## 4. Biznis Logika & Integrácie

### 💳 Platobný Flow (Stripe)
1.  Zloží sa košík v Reduxe.
2.  Vytvorí sa `PaymentIntent` cez `/api/stripe/create-payment-intent`.
3.  **Metadata**: Stripe má limit 50 kľúčov. Preto metadáta konsolidujeme do JSON stringov (`cart_items`, `billing`, `shipping`).
4.  Po úspešnej platbe Stripe pošle Webhook na `/api/stripe/webhook`.
5.  Webhook spracuje objednávku: zavolá SuperFaktúru a pošle emaily cez Resend.

### 🧾 Fakturácia (SuperFaktúra)
- Implementovaná cez `app/actions/superfaktura.ts`.
- Podporuje **Ostré faktúry** (Stripe) aj **Zalohové faktúry** (Dobierka - COD).
- Podporuje Sandbox/Production režim cez premenné prostredia.

### 🍷 Rezervácie Degustácií
- Komponent `ReservationForm.tsx` rieši výber termínu a balíka.
- Povolené časy: **12:00 – 20:00**.
- Emaily s potvrdením odchádzajú zákazníkovi aj adminovi.

---

## 5. Lokálny Vývoj & Príkazy

Po naklonovaní projektu:
1.  `npm install`
2.  `cp .env.example .env` (Vyplňte kľúče)
3.  `npm run dev` (Štart vývojového servera)

**Stripe testovanie**:
```bash
# Pre lokálne testovanie webhookov
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## 6. Produkčné Nasadenie (Coolify + Docker)
Projekt je optimalizovaný pre platformu **Coolify** (na Hetzner Cloud).

- **Dockerfile**: Používa `multi-stage build` (Deps -> Builder -> Runner). Výstupom je `standalone` verzia, ktorá minimalizuje veľkosť (cca 150MB).
- **DNS**:
    - Hlavný web: `A` záznam smerujúci na IP servera.
    - Emaily: `CNAME` záznamy pre Resend DKIM overenie.
- **Environment Variables**: Všetky tajné kľúče (Stripe Secret, SuperFaktura Key, Resend Key) musia byť nastavené v Coolify paneli.

---

## 7. SEO & Výkon
- **Sitemap**: Generuje sa dynamicky cez `app/sitemap.ts`.
- **Obrázky**: Next.js vykonáva automatickú konverziu na WebP/AVIF. Vždy definujte `width`, `height` a `priority` pre LCP obrázky.
- **Manifest**: PWA funkcie povolené cez `app/manifest.ts`.

---

## 8. Údržba a Správa Obsahu
- **Produkty**: Ak sa menia ceny alebo dostupnosť, upravte zodpovedajúce JSON súbory v `configs/` alebo dáta v `messages/`.
- **Obrázky**: Nové obrázky vkladajte do `public/galeria/`. Používajte názvy bez diakritiky a medzier (napr. `biely-vlk.jpg`).

---
*Vytvorené Febuár 2026 pre vinárstvo Pútec.*
