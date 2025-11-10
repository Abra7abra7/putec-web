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
  
  // Kontrola platobnej metódy - faktúru vytvárame len pri online platbe cez Stripe
  const paymentMethod = metadata.paymentMethod || 'unknown';
  console.log('🔍 SuperFaktura - Payment method from metadata:', paymentMethod);
  
  if (paymentMethod !== 'stripe') {
    console.log(`ℹ️ Payment method is "${paymentMethod}", skipping SuperFaktura invoice (faktúru vystaví kurier/prevádzka)`);
    return;
  }
  
  console.log('✅ Payment method is "stripe", proceeding with SuperFaktura invoice creation');
  
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

  // Získanie emailu - priorita: chargeEmail > pi.receipt_email > metadata.billing_email
  const customerEmail = chargeEmail || pi.receipt_email || metadata.billing_email || '';
  
  // Príprava dát o klientovi z metadát PaymentIntent
  const clientData: SFClientData = {
    name: metadata.billing_company_name || `${metadata.billing_firstName} ${metadata.billing_lastName}`,
    ico: metadata.billing_company_ico || undefined,
    dic: metadata.billing_company_dic || undefined,
    ic_dph: metadata.billing_company_icdph || undefined,
    address: metadata.billing_address1 || '',
    city: metadata.billing_city || '',
    zip: metadata.billing_postalCode || '',
    country_id: getCountryId(metadata.billing_country),
    email: customerEmail,
    phone: metadata.billing_phone || undefined,
  };

  // Debug log pre kontrolu emailov
  console.log('🔍 SuperFaktura - Email sources:', {
    chargeEmail,
    receipt_email: pi.receipt_email,
    billing_email: metadata.billing_email,
    final_customerEmail: customerEmail,
  });
  
  // Debug log pre kontrolu metadát
  console.log('🔍 SuperFaktura - Billing metadata:', {
    company_name: metadata.billing_company_name,
    company_ico: metadata.billing_company_ico,
    company_dic: metadata.billing_company_dic,
    company_icdph: metadata.billing_company_icdph,
    firstName: metadata.billing_firstName,
    lastName: metadata.billing_lastName,
    address: metadata.billing_address1,
    city: metadata.billing_city,
    country: metadata.billing_country,
    email: metadata.billing_email,
  });

  console.log('🔍 SuperFaktura - Shipping metadata:', {
    shipping_firstName: metadata.shipping_firstName,
    shipping_lastName: metadata.shipping_lastName,
    shipping_address1: metadata.shipping_address1,
    shipping_city: metadata.shipping_city,
    shipping_country: metadata.shipping_country,
  });

  // Príprava položiek faktúry - OPRAVA: používame price_cents namiesto price
  const invoiceItems: SFInvoiceItem[] = [];
  const indices = new Set<number>();
  Object.keys(metadata).forEach(k => {
    const m = k.match(/^item_(\d+)_/);
    if (m) indices.add(parseInt(m[1], 10));
  });

  indices.forEach(i => {
    // OPRAVA: čítame z price_cents a delíme 100 pre eurá
    const unitPriceCents = parseInt(metadata[`item_${i}_price_cents`] || '0', 10);
    const unitPrice = unitPriceCents / 100;
    
    invoiceItems.push({
      name: metadata[`item_${i}_title`] || `Položka ${i}`,
      description: `Produkt ID: ${metadata[`item_${i}_id`]}`,
      quantity: parseInt(metadata[`item_${i}_qty`] || '1', 10),
      unit: 'ks',
      unit_price: unitPrice,
      tax: 20, // Predpokladáme 20% DPH, upravte podľa potreby
    });
  });

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
  
  // Príprava finálneho JSONu pre API
  const invoicePayload = {
    Invoice: {
      name: `Objednávka ${metadata.orderId}`,
      invoice_currency: pi.currency.toUpperCase(),
      payment_type: 'card', // Platba kartou cez Stripe
      already_paid: true, // Faktúra je už uhradená
      paydate: new Date().toISOString().split('T')[0], // Dátum úhrady (YYYY-MM-DD)
      vs: metadata.orderId.replace(/[^0-9]/g, '').slice(0, 10) || undefined, // Variabilný symbol z orderId
    },
    InvoiceItem: invoiceItems,
    Client: {
      ...clientData,
      delivery_address: metadata.shipping_address1,
      delivery_city: metadata.shipping_city,
      delivery_zip: metadata.shipping_postalCode,
      delivery_country_id: getCountryId(metadata.shipping_country),
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
      console.error(`❌ SuperFaktura API Error for order ${metadata.orderId} (${isSandbox ? 'SANDBOX' : 'PRODUCTION'} mode):`, response.data.error_message);
      // Return undefined instead of throwing - let webhook continue with emails
      return undefined;
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
    // Return undefined instead of throwing - let webhook continue with emails
    return undefined;
  }
}
