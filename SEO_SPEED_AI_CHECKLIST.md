# Post-Deployment: SEO, Rýchlosť a AI Viditeľnosť

Tento checklist obsahuje kroky, ktoré by ste mali vykonať hneď po nasadení webu na produkciu (na doménu `vinoputec.sk`).

## 🔍 1. Rýchla Indexácia (Aby vás ľudia našli)

### Google Search Console
1.  Zaregistrujte web v [Google Search Console](https://search.google.com/search-console).
2.  Pridajte vašu sitemapu: `https://vinoputec.sk/sitemap.xml`.
3.  Použite nástroj **"URL Inspection"** a požiadajte o manuálnu indexáciu hlavnej stránky (`/`) a dôležitých sekcií (`/vina`, `/degustacie`). Toto urýchli proces z týždňov na hodiny.

### Bing & IndexNow (Bing, Seznam, DuckDuckGo)
1.  Zaregistrujte sa v [Bing Webmaster Tools](https://www.bing.com/webmasters).
2.  Importujte nastavenia z Google Search Console.
3.  Aktivujte **IndexNow**. Next.js automaticky posiela signály Bingu, keď zmeníte obsah, čo zaručuje indexáciu v reálnom čase.

---

## ⚡ 2. Web Page Speed (Rýchlosť)

### PageSpeed Insights (Google)
1.  Spustite audit na [PageSpeed Insights](https://pagespeed.web.dev/).
2.  **Cieľ:** Skóre nad 90 pre "Performance" na mobile.
3.  **Vercel Analytics:** V dashboarde Vercelu si zapnite **Speed Insights**. Bude vám v reálnom čase ukazovať "Core Web Vitals" od reálnych používateľov.

### Čo ak je web pomalý?
- **Obrázky:** Skontrolujte, či nepoužívate príliš veľké súbory (odporúča sa `.webp` alebo `.avif`).
- **Fonty:** Používame `next/font`, čo je najrýchlejší spôsob načítania fontov.
- **Middleware:** Náš `proxy.ts` je optimalizovaný na rýchlosť vďaka "Edge Runtime".

---

## 🤖 3. AI Discoverability (GEO)

Váš web je už technicky pripravený vďaka schémam (JSON-LD) a `robots.txt`. Ako si to overiť?

1.  **ChatGPT / Perplexity Test:**
    - Opýtajte sa ChatGPT (s prístupom na web): *"Aké degustácie ponúka vinárstvo Víno Pútec vo Vinosadoch?"*
    - Mal by nájsť údaje z vašej novej stránky a zobraziť ceny.
2.  **Google Rich Results Test:**
    - Vložte URL vášho produktu do [Rich Results Test](https://search.google.com/test/rich-results).
    - Musí ukázať zelenú "fajku" pri **Product** a **Local Business**.
3.  **AI Context stránka:**
    - Vaša stránka `/ai-context` slúži ako "ťahák" pre agentov. Indexácia tejto stránky je kľúčová pre presnosť odpovedí AI.

## 📈 4. Monitoring
Pravidelne (raz mesačne) kontrolujte Search Console, či nemáte **404 chyby** (nefunkčné odkazy). Staré WordPress linky by mal zachytiť náš `proxy.ts` a presmerovať ich.
