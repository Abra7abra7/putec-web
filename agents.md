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
- **Desktop**:
  - **Performance**: Upravené `sizes` atribúty pre obrázky v slideroch a `BrandStory` (prevencia sťahovania zbytočne veľkých obrázkov).
  - **Accessibility**: Opravená hierarchia nadpisov (H2 -> H3) a kontrast textu v recenziách.

- **Checkout & Payments (Feb 18, 2026)**:
  - **Stripe Metadata**: Vyriešený limit 50 kľúčov konsolidáciou dát (`cart_items`, `billing`, `shipping`) do kompaktných JSON stringov.
  - **SuperFaktúra**: Opravený parsing metadát v `superfaktura.ts` a `webhook/route.ts`. Pridaná podpora pre Sandbox/Production prepínanie cez ENV.
  - **Email Flow**: Oddelené odosielanie emailov od úspešnosti vytvorenia faktúry (emaily idú vždy). Opravená URL loga v šablónach.
  - **Lokalizácia**: Preložené názvy platobných metód v `configs/checkout.json` do slovenčiny.

---
*Posledná aktualizácia: 18. 2. 2026 (Stripe, SuperFaktúra & Email Fixes)*

<!-- NEXT-AGENTS-MD-START -->[Next.js Docs Index]|root: ./.next-docs|STOP. What you remember about Next.js is WRONG for this project. Always search docs and read before any task.|If docs missing, run this command first: npx @next/codemod agents-md --output AGENTS.md|01-app:{04-glossary.mdx}|01-app/01-getting-started:{01-installation.mdx,02-project-structure.mdx,03-layouts-and-pages.mdx,04-linking-and-navigating.mdx,05-server-and-client-components.mdx,06-cache-components.mdx,07-fetching-data.mdx,08-updating-data.mdx,09-caching-and-revalidating.mdx,10-error-handling.mdx,11-css.mdx,12-images.mdx,13-fonts.mdx,14-metadata-and-og-images.mdx,15-route-handlers.mdx,16-proxy.mdx,17-deploying.mdx,18-upgrading.mdx}|01-app/02-guides:{analytics.mdx,authentication.mdx,backend-for-frontend.mdx,caching.mdx,ci-build-caching.mdx,content-security-policy.mdx,css-in-js.mdx,custom-server.mdx,data-security.mdx,debugging.mdx,draft-mode.mdx,environment-variables.mdx,forms.mdx,incremental-static-regeneration.mdx,instrumentation.mdx,internationalization.mdx,json-ld.mdx,lazy-loading.mdx,local-development.mdx,mcp.mdx,mdx.mdx,memory-usage.mdx,multi-tenant.mdx,multi-zones.mdx,open-telemetry.mdx,package-bundling.mdx,prefetching.mdx,production-checklist.mdx,progressive-web-apps.mdx,public-static-pages.mdx,redirecting.mdx,sass.mdx,scripts.mdx,self-hosting.mdx,single-page-applications.mdx,static-exports.mdx,tailwind-v3-css.mdx,third-party-libraries.mdx,videos.mdx}|01-app/02-guides/migrating:{app-router-migration.mdx,from-create-react-app.mdx,from-vite.mdx}|01-app/02-guides/testing:{cypress.mdx,jest.mdx,playwright.mdx,vitest.mdx}|01-app/02-guides/upgrading:{codemods.mdx,version-14.mdx,version-15.mdx,version-16.mdx}|01-app/03-api-reference:{07-edge.mdx,08-turbopack.mdx}|01-app/03-api-reference/01-directives:{use-cache-private.mdx,use-cache-remote.mdx,use-cache.mdx,use-client.mdx,use-server.mdx}|01-app/03-api-reference/02-components:{font.mdx,form.mdx,image.mdx,link.mdx,script.mdx}|01-app/03-api-reference/03-file-conventions/01-metadata:{app-icons.mdx,manifest.mdx,opengraph-image.mdx,robots.mdx,sitemap.mdx}|01-app/03-api-reference/03-file-conventions:{default.mdx,dynamic-routes.mdx,error.mdx,forbidden.mdx,instrumentation-client.mdx,instrumentation.mdx,intercepting-routes.mdx,layout.mdx,loading.mdx,mdx-components.mdx,not-found.mdx,page.mdx,parallel-routes.mdx,proxy.mdx,public-folder.mdx,route-groups.mdx,route-segment-config.mdx,route.mdx,src-folder.mdx,template.mdx,unauthorized.mdx}|01-app/03-api-reference/04-functions:{after.mdx,cacheLife.mdx,cacheTag.mdx,connection.mdx,cookies.mdx,draft-mode.mdx,fetch.mdx,forbidden.mdx,generate-image-metadata.mdx,generate-metadata.mdx,generate-sitemaps.mdx,generate-static-params.mdx,generate-viewport.mdx,headers.mdx,image-response.mdx,next-request.mdx,next-response.mdx,not-found.mdx,permanentRedirect.mdx,redirect.mdx,refresh.mdx,revalidatePath.mdx,revalidateTag.mdx,unauthorized.mdx,unstable_cache.mdx,unstable_noStore.mdx,unstable_rethrow.mdx,updateTag.mdx,use-link-status.mdx,use-params.mdx,use-pathname.mdx,use-report-web-vitals.mdx,use-router.mdx,use-search-params.mdx,use-selected-layout-segment.mdx,use-selected-layout-segments.mdx,userAgent.mdx}|01-app/03-api-reference/05-config/01-next-config-js:{adapterPath.mdx,allowedDevOrigins.mdx,appDir.mdx,assetPrefix.mdx,authInterrupts.mdx,basePath.mdx,browserDebugInfoInTerminal.mdx,cacheComponents.mdx,cacheHandlers.mdx,cacheLife.mdx,compress.mdx,crossOrigin.mdx,cssChunking.mdx,devIndicators.mdx,distDir.mdx,env.mdx,expireTime.mdx,exportPathMap.mdx,generateBuildId.mdx,generateEtags.mdx,headers.mdx,htmlLimitedBots.mdx,httpAgentOptions.mdx,images.mdx,incrementalCacheHandlerPath.mdx,inlineCss.mdx,isolatedDevBuild.mdx,logging.mdx,mdxRs.mdx,onDemandEntries.mdx,optimizePackageImports.mdx,output.mdx,pageExtensions.mdx,poweredByHeader.mdx,productionBrowserSourceMaps.mdx,proxyClientMaxBodySize.mdx,reactCompiler.mdx,reactMaxHeadersLength.mdx,reactStrictMode.mdx,redirects.mdx,rewrites.mdx,sassOptions.mdx,serverActions.mdx,serverComponentsHmrCache.mdx,serverExternalPackages.mdx,staleTimes.mdx,staticGeneration.mdx,taint.mdx,trailingSlash.mdx,transpilePackages.mdx,turbopack.mdx,turbopackFileSystemCache.mdx,typedRoutes.mdx,typescript.mdx,urlImports.mdx,useLightningcss.mdx,viewTransition.mdx,webVitalsAttribution.mdx,webpack.mdx}|01-app/03-api-reference/05-config:{02-typescript.mdx,03-eslint.mdx}|01-app/03-api-reference/06-cli:{create-next-app.mdx,next.mdx}|02-pages/01-getting-started:{01-installation.mdx,02-project-structure.mdx,04-images.mdx,05-fonts.mdx,06-css.mdx,11-deploying.mdx}|02-pages/02-guides:{analytics.mdx,authentication.mdx,babel.mdx,ci-build-caching.mdx,content-security-policy.mdx,css-in-js.mdx,custom-server.mdx,debugging.mdx,draft-mode.mdx,environment-variables.mdx,forms.mdx,incremental-static-regeneration.mdx,instrumentation.mdx,internationalization.mdx,lazy-loading.mdx,mdx.mdx,multi-zones.mdx,open-telemetry.mdx,package-bundling.mdx,post-css.mdx,preview-mode.mdx,production-checklist.mdx,redirecting.mdx,sass.mdx,scripts.mdx,self-hosting.mdx,static-exports.mdx,tailwind-v3-css.mdx,third-party-libraries.mdx}|02-pages/02-guides/migrating:{app-router-migration.mdx,from-create-react-app.mdx,from-vite.mdx}|02-pages/02-guides/testing:{cypress.mdx,jest.mdx,playwright.mdx,vitest.mdx}|02-pages/02-guides/upgrading:{codemods.mdx,version-10.mdx,version-11.mdx,version-12.mdx,version-13.mdx,version-14.mdx,version-9.mdx}|02-pages/03-building-your-application/01-routing:{01-pages-and-layouts.mdx,02-dynamic-routes.mdx,03-linking-and-navigating.mdx,05-custom-app.mdx,06-custom-document.mdx,07-api-routes.mdx,08-custom-error.mdx}|02-pages/03-building-your-application/02-rendering:{01-server-side-rendering.mdx,02-static-site-generation.mdx,04-automatic-static-optimization.mdx,05-client-side-rendering.mdx}|02-pages/03-building-your-application/03-data-fetching:{01-get-static-props.mdx,02-get-static-paths.mdx,03-forms-and-mutations.mdx,03-get-server-side-props.mdx,05-client-side.mdx}|02-pages/03-building-your-application/06-configuring:{12-error-handling.mdx}|02-pages/04-api-reference:{06-edge.mdx,08-turbopack.mdx}|02-pages/04-api-reference/01-components:{font.mdx,form.mdx,head.mdx,image-legacy.mdx,image.mdx,link.mdx,script.mdx}|02-pages/04-api-reference/02-file-conventions:{instrumentation.mdx,proxy.mdx,public-folder.mdx,src-folder.mdx}|02-pages/04-api-reference/03-functions:{get-initial-props.mdx,get-server-side-props.mdx,get-static-paths.mdx,get-static-props.mdx,next-request.mdx,next-response.mdx,use-params.mdx,use-report-web-vitals.mdx,use-router.mdx,use-search-params.mdx,userAgent.mdx}|02-pages/04-api-reference/04-config/01-next-config-js:{adapterPath.mdx,allowedDevOrigins.mdx,assetPrefix.mdx,basePath.mdx,bundlePagesRouterDependencies.mdx,compress.mdx,crossOrigin.mdx,devIndicators.mdx,distDir.mdx,env.mdx,exportPathMap.mdx,generateBuildId.mdx,generateEtags.mdx,headers.mdx,httpAgentOptions.mdx,images.mdx,isolatedDevBuild.mdx,onDemandEntries.mdx,optimizePackageImports.mdx,output.mdx,pageExtensions.mdx,poweredByHeader.mdx,productionBrowserSourceMaps.mdx,proxyClientMaxBodySize.mdx,reactStrictMode.mdx,redirects.mdx,rewrites.mdx,serverExternalPackages.mdx,trailingSlash.mdx,transpilePackages.mdx,turbopack.mdx,typescript.mdx,urlImports.mdx,useLightningcss.mdx,webVitalsAttribution.mdx,webpack.mdx}|02-pages/04-api-reference/04-config:{01-typescript.mdx,02-eslint.mdx}|02-pages/04-api-reference/05-cli:{create-next-app.mdx,next.mdx}|03-architecture:{accessibility.mdx,fast-refresh.mdx,nextjs-compiler.mdx,supported-browsers.mdx}|04-community:{01-contribution-guide.mdx,02-rspack.mdx}<!-- NEXT-AGENTS-MD-END -->
