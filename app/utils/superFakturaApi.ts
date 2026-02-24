// SuperFaktúra API Integration
// Dokumentácia: https://www.superfaktura.sk/api/

import { OrderBody, OrderCartItem } from "../../types/Order";

// Helper function to normalize boolean env values (accepts '1', 'true', 'True', 'TRUE', etc)
const isSandboxMode = (): boolean => {
  const sandboxValue = process.env.SUPERFAKTURA_SANDBOX;
  if (!sandboxValue) return false;
  const normalized = sandboxValue.toLowerCase().trim();
  return normalized === '1' || normalized === 'true';
};

// Použiť sandbox alebo produkciu podľa nastavenia
const SUPERFAKTURA_API_URL = isSandboxMode()
  ? "https://sandbox.superfaktura.sk"
  : "https://moja.superfaktura.sk";

interface SuperFakturaInvoiceItem {
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  unit_price: number;
  tax: number;
}

interface SuperFakturaInvoice {
  Invoice: {
    name: string;
    variable: string;
    delivery: string;
    payment_type: string;
    already_paid?: boolean;
    paydate?: string;
    due?: string;
    comment?: string;
    invoice_currency: string;
  };
  Client: {
    name: string;
    ico?: string;
    dic?: string;
    ic_dph?: string;
    address: string;
    city: string;
    zip: string;
    country_id: number;
    email: string;
    phone?: string;
    delivery_address?: string;
    delivery_city?: string;
    delivery_zip?: string;
    delivery_country_id?: number;
  };
  InvoiceItem: SuperFakturaInvoiceItem[];
}

// Mapovanie krajiny na ID podľa SuperFaktúry
const getCountryId = (countryCode: string) => {
  const code = countryCode?.toUpperCase();
  switch (code) {
    case 'SK': return 191;
    case 'CZ': return 58;
    case 'HU': return 101;
    case 'AT': return 15;
    case 'DE': return 81;
    default: return 191; // Default Slovensko
  }
};

// Autentifikácia pre SuperFaktúra API
function getAuthHeaders(): HeadersInit {
  const apiKey = process.env.SUPERFAKTURA_API_KEY;
  const email = process.env.SUPERFAKTURA_EMAIL;
  const companyId = process.env.SUPERFAKTURA_COMPANY_ID;

  if (!apiKey || !email) {
    throw new Error("SuperFaktúra credentials not configured");
  }

  const auth = `SFAPI email=${email}&apikey=${apiKey}${companyId ? `&company_id=${companyId}` : ''}`;

  return {
    "Authorization": auth,
    "Content-Type": "application/json",
  };
}

/**
 * Creates an invoice in SuperFaktúra for an order
 */
export async function createSuperFakturaInvoice(orderData: OrderBody): Promise<string> {
  try {
    console.log("📄 SuperFaktúra: Začínam vytvárať faktúru pre objednávku:", orderData.orderId);
    console.log("📄 SuperFaktúra API URL:", SUPERFAKTURA_API_URL);

    // Priprav položky faktúry
    const invoiceItems: SuperFakturaInvoiceItem[] = orderData.cartItems.map((item: OrderCartItem) => ({
      name: item.Title,
      description: item.ShortDescription || `ID: ${item.ID}`,
      quantity: item.quantity,
      unit: "ks",
      unit_price: parseFloat(item.SalePrice || item.RegularPrice),
      tax: 20, // DPH 20%
    }));

    // Pridaj dopravu ako položku
    if (orderData.shippingMethod.price > 0) {
      invoiceItems.push({
        name: orderData.shippingMethod.name,
        description: "Doprava",
        quantity: 1,
        unit: "ks",
        unit_price: orderData.shippingMethod.price,
        tax: 20,
      });
    }

    // Pridaj poplatok za dobierku
    if (orderData.paymentMethodId === "cod" && (orderData.codFee || 0) > 0) {
      invoiceItems.push({
        name: "Poplatok za dobierku",
        description: "Dobierka",
        quantity: 1,
        unit: "ks",
        unit_price: orderData.codFee || 0,
        tax: 20,
      });
    }

    // Určenie typu platby a stavu úhrady
    const isStripe = orderData.paymentMethodId === "stripe";
    const isCOD = orderData.paymentMethodId === "cod";
    const isPickup = orderData.paymentMethodId === "pickup";

    const paymentType = isCOD ? "cod" : isPickup ? "pickup" : "card";

    // Vytvor faktúru s vloženým klientom (Direct create)
    const invoiceData: SuperFakturaInvoice = {
      Invoice: {
        name: `Objednávka ${orderData.orderId}`,
        variable: orderData.orderId.replace(/[^0-9]/g, '').slice(0, 10),
        delivery: new Date().toISOString().split("T")[0],
        payment_type: paymentType,
        already_paid: isStripe,
        paydate: isStripe ? new Date().toISOString().split("T")[0] : undefined,
        comment: `Objednávka z e-shopu\nSpôsob platby: ${orderData.paymentMethodId.toUpperCase()}`,
        invoice_currency: "EUR",
      },
      Client: {
        name: orderData.billingForm.isCompany ? (orderData.billingForm.companyName || "") : `${orderData.billingForm.firstName} ${orderData.billingForm.lastName}`.trim(),
        ico: orderData.billingForm.companyICO,
        dic: orderData.billingForm.companyDIC,
        ic_dph: orderData.billingForm.companyICDPH,
        address: orderData.billingForm.address1,
        city: orderData.billingForm.city,
        zip: orderData.billingForm.postalCode,
        country_id: getCountryId(orderData.billingForm.country),
        email: orderData.billingForm.email,
        phone: orderData.billingForm.phone,
        delivery_address: orderData.shippingForm.address1,
        delivery_city: orderData.shippingForm.city,
        delivery_zip: orderData.shippingForm.postalCode,
        delivery_country_id: getCountryId(orderData.shippingForm.country),
      },
      InvoiceItem: invoiceItems,
    };

    console.log("🚀 [SuperFaktúra] Sending Payload:", JSON.stringify(invoiceData, null, 2));

    const response = await fetch(`${SUPERFAKTURA_API_URL}/invoices/create`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(invoiceData),
    });

    const result = await response.json();

    if (result.error === 0) {
      const invoiceId = result.data.Invoice.id;
      const invoiceTotal = parseFloat(result.data.Invoice.total || "0");

      console.log("✅ SuperFaktúra: Faktúra vytvorená ID:", invoiceId);
      console.log("💰 Celková suma faktúry (s DPH):", invoiceTotal, "EUR");

      // Ak platba kartou, označ faktúru ako zaplatenú (ak už nie je z create kroku)
      if (isStripe && !result.data.Invoice.already_paid) {
        await markInvoiceAsPaid(invoiceId, invoiceTotal);
      }

      // Odošli faktúru emailom (iba v produkcii)
      if (!isSandboxMode()) {
        await sendInvoiceEmail(invoiceId);
      }

      return invoiceId;
    } else {
      console.error("❌ SuperFaktúra API error:", result.error_message);
      throw new Error(`SuperFaktúra API error: ${result.error_message}`);
    }
  } catch (error) {
    console.error("❌ SuperFaktúra: Chyba pri vytváraní faktúry:", error);
    throw error;
  }
}

// Označiť faktúru ako zaplatenú
async function markInvoiceAsPaid(invoiceId: string, totalAmount: number): Promise<void> {
  try {
    // 1. Označiť faktúru ako odoslanú 
    await fetch(`${SUPERFAKTURA_API_URL}/invoices/mark_as_sent/${invoiceId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    // 2. Pridať platbu
    const paymentData = {
      InvoicePayment: {
        invoice_id: parseInt(invoiceId),
        payment_type: "card",
        amount: totalAmount,
        currency: "EUR",
        created: new Date().toISOString().split("T")[0],
      },
    };

    const payResponse = await fetch(`${SUPERFAKTURA_API_URL}/invoice_payments/add`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentData),
    });

    if (payResponse.ok) {
      console.log("✅ SuperFaktúra: Faktúra označená ako zaplatená:", invoiceId);
    }
  } catch (error) {
    console.warn("⚠️ SuperFaktúra: Problém pri označovaní faktúry ako zaplatenej:", error);
  }
}

// Odoslať faktúru emailom via SuperFaktura API
async function sendInvoiceEmail(invoiceId: string): Promise<void> {
  if (isSandboxMode()) return;

  try {
    const response = await fetch(`${SUPERFAKTURA_API_URL}/invoices/send/${invoiceId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      console.log("✅ SuperFaktúra: Faktúra odoslaná emailom:", invoiceId);
    }
  } catch (error) {
    console.warn("⚠️ SuperFaktúra: Problém pri odosielaní faktúry emailom:", error);
  }
}

// Stiahnuť PDF faktúru
export async function downloadInvoicePDF(invoiceId: string): Promise<Buffer> {
  try {
    const isSandbox = isSandboxMode();
    const pdfUrl = `${SUPERFAKTURA_API_URL}/invoices/pdf/${invoiceId}/lang/slo`;

    const response = await fetch(pdfUrl, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (isSandbox) {
        throw new Error("PDF download not supported in sandbox mode");
      }
      throw new Error(`Failed to download PDF: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error("❌ SuperFaktúra: Chyba pri sťahovaní PDF faktúry:", error);
    throw error;
  }
}

// Test pripojenia k SuperFaktúra API
export async function testSuperFakturaConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${SUPERFAKTURA_API_URL}/users/getUserCompaniesData`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    return response.ok;
  } catch (error) {
    console.error("❌ SuperFaktúra: Chyba pri testovaní pripojenia:", error);
    return false;
  }
}
