# Dokumentácia Merania (GA4) a Verifikačný Protokol

Tento dokument slúži na verifikáciu správneho nastavenia Google Analytics 4 (GA4) a e-commerce merania pre web **vinoputec.sk**.

---

## 🏗️ 1. Technická Architektúra

Implementácia využíva natívne `next/script` v rámci Next.js App Routera. Systém je plne koordinovaný s **Cookiebot (GDPR)** riešením.

- **GDPR Compliance**: Skript pre GA4 (`gtag.js`) má nastavený `type="text/plain"` a atribút `data-cookieconsent="statistics"`.
- **Logika**: Prehliadač skript nespustí (neodosiela dáta), kým návštevník neklikne na „Povoliť výber“ alebo „Povoliť všetko“ v cookies lište.
- **Poloha**: Meracia značka je umiestnená v sekcii `<head>`, čím sa zabezpečuje meranie hneď od prvého momentu interakcie po súhlase.

---

## 🛒 2. Prehľad Meraných Udalostí (Ecommerce)

Okrem základnej návštevnosti (`page_view`) meria web nasledujúce kľúčové biznis akcie:

| Udalosť (Event) | Kedy sa spustí? | Odosielané dáta (Metadata) |
| :--- | :--- | :--- |
| `add_to_cart` | Kliknutie na tlačidlo „Pridať do košíka“ | ID vína, Názov, Cena, Mena, Množstvo |
| `begin_checkout` | Kliknutie na „Pokračovať k objednávke“ | Celková cena košíka, Zoznam produktov |
| `purchase` | Úspešné zobrazenie potvrdenia objednávky | ID objednávky, Cena, Doprava, Zoznam položiek |

---

## 🔍 3. Verifikačný Protokol (Návod na overenie)

Tento postup môžete použiť na overenie, či dáta do Google Analytics naozaj prúdia.

### Krok A: Overenie cez DebugView (Odporúčané)
1. Prihláste sa do [Google Analytics](https://analytics.google.com/).
2. Prejdite na: **Správca (Admin)** -> **Zobrazenie dát** -> **DebugView**.
3. Na webe `vinoputec.sk` v inom okne prejdite procesom pridania do košíka.
4. V GA4 sa v priebehu pár sekúnd objavia ikony udalostí. Kliknutím na ne uvidíte detaily (napr. že pribudol produkt „Muškát Žltý“).

### Krok B: Overenie cez prehliadač (Network Tab)
1. Otvorte web `vinoputec.sk`.
2. Stlačte `F12` (Developer Tools) a prejdite na tab **Network**.
3. Do filtra napíšte `collect?v=2`.
4. Ak po kliknutí na „Povoliť cookies“ vidíte odchádzajúce požiadavky (Requesty), meranie funguje správne.

---

## 📊 4. Kde klient uvidí výsledky?

Pre rýchlu kontrolu odporúčame sledovať tieto sekcie v Google Analytics:

- **Speňažovanie (Monetization)** -> **Nákupy v elektronickom obchode**: Tu uvidíte, ktoré vína generujú najväčší obrat.
- **Akvizícia** -> **Akvizícia návštevnosti**: Tu zistíte, ktoré zdroje (napr. Facebook reklama, vyhľadávanie) prinášajú reálne predaje.

---

**Vypracoval**: Antigravity AI
**Dátum**: 26. 03. 2026
**Stav**: Produkcia (GA ID: `G-KZ4M164JZ3`)
