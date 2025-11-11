# Nákupný proces - Detailná dokumentácia

## Prehľad

Tento dokument popisuje celý nákupný proces od pridania produktu do košíka až po odoslanie faktúry a emailov. Všetko je konfigurovateľné cez environment premenné v `.env` súbore.

---

## Flow diagram

### Online platba (Stripe)

```
1. Užívateľ → Košík → Pokladna (/pokladna)
2. Vyplní dodacie/fakturačné údaje
3. Vyberie "Stripe" ako platobnú metódu
4. Frontend → POST /api/stripe/create-payment-intent
   - Vytvorí PaymentIntent v Stripe
   - Uloží všetky údaje do metadata (objednávka, zákazník, produkty)
   - Vráti client_secret
5. Frontend → Stripe PaymentElement
   - Zobrazí platobné formuláre (karta, Google Pay, Apple Pay)
6. Užívateľ → Potvrdí platbu
7. Stripe → Redirect na /ordersummary?payment_intent=...&redirect_status=succeeded
8. Stripe → Webhook: POST /api/stripe/webhook (payment_intent.succeeded)
   - Vytvorí SuperFaktúra faktúru
   - Stiahne PDF faktúru
   - Pošle zákaznícky email (s PDF faktúrou)
   - Pošle admin email
9. Frontend → OrderSummary stránka
   - Zobrazí potvrdenie objednávky
   - Pre Stripe platby: preskočí volanie /api/checkout/placeorder (webhook už spracoval)
```

### Dobierka (Cash on Delivery)

```
1. Užívateľ → Košík → Pokladna (/pokladna)
2. Vyplní dodacie/fakturačné údaje
3. Vyberie "Dobierka" ako platobnú metódu
4. Užívateľ → Klikne "Objednať"
5. Frontend → POST /api/checkout/placeorder
   - Validuje údaje
   - Pošle zákaznícky email (bez faktúry)
   - Pošle admin email
6. Frontend → Redirect na /ordersummary
   - Zobrazí potvrdenie objednávky
```

---

## Detailný popis krokov

### 1. Košík a Pokladna

**Komponenty:**
- `app/components/MiniCart.tsx` - Mini košík s +/- tlačidlami
- `app/pokladna/page.tsx` - Hlavná pokladňa stránka
- `app/components/checkout/ShippingForm.tsx` - Dodací formulár
- `app/components/checkout/BillingForm.tsx` - Fakturačný formulár
- `app/components/checkout/PaymentMethods.tsx` - Výber platobnej metódy

**Flow:**
1. Užívateľ pridá produkty do košíka (Redux store)
2. Prejde na `/pokladna`
3. Vyplní dodacie údaje (validácia na frontende)
4. Vyberie spôsob dopravy
5. Vyberie platobnú metódu (Stripe alebo Dobierka)

---

### 2. Stripe platba - Vytvorenie PaymentIntent

**API Endpoint:** `POST /api/stripe/create-payment-intent`

**Komponenta:** `app/components/checkout/StripeClientSecretLoader.tsx`

**Čo sa deje:**
1. Frontend automaticky volá API pri načítaní Stripe platobnej metódy
2. API vytvorí Stripe PaymentIntent s:
   - `amount` - suma v centoch
   - `currency` - mena (EUR)
   - `metadata` - všetky údaje objednávky (JSON stringy)
   - `payment_method_types: ['card']` - len karty (+ automaticky Google/Apple Pay)
   - `receipt_email` - email zákazníka
3. API vráti `client_secret`
4. Frontend uloží údaje objednávky do `localStorage` (pre webhook)

**Metadata v PaymentIntent:**
```json
{
  "orderId": "abc123",
  "paymentMethod": "stripe",
  "shipping_firstName": "Ján",
  "shipping_lastName": "Novák",
  "shipping_email": "jan@example.com",
  "billing_firstName": "Ján",
  "billing_lastName": "Novák",
  "billing_email": "jan@example.com",
  "item_1_id": "product-slug",
  "item_1_title": "Product Name",
  "item_1_price": "19.90",
  "item_1_price_cents": "1990",
  "item_1_qty": "2",
  "shippingMethod": "Kurier",
  "shippingPriceCents": "300",
  ...
}
```

---

### 3. Stripe platba - Potvrdenie platby

**Komponenta:** `app/components/checkout/StripePaymentElement.tsx`

**Čo sa deje:**
1. Stripe PaymentElement zobrazí platobné formuláre
2. Užívateľ vyplní údaje karty alebo použije Google/Apple Pay
3. Užívateľ klikne "Zaplatiť teraz"
4. Frontend volá `stripe.confirmPayment()`
5. Stripe spracuje platbu
6. Stripe presmeruje na `/ordersummary?payment_intent=...&redirect_status=succeeded`

**Konfigurácia Stripe:**
- `payment_method_types: ['card']` - len karty (automaticky zahŕňa Google/Apple Pay)
- `terms: { card: 'never' }` - neukladá údaje karty
- `wallets: { applePay: 'auto', googlePay: 'auto' }` - automaticky zobrazí wallet platby

---

### 4. Stripe Webhook - Spracovanie úspešnej platby

**API Endpoint:** `POST /api/stripe/webhook`

**Čo sa deje:**
1. Stripe pošle webhook event `payment_intent.succeeded`
2. Webhook handler:
   - Overí Stripe signature (bezpečnosť)
   - Načíta PaymentIntent z Stripe API (s retry logikou)
   - Validuje, že platba bola úspešná (`status: "succeeded"`, `amount_received > 0`)
   - Vytvorí SuperFaktúra faktúru
   - Stiahne PDF faktúru
   - Pošle zákaznícky email (s PDF faktúrou)
   - Pošle admin email
   - Použije idempotency guard (spracuje len raz)

**Idempotency:**
- In-memory Set `processedOrderIds` - zabráni duplicitnému spracovaniu
- Webhook vráti 200 OK aj pri chybe (aby Stripe neopakoval)

**Fallback:**
- Ak `payment_intent.succeeded` zlyhá, použije sa `charge.succeeded` event

---

### 5. SuperFaktúra faktúra

**Funkcia:** `app/actions/superfaktura.ts` → `createSuperFakturaInvoice()`

**Čo sa deje:**
1. Z PaymentIntent metadata sa vytvorí faktúra
2. Vytvorí sa klient v SuperFaktúra (alebo použije existujúci)
3. Vytvorí sa faktúra s:
   - `already_paid: true` - faktúra je už uhradená
   - `payment_type: 'card'` - platba kartou
   - `paydate` - dátum úhrady
   - Všetky produkty a doprava ako položky
4. Vráti sa `invoiceId`
5. PDF faktúra sa stiahne cez `downloadInvoicePDF(invoiceId)`
6. PDF sa pripojí k zákazníckemu emailu

**Sandbox vs Production:**
- Automaticky detekuje z `SUPERFAKTURA_SANDBOX` env premennej
- Sandbox: `https://sandbox.superfaktura.sk`
- Production: `https://moja.superfaktura.sk`

---

### 6. Email odosielanie

**Služba:** Resend API

**Funkcie:**
- `app/utils/emailUtilities.ts` → `sendCustomerEmail()`
- `app/utils/emailUtilities.ts` → `sendAdminEmail()`

**Zákaznícky email:**
- **Pre Stripe platby:** S PDF faktúrou (príloha)
- **Pre Dobierku:** Bez faktúry (faktúru vystaví kurier)
- Obsahuje: potvrdenie objednávky, zoznam produktov, dodacie údaje

**Admin email:**
- Posiela sa vždy (Stripe aj Dobierka)
- Obsahuje: všetky údaje objednávky, zákaznícke údaje

**Logo v emailoch:**
- Logo sa posiela ako inline attachment (CID: logo)
- Nie je v prílohe (len inline v HTML)
- Okruhlé logo (`borderRadius: 50%`)

---

### 7. Dobierka (Cash on Delivery)

**API Endpoint:** `POST /api/checkout/placeorder`

**Komponenta:** `app/components/checkout/PlaceOrderButton.tsx`

**Čo sa deje:**
1. Užívateľ klikne "Objednať"
2. Frontend validuje formuláre
3. Frontend volá `/api/checkout/placeorder`
4. API:
   - Validuje údaje
   - Validuje ceny produktov
   - Pošle zákaznícky email (bez faktúry)
   - Pošle admin email
5. Frontend presmeruje na `/ordersummary`

**Validácia:**
- Ceny produktov musia sedieť s aktuálnymi cenami
- Spôsob dopravy musí byť platný
- Všetky povinné polia musia byť vyplnené

---

## Environment premenné

### Stripe

```env
# Stripe kľúče (automaticky detekuje test vs live z prefixu)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Test: pk_test_*, Live: pk_live_*
STRIPE_SECRET_KEY=sk_test_...                   # Test: sk_test_*, Live: sk_live_*
STRIPE_WEBHOOK_SECRET=whsec_...                 # Z Stripe Dashboard > Webhooks
```

**Ako získať:**
1. **Test mode:**
   - Stripe Dashboard → Developers → API keys
   - Použite test kľúče (začínajú `pk_test_` a `sk_test_`)
   - Pre lokálne testovanie: `stripe listen` → zobrazí webhook secret

2. **Live mode:**
   - Stripe Dashboard → Developers → API keys
   - Použite live kľúče (začínajú `pk_live_` a `sk_live_`)
   - Stripe Dashboard → Webhooks → vytvorte webhook → zobrazí webhook secret

**Webhook URL:**
- Lokálne: `http://localhost:3000/api/stripe/webhook` (cez Stripe CLI)
- Production: `https://vasadomena.com/api/stripe/webhook` (v Stripe Dashboard)

---

### Resend (Emaily)

```env
RESEND_API_KEY=re_...                    # Z Resend Dashboard > API Keys
RESEND_FROM_EMAIL=orders@abraconsulting.xyz  # MUSÍ byť z overenej domény v Resend
ADMIN_EMAIL=vas-email@domena.sk          # Email pre admin notifikácie
```

**Dôležité:**
- `RESEND_FROM_EMAIL` **MUSÍ** byť z overenej domény v Resend Dashboard
- Ak používate `onboarding@resend.dev` (testovací mód), môžete posielať len na overenú emailovú adresu (napr. `stancikmarian8@gmail.com`)
- Pre posielanie na ľubovoľné emailové adresy je **povinné** overiť doménu v Resend a použiť email z tejto domény

**Ako získať:**
1. Vytvorte účet na [resend.com](https://resend.com)
2. **Overte svoju doménu** v Resend Dashboard > Domains (napr. `abraconsulting.xyz` alebo `vinoputec.sk`)
3. Vytvorte API kľúč v Resend Dashboard > API Keys
4. Nastavte `RESEND_FROM_EMAIL` na email z overenej domény (napr. `orders@abraconsulting.xyz` alebo `info@vinoputec.sk`)

**Poznámka:** Aktuálne používame `orders@abraconsulting.xyz` ako dočasné riešenie. Neskôr sa zmení na správnu doménu (napr. `info@vinoputec.sk` alebo `orders@vinoputec.sk`).

---

### SuperFaktúra (Fakturácia)

```env
SUPERFAKTURA_EMAIL=vas-email@domena.sk   # Email používaný v SuperFaktúra
SUPERFAKTURA_API_KEY=vasklucod...        # API kľúč z SuperFaktúra
SUPERFAKTURA_SANDBOX=1                   # '1' alebo 'true' pre sandbox, '0' alebo prázdne pre production
```

**Ako získať:**
1. Vytvorte účet na [superfaktura.sk](https://www.superfaktura.sk)
2. Pre sandbox: použite [sandbox.superfaktura.sk](https://sandbox.superfaktura.sk)
3. Získajte API kľúč v SuperFaktúra Dashboard → Nastavenia → API
4. Nastavte `SUPERFAKTURA_SANDBOX=1` pre testovanie, `SUPERFAKTURA_SANDBOX=0` pre produkciu

**Dôležité:**
- Sandbox a Production majú **rôzne API kľúče**
- Sandbox: `https://sandbox.superfaktura.sk`
- Production: `https://moja.superfaktura.sk`

---

## Ako to nastaviť pre iný web

### 1. Skopírujte env.example

```bash
cp env.example .env.local
```

### 2. Nastavte Stripe

```env
# Pre testovanie
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_vašetestkľúče
STRIPE_SECRET_KEY=sk_test_vašetestkľúče
STRIPE_WEBHOOK_SECRET=whsec_vašewebhooksecret  # Z stripe listen alebo Stripe Dashboard
```

### 3. Nastavte Resend

```env
RESEND_API_KEY=re_vašeresendkľúč
RESEND_FROM_EMAIL=vas-email@vasa-domena.sk  # Musí byť overená v Resend
ADMIN_EMAIL=admin@vasa-domena.sk
```

### 4. Nastavte SuperFaktúra

```env
# Pre testovanie (sandbox)
SUPERFAKTURA_EMAIL=vas-email@domena.sk
SUPERFAKTURA_API_KEY=vašesandboxkľúč
SUPERFAKTURA_SANDBOX=1  # alebo 'true'

# Pre produkciu
SUPERFAKTURA_EMAIL=vas-email@domena.sk
SUPERFAKTURA_API_KEY=vašeprodukčnýkľúč
SUPERFAKTURA_SANDBOX=0  # alebo 'false', alebo prázdne
```

### 5. Nastavte webhook v Stripe

**Lokálne testovanie:**
```bash
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```

**Produkcia:**
1. Stripe Dashboard → Webhooks
2. Pridajte endpoint: `https://vasadomena.com/api/stripe/webhook`
3. Vyberte eventy: `payment_intent.succeeded`, `charge.succeeded`
4. Skopírujte webhook secret do `.env`

---

## API Endpointy

### `POST /api/stripe/create-payment-intent`

**Vytvorí Stripe PaymentIntent pre platbu.**

**Request body:**
```json
{
  "amount": 2090,  // Suma v centoch
  "currency": "eur",
  "orderId": "abc123",
  "cartItems": [...],
  "shippingForm": {...},
  "billingForm": {...},
  "shippingMethodName": "Kurier",
  "shippingCost": 3.00,
  "customerEmail": "jan@example.com",
  "paymentMethodId": "stripe"
}
```

**Response:**
```json
{
  "clientSecret": "pi_..._secret_..."
}
```

---

### `POST /api/stripe/webhook`

**Spracováva Stripe webhook eventy.**

**Eventy:**
- `payment_intent.succeeded` - úspešná platba
- `charge.succeeded` - fallback pre úspešnú platbu
- `payment_intent.payment_failed` - zlyhaná platba
- `payment_intent.canceled` - zrušená platba

**Čo robí:**
1. Overí Stripe signature
2. Vytvorí SuperFaktúra faktúru
3. Pošle zákaznícky email (s PDF faktúrou)
4. Pošle admin email

---

### `POST /api/checkout/placeorder`

**Spracováva objednávky na dobierku.**

**Request body:**
```json
{
  "orderId": "abc123",
  "orderDate": "2025-11-10T15:00:00Z",
  "cartItems": [...],
  "shippingForm": {...},
  "billingForm": {...},
  "shippingMethod": {...},
  "paymentMethodId": "cod"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order placed successfully"
}
```

**Čo robí:**
1. Validuje údaje
2. Validuje ceny produktov
3. Pošle zákaznícky email (bez faktúry)
4. Pošle admin email

---

## Dôležité poznámky

### Idempotency

- Webhook handler používa in-memory Set `processedOrderIds` na zabránenie duplicitnému spracovaniu
- Každá objednávka sa spracuje len raz (aj pri retry)

### Error handling

- Všetky chyby sa logujú do konzoly
- Email chyby neblokujú webhook (webhook vráti 200 OK)
- SuperFaktúra chyby neblokujú email odosielanie

### Sandbox vs Production

- **Stripe:** Automaticky detekuje z prefixu kľúča (`sk_test_` vs `sk_live_`)
- **SuperFaktúra:** Explicitne nastavte `SUPERFAKTURA_SANDBOX=1` alebo `0`

### Bezpečnosť

- Stripe webhook signature sa vždy overuje
- Všetky ceny sa validujú na serveri
- PaymentIntent metadata obsahuje len stringy (nie objekty)

---

## Testovanie

### Lokálne testovanie

1. Nastavte `.env.local` s test kľúčmi
2. Spustite dev server: `npm run dev`
3. Spustite Stripe CLI: `stripe listen --forward-to http://localhost:3000/api/stripe/webhook`
4. Skopírujte webhook secret z Stripe CLI do `.env.local`
5. Vykonajte testovú platbu (karta: 4242 4242 4242 4242)

### Produkcia

1. Nastavte production kľúče v Vercel Environment Variables
2. Vytvorte webhook v Stripe Dashboard
3. Skopírujte webhook secret do Vercel Environment Variables
4. Otestujte platbu v live móde

---

## Zhrnutie

**Pre Stripe platby:**
1. Frontend → Stripe PaymentIntent → Stripe platba → Webhook → SuperFaktúra faktúra → Emaily

**Pre Dobierku:**
1. Frontend → PlaceOrder API → Emaily (bez faktúry)

**Všetko je konfigurovateľné cez `.env` súbor - žiadne hardcoded hodnoty!**

