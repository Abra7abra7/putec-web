# AGENTS.md - Prehľad projektu Vino Pútec

Tento dokument slúži ako hlavný zdroj informácií pre AI agentov pracujúcich na projekte.

## 🚀 Technologický Stack
- **Framework**: Next.js 16.1.6 (App Router, Turbopack)
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
  - **Štýl**: Duo-tone zlaté ikony s jemným pozadím (`bg-accent/5`) a mikro-animáciami (zväčšenie, rotácia a odlesk na hoveri).
  - **Hlavička & Navigácia**: Desktopové menu so zväčšeným písmom (`text-base semibold`), širšími rozostupmi a glassmorphism efektom pozadia.
- **Vizuálne prvky**:
  - **Zaoblenie**: Väčšie zaoblenia rohov (`borderRadius: 0.75rem` / `lg`).
  - **Tlačidlá**: Výrazné zlaté CTA tlačidlá s hover efektmi a plynulými prechodmi (Framer Motion).
  - **Obrázky**: Používanie vysokokvalitných `webp` obrázkov viníc a produktov. Banners majú `vineyard-banner.webp`.

## 🛠️ Funkcie a Integrácie
### 1. Nákupný proces a Košík
- **Košík**: Redux store zabezpečuje perzistenciu produktov. Existuje `MiniCart.tsx` (slide-over) pre rýchly prístup.
- **Pokladňa**: `/pokladna` s formulármi pre dodacie a fakturačné údaje.

### 2. Externé Služby a API
- **Stripe (Platobná brána)**: 
  - Generuje `PaymentIntent` cez `/api/stripe/create-payment-intent`.
  - Spracováva platby cez `PaymentElement`.
  - Webhook (`/api/stripe/webhook`) automatizuje následné kroky.
- **SuperFaktúra (Generovanie faktúr)**: 
  - Automatické vytvorenie faktúry po úspešnej Stripe platbe.
  - Sťahovanie PDF faktúry a jej pripojenie k emailu.
  - Podpora Sandbox aj Production módu.
- **Resend (Emailing)**:
  - Odosielanie potvrdení o objednávkach, rezerváciách a kontaktných formulárov.
  - Používa React-based šablóny v `app/emails`.
- **Previo (Ubytovanie)**:
  - Integrácia cez `iframe` rezervačného modulu Previon (Hot ID 782975).
- **Google Maps**:
  - Zobrazenie polohy vinárstva (lenivá inicializácia).

### 3. Rezervácie
- **Degustácie**: Vlastný formulár a API endpoint `/api/degustation-reservation`. Pošle email adminovi a zákazníkovi.
- **Ubytovanie**: Cez externý systém Previo.

### 4. Súkromie a Cookies
- **Cookie Banner**: Plávajúca karta s vysokou opacitou (95%), rozmazaným pozadím (backdrop-blur) a tieňovaním. Umiestnený vpravo dole pre lepšiu čitateľnosť.

## 📍 Hlavné body implementácie
- **Checkout Flow**: Detailne popísaný v `CHECKOUT_FLOW.md`.
- **Emaily**: Inline logá (CID) pre lepší vizuál v emailových klientoch.
- **Next.js 16 Proxy**: Používa `proxy.ts` namiesto staršieho `middleware.ts` (Turbopack konvencia).
- **SEO**: Automaticky generovaná `sitemap.ts` a `robots.ts`.

---
## 5. SEO & GEO Stratégia (New 2026)
### 🧠 Generative Engine Optimization (GEO)
Projekt implementuje "Princeton GEO metódy" na zvýšenie viditeľnosti v AI modeloch (ChatGPT, Perplexity, Gemini).
- **AI Context Page**: `/ai-context` (Knowledge Base pre botov). Obsahuje čisté fakty, štatistiky a citácie.
- **FAQ Schéma**: Každá otázka v `/ai-context` má `JSON-LD FAQPage` markup.
- **Robots.txt**: Explicitne povolené: `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Anthropic-AI`.

### 🌍 Lokálne SEO (Western Slovakia)
Cielime na zákazníkov z miest: **Bratislava, Pezinok, Trnava, Senec**.
- **Metadata**: Keywords a Description v `layout.tsx` obsahujú tieto lokality.
- **Schema.org**: `Winery` element obsahuje property `areaServed` s definovanými mestami.

**Príklad implementácie (Layout):**
```typescript
"areaServed": [
  { "@type": "City", "name": "Bratislava" },
  { "@type": "City", "name": "Pezinok" }
]
```

### 🛡️ Migračné Safeguards (Websupport -> Vercel)
Pri migrácii dodržiavame striktné pravidlá:
1. **Redirects (308)**: Staré URL (`/sluzby`, `/obchod`) musia smerovať na nové (`/degustacie`, `/vina`). Nastavené v `next.config.ts`.
2. **Emaily**: 
   - **MX záznamy** (Websupport) sa **NEMENIA** (prijímanie pošty).
   - **TXT/SPF** (Resend) sa pridávajú len pre odosielanie notifikácií.

---
*Posledná aktualizácia: 12. 2. 2026 (SEO Update)*
