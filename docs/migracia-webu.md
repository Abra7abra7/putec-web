# **Komplexná stratégia migrácie z PHP na Next.js 16: Manuál pre SEO kontinuitu, lokalizáciu a infraštruktúrnu optimalizáciu na Slovensku**

Prechod z tradičných architektúr postavených na PHP na moderné frameworky typu Next.js 16 predstavuje pre moderné webové inžinierstvo zásadný paradigmatický posun. Táto zmena sa netýka len samotnej syntaxe alebo programovacieho jazyka, ale zasahuje do hĺbky infraštruktúry, spôsobu doručovania obsahu a mechanizmov, ktorými vyhľadávače indexujú a hodnotia digitálne aktíva. Next.js 16 prichádza s radikálnymi inováciami v oblasti bundlingových procesov, explicitného cachingu a sieťových hraníc, ktoré pri správnej implementácii umožňujú dosiahnuť bezprecedentnú rýchlosť a stabilitu.1 Pre projekt zameraný na slovenský trh, a špecificky na oblasť západného Slovenska, je táto modernizácia príležitosťou na získanie konkurenčnej výhody v lokálnych výsledkoch vyhľadávania (Local SEO), pokiaľ sa dodržia prísne protokoly pre zachovanie existujúcej autority pôvodného webu.4

## **Architektonická evolúcia Next.js 16 a nástup Turbopacku**

Stabilizácia Turbopacku ako predvoleného bundlera v Next.js 16 je kľúčovým faktorom, ktorý definuje novú éru vývoja. Na rozdiel od starších verzií využívajúcich Webpack, Turbopack, napísaný v jazyku Rust, využíva prírastkové výpočty (incremental computation) na drastické zníženie času potrebného na kompiláciu a Fast Refresh.1 Pre vývojárov prechádzajúcich z PHP prostredia, kde je cyklus úpravy kódu a jeho zobrazenia v prehliadači takmer okamžitý vďaka interpretovanej povahe jazyka, predstavuje Turbopack návrat k tejto vysokej produktivite v rámci komplexného JavaScriptového ekosystému.2

Dátová analýza výkonnostných rozdielov medzi Webpackom v Next.js 15 a Turbopackom v Next.js 16 ukazuje, že produkčné buildy sú až päťkrát rýchlejšie, pričom vývojové prostredie vykazuje až desaťnásobné zrýchlenie pri obnovovaní stránok.1 Táto efektivita nie je len otázkou pohodlia vývojára, ale priamo ovplyvňuje rýchlosť iterácií a schopnosť rýchlo nasadzovať kritické záplaty v produkcii.2

### **Porovnanie výkonnostných metrík bundlerov**

| Metrika výkonu | Next.js 15 (Webpack) | Next.js 16 (Turbopack) | Faktor zlepšenia |
| :---- | :---- | :---- | :---- |
| Studený štart (Cold Startup) | 35,6 s | 6,0 s | \~6,0x |
| Teplý štart (Warm Startup) | 8,6 s | 3,8 s | \~2,2x |
| Rýchlosť kompilácie (Dev) | 121,7 s | 21,5 s | \~5,6x |
| Latencia Fast Refresh | 10,6 s | 4,6 s | \~2,3x |
| Plný produkčný build | 251,6 s | 36,2 s | \~7,0x |

Zdroj: 2

Okrem rýchlosti prináša Next.js 16 aj čistejšiu správu závislostí. Build logy verzie 16 vykazujú absenciu varovaní o zastaraných moduloch typu inflight alebo rimraf, ktoré sa bežne vyskytovali vo verzii 15, čo naznačuje vyššiu stabilitu a modernizáciu celého ekosystému.1 Pre projekt migrovaný z PHP je toto čisté prostredie nevyhnutné pre dlhodobú udržateľnosť kódu.

## **Prechod z PHP na Next.js 16: Správa sieťových hraníc cez Proxy**

Jednou z najvýznamnejších zmien v Next.js 16 je transformácia súboru middleware.ts na proxy.ts.7 Tento krok je motivovaný snahou o jasnejšie definovanie sieťových hraníc aplikácie. Zatiaľ čo termín "middleware" bol často zamieňaný s middlewarom v Express.js, názov "Proxy" jasne indikuje, že tento kód beží pred samotnou aplikáciou a slúži na interceptovanie požiadaviek, ich presmerovanie alebo úpravu hlavičiek.8

Pre migráciu z PHP, kde sa presmerovania často riešili cez .htaccess alebo priamo v PHP skriptoch, je proxy.ts kritickým nástrojom pre zachovanie SEO. Beží na runtime Node.js a umožňuje programovo riadiť tok požiadaviek skôr, než dôjde k vykresleniu stránky.7

### **Mechanizmus fungovania Proxy**

Implementácia proxy.ts umožňuje vývojárovi zachytiť staré PHP URL adresy (napr. sluzby.php?id=10) a presmerovať ich na nové sémantické cesty (/sk/sluzby/montaz-okien).11 Tento proces je pre Google signálom, že obsah sa natrvalo presunul, čím sa prenáša takzvaný "link juice" alebo autorita stránky z pôvodného webu na nový.13

Analýza architektúry Next.js 16 naznačuje, že proxy.ts by sa mal používať primárne na:

* Dynamické presmerovania založené na prichádzajúcich parametroch požiadavky.10  
* Modifikáciu bezpečnostných hlavičiek pre všetky alebo vybrané cesty.10  
* Programové riadenie prístupu (napr. kontrola autentifikácie na sieťovej úrovni).15

Dôležitým aspektom je, že proxy.ts je vykonávaný na hrane (Edge) alebo blízko používateľa, čo minimalizuje latenciu pri spracovaní presmerovaní.8

## **Zachovanie SEO pozícií a kontinuita indexácie**

Najväčším rizikom pri migrácii webu je strata pozícií vo výsledkoch vyhľadávania. PHP weby často využívajú nekonzistentné URL štruktúry s príponami súborov alebo komplexnými dopytovými parametrami. Next.js 16 presadzuje čisté, kľúčovými slovami bohaté URL adresy, ktoré sú lepšie čitateľné pre používateľov aj roboty vyhľadávačov.13

### **Implementácia trvalých presmerovaní (301 a 308\)**

Pre zachovanie autority je nevyhnutné použiť trvalé presmerovania. Next.js natívne podporuje status kód 308 (Permanent Redirect), ktorý je modernejšou verziou 301\. Rozdiel spočíva v tom, že 308 neumožňuje zmenu HTTP metódy z POST na GET, čo zvyšuje bezpečnosť a predvídateľnosť toku dát.15

| Typ presmerovania | Status kód | Odporúčané použitie | SEO vplyv |
| :---- | :---- | :---- | :---- |
| Trvalé (Permanent) | 301 / 308 | Zmena starej cesty .php na novú. | Prenáša 95-99% autority. |
| Dočasné (Temporary) | 302 / 307 | Krátkodobé zmeny (akcie, údržba). | Neprenáša autoritu, stará URL ostáva indexovaná. |

Zdroj: 13

Pri veľkom množstve adries (nad 1000\) sa odporúča namiesto statickej konfigurácie v next.config.ts použiť databázou riadené riešenie v rámci proxy.ts. Takéto riešenie môže využívať rýchle kľúč-hodnota úložiská ako Vercel Edge Config alebo Redis na okamžité vyhľadanie cieľovej adresy bez spomalenia požiadavky.15

### **Audit a mapovanie URL adries**

Pred samotným spustením nového webu je kritické vykonať audit pôvodného webu. Tento proces zahŕňa:

1. **Získanie zoznamu všetkých indexovaných adries:** Použitie nástrojov ako Google Search Console, Screaming Frog alebo analýza logov servera.13  
2. **Identifikácia vysoko hodnotných stránok:** Stránky s najväčšou návštevnosťou a najkvalitnejšími spätnými odkazmi musia byť presmerované prioritne.13  
3. **Vytvorenie mapovacej tabuľky:** Každá stará URL musí mať svoj presný ekvivalent na novom webe. Hromadné presmerovania na domovskú stránku (tzv. "blanket redirects") sú Googleom penalizované a mali by ste sa im vyhnúť.13

## **Lokalizácia pre Slovensko a cielené SEO na západný región**

Lokalizácia webu pre slovenský trh v Next.js 16 presahuje jednoduchý preklad textov. Vyžaduje si komplexné nastavenie routingu, metadát a štruktúrovaných dát, ktoré jasne definujú geografickú pôsobnosť podniku.23

### **Implementácia i18n s knižnicou next-intl**

Pre Next.js App Router je najvhodnejším riešením knižnica next-intl. Umožňuje definovať preklady v JSON súboroch a spravovať jazykové mutácie cez dynamické segmenty URL adries (napr. /sk/o-nas alebo /en/about-us).24

Kľúčové kroky pre slovenské nastavenie:

1. **Konfigurácia správ:** Vytvorenie messages/sk.json so všetkými lokalizovanými reťazcami.  
2. **Middleware/Proxy nastavenie:** Detekcia jazyka prehliadača a automatické presmerovanie na /sk pri prvej návšteve.24  
3. **Hreflang tagy:** Next.js 16 automaticky generuje hreflang atribúty, ktoré informujú Google o vzťahu medzi rôznymi jazykovými verziami, čím zabraňujú problémom s duplicitným obsahom.21

### **Geografické cielenie: Západné Slovensko**

Pre maximalizáciu viditeľnosti v regióne Bratislava, Trnava alebo Nitra je nevyhnutné implementovať schému LocalBusiness. Tento typ štruktúrovaných dát umožňuje vyhľadávačom priradiť web ku konkrétnej fyzickej lokalite a zobraziť ho v "Local Pack" výsledkoch.4

V rámci JSON-LD schémy by sa mali použiť vlastnosti areaServed a geo súradnice. Pre západné Slovensko je vhodné špecifikovať administratívne oblasti podľa normy ISO 3166-2:SK.28

| Región (Západné Slovensko) | Kód ISO 3166-2 | Administratívny názov |
| :---- | :---- | :---- |
| Bratislavský kraj | SK-BL | Bratislavský kraj |
| Trnavský kraj | SK-TA | Trnavský kraj |
| Nitriansky kraj | SK-NI | Nitriansky kraj |
| Trenčiansky kraj | SK-TC | Trenčiansky kraj |

Zdroj: 28

Príklad implementácie pre lokálnu firmu:

JSON

{  
  "@context": "https://schema.org",  
  "@type": "LocalBusiness",  
  "name": "Názov Firmy Kamaráta",  
  "address": {  
    "@type": "PostalAddress",  
    "streetAddress": "Mýtna 1",  
    "addressLocality": "Bratislava",  
    "postalCode": "81107",  
    "addressCountry": "SK"  
  },  
  "areaServed":,  
  "geo": {  
    "@type": "GeoCoordinates",  
    "latitude": 48.1486,  
    "longitude": 17.1077  
  }  
}

Tento prístup zabezpečuje, že web bude prioritne zobrazovaný používateľom nachádzajúcim sa v týchto lokalitách alebo hľadajúcim služby v týchto mestách.5

## **Infraštruktúra na Vercel a optimalizácia latencie pre Bratislavu**

Nasadenie webu na platformu Vercel poskytuje prístup k globálnej sieti doručovania obsahu (CDN), ktorá je optimalizovaná pre Next.js. Pre cieľovú skupinu na západnom Slovensku je však potrebné manuálne nakonfigurovať región vykonávania bezserverových funkcií (Serverless Functions).31

### **Výber optimálneho regiónu**

Predvoleným regiónom pre Vercel projekty je často Washington, D.C. (iad1), čo by pre slovenských používateľov znamenalo latenciu presahujúcu 100-150 ms pri každej dynamickej požiadavke.16 Pre západné Slovensko je najlepšou voľbou Frankfurt, Nemecko (fra1), ktorý je najbližším výpočtovým uzlom k Bratislave.16

Výhody Frankfurtu (fra1):

* **Minimálna latencia:** Sieťová trasa z Bratislavy do Frankfurtu vedie cez hlavné európske internetové uzly (IXP), čo zabezpečuje odozvu pod 15-20 ms.16  
* **Blízkosť k dátam:** Ak sa používa databáza hostovaná v Európe (napr. AWS eu-central-1), umiestnenie funkcií do rovnakého regiónu drasticky znižuje čas potrebný na vykreslenie stránky.16

Pre optimálny výkon by mal byť súbor vercel.json nakonfigurovaný nasledovne:

JSON

{  
  "regions": \["fra1"\]  
}

V prípade potreby vyššej odolnosti je možné definovať aj záložné regióny ako Paríž (cdg1) alebo Štokholm (arn1).16

### **Využitie Edge Network a PoP (Points of Presence)**

Vercel prevádzkuje viac ako 126 PoP lokalít po celom svete.16 Hoci Bratislava nemusí mať vždy dedikovaný PoP priamo v meste, vďaka peeringovým dohodám so slovenskými poskytovateľmi ako Orange alebo Slovak Telekom je prevádzka smerovaná cez najbližšie uzly v Prahe, Budapešti alebo Viedni.33 To zabezpečuje, že statické súbory (obrázky, JS, CSS) sú doručené v rádoch jednotiek milisekúnd.16

## **Nová paradigma cachingu: use cache v Next.js 16**

Next.js 16 prináša revolúciu v spôsobe, akým sa ukladajú dáta do vyrovnávacej pamäte. Tradičné ISR (Incremental Static Regeneration) je nahradené explicitným modelom využívajúcim direktívu use cache.36 Táto direktíva umožňuje vývojárovi presne definovať, ktoré komponenty alebo funkcie majú byť cachované, čím sa eliminuje neistota spojená s automatickým cachovaním v predchádzajúcich verziách.3

### **Granulárne riadenie cache**

| Typ cachingu | Rozsah (Scope) | Prístup k dátam | Ideálne použitie |
| :---- | :---- | :---- | :---- |
| use cache | Zdieľaná (všetci používatelia) | Nemá prístup k cookies/headers | Zoznam produktov, blogové príspevky. |
| use cache: private | Per-klient (prehliadač) | Prístup k cookies/headers | Nákupný košík, profil používateľa. |
| use cache: remote | Vzdialená (distribuovaná) | Zdieľaná naprieč instanciami | Dáta z CMS, ktoré sa často nemenia. |

Zdroj: 38

Pre migráciu z PHP je táto funkcia kľúčová. Umožňuje napríklad cachovať výsledok náročného SQL dopytu priamo na úrovni funkcie:

TypeScript

export async function getSluzbyPreZapadneSlovensko() {  
  "use cache";  
  // Simulácia databázového dopytu  
  return await db.query("SELECT \* FROM services WHERE region \= 'western'");  
}

V kombinácii s Vercel infraštruktúrou sa tieto dáta ukladajú do distribuovanej cache, čo znamená, že po prvom načítaní bude každá ďalšia požiadavka z akéhokoľvek miesta na Slovensku vybavená okamžite.36

## **Manuál krok po kroku: Proces migrácie a spustenia**

Nasledujúca sekcia poskytuje technický plán postupu pre zabezpečenie hladkého prechodu z PHP na Next.js 16 pri zachovaní SEO a lokálnej relevancie.

### **Krok 1: Prípravná fáza a audit dát**

Pred napísaním prvého riadku kódu je nevyhnutné pochopiť štruktúru pôvodného webu. Vývojár by mal exportovať všetky existujúce URL adresy a ich výkonnostné štatistiky. Je dôležité identifikovať tzv. "kanonické" verzie stránok, aby sa predišlo duplicite po migrácii.13

Analýza by mala zahŕňať:

* Kompletný zoznam súborov .php a ich parametrov.  
* Zoznam všetkých obrázkov a ich ALT popisov (tieto by mali byť zachované pre kontinuitu v Google Images).18  
* Kontrolu metadát (Title a Description) pre každú kľúčovú stránku.39

### **Krok 2: Vývoj v prostredí Next.js 16**

Pri inicializácii projektu sa odporúča použiť najnovšie predvolené nastavenia, ktoré už obsahujú podporu pre App Router a Turbopack.3

1. **Nastavenie slovenskej lokalizácie:** Inštalácia next-intl a vytvorenie adresárovej štruktúry \[locale\]. Slovenčina by mala byť nastavená ako predvolený jazyk (defaultLocale: 'sk').24  
2. **Migrácia obsahu:** Preklopenie PHP logiky do React Server Components (RSC). RSC umožňujú vykonávať databázové dopyty priamo na serveri, čo je PHP vývojárom blízke, avšak s výhodou rýchleho streamovania UI k používateľovi.37  
3. **Implementácia Proxy:** Vytvorenie src/proxy.ts pre správu presmerovaní a sieťových pravidiel.7

### **Krok 3: SEO a presmerovacia stratégia**

Tento krok je najkritickejší pre zachovanie pozícií na Google. Každá stará adresa musí smerovať na novú.

1. **Vytvorenie redirect mapy:** Ak má pôvodný web adresu firma.sk/kontakt.php, nová adresa by mala byť firma.sk/sk/kontakt.  
2. **Logika v Proxy:**  
   TypeScript  
   export function proxy(request: NextRequest) {  
     const url \= request.nextUrl.clone();  
     if (url.pathname.endsWith('.php')) {  
       const newPath \= mapOldToNew(url.pathname); // Funkcia na mapovanie  
       return NextResponse.redirect(new URL(newPath, request.url), 308);  
     }  
   }

3. **Nastavenie metadataBase:** V koreňovom layoute je nevyhnutné nastaviť metadataBase. Bez tohto nastavenia budú Open Graph obrázky (pre zdieľanie na Facebooku) generovať relatívne URL adresy, ktoré sociálne siete nedokážu načítať.39

### **Krok 4: Lokálna optimalizácia a Core Web Vitals**

Aby bol web úspešný na západnom Slovensku, musí byť rýchly aj na mobilných zariadeniach so slabším pripojením.

1. **Optimalizácia obrázkov:** Použitie komponentu next/image, ktorý automaticky konvertuje obrázky do formátov WebP alebo AVIF a prispôsobuje ich veľkosť rozlíšeniu obrazovky.41  
2. **Prioritné načítanie:** Pre hero obrázky (napr. panoráma Bratislavy na úvodnej stránke) pridajte atribút priority. Tým sa zabezpečí, že obrázok sa začne sťahovať okamžite, čo zlepší metriku LCP.39  
3. **Fonty:** Využitie next/font na lokálne hostovanie fontov, čím sa eliminuje layout shift (CLS) spôsobený neskorým načítaním externých písiem z Google Fonts.39

### **Krok 5: Nasadenie a post-launch monitoring**

Po nasadení na Vercel (s regiónom fra1) nasleduje fáza verifikácie.

1. **Google Search Console:** Okamžité nahranie novej sitemap.xml. Použitie nástroja "Inspection Tool" na vynútenie re-indexácie kľúčových stránok.13  
2. **Monitoring status kódov:** Sledovanie logov na prítomnosť 404 chýb. Ak sa objavia adresy, ktoré neboli presmerované, je potrebné ich okamžite doplniť do proxy mapy.13  
3. **Validácia bohatých výsledkov:** Kontrola cez "Rich Results Test", či Google správne interpretuje LocalBusiness schému pre západné Slovensko.44

## **Pokročilé aspekty bezpečnosti a výkonu v roku 2026**

Migrácia na Next.js 16 so sebou prináša aj potrebu dbať na nové bezpečnostné štandardy. V októbri 2025 bola identifikovaná kritická zraniteľnosť CVE-2025-66478 v protokole React Server Components, ktorá umožňovala vzdialené spustenie kódu. Všetky projekty na verzii 15 a 16 musia byť okamžite aktualizované na najnovšie minor verzie, aby sa toto riziko eliminovalo.46

### **React Compiler a automatická memoizácia**

Next.js 16 stabilizuje podporu pre React Compiler. Tento nástroj automaticky optimalizuje komponenty tak, aby sa zbytočne nevykresľovali (re-render), čo bolo v minulosti potrebné riešiť manuálne cez useMemo alebo useCallback.7 Pre komplexné stránky s mnohými interaktívnymi prvkami (napr. kalkulačky cien pre montážne služby) to znamená plynulejšiu odozvu pre používateľa.

### **Benchmarking pre rok 2026**

Moderný web musí spĺňať prísne limity Core Web Vitals, aby bol uprednostňovaný v mobilnom vyhľadávaní.

| Metrika | Cieľová hodnota | Metóda dosiahnutia v Next.js 16 |
| :---- | :---- | :---- |
| **LCP** (Largest Contentful Paint) | pod 2,5 s | Streaming RSC \+ next/image s prioritou. |
| **INP** (Interaction to Next Paint) | pod 200 ms | React Compiler \+ Efektívne delenie kódu (Code Splitting). |
| **CLS** (Cumulative Layout Shift) | pod 0,1 | Pevné rozmery obrázkov \+ next/font. |
| **TTFB** (Time to First Byte) | pod 800 ms | Región fra1 \+ PPR (Partial Pre-rendering). |

Zdroj: 41

## **Syntéza a strategické odporúčania pre úspešnú migráciu**

Prechod z PHP na Next.js 16 nie je len technologickým upgrady, ale komplexnou investíciou do digitálnej budúcnosti projektu. Pre dosiahnutie cieľov stanovených v zadaní — teda zachovanie SEO pozícií a efektívne cielenie na západné Slovensko — je nevyhnutné pristupovať k migrácii s dôrazom na detail v každej vrstve stacku.

Kľúčové zistenia analýzy potvrdzujú, že:

* **Turbopack** dramaticky zrýchľuje vývojový cyklus, čo umožňuje rýchlejšiu reakciu na požiadavky trhu.1  
* **Proxy (proxy.ts)** poskytuje moderný a predvídateľný spôsob správy sieťových hraníc a presmerovaní, čo je kľúčové pre SEO kontinuitu.7  
* **Lokalizácia** musí byť podporená nielen prekladmi, ale aj regionálnou schémou LocalBusiness, aby vyhľadávače pochopili relevanciu webu pre Bratislavu a okolie.4  
* **Regionálna optimalizácia na Vercel (fra1)** je nevyhnutná pre dosiahnutie nízkej latencie, ktorá je priamym hodnotiacim faktorom Google.32

Dodržaním tohto manuálu, od precízneho mapovania URL adries až po nasadenie na optimalizovanú infraštruktúru, sa minimalizuje riziko straty indexácie a zároveň sa vytvára základ pre rýchly rast organickej návštevnosti v cieľovom regióne. Next.js 16 s jeho explicitným cachovaním a Rust-based nástrojmi predstavuje v súčasnosti najvyspelejšiu platformu pre budovanie vysoko výkonných a SEO-optimalizovaných webových aplikácií.3

Tento proces si vyžaduje precíznu koordináciu medzi nastavením DNS u registrátora a konfiguráciou v Next.js 16\. Tu je váš manuál krok za krokom, ako presunúť web na Vercel, zachovať e-maily na Websupporte a nestratiť SEO pozície.

### **1\. Príprava Next.js 16 a konfigurácia regiónu**

Predtým, než zmeníte čokoľvek v DNS, musíte mať web pripravený na Verceli a nastavený na správny región.

**Nastavenie regiónu Frankfurt (`fra1`):** V koreňovom adresári projektu vytvorte alebo upravte súbor `vercel.json`. Tým zabezpečíte, že serverless funkcie pobežia vo Frankfurte, čo je pre Slovensko najoptimálnejšie z pohľadu latencie.  
JSON  
{  
  "regions": \["fra1"\]  
}

*   
* **Nasadenie (Deploy):** Nahrajte kód na GitHub a prepojte ho s Vercelom. Vercel vám pridelí testovaciu doménu (napr. `web-kamarat.vercel.app`), na ktorej si overíte funkčnosť.

### **2\. SEO Stratégia: Presmerovanie PHP adries**

Keďže starý web bežal na PHP, je vysoko pravdepodobné, že indexované URL adresy končia na `.php` (napr. `index.php`, `kontakt.php`). Aby ste nestratili pozície, musíte použiť **301 (Permanent) redirects**.

**Využitie `next.config.ts`:** Pre statické adresy je to najjednoduchší spôsob. Next.js 16 ich spracuje ešte pred vykreslením stránky.  
TypeScript  
// next.config.ts  
const nextConfig \= {  
  async redirects() {  
    return;  
  },  
};

*   
* **Využitie `proxy.ts` (Next.js 16):** Ak máte stovky adries alebo potrebujete logiku (napr. zachytávanie všetkých `.php` súborov), použite nový súbor `proxy.ts` (bývalý middleware), ktorý beží na sieťovej hranici.

### **3\. DNS konfigurácia: Web na Vercel, Mail na Websupport**

Toto je najcitlivejšia časť. **Nemeňte Nameservery (NS)** na Vercel. Ak ponecháte Nameservery Websupportu, správa DNS zostane tam a e-maily budú naďalej fungovať bez prerušenia.

V administrácii Websupportu (WebAdmin \-\> DNS \-\> DNS nastavenia) upravte iba tieto záznamy:

1. **A záznam (pre hlavnú doménu `domena.sk`):** Zmeňte IP adresu na **76.76.21.21** (IP Vercelu).  
2. **CNAME záznam (pre `www.domena.sk`):** Nastavte hodnotu na **https://www.google.com/search?q=cname.vercel-dns.com**.  
3. **MX záznamy (E-maily):** **Týchto sa nedotýkajte.** Musia zostať namierené na Websupport (napr. `mx1.websupport.sk`).  
4. **TXT záznamy (SPF a DKIM):** Taktiež ich ponechajte v pôvodnom stave. Zabezpečujú, aby e-maily nepadali do spamu.

### **4\. Aktivácia domény vo Verceli**

Po nastavení DNS v Websupporte musíte doménu pridať do projektu vo Vercel Dashboarde:

* Prejdite do **Settings \-\> Domains**.  
* Pridajte `domena.sk` aj `www.domena.sk`.  
* Vercel skontroluje DNS záznamy. Keďže ste ich už v kroku 3 nastavili, verifikácia by mala prebehnúť rýchlo.

### **5\. Post-Migračný checklist (SEO Kontrola)**

Keď web nabehne na novej adrese, vykonajte tieto kroky, aby ste potvrdili zachovanie indexácie:

* **Google Search Console:** Overte si novú verziu webu a nahrajte novú `sitemap.xml`. Použite nástroj "Kontrola URL" na otestovanie, či staré PHP adresy správne presmerovávajú na nové.  
* **Screaming Frog alebo iný Crawler:** Prejdite starý zoznam URL adries a uistite sa, že žiadna nekončí chybou 404, ale všetky vracajú kód 301/308 na novú cieľovú adresu.  
* **SSL Certifikát:** Vercel automaticky vygeneruje SSL certifikát pre vašu doménu. Skontrolujte, či web beží na `https://`.

Týmto postupom úspešne odpojíte starý PHP hosting (ktorý môžete následne vo Websupporte zrušiť), zatiaľ čo e-mailová infraštruktúra zostane nedotknutá a SEO autorita sa prenesie na nový Next.js 16 projekt.

