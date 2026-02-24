import { Resend } from 'resend';
import { render } from '@react-email/render';
import { getLocalization } from "./getLocalization";
import { downloadInvoicePDF } from "./superFakturaApi";
import { OrderBody, OrderCartItem, Address, ShippingMethod } from "../../types/Order";
import OrderConfirmationAdmin from '../emails/OrderConfirmationAdmin';
import OrderConfirmationCustomer from '../emails/OrderConfirmationCustomer';
import React from 'react';

// ----- Interfaces moved to types/Order.ts -----

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

    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set");
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Build email data
    const emailData: any = {
      from: process.env.RESEND_FROM_EMAIL!,
      to,
      subject,
      attachments: attachments || [],
    };

    if (html) emailData.html = html;
    if (text) emailData.text = text;

    const { data, error } = await resend.emails.send(emailData);

    if (error) {
      console.error("❌ Resend API Error:", JSON.stringify(error, null, 2));
      throw new Error(`Resend error: ${error.message}`);
    }

    console.log("✅ Email sent successfully to:", to, "ID:", data?.id);
    return { data, error: null };
  } catch (error) {
    console.error("❌ Failed to send email to:", to);
    console.error("❌ Error details:", error instanceof Error ? error.message : String(error));
    throw error;
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

export async function sendAdminEmail(body: OrderBody, locale: string = 'sk') {
  const { subtotal } = formatOrderSummary(body.cartItems);
  const shippingCost = body.shippingMethod.price;
  const codFee = body.codFee || 0;
  const total = subtotal + shippingCost + codFee;

  const localization = await getLocalization(locale);
  const paymentMethodName = body.paymentMethodId === 'cod'
    ? localization.labels.checkout.paymentCod
    : body.paymentMethodId === 'pickup'
      ? localization.labels.checkout.paymentPickup
      : body.paymentMethodId === 'stripe'
        ? localization.labels.checkout.paymentStripe
        : body.paymentMethodId;

  // Use R2 URL for logo if available
  const r2Url = process.env.NEXT_PUBLIC_R2_URL;
  const logoSrc = r2Url ? `${r2Url}/putec-logo.jpg?v=1` : 'https://vinoputec.sk/putec-logo.jpg';

  // Render React Email component to HTML using JSX
  const html = await render(
    <OrderConfirmationAdmin
      orderId={body.orderId}
      orderDate={body.orderDate}
      customerName={`${body.billingForm.firstName} ${body.billingForm.lastName}`}
      customerEmail={body.billingForm.email}
      customerPhone={body.billingForm.phone}
      shippingAddress={body.shippingForm}
      billingAddress={body.billingForm}
      cartItems={body.cartItems}
      subtotal={subtotal}
      shippingCost={shippingCost}
      total={total}
      shippingMethod={body.shippingMethod.name}
      paymentMethod={paymentMethodName}
      logoSrc={logoSrc}
    />
  );

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn("⚠️ ADMIN_EMAIL not set. Skipping admin email.");
    return;
  }

  try {
    await sendEmail({
      to: adminEmail,
      subject: `Nová objednávka ${body.orderId}`,
      html,
    });
  } catch (error) {
    console.error(`❌ Failed to send admin email:`, error);
  }
}

// ----- Customer Email -----

export async function sendCustomerEmail(body: OrderBody, invoiceId?: string, locale: string = 'sk') {
  const { subtotal } = formatOrderSummary(body.cartItems);
  const shippingCost = body.shippingMethod.price;
  const codFee = body.codFee || 0;
  const total = subtotal + shippingCost + codFee;

  const localization = await getLocalization(locale);
  const paymentMethodName = body.paymentMethodId === 'cod'
    ? localization.labels.checkout.paymentCod
    : body.paymentMethodId === 'pickup'
      ? localization.labels.checkout.paymentPickup
      : body.paymentMethodId === 'stripe'
        ? localization.labels.checkout.paymentStripe
        : body.paymentMethodId;

  // Use R2 URL for logo if available
  const r2Url = process.env.NEXT_PUBLIC_R2_URL;
  const logoSrc = r2Url ? `${r2Url}/putec-logo.jpg?v=1` : 'https://vinoputec.sk/putec-logo.jpg';

  // Render React Email component to HTML using JSX
  const html = await render(
    <OrderConfirmationCustomer
      orderId={body.orderId}
      orderDate={body.orderDate}
      customerName={`${body.billingForm.firstName} ${body.billingForm.lastName}`}
      cartItems={body.cartItems.map(item => ({
        ...item,
        Slug: item.Slug || item.ID
      }))}
      subtotal={subtotal}
      shippingCost={shippingCost}
      total={total}
      shippingMethod={body.shippingMethod.name}
      paymentMethod={paymentMethodName}
      logoSrc={logoSrc}
    />
  );

  let attachments: any[] | undefined;

  if (invoiceId) {
    try {
      const pdfBuffer = await downloadInvoicePDF(invoiceId);
      attachments = [
        {
          filename: `Faktura-${body.orderId}.pdf`,
          content: pdfBuffer,
        },
      ];
      console.log("✅ PDF faktúra pripojená k emailu pre order:", body.orderId);
    } catch (error) {
      console.warn("⚠️ Nepodarilo sa pripojiť PDF faktúru:", error instanceof Error ? error.message : String(error));
    }
  }

  await sendEmail({
    to: body.billingForm.email,
    subject: localization.labels.orderConfirmationTitle || "Potvrdenie objednávky",
    html,
    attachments,
  });
}
