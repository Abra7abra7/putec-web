// SuperFaktúra API Integration
// Dokumentácia: https://www.superfaktura.sk/api/

import { OrderBody, OrderCartItem } from "./emailUtilities";

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

interface SuperFakturaClient {
  name: string;
  ico?: string;
  dic?: string;
  ic_dph?: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  phone?: string;
}

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
    due?: string;
    comment?: string;
  };
  Client: {
    id: number;
  };
  InvoiceItem: SuperFakturaInvoiceItem[];
}

// Autentifikácia pre SuperFaktúra API
function getAuthHeaders(): HeadersInit {
  const apiKey = process.env.SUPERFAKTURA_API_KEY;
  const email = process.env.SUPERFAKTURA_EMAIL;
  const companyId = process.env.SUPERFAKTURA_COMPANY_ID;

  if (!apiKey || !email) {
    throw new Error("SuperFaktúra credentials not configured");
  }

  const headers: HeadersInit = {
    "Authorization": `SFAPI email=${email}&apikey=${apiKey}&company_id=${companyId || ''}`,
    "Content-Type": "application/json",
  };

  console.log("🔐 SuperFaktúra Auth Header:", `SFAPI email=${email}&apikey=${apiKey.substring(0, 10)}...&company_id=${companyId || ''}`);

  return headers;
}

// Získať alebo vytvoriť klienta v SuperFaktúra
async function getOrCreateClient(orderData: OrderBody): Promise<number> {
  try {
    const billingForm = orderData.billingForm;
    
    const clientData: SuperFakturaClient = {
      name: billingForm.isCompany 
        ? billingForm.companyName || `${billingForm.firstName} ${billingForm.lastName}`
        : `${billingForm.firstName} ${billingForm.lastName}`,
      ico: billingForm.companyICO || undefined,
      dic: billingForm.companyDIC || undefined,
      ic_dph: billingForm.companyICDPH || undefined,
      email: billingForm.email,
      address: billingForm.address1,
      city: billingForm.city,
      zip: billingForm.postalCode,
      country: billingForm.country,
      phone: billingForm.phone || orderData.shippingForm.phone,
    };

    // Najprv skúsime nájsť existujúceho klienta
    const searchResponse = await fetch(
      `${SUPERFAKTURA_API_URL}/clients/index.json?search=${encodeURIComponent(clientData.email)}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    console.log("🔍 SuperFaktúra search response status:", searchResponse.status);
    
    if (searchResponse.ok) {
      const responseText = await searchResponse.text();
      console.log("📄 SuperFaktúra search response:", responseText.substring(0, 500));
      
      try {
        const clients = JSON.parse(responseText);
        if (clients && clients.length > 0) {
          const clientId = clients[0].Client.id;
          console.log("✅ SuperFaktúra: Našiel sa existujúci klient ID:", clientId);
          
          // Aktualizuj klienta s novými údajmi z aktuálnej objednávky
          console.log("🔄 SuperFaktúra: Aktualizujem klienta s novými údajmi");
          const updateResponse = await fetch(`${SUPERFAKTURA_API_URL}/clients/edit/${clientId}`, {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify({ Client: clientData }),
          });
          
          if (updateResponse.ok) {
            console.log("✅ SuperFaktúra: Klient aktualizovaný s novými údajmi");
          } else {
            const updateError = await updateResponse.text();
            console.warn("⚠️ SuperFaktúra: Nepodarilo sa aktualizovať klienta:", updateResponse.status, updateError.substring(0, 200));
            // Pokračujeme aj tak - použijeme existujúceho klienta
          }
          
          return clientId;
        }
      } catch (parseError) {
        console.error("❌ SuperFaktúra: Chyba pri parsovaní JSON odpovede:", parseError);
        console.log("📄 Response text:", responseText);
      }
    } else {
      const errorText = await searchResponse.text();
      console.error("❌ SuperFaktúra search failed:", searchResponse.status, errorText.substring(0, 500));
    }

    // Ak klient neexistuje, vytvoríme nového
    const createResponse = await fetch(`${SUPERFAKTURA_API_URL}/clients/create`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ Client: clientData }),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error("❌ SuperFaktúra: Chyba pri vytváraní klienta:", errorText);
      throw new Error(`Failed to create client: ${createResponse.status}`);
    }

    const result = await createResponse.json();
    console.log("✅ SuperFaktúra: Vytvorený nový klient ID:", result.data?.Client?.id);
    return result.data?.Client?.id || result.Client?.id;
  } catch (error) {
    console.error("❌ SuperFaktúra: Chyba pri práci s klientom:", error);
    throw error;
  }
}

// Vytvorenie faktúry v SuperFaktúra
export async function createSuperFakturaInvoice(orderData: OrderBody): Promise<string> {
  try {
    console.log("📄 SuperFaktúra: Začínam vytvárať faktúru pre objednávku:", orderData.orderId);

    // Získaj alebo vytvor klienta
    const clientId = await getOrCreateClient(orderData);

    // Priprav položky faktúry
    const invoiceItems: SuperFakturaInvoiceItem[] = orderData.cartItems.map((item: OrderCartItem) => ({
      name: item.Title,
      description: item.ShortDescription || "",
      quantity: item.quantity,
      unit: "ks",
      unit_price: parseFloat(item.SalePrice || item.RegularPrice),
      tax: 20, // DPH 20% pre Slovensko
    }));

    // Pridaj dopravu ako položku
    if (orderData.shippingMethod.price > 0) {
      invoiceItems.push({
        name: "Doprava",
        description: orderData.shippingMethod.name,
        quantity: 1,
        unit: "ks",
        unit_price: orderData.shippingMethod.price,
        tax: 20,
      });
    }

    // Určenie typu platby
    const paymentType = orderData.paymentMethodId === "cod" ? "cod" : "card";

    // Vytvor faktúru
    const invoiceData: SuperFakturaInvoice = {
      Invoice: {
        name: `Objednávka ${orderData.orderId}`,
        variable: orderData.orderId,
        delivery: new Date().toISOString().split("T")[0],
        payment_type: paymentType,
        comment: `Objednávka z e-shopu\nSpôsob platby: ${orderData.paymentMethodId.toUpperCase()}`,
      },
      Client: {
        id: clientId,
      },
      InvoiceItem: invoiceItems,
    };

    const response = await fetch(`${SUPERFAKTURA_API_URL}/invoices/create`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(invoiceData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ SuperFaktúra: Chyba pri vytváraní faktúry:", errorText);
      throw new Error(`Failed to create invoice: ${response.status}`);
    }

    const result = await response.json();
    const invoiceId = result.data?.Invoice?.id || result.Invoice?.id;
    const invoiceTotal = parseFloat(result.data?.Invoice?.total || result.Invoice?.total || "0");
    
    console.log("✅ SuperFaktúra: Faktúra vytvorená ID:", invoiceId);
    console.log("💰 Celková suma faktúry (s DPH):", invoiceTotal, "EUR");

    // Ak platba kartou, označ faktúru ako zaplatenú
    if (orderData.paymentMethodId === "stripe") {
      await markInvoiceAsPaid(invoiceId, invoiceTotal);
    }

    // Odošli faktúru emailom
    await sendInvoiceEmail(invoiceId);

    return invoiceId;
  } catch (error) {
    console.error("❌ SuperFaktúra: Chyba pri vytváraní faktúry:", error);
    throw error;
  }
}

// Označiť faktúru ako zaplatenú
async function markInvoiceAsPaid(invoiceId: string, totalAmount: number): Promise<void> {
  try {
    // 1. Označiť faktúru ako odoslanú
    const sentResponse = await fetch(`${SUPERFAKTURA_API_URL}/invoices/mark_as_sent/${invoiceId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (sentResponse.ok) {
      console.log("✅ SuperFaktúra: Faktúra označená ako odoslaná:", invoiceId);
    } else {
      const errorText = await sentResponse.text();
      console.warn("⚠️ SuperFaktúra mark_as_sent error:", errorText.substring(0, 200));
    }

    // 2. Pridať platbu kartou
    const paymentData = {
      InvoicePayment: {
        invoice_id: parseInt(invoiceId),
        payment_type: "card", // karta
        amount: totalAmount,
        currency: "EUR",
        created: new Date().toISOString().split("T")[0],
      },
    };

    console.log("💳 SuperFaktúra: Pridávam platbu:", JSON.stringify(paymentData));

    const payResponse = await fetch(`${SUPERFAKTURA_API_URL}/invoice_payments/add`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentData),
    });

    if (payResponse.ok) {
      const payResult = await payResponse.json();
      console.log("✅ SuperFaktúra: Faktúra označená ako zaplatená:", invoiceId, payResult);
    } else {
      const errorText = await payResponse.text();
      console.error("❌ SuperFaktúra payment error:", payResponse.status, errorText.substring(0, 300));
    }
  } catch (error) {
    console.warn("⚠️ SuperFaktúra: Problém pri označovaní faktúry ako zaplatenej:", error);
  }
}

// Odoslať faktúru emailom
async function sendInvoiceEmail(invoiceId: string): Promise<void> {
  // V sandboxe preskočíme odosielanie emailov, pretože API endpoint nefunguje
  if (isSandboxMode()) {
    console.log("⚠️ SuperFaktúra Sandbox: Preskakujem odosielanie emailu. Faktúru si môžete pozrieť v SuperFaktúra účte.");
    return;
  }

  try {
    const response = await fetch(`${SUPERFAKTURA_API_URL}/invoices/send/${invoiceId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      console.log("✅ SuperFaktúra: Faktúra odoslaná emailom:", invoiceId);
    } else {
      const errorText = await response.text();
      console.warn("⚠️ SuperFaktúra: Problém pri odosielaní faktúry:", errorText.substring(0, 200));
    }
  } catch (error) {
    console.warn("⚠️ SuperFaktúra: Problém pri odosielaní faktúry emailom:", error);
  }
}

// Stiahnuť PDF faktúru
export async function downloadInvoicePDF(invoiceId: string): Promise<Buffer> {
  try {
    // V sandbox móde môže PDF download zlyhať - logujeme a pokračujeme
    const isSandbox = isSandboxMode();
    const pdfUrl = `${SUPERFAKTURA_API_URL}/invoices/pdf/${invoiceId}/lang/slo`;
    
    console.log("📄 SuperFaktúra: Sťahujem PDF faktúru");
    console.log("   - Invoice ID:", invoiceId);
    console.log("   - URL:", pdfUrl);
    console.log("   - Mode:", isSandbox ? "SANDBOX" : "PRODUCTION");
    console.log("   - SUPERFAKTURA_SANDBOX value:", process.env.SUPERFAKTURA_SANDBOX);
    
    const response = await fetch(pdfUrl, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    console.log("   - Response status:", response.status);
    console.log("   - Content-Type:", response.headers.get("content-type"));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ SuperFaktúra: Chyba pri sťahovaní PDF:", response.status);
      console.error("   - Error response:", errorText.substring(0, 300));
      
      // V sandbox mode môže PDF download nefungovať - to je OK
      if (isSandbox) {
        console.warn("⚠️ SuperFaktúra Sandbox: PDF download nie je podporovaný, preskakujem prílohu");
        throw new Error("PDF download not supported in sandbox mode");
      }
      
      throw new Error(`Failed to download PDF: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && !contentType.includes("pdf")) {
      console.warn("⚠️ SuperFaktúra: Odpoveď nie je PDF, ale:", contentType);
      const text = await response.text();
      console.error("   - Response text:", text.substring(0, 300));
      throw new Error("Response is not a PDF");
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log("✅ SuperFaktúra: PDF faktúra stiahnutá, veľkosť:", buffer.length, "bytes");
    return buffer;
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

    if (response.ok) {
      const data = await response.json();
      console.log("✅ SuperFaktúra: Pripojenie úspešné", data);
      return true;
    } else {
      console.error("❌ SuperFaktúra: Chyba pripojenia", response.status);
      return false;
    }
  } catch (error) {
    console.error("❌ SuperFaktúra: Chyba pri testovaní pripojenia:", error);
    return false;
  }
}

