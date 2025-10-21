import { Resend } from 'resend';
import { getLocalization } from "./getLocalization";
import { Product } from "../../types/Product";

// ----- Interfaces -----

export interface Address {
  firstName: string;
  lastName: string;
  country: string;
  state: string;
  city: string;
  address1: string;
  address2: string;
  postalCode: string;
  phone: string;
  email: string;
  isCompany?: boolean;
  companyName?: string;
  companyICO?: string;
  companyDIC?: string;
  companyICDPH?: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  currency: string;
}

export interface OrderCartItem extends Product {
  quantity: number;
}

export interface OrderBody {
  orderId: string,
  orderDate: string;
  cartItems: OrderCartItem[];
  shippingForm: Address;
  billingForm: Address;
  shippingMethod: ShippingMethod;
  paymentMethodId: string;
}

// ----- Send Email with Rate Limiting -----

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  try {
    console.log("📧 Attempting to send email to:", to);
    console.log("📧 From email: onboarding@resend.dev");
    console.log("📧 Subject:", subject);
    console.log("📧 Resend API Key exists:", !!process.env.RESEND_API_KEY);
    
    const resend = new Resend(process.env.RESEND_API_KEY);

    const result = await resend.emails.send({
      from: "Vino Pútec <onboarding@resend.dev>",
      to,
      subject,
      text,
    });

    console.log("✅ Email sent successfully to:", to, "ID:", result.data?.id);
    
    // Check for errors in response
    if (result.error) {
      console.error("❌ Resend API Error:", result.error);
      throw new Error(`Resend API Error: ${result.error.message}`);
    }
    
    return result;
  } catch (error) {
    console.error("❌ Failed to send email to:", to);
    console.error("❌ Error details:", JSON.stringify(error, null, 2));
    console.error("❌ Error message:", error instanceof Error ? error.message : 'Unknown error');
    throw error; // Re-throw error so calling functions know it failed
  }
}

// ----- Format Order Summary -----

export function formatOrderSummary(cartItems: OrderCartItem[]): {
  lines: string;
  subtotal: number;
} {
  const lines = cartItems
    .map(
      (item) =>
        `- ${item.Title} × ${item.quantity} = €${(
          parseFloat(item.SalePrice || item.RegularPrice) * item.quantity
        ).toFixed(2)}`
    )
    .join("\n");

  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc + item.quantity * parseFloat(item.SalePrice || item.RegularPrice),
    0
  );

  return { lines, subtotal };
}

// ----- Admin Email -----

export function generateAdminEmail(
  body: OrderBody,
  summary: string,
  subtotal: number,
  shipping: number,
  total: number
): string {
  return `Nová objednávka

Číslo objednávky: ${body.orderId}
Dátum objednávky: ${body.orderDate}
Zákazník: ${body.shippingForm.firstName} ${body.shippingForm.lastName}
Email: ${body.shippingForm.email}
Telefón: ${body.shippingForm.phone}

Dodacia adresa:
${body.shippingForm.address1}
${body.shippingForm.address2}
${body.shippingForm.city}, ${body.shippingForm.state}, ${body.shippingForm.country} ${body.shippingForm.postalCode}

Fakturačné údaje:
${body.billingForm.firstName} ${body.billingForm.lastName}
${body.billingForm.address1}
${body.billingForm.address2}
${body.billingForm.city}, ${body.billingForm.state}, ${body.billingForm.country} ${body.billingForm.postalCode}
${body.billingForm.isCompany ? `\nFirma: ${body.billingForm.companyName}\nICO: ${body.billingForm.companyICO || ''}\nDIC: ${body.billingForm.companyDIC || ''}\nIC DPH: ${body.billingForm.companyICDPH || ''}` : ''}

Spôsob doručenia: ${body.shippingMethod.name}
Spôsob platby: ${body.paymentMethodId.toUpperCase()}

Súhrn objednávky:
${summary}

Medzisúčet: €${subtotal.toFixed(2)}
Doprava: €${shipping.toFixed(2)}
Celkom: €${total.toFixed(2)}

Dátum: ${new Date().toLocaleString()}
`;
}

// ----- Customer Email -----

export async function generateCustomerEmail(
  body: OrderBody,
  summary: string,
  total: number
): Promise<string> {
  const { labels, siteName } = await getLocalization();
  return `Dobrý deň ${body.shippingForm.firstName},

${labels.orderConfirmationMessage || "Vaša objednávka bola úspešne odoslaná. Oznámime vám, keď ju spracujeme."}

Číslo objednávky: ${body.orderId}
Dátum objednávky: ${body.orderDate}
Spôsob doručenia: ${body.shippingMethod.name}
Spôsob platby: ${body.paymentMethodId.toUpperCase()}

Dodacia adresa:
${body.shippingForm.address1}
${body.shippingForm.address2}
${body.shippingForm.city}, ${body.shippingForm.state}, ${body.shippingForm.country} ${body.shippingForm.postalCode}

Súhrn objednávky:
${summary}

Fakturačné údaje:
${body.billingForm.firstName} ${body.billingForm.lastName}
${body.billingForm.address1}
${body.billingForm.address2}
${body.billingForm.city}, ${body.billingForm.state}, ${body.billingForm.country} ${body.billingForm.postalCode}
${body.billingForm.isCompany ? `\nFirma: ${body.billingForm.companyName}\nICO: ${body.billingForm.companyICO || ''}\nDIC: ${body.billingForm.companyDIC || ''}\nIC DPH: ${body.billingForm.companyICDPH || ''}` : ''}

Celkom: €${total.toFixed(2)}

Ďakujeme za nákup!
${siteName || "Vino Putec"}
`;
}

// ----- Send Admin Email -----

export async function sendAdminEmail(body: OrderBody) {
  const { lines, subtotal } = formatOrderSummary(body.cartItems);
  const shipping = body.shippingMethod?.price || 0;
  const total = subtotal + shipping;

  const text = generateAdminEmail(body, lines, subtotal, shipping, total);
  const subject = `🛒 Nová objednávka od ${body.shippingForm.firstName} ${body.shippingForm.lastName}`;

  await sendEmail({
    to: process.env.ADMIN_EMAIL!,
    subject,
    text,
  });
}

// ----- Send Customer Email -----

export async function sendCustomerEmail(body: OrderBody) {
  const { lines, subtotal } = formatOrderSummary(body.cartItems);
  const shipping = body.shippingMethod?.price || 0;
  const total = subtotal + shipping;

  const [text, localization] = await Promise.all([
    generateCustomerEmail(body, lines, total),
    getLocalization(),
  ]);
  
  const subject = localization.labels.orderConfirmationTitle || "Potvrdenie objednávky";

  await sendEmail({
    to: body.shippingForm.email,
    subject,
    text,
  });
}
