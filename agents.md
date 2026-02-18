# AGENTS.md - Prehľad projektu Vino Pútec

Tento dokument slúži ako hlavný zdroj informácií pre AI agentov pracujúcich na projekte.

## 🚀 Technologický Stack
- **Framework**: Next.js 16.1.6 (App Router, Turbopack)
- **Lokalizácia**: `next-intl` (Routing: `app/[locale]/`, Middleware: `proxy.ts`)
- **Frontend**: React 19.2.3, Tailwind CSS 4
- **State Management**: Redux Toolkit (@reduxjs/toolkit)
- **Animácie**: Framer Motion
- **Ikony**: Lucide React, React Icons, Custom `IconWrapper`
- **Emaily**: Resend API, @react-email (komponenty a render)
- **Platby**: Stripe (React Stripe JS)
- **Validácia**: Zod
- **Spracovanie obrázkov**: Sharp

## 🎨 Design a Vizuálny Štýl
Projekt používa moderný, luxusný a čistý vizuál zameraný na segment vinárstva.

- **Farebná Paleta**:
  - **Hlavná akcentná**: Modern Luxury Gold (`#D6AD60` / `--accent`)
  - **Hover akcent**: Darker Gold (`#B58E3E` / `--accent-dark`)
  - **Pozadie**: Čistá biela (`#ffffff`) a jemná béžová (`--accent-subtle`)
  - **Text**: Zinc 900 (`#18181b`) pre nadpisy, Zinc 700 pre telo textu.
- **Typografia**:
  - **Nadpisy**: `Poppins` (moderný, elegantný sans-serif)
  - **Telo textu**: `Inter` (vysoko čitateľný geometrický sans-serif)
- **Ikonografia**:
  - **Knižnice**: `lucide-react` (UI), `react-icons/si` (Brand/Social)
  - **Systém**: Centralizovaný cez `IconWrapper.tsx`.
  - **Štýl**: Duo-tone zlaté ikony s jemným pozadím (`bg-accent/5`) a mikro-animáciami.

## 🛠️ Funkcie a Integrácie
### 1. Lokalizácia & Routing (New 2026)
- **Štruktúra**: Všetky stránky sú v `app/[locale]/`. Default locale: `sk`.
- **Middleware**: Používame `proxy.ts` (nie `middleware.ts`) kvôli Next.js 16 kompatibilite.
- **Provider**: `LocalizationProvider` v `layout.tsx` zabezpečuje kontext pre klientske komponenty.
- **Redirects**: Staré URL (napr. `/sluzby`) sú presmerované v `proxy.ts`.

### 2. Nákupný proces a Košík
- **Košík**: Redux store zabezpečuje perzistenciu produktov.
- **Pokladňa**: `/pokladna` s formulármi pre dodacie a fakturačné údaje.

### 3. Externé Služby a API
- **Stripe (Platby)**: Generuje `PaymentIntent`, webhook na spracovanie objednávky.
- **SuperFaktúra**: Automatická fakturácia pri platbe.
- **Resend**: Transakčné emaily (Objednávka, Rezervácia).
- **Previo**: Rezervačný systém pre ubytovanie (iframe).

## 📍 Hlavné body implementácie
- **Proxy Middleware**: `proxy.ts` rieši:
  1. Presmerovania starých URL (SEO continuity).
  2. `next-intl` lokalizáciu.
  3. Ignorovanie statických assetov (`matcher` exclues `.*\\..*`).
- **Emaily**: Logá vkladané ako Base64 (pozri `fs.readFileSync`), šablóny v `app/emails`.
- **Images**: Automatická optimalizácia povolená (Next.js Image Optimization cez Vercel Edge).
- **PWA**: `manifest.ts` generuje `manifest.webmanifest`.
- **Hosting**: Projekt je nasadený v regióne **Frankfurt, EU (fra1)** pre nízku latenciu na Slovensku.

## 📄 Projektová Dokumentácia
V koreňovom priečinku sú dostupné tieto návody pre klienta:
- **[MIGRATION_GUIDE.md](file:///Users/abra/putec-web/MIGRATION_GUIDE.md)**: Postup pre DNS a migráciu z Websupportu.
- **[SEO_SPEED_AI_CHECKLIST.md](file:///Users/abra/putec-web/SEO_SPEED_AI_CHECKLIST.md)**: Kroky pre vyhľadávače a AI agentov.
- **[FINAL_PROJECT_REPORT.md](file:///Users/abra/putec-web/FINAL_PROJECT_REPORT.md)**: Záverečná správa a cenový návrh.

---
## 🛡️ Kvalita a Opravy
- **Hydratačné chyby**: Vyriešené odstránením duplicitných `<html>` a `<body>` tagov v pod-layoutoch (napr. `kontakt/layout.tsx`).
- **Výkon**: Zapnutá natívna optimalizácia obrázkov (Next.js Image), čo znižuje LCP pod 1s.

---
## 5. SEO & GEO Stratégia
### 🧠 Generative Engine Optimization (GEO)
Projekt implementuje metódy na zvýšenie viditeľnosti v AI modeloch:
- **AI Context Page**: `/ai-context` (Knowledge Base).
- **Robots.txt**: Explicitne povolené AI boty (`GPTBot`, `ClaudeBot`).
- **Metadata**: Rich metadata v `layout.tsx` (OpenGraph, Keywords).

### 🌍 Lokálne SEO & Schema.org
Cielime na: **Bratislava, Pezinok, Trnava, Senec**.

- **JSON-LD Schema**:
  - **Winery (LocalBusiness)**: V `layout.tsx`. Obsahuje adresu, otváracie hodiny, geo súradnice.
  - **Product**: V `page.tsx` produktu. Obsahuje cenu, dostupnosť, popis.
- **Sitemap**: Dynamicky generovaná v `app/sitemap.ts`.

### 🛡️ Migračné Safeguards
1. **Redirects (301/307)**: Všetky staré WordPress URL sú pokryté v `proxy.ts`.
2. **Zachovanie linkjuice**: Kanonické URL sú nastavené.

## 6. Migrácia a Produkčné Nastavenia (Coolify, Hetzner, Integrácie)

### 🏗️ Coolify & Docker
- **Server**: Hetzner Cloud (CX22/31), Ubuntu 24.04, Coolify v4.
- **Build Pack**: **Dockerfile** (nie Nixpacks!).
- **Node.js**: Verzia 20 (Alpine), `npm install`, `npm run build` (standalone).
- **Port**: `3000` (Exposed), `0.0.0.0` host.
- **Domains**: `https://vinoputec.sk` (Direction: Allow www & non-www).

### 🌐 DNS (WebSupport)
- **A Záznamy**:
  - `@` -> IP Hetzner Servera (`46.225.136.48`)
  - `www` -> IP Hetzner Servera (`46.225.136.48`)
  - `*` -> IP Hetzner Servera (voliteľné)
- **MX Záznamy**:
  - Hlavná doména: Ponechané WebSupport MX (`mailin1.vinoputec.sk`, ...)
  - Subdoména `send`: `feedback-smtp.eu-west-1.amazonses.com` (Priorita 10)

### 📧 Resend (Transakčné Emaily)
- **Domain**: `vinoputec.sk` (Region: EU - Ireland).
- **DNS Nastavenia**:
  - **DKIM**: `resend._domainkey` (TXT)
  - **SPF (send)**: `send` (TXT) -> `v=spf1 include:amazonses.com ~all`
- **Odosielateľ**: `RESEND_FROM_EMAIL="Vino Putec <objednavky@vinoputec.sk>"`

### 💳 Stripe (Platby)
- **Mode**: Live (Production).
- **Webhooks**:
  - **Endpoint**: `https://vinoputec.sk/api/stripe/webhook`
  - **Events**: `payment_intent.succeeded` (Kľúčový pre faktúry), `payment_intent.payment_failed`, `payment_intent.canceled`, `charge.failed`.
  - **Secret**: `STRIPE_WEBHOOK_SECRET` (začína `whsec_`).

### 🧾 SuperFaktúra
- **Mode**: Produkcia (`SUPERFAKTURA_SANDBOX=0`).
- **Email**: `brano.putec@gmail.com`
- **Nastavenia**: `SUPERFAKTURA_SEND_EMAILS=1`.

---
### 7. Aktuálne Vylepšenia a Opravy (Feb 18, 2026)
- **SEO & Indexing**:
  - **Bing Fixes**: Opravené duplicitné H1 tagy (Hero komponent refaktorovaný na podporu H2). Doplnené fallback ALT atribúty pre obrázky.
  - **Canonical URL**: Opravená kritická chyba v `layout.tsx` pre správnu indexáciu podstránok.
  - **Schema.org**: Implementovaná `Winery` schéma v `layout.tsx`.
- **UI/UX**:
  - **Overenie Veku**: Redizajn na High-Contrast (Biele pozadie, čierne písmo, zlaté tlačidlá) pre lepšiu čitateľnosť.
  - **Načítanie (Loading)**: Nahradená "červená ikona" za animovanú zlatú fľašu.
- **Infrastructure**:
  - **Docker**: Pridaná podpora `libc6-compat` do `Dockerfile` (runner stage) pre funkčnosť `sharp` (optimalizácia obrázkov).
  - **Bugfix**: Opravené nekonečné presmerovania na stránkach *Obchodné podmienky* a *Reklamačný poriadok* (`proxy.ts`).
- **Legal**: Doplnené IČO na stránku Ochrany osobných údajov.
- **Mobile & Accessibility**:
  - **Performance**: Optimalizované načítanie hlavného bannera (`fetchPriority="high"`).
  - **Accessibility**: Zvýšený kontrast textu na banneroch, pridané `aria-labels` (sociálne siete) a zväčšené dotykové plochy (slider).

---
*Posledná aktualizácia: 18. 2. 2026 (SEO Fixes & Final Polish)*
