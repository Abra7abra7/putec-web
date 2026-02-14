# Migrácia Domény a Hostingu: Websupport -> Vercel

Tento návod popisuje kroky potrebné na presmerovanie domény `vinoputec.sk` z Websupport hostingu na Vercel (región Frankfurt), pričom sa zachová funkčnosť emailov.

## ⚠️ Dôležité Upozornenie (Na čo si dať pozor)
- **Emaily:** Ak používate emaily na Websupporte (napr. `info@vinoputec.sk`), **NESMIETE** meniť `MX` záznamy. Musíte zmeniť len `A` a `CNAME` záznamy pre web.
- **Výpadok:** Zmena DNS trvá 1-24 hodín (propagačná doba), ale pri správnom postupe je výpadok webu minimálny.
- **Hosting vs. Doména:** Na Websupporte rušíte len *Webhosting*. *Doménu* si tam musíte nechať a platiť za ňu ročný poplatok (cca 15€).

## 1. Príprava na Vercel
1.  Choďte na [Vercel Dashboard](https://vercel.com/dashboard).
2.  Importujte projekt z GitHubu (`clients-web/putec-web`).
3.  V **Project Settings** -> **General** -> **Function Region** vyberte **Frankfurt (fra1)**.
4.  Spustite **Deploy**.
5.  Po úspešnom builde choďte do **Settings** -> **Domains**.
6.  Pridajte doménu `vinoputec.sk`. Vercel vám vygeneruje hodnoty pre DNS (A Record a CNAME).

## 2. Nastavenie DNS na Websupporte
Prihláste sa do [Websupport Administrácie](https://admin.websupport.sk/), kliknite na vašu doménu a otvorte sekciu **DNS**.

### Krok A: Zmazať staré záznamy (Webhosting)
Vyhľadajte a **zmažte** tieto záznamy (podľa vašich screenshotov):
- **A**: `vinoputec.sk` (IP: 37.9.175.187)
- **A**: `*.vinoputec.sk` (IP: 37.9.175.187)
- **A**: `www.vinoputec.sk` (IP: 37.9.175.187)
- **AAAA**: Všetky záznamy smerujúce na `2a00:4b40:aaaa:2008::5` (vrátane `vinoputec.sk`, `www`, `*`).

### Krok B: Čo so subdoménou "ubytovanie"?
V screenshote vidím AAAA záznam pre `ubytovanie.vinoputec.sk`.
- **Zistenie:** Na tejto subdoméne momentálne beží stará verzia webu pre ubytovanie.
- **Prečo to presmerovať?** V novom webe sme vytvorili modernú sekciu priamo na adrese `vinoputec.sk/ubytovanie`. Táto nová stránka už obsahuje všetko: galériu, popisy izieb aj rezervačný systém Previo. 
- **Výhoda:** Mať všetko na jednej hlavnej doméne (`vinoputec.sk/ubytovanie`) je oveľa lepšie pre Google (SEO) a jednoduchšie na správu pod jedným Vercel projektom.

- **Postup presmerovania:**
  1. Zmažte staré A/AAAA záznamy pre `ubytovanie` na Websupporte.
  2. Pridajte nový **CNAME** záznam: `ubytovanie` -> `cname.vercel-dns.com.`
  3. Na Verceli (Settings -> Domains) pridajte doménu `ubytovanie.vinoputec.sk`.
  4. Vercel sa vás opýta, či to chcete presmerovať na `vinoputec.sk`. Potvrďte to ("Redirect to vinoputec.sk").
  5. V detailných nastaveniach (Edit) pre túto doménu na Verceli môžete nastaviť cieľovú cestu na `https://vinoputec.sk/ubytovanie`.

### Krok C: Pridat nové záznamy pre Vercel
Pridajte tieto záznamy:

| Typ | Názov (Host) | Hodnota (Value) | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` | 600 |
| **CNAME** | `www` | `cname.vercel-dns.com.` | 600 |

## 3. Overenie Emailov (Čo sa NESMIE zmazať!)
Podľa screenshotov musíte **PONECHAŤ** tieto záznamy pre funkčnosť emailov:
- **MX**: Všetky záznamy (`mx1.websupport.sk`, atď.)
- **A**: `mail`, `webmail`, `smail`, `smtp`, `pop3`, `imap`, `admin` (smerujúce na 45.13.137.x).
- **AAAA**: `mail`, `webmail`, ... (smerujúce na 2a00:4b40:aaaa:2101:...).
- **CNAME**: `autodiscover`, `autoconfig`.
- **TXT**: Všetky existujúce TXT záznamy (SPF, Google verification, DKIM, DMARC).

## 4. Zrušenie starého Hostingu
Až keď Vercel ukazuje pri doméne zelenú "fajku" (Valid Configuration) a web `vinoputec.sk` načíta novú stránku:
1.  Na Websupporte môžete požiadať o zrušenie služby **Webhosting** (alebo "The Hosting").
2.  **POZOR:** Uistite sa, že máte zálohované všetky staré súbory a databázy, ak ich ešte potrebujete.
3.  **NEKRUŠTE DOMÉNU!** Doménu musíte naďalej predlžovať na Websupporte.

## 💶 Náklady
- **Vercel Hobby:** Zadarmo (pre osobné/non-commercial projekty).
- **Vercel Pro:** $20/mesiac (ak presiahnete limity alebo potrebujete tím).
- **Websupport Doména:** cca 15€ / rok.
- **Websupport Hosting:** 0€ (po zrušení).
