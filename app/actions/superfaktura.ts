// app/utils/superfaktura.ts
import axios from 'axios';
import Stripe from 'stripe';

// Definícia štruktúry pre položku faktúry v SuperFaktúre
interface SFInvoiceItem {
  name: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  tax: number; // Sadzba DPH (napr. 20 pre 20%)
}

// Definícia štruktúry pre údaje klienta v SuperFaktúre
interface SFClientData {
  name: string;
  ico?: string;
  dic?: string;
  ic_dph?: string;
  address: string;
  city: string;
  zip: string;
  country_id: number; // ID krajiny (Slovensko = 189, Česko = 58)
  email: string;
  phone?: string;
}

// Hlavná funkcia na vytvorenie faktúry
export async function createSuperFakturaInvoice(pi: Stripe.PaymentIntent, chargeEmail?: string | null) {
  console.log('🔍 SuperFaktura - Checking credentials...');
  console.log('🔍 SUPERFAKTURA_EMAIL exists:', !!process.env.SUPERFAKTURA_EMAIL);
  console.log('🔍 SUPERFAKTURA_API_KEY exists:', !!process.env.SUPERFAKTURA_API_KEY);
  console.log('🔍 SUPERFAKTURA_SEND_EMAILS:', process.env.SUPERFAKTURA_SEND_EMAILS);
  console.log('🔍 SUPERFAKTURA_SANDBOX:', process.env.SUPERFAKTURA_SANDBOX);
  console.log('🔍 SUPERFAKTURA_EMAIL value:', process.env.SUPERFAKTURA_EMAIL);

  if (!process.env.SUPERFAKTURA_EMAIL || !process.env.SUPERFAKTURA_API_KEY) {
    console.warn("⚠️ SuperFaktura credentials are not set. Skipping invoice creation.");
    return;
  }

  const metadata = pi.metadata as Record<string, string>;

  // Kontrola platobnej metódy
  const paymentMethod = metadata.paymentMethod || 'unknown';
  console.log('🔍 SuperFaktura - Payment method from metadata:', paymentMethod);

  if (paymentMethod !== 'stripe' && paymentMethod !== 'cash_on_delivery' && paymentMethod !== 'dobierka') {
    console.log(`ℹ️ Payment method is "${paymentMethod}", skipping SuperFaktura invoice.`);
    return;
  }

  console.log(`✅ Payment method is "${paymentMethod}", proceeding with SuperFaktura invoice creation`);

  console.log('🔍 SuperFaktura - PaymentIntent metadata:', metadata);
  console.log('🔍 SuperFaktura - Order ID from metadata:', metadata.orderId);

  // Mapovanie krajiny na ID podľa SuperFaktúry
  const getCountryId = (countryCode: string) => {
    switch (countryCode) {
      case 'SK': return 191;
      case 'CZ': return 58;
      default: return 191; // Default na Slovensko
    }
  };

  // --- Parse billing form (new compact JSON or old per-field format) ---
  let billingParsed: Record<string, string> = {};
  if (metadata.billing) {
    try { billingParsed = JSON.parse(metadata.billing); } catch { /* ignore */ }
  }
  const billingFirstName = billingParsed.fn || metadata.billing_firstName || '';
  const billingLastName = billingParsed.ln || metadata.billing_lastName || '';
  const billingAddr = billingParsed.addr || metadata.billing_address1 || '';
  const billingCity = billingParsed.city || metadata.billing_city || '';
  const billingZip = billingParsed.zip || metadata.billing_postalCode || '';
  const billingCountry = billingParsed.country || metadata.billing_country || '';
  const billingEmail = billingParsed.email || metadata.billing_email || '';
  const billingPhone = billingParsed.phone || metadata.billing_phone || undefined;
  const billingCompanyName = billingParsed.cname || metadata.billing_company_name || undefined;
  const billingICO = billingParsed.ico || metadata.billing_company_ico || undefined;
  const billingDIC = billingParsed.dic || metadata.billing_company_dic || undefined;
  const billingICDPH = metadata.billing_company_icdph || undefined;

  // --- Parse shipping form (new compact JSON or old per-field format) ---
  let shippingParsed: Record<string, string> = {};
  if (metadata.shipping) {
    try { shippingParsed = JSON.parse(metadata.shipping); } catch { /* ignore */ }
  }
  const shippingAddr = shippingParsed.addr || metadata.shipping_address1 || '';
  const shippingCity = shippingParsed.city || metadata.shipping_city || '';
  const shippingZip = shippingParsed.zip || metadata.shipping_postalCode || '';
  const shippingCountry = shippingParsed.country || metadata.shipping_country || '';

  // Získanie emailu - priorita: chargeEmail > pi.receipt_email > billing email
  const customerEmail = chargeEmail || pi.receipt_email || billingEmail || '';

  // Príprava dát o klientovi
  const clientData: SFClientData = {
    name: billingCompanyName || `${billingFirstName} ${billingLastName}`.trim(),
    ico: billingICO,
    dic: billingDIC,
    ic_dph: billingICDPH,
    address: billingAddr,
    city: billingCity,
    zip: billingZip,
    country_id: getCountryId(billingCountry || shippingCountry),
    email: customerEmail,
    phone: billingPhone,
  };

  // Debug log
  console.log('🔍 SuperFaktura - Client data:', { name: clientData.name, email: clientData.email, city: clientData.city });

  // --- Parse cart items (new compact JSON or old per-field format) ---
  const invoiceItems: SFInvoiceItem[] = [];

  if (metadata.cart_items) {
    // New compact format
    try {
      const parsed = JSON.parse(metadata.cart_items) as Array<{ id: string; title: string; qty: number; price: number }>;
      parsed.forEach(item => {
        invoiceItems.push({
          name: item.title || `Položka`,
          description: `Produkt ID: ${item.id}`,
          quantity: item.qty || 1,
          unit: 'ks',
          unit_price: item.price || 0,
          tax: 20,
        });
      });
    } catch {
      console.warn('⚠️ Failed to parse cart_items JSON');
    }
  } else {
    // Old per-field format fallback
    const indices = new Set<number>();
    Object.keys(metadata).forEach(k => {
      const m = k.match(/^item_(\d+)_/);
      if (m) indices.add(parseInt(m[1], 10));
    });
    indices.forEach(i => {
      const unitPriceCents = parseInt(metadata[`item_${i}_price_cents`] || '0', 10);
      const unitPrice = unitPriceCents > 0 ? unitPriceCents / 100 : parseFloat(metadata[`item_${i}_price`] || '0');
      invoiceItems.push({
        name: metadata[`item_${i}_title`] || `Položka ${i}`,
        description: `Produkt ID: ${metadata[`item_${i}_id`]}`,
        quantity: parseInt(metadata[`item_${i}_qty`] || '1', 10),
        unit: 'ks',
        unit_price: unitPrice,
        tax: 20,
      });
    });
  }

  console.log(`🔍 SuperFaktura - Invoice items count: ${invoiceItems.length}`);


  // Pridanie dopravy ako položky faktúry - OPRAVA: používame shippingPriceCents
  const shippingCostCents = parseInt(metadata.shippingPriceCents || '0', 10);
  const shippingCost = shippingCostCents / 100;

  if (shippingCost > 0) {
    invoiceItems.push({
      name: `Doprava: ${metadata.shippingMethod || ''}`.trim(),
      description: 'Poplatok za dopravu',
      quantity: 1,
      unit: 'ks',
      unit_price: shippingCost,
      tax: 20, // Predpokladáme 20% DPH
    });
  }

  // Create Dobierka item if COD
  const isCOD = paymentMethod === 'cash_on_delivery' || paymentMethod === 'dobierka';

  // Príprava finálneho JSONu pre API
  const invoicePayload = {
    Invoice: {
      name: `Objednávka ${metadata.orderId}`,
      invoice_currency: pi.currency.toUpperCase(),
      payment_type: isCOD ? 'cod' : 'card', // 'cod' for dobierka, 'card' for stuck
      already_paid: !isCOD, // False for COD
      paydate: !isCOD ? new Date().toISOString().split('T')[0] : undefined, // Dátum úhrady len ak je zaplatené
      vs: metadata.orderId.replace(/[^0-9]/g, '').slice(0, 10) || undefined, // Variabilný symbol z orderId
    },
    InvoiceItem: invoiceItems,
    Client: {
      ...clientData,
      delivery_address: shippingAddr,
      delivery_city: shippingCity,
      delivery_zip: shippingZip,
      delivery_country_id: getCountryId(shippingCountry),
    },
  };

  // Helper function to normalize boolean env values (accepts '1', 'true', 'True', 'TRUE', etc)
  const isSandboxMode = (): boolean => {
    const sandboxValue = process.env.SUPERFAKTURA_SANDBOX;
    if (!sandboxValue) return false;
    const normalized = sandboxValue.toLowerCase().trim();
    return normalized === '1' || normalized === 'true';
  };

  // Use sandbox URL if SUPERFAKTURA_SANDBOX is set to '1' or 'true' (case-insensitive)
  const isSandbox = isSandboxMode();
  const baseUrl = isSandbox
    ? 'https://sandbox.superfaktura.sk'
    : 'https://moja.superfaktura.sk';

  console.log(`🔍 SuperFaktura - Mode: ${isSandbox ? 'SANDBOX' : 'PRODUCTION'}`);
  console.log(`🔍 SuperFaktura - API URL: ${baseUrl}`);
  console.log(`🔍 SuperFaktura - SUPERFAKTURA_SANDBOX value: "${process.env.SUPERFAKTURA_SANDBOX}"`);

  // Odoslanie požiadavky na SuperFaktúra API
  try {
    const response = await axios.post(`${baseUrl}/invoices/create`, invoicePayload, {
      headers: {
        'Authorization': `SFAPI email=${process.env.SUPERFAKTURA_EMAIL}&apikey=${process.env.SUPERFAKTURA_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.data.error === 0) {
      const invoiceId = response.data.data.Invoice.id;
      console.log(`✅ SuperFaktura invoice created successfully for order ${metadata.orderId}. Invoice ID: ${invoiceId} (${isSandbox ? 'SANDBOX' : 'PRODUCTION'} mode)`);

      // Vrátiť invoiceId pre webhook handler (webhook pošle emaily s PDF)
      return invoiceId;
    } else {
      const errorMessage = response.data.error_message || "Unknown SuperFaktura Error";
      console.error(`❌ SuperFaktura API Error for order ${metadata.orderId} (${isSandbox ? 'SANDBOX' : 'PRODUCTION'} mode):`, errorMessage);
      // THROW error to trigger Stripe Retry
      throw new Error(`SuperFaktura API Error: ${errorMessage}`);
    }
  } catch (error) {
    console.error(`❌ Failed to create SuperFaktura invoice for order ${metadata.orderId} (${isSandbox ? 'SANDBOX' : 'PRODUCTION'} mode):`, error);

    // Log detailed error information for debugging
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown; statusText?: string } };
      console.error(`❌ SuperFaktura API Error Details:`, {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        url: `${baseUrl}/invoices/create`,
        email: process.env.SUPERFAKTURA_EMAIL,
        apiKeyLength: process.env.SUPERFAKTURA_API_KEY?.length || 0,
        sandboxMode: isSandbox,
        mode: isSandbox ? 'SANDBOX' : 'PRODUCTION',
      });
    }
    // THROW error to trigger Stripe Retry
    throw error;
  }
}
