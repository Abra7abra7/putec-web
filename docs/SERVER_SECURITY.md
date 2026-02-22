# Bezpečnostný manuál pre Hetzner Cloud (Firewall)

Tento dokument slúži ako rýchly sprievodca na zabezpečenie vášho VPS (Virtual Private Server) na Hetzneri, špeciálne pri využívaní Coolify a Dockerových inštancií.

## 1. Minimalizácia otvorených portov

Predvolene môže byť server na Hetzneri prístupný zvonku na rôznych portoch. Najprv musíte zapnúť a nakonfigurovať **Hetzner Cloud Firewall**.

1. Prihláste sa do [Hetzner Cloud Console](https://console.hetzner.cloud/).
2. Otvorte detail vášho projektu a prejdite do sekcie **Firewalls**.
3. Kliknite na **Create Firewall**.
4. Pomenujte ho, napr. `Vinoputec-Production-Firewall`.

## 2. Inbound (Prichádzajúce) Pravidlá

Povoľte **iba nasledujúce porty**. Všetko ostatné bude implicitne zablokované (Drop).

| Názov pravidla (Port) | Protokol | Pôvod IPs (Source IPs)                      | Účel                                                                            |
| :-------------------- | :------- | :------------------------------------------ | :------------------------------------------------------------------------------ |
| **SSH (22)**          | TCP      | Váš domáci IP / VPN (alebo `Any IPv4/IPv6`) | Pre správu servera. _Tip: Obmedzte ho len na vašu statickú IP, ak ju máte._     |
| **HTTP (80)**         | TCP      | `Any IPv4`, `Any IPv6`                      | Nutné pre obnovu Let's Encrypt / Coolify proxy a návštevníkov bez SSL.          |
| **HTTPS (443)**       | TCP      | `Any IPv4`, `Any IPv6`                      | Bezpečný prístup na webové stránky, zabezpečený od Coolify proxy a certifikátu. |

> **UPOZORNENIE na porty 8000 a 3000:** Aplikácia Next.js beží z vnútra Dockeru na porte 3000. Coolify ju však vďaka internej proxy (Traefik) prekladá navonok cez štandardný port 443 (HTTPS). Z bezpečnostného hľadiska by ste port 3000 vo firewalle **nemali otvárať verejnosti**.

## 3. Aplikácia Firewallu na Server

1. Po vytvorení pravidiel kliknite na **Apply to Servers** (Aplikovať na servery).
2. Vyberte vašu `vinoputec` inštanciu zo zoznamu.
3. Potvrďte kliknutím na **Apply**.

## 4. Ochrana .env súborov a Secrets

Váš repozitár obsahuje `.env` sekciu (ktorá je momentálne našťastie ignorovaná v `.gitignore`). To je vynikajúce z hľadiska git repository!

Avšak pri nasadzovaní do produkcie:

1. Vaše Stripe kľúče, Resend tokeny a heslo do databázy musia byť spravované buď priamo v správe premenných (Environment variables) webovej aplikácie vo vnútri **Coolify**, alebo ako **Coolify Secrets**.
2. Tieto informácie by **nikdy nemali byť verejné na GitHub repoziotary**, ako napríklad nahratím do GitHub Actions YAML subokrem v sekrecií `secrets.*`.

## 5. Udržovanie pravidelných aktualizácií systému

Coolify sa zvyčajne stará o vašu aplikáciu a jej interný docker balík. Napriek tomu by mal byť systémový software na hostiteľskom serveri Ubuntu/Debian rovnako dôležitý:

- Prihláste sa aspoň raz mesačne cez rozhranie SSH.
- Vykonajte príkazy: `sudo apt update && sudo apt upgrade -y`.
- Predídete tak mnohým bežným chybám zraniteľnosti (CVE).
