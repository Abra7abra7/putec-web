# Sprievodca nasadením na Coolify (Hetzner) a Migráciou DNS

Tento dokument vás prevedie procesom nasadenia aplikácie `vinoputec.sk` na server Hetzner pomocou Coolify a následnou zmenou DNS záznamov na Websupporte.

## 🚀 1. Príprava Coolify Projektu

1.  Prihláste sa do vašeho inštancie **Coolify**.
2.  Prejdite do **Projects** -> **New Project** (alebo použite existujúci).
3.  Vyberte prostredie (napr. **Production**).
4.  Kliknite na **+ New Resource** -> **Git Repository** (Private alebo Public, podľa toho kde je repo).
5.  Vyberte repozitár: `clients-web/putec-web` (alebo váš názov).
6.  **Build Pack**: Coolify by mal automaticky detegovať **Docker**, pretože sme pridali `Dockerfile`. Ak nie, manuálne vyberte **Docker**.
7.  **Port**: Nastavte na `3000`.

### 🔑 2. Environment Variables (Premenné prostredia)
V Coolify v sekcii **Secrets** alebo **Environment Variables** pridajte nasledujúce kľúče.
> **Dôležité:** Hodnoty pre `STRIPE`, `RESEND` a `SUPERFAKTURA` nájdete vo vašom lokálnom `.env` súbore alebo v zálohe.

```env
# URL Aplikácie
NEXT_PUBLIC_APP_URL=https://vinoputec.sk

# Stripe (Live Kľúče!)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (Emaily)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=info@vinoputec.sk (alebo iný overený email)
ADMIN_EMAIL=branislav.putec@vinoputec.sk

# SuperFaktúra (Produkcia)
SUPERFAKTURA_EMAIL=...
SUPERFAKTURA_API_KEY=...
SUPERFAKTURA_COMPANY_ID=...
SUPERFAKTURA_SEND_EMAILS=1
SUPERFAKTURA_SANDBOX=0

# Next.js
NODE_ENV=production
```

### 🛠️ 3. Prvé Nasadenie (Deploy)
1.  Kliknite na **Deploy**.
2.  Sledujte **Logs**. Coolify stiahne repozitár, spustí `docker build` a naštartuje kontajner.
3.  Po úspešnom nasadení vám Coolify ukáže, že aplikácia beží (Status: Running).
4.  V nastaveniach resource (Configuration -> General) zadajte doménu: `https://vinoputec.sk`. Coolify automaticky vygeneruje **SSL certifikát** (Let's Encrypt), ale až keď bude DNS smerovať na server.

---

## 🌍 4. Zmena DNS na Websupporte

Teraz musíme presmerovať doménu `vinoputec.sk` na IP adresu vášho Hetzner servera.

**IP Adresa Hetzner Servera:** (Doplňte vašu IP, napr. `123.456.78.90`)

Prihláste sa do [Websupport Administrácie](https://admin.websupport.sk/) -> Doména -> DNS.

### Zmazať staré záznamy (Webhosting)
Zmažte záznamy typu **A** a **AAAA**, ktoré smerujú na Websupport (napr. IP `37.9.175.187` a IPv6 `2a00:4b40:...`).
- `vinoputec.sk` (A)
- `www.vinoputec.sk` (A)
- `*.vinoputec.sk` (A)

### Pridať nové záznamy (Coolify/Hetzner)
Pridajte nové **A** záznamy smerujúce na vašu **Hetzner IP**.

| Typ | Názov (Host) | Hodnota (IP Servera) | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` (alebo prázdne) | `VAŠA_HETZNER_IP` | 600 |
| **A** | `www` | `VAŠA_HETZNER_IP` | 600 |
| **A** | `*` (wildcard - voliteľné) | `VAŠA_HETZNER_IP` | 600 |

> **Poznámka:** AAAA (IPv6) záznamy zatiaľ nepridávajte, pokiaľ nemáte IPv6 explicitne nastavené v Coolify.

### ⚠️ Čo s emailami? (NEMENIŤ!)
Aby vám fungovali emaily na Websupporte, **NEDOTÝKAJTE SA** záznamov MX, ani záznamov `mail`, `webmail`, `smtp`, `imap`, `pop3`. Tie musia stále smerovať na Websupport IP (45.13.137.x).

---

## 🕵️ 5. Overenie a Dokončenie

1.  Počkajte na propagáciu DNS (môže to trvať pár minút až hodinu).
2.  Skúste otvoriť `https://vinoputec.sk`.
    - Ak vidíte novú stránku -> **Super!**
    - Ak vidíte chybu SSL -> Počkajte, Coolify sa snaží získať certifikát. Skontrolujte v Coolify logy proxy (Traefik).
3.  Otestujte funkčnosť webu (objednávka, formuláre).

**Hotovo!** 🎉 Váš web teraz beží na vlastnom výkonnom serveri.
