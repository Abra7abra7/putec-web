import { Resend } from 'resend';
import { render } from '@react-email/render';
import { getLocalization } from "./getLocalization";
import { Product } from "../../types/Product";
import { downloadInvoicePDF } from "./superFakturaApi";
import fs from 'fs';
import path from 'path';
import OrderConfirmationAdmin from '../emails/OrderConfirmationAdmin';
import OrderConfirmationCustomer from '../emails/OrderConfirmationCustomer';

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

// ----- Send Email -----

export async function sendEmail({
  to,
  subject,
  html,
  text,
  attachments,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    cid?: string;
  }>;
}) {
  try {
    console.log("📧 Attempting to send email to:", to);
    console.log("📧 From email:", process.env.RESEND_FROM_EMAIL);
    console.log("📧 Subject:", subject);
    console.log("📧 Has HTML:", !!html);
    console.log("📧 Has attachments:", !!attachments?.length);
    console.log("📧 Resend API Key exists:", !!process.env.RESEND_API_KEY);
    
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Load logo as inline attachment
    const logoPath = path.join(process.cwd(), 'public', 'putec-logo.jpg');
    const logoBuffer = fs.readFileSync(logoPath);
    
    const allAttachments = [
      {
        filename: 'putec-logo.jpg',
        content: logoBuffer,
        cid: 'logo', // Content-ID for inline reference
      },
      ...(attachments || []),
    ];

    console.log("📧 Including inline logo attachment with CID: logo");
    console.log("📧 Total attachments:", allAttachments.length);

    // Build email data with only defined properties
    const emailData: {
      from: string;
      to: string;
      subject: string;
      html?: string;
      text?: string;
      attachments: Array<{ filename: string; content: Buffer; cid?: string }>;
    } = {
      from: process.env.RESEND_FROM_EMAIL!,
      to,
      subject,
      attachments: allAttachments,
    };

    // Add html or text if provided
    if (html) {
      emailData.html = html;
    }
    if (text) {
      emailData.text = text;
    }

    // Type assertion needed because Resend's types are overly strict
    const result = await resend.emails.send(emailData as Parameters<typeof resend.emails.send>[0]);

    console.log("✅ Email sent successfully to:", to, "ID:", result.data?.id);
    console.log("✅ Full result:", JSON.stringify(result, null, 2));
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

export async function sendAdminEmail(body: OrderBody) {
  const { subtotal } = formatOrderSummary(body.cartItems);
  const shippingCost = body.shippingMethod.price;
  const total = subtotal + shippingCost;

  const localization = await getLocalization();
  const paymentMethodName = localization.labels[body.paymentMethodId as keyof typeof localization.labels] || body.paymentMethodId;

  // Render React Email component to HTML
  const html = await render(
    OrderConfirmationAdmin({
      orderId: body.orderId,
      orderDate: body.orderDate,
      customerName: `${body.shippingForm.firstName} ${body.shippingForm.lastName}`,
      customerEmail: body.shippingForm.email,
      customerPhone: body.shippingForm.phone,
      shippingAddress: body.shippingForm,
      billingAddress: body.billingForm,
      cartItems: body.cartItems,
      subtotal,
      shippingCost,
      total,
      shippingMethod: body.shippingMethod.name,
      paymentMethod: paymentMethodName,
    })
  );

  await sendEmail({
    to: process.env.ADMIN_EMAIL!,
    subject: `Nová objednávka ${body.orderId}`,
    html,
  });
}

// ----- Customer Email -----

export async function sendCustomerEmail(body: OrderBody, invoiceId?: string) {
  const { subtotal } = formatOrderSummary(body.cartItems);
  const shippingCost = body.shippingMethod.price;
  const total = subtotal + shippingCost;

  const localization = await getLocalization();
  const paymentMethodName = localization.labels[body.paymentMethodId as keyof typeof localization.labels] || body.paymentMethodId;

  // Render React Email component to HTML
  const html = await render(
    OrderConfirmationCustomer({
      orderId: body.orderId,
      orderDate: body.orderDate,
      customerName: `${body.shippingForm.firstName} ${body.shippingForm.lastName}`,
      cartItems: body.cartItems,
      subtotal,
      shippingCost,
      total,
      shippingMethod: body.shippingMethod.name,
      paymentMethod: paymentMethodName,
    })
  );

  // Try to attach PDF invoice if SuperFaktura is configured and invoiceId is provided
  let attachments: Array<{ filename: string; content: Buffer }> | undefined;
  
  if (invoiceId && process.env.SUPERFAKTURA_API_KEY) {
    try {
      const pdfBuffer = await downloadInvoicePDF(invoiceId);
      attachments = [
        {
          filename: `Faktura-${body.orderId}.pdf`,
          content: pdfBuffer,
        },
      ];
      console.log("✅ PDF faktúra pripojená k zákazníckemu emailu");
    } catch (error) {
      console.error("⚠️ Nepodarilo sa pripojiť PDF faktúru k emailu:", error);
      // Continue without attachment - don't fail the email
    }
  }

  await sendEmail({
    to: body.shippingForm.email,
    subject: (await getLocalization()).labels.orderConfirmationTitle || "Potvrdenie objednávky",
    html,
    attachments,
  });
}
