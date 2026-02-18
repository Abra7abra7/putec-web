# **Architektúra a technická implementácia Silktide Consent Manager v prostredí Next.js 16.1.6**

Digitálny ekosystém v roku 2026 prešiel zásadnou transformáciou v oblasti správy súkromia používateľov, čo bolo vyvolané nielen sprísnením regulácií, ako sú Všeobecné nariadenie o ochrane údajov (GDPR) a Zákon o digitálnych trhoch (DMA), ale aj technickými požiadavkami globálnych platforiem.1 Implementácia správcu súhlasov (Consent Manager) už nie je vnímaná len ako právna povinnosť, ale ako kritický prvok technickej infraštruktúry webu, ktorý priamo ovplyvňuje presnosť analytických dát a efektivitu marketingových kampaní.2 V tomto kontexte sa Silktide Consent Manager javí ako mimoriadne efektívne, transparentné a ekonomicky najvýhodnejšie riešenie pre európske spoločnosti, najmä vďaka svojej open-source povahe a natívnej podpore pre Google Consent Mode v2 (GCM v2).2 Nasledujúca analýza podrobne rozoberá integráciu tohto nástroja do frameworku Next.js 16.1.6, pričom zohľadňuje špecifiká vykresľovania na strane servera, stabilitu kompilátora Turbopack a najnovšie API pre správu vyrovnávacej pamäte v React 19.2.5

## **Právny a technologický rámec správy súhlasov**

Potreba implementácie robustných mechanizmov na získavanie súhlasu vyplýva z legislatívneho tlaku na ochranu súkromia koncových používateľov. Smernica ePrivacy a nariadenie GDPR striktne vyžadujú, aby webové stránky získali informovaný a explicitný súhlas predtým, než uložia alebo prečítajú akékoľvek nepodstatné súbory cookie.1 Tento súhlas nesmie byť predpokladaný na základe ďalšieho používania stránky, ale musí byť vyjadrený aktívnym úkonom používateľa.1 Silktide Consent Manager bol navrhnutý tak, aby tieto požiadavky spĺňal bez kompromisov v oblasti výkonu alebo prístupnosti webu.4

### **Porovnanie riešení pre správu súhlasov**

Výber Silktide pred komerčnými platformami (CMP) je podložený absenciou skrytých nákladov a obmedzení, ktoré sú bežné u iných poskytovateľov. Zatiaľ čo väčšina "bezplatných" riešení limituje počet zobrazení banneru alebo počet domén, Silktide ponúka plnú funkcionalitu bez mesačných poplatkov.2

| Parameter | Silktide Consent Manager | Bežné komerčné CMP (Free Tier) |
| :---- | :---- | :---- |
| **Licencovanie** | Open-source (MIT License) 9 | Proprietárny softvér 3 |
| **Mesačné poplatky** | 0 € (Navždy zadarmo) 2 | Od 10 € do 100+ € pri prekročení limitov 3 |
| **Google Consent Mode v2** | Plná podpora v základe 2 | Často platená funkcia alebo vyžaduje upgrade 2 |
| **Limity návštevnosti** | Bez obmedzení 2 | Často obmedzené na 5 000 \- 10 000 návštev 2 |
| **Ukladanie dát** | LocalStorage (Bez vlastných cookies) 8 | Vlastné cookies alebo databázy 7 |
| **Prístupnosť** | WCAG 2.2 a ADA súlad 4 | Závisí od konkrétneho poskytovateľa 4 |

Technologické hľadisko taktiež uprednostňuje Silktide pre jeho ľahkú architektúru, ktorá minimalizuje vplyv na metriky Core Web Vitals, čo je kľúčové pre udržanie vysokého výkonu aplikácií v Next.js.2

## **Charakteristika Next.js 16.1.6 a dopad na externé skripty**

Framework Next.js vo verzii 16.1.6, vydaný koncom roka 2025, priniesol finálnu stabilizáciu kompilátora Turbopack ako predvoleného nástroja pre zostavovanie aplikácií.5 Táto verzia sa zameriava na extrémnu rýchlosť vývojového cyklu a optimalizáciu správy externých závislostí, čo priamo ovplyvňuje spôsob, akým sa integrujú nástroje tretích strán.5

### **Architektonické zmeny v Next.js 16.1.6**

Prechod na Next.js 16 priniesol niekoľko prelomových zmien v správe siete a vyrovnávacej pamäte. Súbor middleware.ts bol nahradený konvenciou proxy.ts, ktorá jasnejšie definuje hranice spracovania požiadaviek na sieťovej úrovni.6 Tento posun je dôležitý pre bezpečnosť, pretože proxy umožňuje efektívnejšie riadenie hlavičiek Content Security Policy (CSP), ktoré sú nevyhnutné pre bezpečné spúšťanie externých JavaScriptov.6

| Vlastnosť v Next.js 16.1.6 | Technický dopad na implementáciu |
| :---- | :---- |
| **Turbopack Stable** | Až 10x rýchlejší Fast Refresh; vkladanie skriptov je okamžité.5 |
| **proxy.ts** | Náhrada za middleware; umožňuje bezpečnú manipuláciu s hlavičkami bez vracania tela odpovede.6 |
| **React 19.2** | Vylepšená hydratácia a správa asynchrónnych komponentov.6 |
| **use cache direktíva** | Explicitná kontrola nad statickými fragmentmi aplikácie; ovplyvňuje zobrazovanie banneru.6 |
| **Async Request APIs** | Rozhrania cookies(), headers() a params musia byť teraz asynchrónne (await).6 |

Stabilizácia Turbopacku znamená, že vývojári môžu využívať File System Caching, čo radikálne znižuje čas potrebný na reštart vývojového servera pri úpravách konfiguračných skriptov správcu súhlasov.5

## **Technická implementácia Silktide Consent Manager**

Integrácia Silktide do prostredia Next.js 16.1.6 vyžaduje kombináciu serverových a klientskych techník, aby sa zabezpečilo, že súhlasy sú správne inicializované ešte pred načítaním analytických značiek, a zároveň sa predišlo chybám v hydratácii (Hydration Mismatch).14

### **Konfigurácia a vloženie základných súborov**

Správca súhlasov Silktide vyžaduje dva primárne súbory: silktide-consent-manager.js a silktide-consent-manager.css.9 Najlepšou praxou v Next.js je umiestnenie týchto súborov do adresára public a ich načítanie pomocou komponentu next/script so stratégiou afterInteractive.16 Toto zabezpečí, že skript nebude blokovať vykresľovanie obsahu nad ohybom (above the fold) a nezníži hodnotu metriky Largest Contentful Paint (LCP).16

JavaScript

// app/layout.js  
import Script from 'next/script';

export default function RootLayout({ children }) {  
  return (  
    \<html lang\="sk"\>  
      \<head\>  
        \<link rel\="stylesheet" href\="/silktide-consent-manager.css" /\>  
      \</head\>  
      \<body\>  
        {children}  
        \<Script  
          src\="/silktide-consent-manager.js"  
          strategy\="afterInteractive"  
        /\>  
      \</body\>  
    \</html\>  
  );  
}

Dôležitým aspektom je, že Silktide nevyžaduje registráciu ani API kľúče, čo zjednodušuje deployment a minimalizuje riziká spojené s výpadkom služieb tretích strán.2

### **Prevencia chýb v hydratácii (Hydration Error Handling)**

V Next.js 16.1.6 je hydratácia kľúčovým procesom, pri ktorom React priraďuje interaktivitu k statickému HTML vygenerovanému na serveri.15 Keďže Silktide pri načítaní kontroluje localStorage, aby zistil, či sa má banner zobraziť, môže nastať situácia, kedy server vyrenderuje HTML bez banneru, ale klient sa ho okamžite pokúsi pridať do DOMu.8 Toto vedie k hydratačným chybám, ktoré môžu znefunkčniť interaktivitu aplikácie.15

Riešením je vytvorenie klientskeho komponentu (Client Component), ktorý odloží inicializáciu správcu súhlasov až po úspešnom namontovaní komponentu v prehliadači pomocou hookov useState a useEffect.14

JavaScript

// components/ConsentManagerInitializer.js  
'use client';

import { useEffect, useState } from 'react';

export default function ConsentManagerInitializer() {  
  const \[mounted, setMounted\] \= useState(false);

  useEffect(() \=\> {  
    setMounted(true);  
    if (typeof window\!== 'undefined' && window.silktideConsentManager) {  
      window.silktideConsentManager.init({  
        consentTypes:  
          },  
          {  
            id: 'analytics',  
            label: 'Analytické',  
            description: 'Pomáhajú nám pochopiť, ako návštevníci používajú náš web.',  
            gtag: 'analytics\_storage'  
          },  
          {  
            id: 'marketing',  
            label: 'Marketingové',  
            description: 'Používajú sa na sledovanie návštevníkov naprieč webovými stránkami.',  
            gtag: \['ad\_storage', 'ad\_user\_data', 'ad\_personalization'\]  
          }  
        \],  
        eventName: 'stcm\_consent\_update',  
        text: {  
          prompt: {  
            description: '\<p\>Tento web používa cookies na zlepšenie používateľského zážitku.\</p\>',  
            acceptAllButtonText: 'Prijať všetko',  
            rejectNonEssentialButtonText: 'Odmietnuť voliteľné'  
          }  
        }  
      });  
    }  
  },);

  if (\!mounted) return null;

  return null;  
}

Tento prístup zabezpečuje, že kód pristupujúci k rozhraniu window sa nespustí na strane servera, čím sa predíde chybám typu window is not defined a zachová sa stabilita renderovacieho stromu.14

## **Integrácia s Google Consent Mode v2**

Google Consent Mode v2 prináša nové parametre súhlasu, ako sú ad\_user\_data a ad\_personalization, ktoré sú povinné pre efektívne cielenie reklám v rámci Google Ads.3 Silktide Consent Manager umožňuje mapovanie týchto parametrov priamo v konfigurácii, čím automatizuje komunikáciu s globálnym API gtag.9

### **Nastavenie predvolených hodnôt súhlasu (Default State)**

Podľa zásad GDPR musí byť predvolený stav pre všetky nepodstatné sledovacie technológie nastavený na "denied" (zamietnuté).1 V Next.js 16.1.6 sa odporúča vložiť tento skript ako inline fragment do layout.js pred načítaním akýchkoľvek analytických skriptov.11

JavaScript

// layout.js  
\<head\>  
  \<script dangerouslySetInnerHTML\={{ \_\_html: \`  
    window.dataLayer \= window.dataLayer ||;  
    function gtag(){dataLayer.push(arguments);}  
    gtag('js', new Date());  
    gtag('consent', 'default', {  
      'ad\_storage': 'denied',  
      'ad\_user\_data': 'denied',  
      'ad\_personalization': 'denied',  
      'analytics\_storage': 'denied',  
      'functionality\_storage': 'granted',  
      'security\_storage': 'granted',  
      'wait\_for\_update': 500  
    });  
  \`}} /\>  
\</head\>

Tento úvodný stav garantuje, že akákoľvek analytika odoslaná pred interakciou používateľa s bannerom nebude obsahovať osobné identifikátory, čo chráni prevádzkovateľa pred právnymi rizikami.3

### **Dynamická aktualizácia súhlasu (Consent Update)**

Keď používateľ potvrdí svoju voľbu v banneri Silktide, manažér automaticky zavolá funkciu gtag('consent', 'update',...) s príslušnými hodnotami.9 Toto je zabezpečené prítomnosťou kľúča gtag v definícii consentTypes.9

| Silktide Consent ID | Mapovaný parameter GCM v2 | Účel parametra |
| :---- | :---- | :---- |
| **essential** | security\_storage, functionality\_storage | Zaisťuje bezpečnosť a základné funkcie webu.9 |
| **analytics** | analytics\_storage | Umožňuje zber štatistických údajov o návštevnosti.11 |
| **marketing** | ad\_storage, ad\_user\_data, ad\_personalization | Podmienka pre remarketing a modelovanie konverzií v GCM v2.3 |

Okrem systémových aktualizácií súhlasu Silktide odosiela do dataLayer vlastnú udalosť, štandardne pomenovanú stcm\_consent\_update.9 Táto udalosť slúži ako univerzálny spúšťač (Trigger) v Google Tag Manageri, ktorý signalizuje značkám (Tags), že môžu začať pracovať s plným súhlasom bez potreby obnovy stránky.9

## **Riešenie výziev Client-Side Rendering (CSR)**

V aplikáciách Next.js využívajúcich App Router často dochádza k navigácii bez úplného znovunačítania stránky.20 Súčasné analytické nástroje nemusia tieto "virtuálne" zmeny adries detegovať, čo vedie k nepresným údajom o správaní používateľov.16

### **Sledovanie ciest (Route Tracking) a Consent Guard**

Pre správne fungovanie analytiky v CSR prostredí je potrebné sledovať zmeny v URL adrese pomocou hookov usePathname a useSearchParams a následne manuálne notifikovať analytické rozhrania, pokiaľ je udelený súhlas.22

JavaScript

// components/AnalyticsTracker.js  
'use client';

import { usePathname, useSearchParams } from 'next/navigation';  
import { useEffect } from 'react';

export default function AnalyticsTracker() {  
  const pathname \= usePathname();  
  const searchParams \= useSearchParams();

  useEffect(() \=\> {  
    if (typeof window\!== 'undefined' && window.gtag) {  
      const url \= \`${pathname}${searchParams.toString()? \`?${searchParams.toString()}\` : ''}\`;  
      window.gtag('config', 'G-XXXXXXXXXX', {  
        page\_path: url,  
      });  
    }  
      
    // Špecifická notifikácia pre Silktide Analytics (ak je použitá)  
    if (typeof window\!== 'undefined' && window.silktide) {  
      window.silktide("page\_load");  
    }  
  }, \[pathname, searchParams\]);

  return null;  
}

Tento mechanizmus zabezpečuje, že aj v modernom prostredí Next.js, ktoré sa správa ako Single Page Application (SPA), sú analytické dáta konzistentné a presné.22

## **Výkon, prístupnosť a vizuálna prispôsobiteľnosť**

Silktide Consent Manager v2.0 kladie veľký dôraz na minimalizmus a výkon. Celý balík skriptov a štýlov má zanedbateľnú veľkosť, čo je v ostrom kontraste s ťažkými komerčnými riešeniami, ktoré môžu pridať stovky milisekúnd k času interaktivity webu.2

### **Prispôsobenie dizajnu cez CSS premenné**

Vizuálna stránka banneru je plne prispôsobiteľná pomocou CSS premenných. Všetky triedy používané v manažéri začínajú prefixom stcm-, čo eliminuje riziko konfliktov s existujúcimi štýlmi aplikácie Next.js.9

CSS

/\* Globálne štýly pre prispôsobenie Silktide \*/  
:root {  
  \--stcm-primary-color: \#0070f3; /\* Next.js modrá \*/  
  \--stcm-button\-border-radius: 8px;  
  \--stcm-font-family: '\_\_Inter\_Fallback\_c3d057', sans-serif;  
}

.stcm-banner {  
  box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.1);  
}

Možnosť hĺbkovej úpravy štýlov umožňuje vývojárom dokonale zladiť banner s firemnou identitou bez potreby platených licencií, ktoré sú často vyžadované u iných CMP na odstránenie loga alebo zmenu farieb.3

### **Prístupnosť (Accessibility) ako priorita**

V kontexte moderného webu a legislatívy o prístupnosti (European Accessibility Act) je nevyhnutné, aby prvky správy súhlasu nebránili v navigácii používateľom s postihnutím.4 Silktide obsahuje natívnu podporu pre navigáciu klávesnicou, správne ARIA štítky a zachytávanie fokusu (Focus Traps) v rámci modálnych okien.4

| Prvok prístupnosti | Implementácia v Silktide | Význam pre súlad s WCAG |
| :---- | :---- | :---- |
| **Klávesnicový fokus** | Logické poradie Tab indexov 9 | Umožňuje ovládanie webu používateľom bez myši.8 |
| **ARIA štítky** | aria-label pre všetky tlačidlá 9 | Čítačky obrazovky správne interpretujú účel tlačidiel.4 |
| **Farebný kontrast** | Nastavený podľa WCAG 2.2 AA 4 | Zabezpečuje čitateľnosť pre používateľov so zrakovým postihnutím.8 |
| **Modálne správanie** | Blokovanie interakcie s pozadím 9 | Používateľ nemôže náhodne opustiť proces udelenia súhlasu.4 |

## **Správa životného cyklu súhlasu a bezpečnosť**

Silktide neukladá súhlasy v cloude, ale využíva localStorage v prehliadači používateľa.8 To znamená, že prevádzkovateľ webu má plnú kontrolu nad dátami a nenesie riziko spojené s únikom databázy súhlasov u externého poskytovateľa.3

### **Metódy API pre pokročilé riadenie**

Programové rozhranie Silktide poskytuje niekoľko kľúčových metód, ktoré možno v Next.js využiť napríklad v pätičke webu pre zmenu nastavení 9:

1. **resetConsent()**: Vymaže všetky uložené voľby a znova zobrazí úvodný banner. Ideálne pre implementáciu odkazu "Zmeniť nastavenia cookies".9  
2. **update(partialConfig)**: Umožňuje dynamicky meniť texty alebo konfiguráciu bez nutnosti znovunačítania stránky.9  
3. **getInstance().getConsentChoice(id)**: Vráti aktuálny stav súhlasu pre konkrétnu kategóriu (true/false/null), čo je užitočné pre podmienečné renderovanie komponentov na klientskej strane.9

### **Bezpečnosť a Content Security Policy (CSP)**

Pri použití súboru proxy.ts v Next.js 16.1.6 je možné definovať striktné bezpečnostné hlavičky. Keďže Silktide je open-source, kód je možné auditovať a hostovať na vlastnej doméne, čím sa vyhnete potrebe povoliť v CSP hlavičke cudzie zdroje (Cross-Origin).6

TypeScript

// proxy.ts  
import { NextResponse } from 'next/server';

export function proxy(request) {  
  const response \= NextResponse.next();  
  response.headers.set(  
    'Content-Security-Policy',  
    "script-src 'self' https://www.googletagmanager.com; object-src 'none';"  
  );  
  return response;  
}

Vďaka tomu, že Silktide nepotrebuje komunikovať so žiadnym externým serverom na overenie licencie, je toto riešenie odolnejšie voči útokom typu Supply Chain Attack, ktoré môžu postihovať komerčné CMP platformy.2

## **Závery a strategické odporúčania pre implementáciu**

Integrácia Silktide Consent Manager do Next.js 16.1.6 predstavuje optimálnu rovnováhu medzi právnou bezpečnosťou, technickým výkonom a nákladovou efektivitou. Analýza potvrdzuje, že Silktide nie je len "najlacnejšou" voľbou, ale vďaka svojej technickej kvalite a absencii limitov predbieha mnohé platené alternatívy.2

Pre úspešnú implementáciu sa odporúča nasledovný postup:

* **Konzistentná konfigurácia GCM v2**: Zabezpečte, aby ID kategórií v Silktide presne korešpondovali s parametrami v GTM.11  
* **Využitie proxy.ts**: Implementujte bezpečnostné hlavičky a riadenie sieťových hraníc, ktoré Next.js 16.1.6 natívne ponúka.6  
* **Monitoring výkonu**: Pravidelne overujte vplyv banneru na metriky Core Web Vitals pomocou nového experimentálneho Bundle Analyzera v Next.js 16.1.5  
* **Pravidelné aktualizácie**: Hoci Silktide nemá nútené upgrady, odporúča sa sledovať zmeny v GCM v2, ktoré môže Google zaviesť v budúcnosti, a prispôsobovať mapovanie súhlasov.2

Riešenie Silktide v kombinácii so silou frameworku Next.js a kompilátora Turbopack poskytuje budúcim projektom stabilný základ pre správu súkromia, ktorý je pripravený na globálne legislatívne výzvy bez zbytočnej finančnej záťaže.2 Tento prístup demonštruje, že otvorený softvér a transparentné modely licencovania sú kľúčom k udržateľnému webovému vývoju v ére post-cookie apokalypsy.

#### **Citované práce**

1. The Essential GDPR Guide for Website Owners \- Silktide, otvorené februára 18, 2026, [https://silktide.com/blog/the-essential-gdpr-guide-for-website-owners/](https://silktide.com/blog/the-essential-gdpr-guide-for-website-owners/)  
2. The best free cookie banner \- 100% Open Source \- Silktide, otvorené februára 18, 2026, [https://silktide.com/consent-manager/](https://silktide.com/consent-manager/)  
3. Why You Need A Free Consent V2 Cookie Banner \- Silktide, otvorené februára 18, 2026, [https://silktide.com/consent-manager/why-consent-v2/](https://silktide.com/consent-manager/why-consent-v2/)  
4. Silktide launches a 100% free cookie banner, otvorené februára 18, 2026, [https://silktide.com/blog/silktide-launches-free-cookie-banner/](https://silktide.com/blog/silktide-launches-free-cookie-banner/)  
5. Next.js 16.1, otvorené februára 18, 2026, [https://nextjs.org/blog/next-16-1](https://nextjs.org/blog/next-16-1)  
6. Next.js 16: what's new? \- MakerKit, otvorené februára 18, 2026, [https://makerkit.dev/blog/tutorials/nextjs-16](https://makerkit.dev/blog/tutorials/nextjs-16)  
7. Cookie Consent for Next.js \- Termly, otvorené februára 18, 2026, [https://termly.io/resources/articles/cookie-consent-for-next-js/](https://termly.io/resources/articles/cookie-consent-for-next-js/)  
8. Cookie Banner Documentation \- Silktide, otvorené februára 18, 2026, [https://silktide.com/consent-manager/docs/](https://silktide.com/consent-manager/docs/)  
9. silktide/consent-manager: Free banner for collecting consent to cookies and more \- GitHub, otvorené februára 18, 2026, [https://github.com/silktide/consent-manager](https://github.com/silktide/consent-manager)  
10. license \- silktide/consent-manager \- GitHub, otvorené februára 18, 2026, [https://github.com/silktide/consent-manager/blob/main/LICENSE](https://github.com/silktide/consent-manager/blob/main/LICENSE)  
11. Free Cookie Banner with Google Consent V2 \- Silktide, otvorené februára 18, 2026, [https://silktide.com/consent-manager/docs/google-consent-mode/](https://silktide.com/consent-manager/docs/google-consent-mode/)  
12. Next.js \- endoflife.date, otvorené februára 18, 2026, [https://endoflife.date/nextjs](https://endoflife.date/nextjs)  
13. Upgrading: Version 16 \- Next.js, otvorené februára 18, 2026, [https://nextjs.org/docs/app/guides/upgrading/version-16](https://nextjs.org/docs/app/guides/upgrading/version-16)  
14. Building a Next.js cookie consent banner \- PostHog, otvorené februára 18, 2026, [https://posthog.com/tutorials/nextjs-cookie-banner](https://posthog.com/tutorials/nextjs-cookie-banner)  
15. How to Fix "Hydration Mismatch" Errors in Next.js \- OneUptime, otvorené februára 18, 2026, [https://oneuptime.com/blog/post/2026-01-24-fix-hydration-mismatch-errors-nextjs/view](https://oneuptime.com/blog/post/2026-01-24-fix-hydration-mismatch-errors-nextjs/view)  
16. Configuring Google Cookies Consent with Next.js 15\. | by skeez | Medium, otvorené februára 18, 2026, [https://medium.com/@sdanvudi/configuring-google-cookies-consent-with-next-js-15-ca159a2bea13](https://medium.com/@sdanvudi/configuring-google-cookies-consent-with-next-js-15-ca159a2bea13)  
17. The Ultimate Guide to Hydration and Hydration Errors in Next.js | by Arka Sheikh \- Medium, otvorené februára 18, 2026, [https://medium.com/@skarka90/the-ultimate-guide-to-hydration-and-hydration-errors-in-next-js-ae9b4bc74ee2](https://medium.com/@skarka90/the-ultimate-guide-to-hydration-and-hydration-errors-in-next-js-ae9b4bc74ee2)  
18. Text content does not match server-rendered HTML | Next.js, otvorené februára 18, 2026, [https://nextjs.org/docs/messages/react-hydration-error](https://nextjs.org/docs/messages/react-hydration-error)  
19. silktide/consent-manager: Free banner for collecting ... \- GitHub, otvorené februára 18, 2026, [https://github.com/silktide/consent-manager\#configuration-options-advanced](https://github.com/silktide/consent-manager#configuration-options-advanced)  
20. Routing: Linking and Navigating \- Next.js, otvorené februára 18, 2026, [https://nextjs.org/docs/pages/building-your-application/routing/linking-and-navigating](https://nextjs.org/docs/pages/building-your-application/routing/linking-and-navigating)  
21. Server side rendering with dynamic client side using nextjs App Router \- Stack Overflow, otvorené februára 18, 2026, [https://stackoverflow.com/questions/76193533/server-side-rendering-with-dynamic-client-side-using-nextjs-app-router](https://stackoverflow.com/questions/76193533/server-side-rendering-with-dynamic-client-side-using-nextjs-app-router)  
22. Using Silktide Analytics with Client-Side Rendering, otvorené februára 18, 2026, [https://help.silktide.com/en/articles/9834301-using-silktide-analytics-with-client-side-rendering](https://help.silktide.com/en/articles/9834301-using-silktide-analytics-with-client-side-rendering)  
23. Next.js Cookie Consent Banner: Build GDPR-Compliant System (No Libraries), otvorené februára 18, 2026, [https://www.buildwithmatija.com/blog/build-cookie-consent-banner-nextjs-15-server-client](https://www.buildwithmatija.com/blog/build-cookie-consent-banner-nextjs-15-server-client)