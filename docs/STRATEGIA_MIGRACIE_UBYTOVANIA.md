# Strategický návrh: Konsolidácia webu a migrácia ubytovania

Tento dokument vysvetľuje princíp, výhody a proces prechodu subdomény `ubytovanie.vinoputec.sk` pod novú technologickú platformu Next.js na serveri Hetzner.

## 1. Princíp riešenia: "Jeden systém, dve tváre"
Doteraz fungovalo vinárstvo a ubytovanie ako dva úplne oddelené svety (rôzne servery, rôzne systémy). Naše nové riešenie využíva **Multi-domain Routing**:
- **Jeden motor**: Celý web beží na jednom modernom kóde (Next.js).
- **Inteligentné smerovanie**: Systém automaticky rozpozná, či návštevník prišiel cez `vinoputec.sk` alebo `ubytovanie.vinoputec.sk`.
- **Nezávislý dizajn**: Hoci sú v jednom systéme, subdoména môže mať úplne odlišný vizuálny štýl, písma a rozloženie, aby si zachovala svoju unikátnu identitu (Boutique Stay feeling).

## 2. Hlavné výhody (Prečo do toho ísť?)

### 🚀 Extrémna rýchlosť (PageSpeed)
- **Hetzner vs. Klasický hosting**: Prechod na vlastný výkonný server Hetzner znižuje odozvu webu na minimum.
- **Optimalizácia médií**: Video na pozadí sme zmenšili z 9.5 MB na **1.99 MB** pri zachovaní kvality. Web sa vďaka tomu na mobiloch načíta bleskovo.

### 📈 SEO a autorita (Google ranking)
- **Koniec duplicity**: Implementovali sme trvalé presmerovania (308) a kanonické značky. Google už nebude zmätený z dvoch verzií webu, ale sústredí všetku „silu“ na subdoménu ubytovania.
- **Lokalizácia**: Jazyky sú teraz dokonale prepojené. Ak hosť prepne ubytovanie do angličtiny, celý zážitok (vrátane následného nákupu vína) ostáva v angličtine.

### 🤖 Príprava na AI (GEO - Generative Engine Optimization)
- Vyhľadávače budúcnosti (ChatGPT, Gemini) lepšie pochopia súvislosť medzi vaším vínom a ubytovaním, pretože dáta sú štruktúrované pod jednou architektúrou.

### 🛠️ Zjednodušenie správy
- **Jedno miesto pre zmeny**: Úprava telefónneho čísla, loga alebo obchodných podmienok sa urobí raz a prejaví sa na oboch doménach.
- **Nižšie náklady**: V dlhodobom horizonte platíte za jeden výkonný server (Coolify/Hetzner) namiesto viacerých menších hostingov.

## 3. Nevýhody a riziká

- **DNS Propagácia**: Pri samotnom prepnutí môže trvať 15 minút až hodinu, kým sa zmena prejaví u všetkých používateľov na svete.
- **Koniec WordPressu**: Staré administratívne rozhranie WordPressu pre ubytovanie nahradí moderný, rýchlejší systém, čo si vyžaduje krátky zvyk na nové prostredie.

## 4. Proces migrácie (Ako to prebehne?)

1. **Príprava (HOTOVO)**: Kód je napísaný, video optimalizované, presmerovania a SEO značky sú nastavené. Web je nasadený na testovacom serveri.
2. **Prepnutie DNS**: Vo Websupporte sa zmení smerovanie domény (A záznam) na novú IP adresu.
3. **SSL Aktivácia**: Coolify automaticky vygeneruje nové bezpečnostné certifikáty (HTTPS).
4. **Indexácia**: Googlu povieme cez Search Console, že ubytovanie má novú, lepšiu verziu.

## Záverečné stanovisko
Prechodom na toto riešenie klient získa technologickú špičku. Web prestane byť len „vizitkou“ a stane sa rýchlym, moderným predajným nástrojom, ktorý pôsobí luxusne a konzistentne v oboch jazykoch. 

**Odporúčanie: Prejsť na nový systém čo najskôr, aby sme využili sezónu s rýchlejším a lepšie indexovaným webom.**
