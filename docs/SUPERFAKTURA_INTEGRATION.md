# SuperFaktúra integrácia - Implementačný návod

## Prehľad
Tento dokument popisuje implementáciu SuperFaktúry do e-shopu Vino Putec pre automatické generovanie právne platných faktúr **len pri online platbe** cez Stripe. Dobierka a osobný odber faktúru automaticky netvoria (vystaví ju kurier/prevádzka).

## Implementované zmeny

### 1. Nové závislosti
- **axios**: HTTP klient pre komunikáciu s SuperFaktúra API
```bash
npm install axios
```

### 2. Nové súbory
- `app/utils/superfaktura.ts` - Hlavná logika pre vytváranie faktúr v SuperFaktúre (s podmienkou na paymentMethod)

### 3. Upravené súbory
- `app/api/stripe/webhook/route.tsx` - Odstránená Stripe invoice logika, ponechaná len SuperFaktúra
- `app/utils/superfaktura.ts` - Pridaná kontrola `paymentMethod` z metadata
- `app/api/stripe/create-payment-intent/route.tsx` - Pridané `paymentMethod` do metadata
- `app/components/checkout/StripeClientSecretLoader.tsx` - Odosielanie `paymentMethodId` do API
- `env.example` - Pridané SuperFaktúra environment premenné

## Environment premenné

Pridajte do `.env.local` a Vercel Environment Variables:

```env
# SuperFaktura (fakturácia)
SUPERFAKTURA_EMAIL=vas-email@domena.sk
SUPERFAKTURA_API_KEY=vasklucodsuperFaktury
```

## Ako to funguje

### Flow po úspešnej online platbe (Stripe):
1. Zákazník zaplatí cez Stripe (Google Pay, Apple Pay, karta)
2. **Stripe webhook** prijme `payment_intent.succeeded` event
3. **Kontrola platobnej metódy**: `metadata.paymentMethod === 'stripe'`
4. **Vytvorí sa SuperFaktúra faktúra** s položkami a dopravou
5. **SuperFaktúra automaticky odošle email** zákazníkovi
6. **Resend odošle potvrdenie objednávky**

### Flow pri dobierke / osobnom odbere:
1. Zákazník vyberie "Dobierka" alebo "Osobný odber"
2. Klikne "Dokončiť objednávku"
3. **SuperFaktúra faktúra sa nevytvára** (kurier/prevádzka ju vystavia neskôr)
4. **Resend odošle potvrdenie objednávky**

### Dátové mapovanie:
- **Platobná metóda**: `paymentMethod` (stripe/cod/pickup)
- **Položky košíka**: `item_{i}_title`, `item_{i}_qty`, `item_{i}_price_cents`
- **Doprava**: `shippingMethod`, `shippingPriceCents`
- **Fakturačné údaje**: `billing_*` (vrátane firemných IČO, DIČ, IČ DPH)
- **Dodacie údaje**: `shipping_*`

## Konfigurácia SuperFaktúry

### DPH sadzba
Predvolene je nastavená 20% DPH. Pre zmenu upravte v `app/utils/superfaktura.ts`:
```typescript
tax: 20, // Zmeňte podľa potreby
```

### Mena
Podporované meny: EUR, CZK (podľa `pi.currency`)

### Krajiny
- Slovensko: ID 189
- Česko: ID 58

## Testovanie

### Lokálne testovanie:
```bash
# 1. Nastavte SuperFaktúra kľúče v .env.local
# 2. Spustite Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook

# 3. Spustite dev server
npm run dev

# 4. Vykonajte testovaciu objednávku
```

### Priamy test SuperFaktúra API:
```bash
node test-superfaktura-direct.js
```
Tento test vytvorí faktúru s ID 219491 a číslom 2025001.

### ✅ Overené funkcie (2025-01-19):
- **Sandbox URL**: `https://sandbox.superfaktura.sk` (funkčné)
- **API autentifikácia**: Funguje s sandbox kľúčom
- **Vytvorenie faktúry**: Úspešné (ID: 219491)
- **Položky faktúry**: Správne spracované (produkty + doprava)
- **DPH kalkulácia**: 20% DPH správne vypočítané
- **Číslovanie faktúr**: Automatické (2025001)

### Logy na sledovanie:
- `✅ Payment method is "stripe", proceeding with SuperFaktura invoice creation` - Kontrola prešla, vytváram faktúru
- `ℹ️ Payment method is "cod/pickup", skipping SuperFaktura invoice` - Dobierka/osobný odber, preskakujem
- `✅ SuperFaktura invoice created successfully` - úspešné vytvorenie
- `📧 Invoice email sent via SuperFaktura` - Email odoslaný
- `❌ SuperFaktura API Error` - chyba API
- `❌ Failed to create SuperFaktura invoice` - všeobecná chyba

## Produkčné nasadenie

### Vercel Environment Variables:
1. Prejdite do Vercel Dashboard → Project Settings → Environment Variables
2. Pridajte:
   - `SUPERFAKTURA_EMAIL`
   - `SUPERFAKTURA_API_KEY`
3. Redeploy projekt

### Stripe Webhook:
- URL: `https://vino-putec-web.vercel.app/api/stripe/webhook`
- Events: `payment_intent.succeeded`

## Troubleshooting

### Časté problémy:

1. **SuperFaktúra faktúra sa nevytvára**
   - Skontrolujte environment premenné
   - Skontrolujte logy v Vercel Functions

2. **Nesprávne ceny**
   - Overte, že `item_{i}_price_cents` obsahuje ceny v centoch
   - Skontrolujte delenie 100 pre konverziu na eurá

3. **Chyba DPH**
   - Upravte `tax` hodnotu v `superfaktura.ts`
   - Skontrolujte, či všetky produkty majú rovnakú sadzbu

4. **Chyba krajiny**
   - Overte `billing_country` a `shipping_country` hodnoty
   - Skontrolujte mapovanie v `getCountryId` funkcii

## Monitoring

### Vercel Functions Logs:
1. Prejdite do Vercel Dashboard → Functions
2. Vyberte `api/stripe/webhook`
3. Sledujte logy pre SuperFaktúra správy

### SuperFaktúra Dashboard:
- Skontrolujte vytvorené faktúry v SuperFaktúra účte
- Overte správnosť údajov a cien

## Bezpečnosť

- API kľúče sú uložené v environment premenných
- SuperFaktúra komunikácia prebieha cez HTTPS
- Error handling zabraňuje úniku citlivých údajov do logov

## Podpora

Pre technickú podporu kontaktujte:
- **Email**: brano.putec@gmail.com
- **Telefón**: +421 903465666

---

**Poznámka**: SuperFaktúra je primárny fakturačný systém. Stripe faktúry boli odstránené. SuperFaktúra faktúry sa vytvárajú len pri online platbe cez Stripe - dobierka a osobný odber faktúru netvoria (vystaví ju kurier/prevádzka).

## Changelog

### 2025-10 - Optimalizácia fakturácie
- Odstránené duplicitné Stripe faktúry
- SuperFaktúra ako jediný fakturačný systém
- Podmienečné vytvorenie faktúry (len pri online platbe)
- Dobierka a osobný odber bez automatickej faktúry

### 2025-01 - Počiatočná implementácia
- Pridaná SuperFaktúra integrácia
- Paralelné Stripe + SuperFaktúra faktúry
- Automatické odosielanie emailov
