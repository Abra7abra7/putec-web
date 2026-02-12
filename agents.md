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

<!-- NEXT-AGENTS-MD-START -->[Next.js Docs Index]|root: ./.next-docs|STOP. What you remember about Next.js is WRONG for this project. Always search docs and read before any task.|If docs missing, run this command first: npx @next/codemod agents-md --output AGENTS.md|01-app:{04-glossary.mdx}|01-app/01-getting-started:{01-installation.mdx,02-project-structure.mdx,03-layouts-and-pages.mdx,04-linking-and-navigating.mdx,05-server-and-client-components.mdx,06-cache-components.mdx,07-fetching-data.mdx,08-updating-data.mdx,09-caching-and-revalidating.mdx,10-error-handling.mdx,11-css.mdx,12-images.mdx,13-fonts.mdx,14-metadata-and-og-images.mdx,15-route-handlers.mdx,16-proxy.mdx,17-deploying.mdx,18-upgrading.mdx}|01-app/02-guides:{analytics.mdx,authentication.mdx,backend-for-frontend.mdx,caching.mdx,ci-build-caching.mdx,content-security-policy.mdx,css-in-js.mdx,custom-server.mdx,data-security.mdx,debugging.mdx,draft-mode.mdx,environment-variables.mdx,forms.mdx,incremental-static-regeneration.mdx,instrumentation.mdx,internationalization.mdx,json-ld.mdx,lazy-loading.mdx,local-development.mdx,mcp.mdx,mdx.mdx,memory-usage.mdx,multi-tenant.mdx,multi-zones.mdx,open-telemetry.mdx,package-bundling.mdx,prefetching.mdx,production-checklist.mdx,progressive-web-apps.mdx,public-static-pages.mdx,redirecting.mdx,sass.mdx,scripts.mdx,self-hosting.mdx,single-page-applications.mdx,static-exports.mdx,tailwind-v3-css.mdx,third-party-libraries.mdx,videos.mdx}|01-app/02-guides/migrating:{app-router-migration.mdx,from-create-react-app.mdx,from-vite.mdx}|01-app/02-guides/testing:{cypress.mdx,jest.mdx,playwright.mdx,vitest.mdx}|01-app/02-guides/upgrading:{codemods.mdx,version-14.mdx,version-15.mdx,version-16.mdx}|01-app/03-api-reference:{07-edge.mdx,08-turbopack.mdx}|01-app/03-api-reference/01-directives:{use-cache-private.mdx,use-cache-remote.mdx,use-cache.mdx,use-client.mdx,use-server.mdx}|01-app/03-api-reference/02-components:{font.mdx,form.mdx,image.mdx,link.mdx,script.mdx}|01-app/03-api-reference/03-file-conventions/01-metadata:{app-icons.mdx,manifest.mdx,opengraph-image.mdx,robots.mdx,sitemap.mdx}|01-app/03-api-reference/03-file-conventions:{default.mdx,dynamic-routes.mdx,error.mdx,forbidden.mdx,instrumentation-client.mdx,instrumentation.mdx,intercepting-routes.mdx,layout.mdx,loading.mdx,mdx-components.mdx,not-found.mdx,page.mdx,parallel-routes.mdx,proxy.mdx,public-folder.mdx,route-groups.mdx,route-segment-config.mdx,route.mdx,src-folder.mdx,template.mdx,unauthorized.mdx}|01-app/03-api-reference/04-functions:{after.mdx,cacheLife.mdx,cacheTag.mdx,connection.mdx,cookies.mdx,draft-mode.mdx,fetch.mdx,forbidden.mdx,generate-image-metadata.mdx,generate-metadata.mdx,generate-sitemaps.mdx,generate-static-params.mdx,generate-viewport.mdx,headers.mdx,image-response.mdx,next-request.mdx,next-response.mdx,not-found.mdx,permanentRedirect.mdx,redirect.mdx,refresh.mdx,revalidatePath.mdx,revalidateTag.mdx,unauthorized.mdx,unstable_cache.mdx,unstable_noStore.mdx,unstable_rethrow.mdx,updateTag.mdx,use-link-status.mdx,use-params.mdx,use-pathname.mdx,use-report-web-vitals.mdx,use-router.mdx,use-search-params.mdx,use-selected-layout-segment.mdx,use-selected-layout-segments.mdx,userAgent.mdx}|01-app/03-api-reference/05-config/01-next-config-js:{adapterPath.mdx,allowedDevOrigins.mdx,appDir.mdx,assetPrefix.mdx,authInterrupts.mdx,basePath.mdx,browserDebugInfoInTerminal.mdx,cacheComponents.mdx,cacheHandlers.mdx,cacheLife.mdx,compress.mdx,crossOrigin.mdx,cssChunking.mdx,devIndicators.mdx,distDir.mdx,env.mdx,expireTime.mdx,exportPathMap.mdx,generateBuildId.mdx,generateEtags.mdx,headers.mdx,htmlLimitedBots.mdx,httpAgentOptions.mdx,images.mdx,incrementalCacheHandlerPath.mdx,inlineCss.mdx,isolatedDevBuild.mdx,logging.mdx,mdxRs.mdx,onDemandEntries.mdx,optimizePackageImports.mdx,output.mdx,pageExtensions.mdx,poweredByHeader.mdx,productionBrowserSourceMaps.mdx,proxyClientMaxBodySize.mdx,reactCompiler.mdx,reactMaxHeadersLength.mdx,reactStrictMode.mdx,redirects.mdx,rewrites.mdx,sassOptions.mdx,serverActions.mdx,serverComponentsHmrCache.mdx,serverExternalPackages.mdx,staleTimes.mdx,staticGeneration.mdx,taint.mdx,trailingSlash.mdx,transpilePackages.mdx,turbopack.mdx,turbopackFileSystemCache.mdx,typedRoutes.mdx,typescript.mdx,urlImports.mdx,useLightningcss.mdx,viewTransition.mdx,webVitalsAttribution.mdx,webpack.mdx}|01-app/03-api-reference/05-config:{02-typescript.mdx,03-eslint.mdx}|01-app/03-api-reference/06-cli:{create-next-app.mdx,next.mdx}|02-pages/01-getting-started:{01-installation.mdx,02-project-structure.mdx,04-images.mdx,05-fonts.mdx,06-css.mdx,11-deploying.mdx}|02-pages/02-guides:{analytics.mdx,authentication.mdx,babel.mdx,ci-build-caching.mdx,content-security-policy.mdx,css-in-js.mdx,custom-server.mdx,debugging.mdx,draft-mode.mdx,environment-variables.mdx,forms.mdx,incremental-static-regeneration.mdx,instrumentation.mdx,internationalization.mdx,lazy-loading.mdx,mdx.mdx,multi-zones.mdx,open-telemetry.mdx,package-bundling.mdx,post-css.mdx,preview-mode.mdx,production-checklist.mdx,redirecting.mdx,sass.mdx,scripts.mdx,self-hosting.mdx,static-exports.mdx,tailwind-v3-css.mdx,third-party-libraries.mdx}|02-pages/02-guides/migrating:{app-router-migration.mdx,from-create-react-app.mdx,from-vite.mdx}|02-pages/02-guides/testing:{cypress.mdx,jest.mdx,playwright.mdx,vitest.mdx}|02-pages/02-guides/upgrading:{codemods.mdx,version-10.mdx,version-11.mdx,version-12.mdx,version-13.mdx,version-14.mdx,version-9.mdx}|02-pages/03-building-your-application/01-routing:{01-pages-and-layouts.mdx,02-dynamic-routes.mdx,03-linking-and-navigating.mdx,05-custom-app.mdx,06-custom-document.mdx,07-api-routes.mdx,08-custom-error.mdx}|02-pages/03-building-your-application/02-rendering:{01-server-side-rendering.mdx,02-static-site-generation.mdx,04-automatic-static-optimization.mdx,05-client-side-rendering.mdx}|02-pages/03-building-your-application/03-data-fetching:{01-get-static-props.mdx,02-get-static-paths.mdx,03-forms-and-mutations.mdx,03-get-server-side-props.mdx,05-client-side.mdx}|02-pages/03-building-your-application/06-configuring:{12-error-handling.mdx}|02-pages/04-api-reference:{06-edge.mdx,08-turbopack.mdx}|02-pages/04-api-reference/01-components:{font.mdx,form.mdx,head.mdx,image-legacy.mdx,image.mdx,link.mdx,script.mdx}|02-pages/04-api-reference/02-file-conventions:{instrumentation.mdx,proxy.mdx,public-folder.mdx,src-folder.mdx}|02-pages/04-api-reference/03-functions:{get-initial-props.mdx,get-server-side-props.mdx,get-static-paths.mdx,get-static-props.mdx,next-request.mdx,next-response.mdx,use-params.mdx,use-report-web-vitals.mdx,use-router.mdx,use-search-params.mdx,userAgent.mdx}|02-pages/04-api-reference/04-config/01-next-config-js:{adapterPath.mdx,allowedDevOrigins.mdx,assetPrefix.mdx,basePath.mdx,bundlePagesRouterDependencies.mdx,compress.mdx,crossOrigin.mdx,devIndicators.mdx,distDir.mdx,env.mdx,exportPathMap.mdx,generateBuildId.mdx,generateEtags.mdx,headers.mdx,httpAgentOptions.mdx,images.mdx,isolatedDevBuild.mdx,onDemandEntries.mdx,optimizePackageImports.mdx,output.mdx,pageExtensions.mdx,poweredByHeader.mdx,productionBrowserSourceMaps.mdx,proxyClientMaxBodySize.mdx,reactStrictMode.mdx,redirects.mdx,rewrites.mdx,serverExternalPackages.mdx,trailingSlash.mdx,transpilePackages.mdx,turbopack.mdx,typescript.mdx,urlImports.mdx,useLightningcss.mdx,webVitalsAttribution.mdx,webpack.mdx}|02-pages/04-api-reference/04-config:{01-typescript.mdx,02-eslint.mdx}|02-pages/04-api-reference/05-cli:{create-next-app.mdx,next.mdx}|03-architecture:{accessibility.mdx,fast-refresh.mdx,nextjs-compiler.mdx,supported-browsers.mdx}|04-community:{01-contribution-guide.mdx,02-rspack.mdx}<!-- NEXT-AGENTS-MD-END -->
