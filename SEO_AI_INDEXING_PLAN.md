# SEO & AI Indexing Plan: Vino Pútec

Tento dokument obsahuje detailný postup, ako dostať `vinoputec.sk` do vyhľadávačov (Google, Bing) a ako zabezpečiť, aby o vás vedeli AI asistenti (ChatGPT, Claude, Gemini).

---

## 1. Google Search Console (GSC)
Toto je **najdôležitejší** krok pre SEO.

### Postup registrácie:
1.  Choďte na: [search.google.com/search-console](https://search.google.com/search-console)
2.  Prihláste sa Google účtom (odporúčam firemný `info@vinoputec.sk` alebo ten, čo používate pre Analytics).
3.  Vľavo hore kliknite na **Add property** (Pridať vlastníctvo).
4.  Vyberte typ **Domain** (Doména) - tá možnosť vľavo.
5.  Zadajte: `vinoputec.sk` (bez https, čistú doménu).
6.  Google vám dá **TXT záznam** (napr. `google-site-verification=...`).
7.  **WebSupport:** Choďte do DNS nastavení a pridajte nový TXT záznam:
    *   **Host:** `@` (alebo prázdne)
    *   **Hodnota:** Ten kód od Google.
8.  Počkajte pár minút a v GSC kliknite **Verify**.

### Odoslanie Sitemapy:
Keď je doména overená:
1.  V GSC menu kliknite na **Sitemaps**.
2.  Do poľa "Add a new sitemap" napíšte: `sitemap.xml`
3.  Kliknite **Submit**.
    *   *Mali by ste vidieť "Success" a počet objavených URL (cca 10+).*

---

## 2. Bing Webmaster Tools & Yahoo
Bing poháňa aj Yahoo a DuckDuckGo. Navyše, Bing je základom pre **ChatGPT Search**.

### Postup:
1.  Choďte na: [bing.com/webmasters](https://www.bing.com/webmasters)
2.  Prihláste sa (Microsoft/Google účet).
3.  Môžete zvoliť **Import from Google Search Console** (najrýchlejšie - prenesie overenie aj sitemapy).
4.  Ak import zlyhá, overte manuálne rovnako ako pri Google (cez DNS TXT záznam).

---

## 3. Optimalizácia pre AI Agentov (GEO)
Váš web je už pripravený pre AI revolúciu. Máte špeciálnu stránku, ktorú bežní ľudia nevidia, ale roboty áno.

### Čo sme už urobili (Hotové ✅):
*   **`/ai-context`**: Existuje špeciálna stránka `https://vinoputec.sk/ai-context`, ktorá obsahuje čisté fakty o vašich vínach, lokalite a službách. AI modely si ju načítajú a budú vedieť odpovedať na otázky typu *"Kde sídli Vino Pútec?"* alebo *"Aké vína majú?"*.
*   **Structured Data (Schema.org)**: V kóde sú zabudované "vizitky" pre roboty:
    *   **Winery Schema**: Adresa, otváracie hodiny, GPS.
    *   **FAQ Schema**: Odpovede na časté otázky.
*   **Robots.txt**: Povolili sme prístup pre `GPTBot` (OpenAI), `ClaudeBot`, `Google-Extended` (Gemini).

### Čo môžete urobiť vy:
Keď budete mať overený Google Search Console, AI boti si vašu stránku nájdu cez sitemapu automaticky.

---

## 4. Lokálne SEO (Google Maps)
Aby Vás ľudia našli, keď napíšu "vinárstvo Pezinok".

1.  Skontrolujte svoj **Google Business Profile** (Firemný profil na Google).
    *   Uistite sa, že odkaz na web je presne: `https://vinoputec.sk`
    *   Otváracie hodiny sedia s tým, čo je na webe.
2.  Ak profil nemáte, založte si ho na [business.google.com](https://business.google.com).

---

## 5. Sociálne Siete (OpenGraph)
Keď zdieľate odkaz na Facebooku/Whatsappe, mal by sa ukázať pekný obrázok.

*   V kóde je nastavený `og:image` a `twitter:image`.
*   Otestovať to môžete tu: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) - vložte tam `https://vinoputec.sk`.

---

## Súhrnný Checklist
- [ ] Overiť doménu v **Google Search Console** (DNS TXT).
- [ ] Odoslať `sitemap.xml` v GSC.
- [ ] Importovať do **Bing Webmaster Tools**.
- [ ] Skontrolovať **Google Business Profile** (či odkazuje na nový web).
- [ ] (Voliteľné) Otestovať zdieľanie odkazu na Facebooku.
