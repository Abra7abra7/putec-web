import Stripe from "stripe";
import { NextRequest } from "next/server";
import { createSuperFakturaInvoice } from "../../../actions/superfaktura";
import { sendAdminEmail, sendCustomerEmail, OrderBody, OrderCartItem } from "../../../utils/emailUtilities";

/**
 * Webhook configuration
 * - runtime: nodejs - Required for crypto operations
 * - dynamic: force-dynamic - Always server-rendered
 * Note: In App Router, we read raw body using request.arrayBuffer()
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Helper function to detect Stripe mode (test vs live)
const getStripeMode = (): 'test' | 'live' | 'unknown' => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return 'unknown';
  if (key.startsWith('sk_test_')) return 'test';
  if (key.startsWith('sk_live_')) return 'live';
  return 'unknown';
};

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {})
  : null;

// Log Stripe mode on initialization
if (stripe) {
  const mode = getStripeMode();
  console.log(`🔍 Stripe - Mode: ${mode.toUpperCase()} (detected from key prefix)`);
}

// In-memory guard to prevent duplicate processing during single server lifetime
const processedOrderIds = new Set<string>();

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retrievePaymentIntentWithRetry(id: string, attempts = 3, delayMs = 400): Promise<Stripe.PaymentIntent | null> {
  if (!stripe) return null;
  let lastError: unknown = null;
  for (let i = 0; i < attempts; i++) {
    try {
      const pi = await stripe.paymentIntents.retrieve(id);
      return pi;
    } catch (e) {
      lastError = e;
      await sleep(delayMs);
    }
  }
  console.warn("⚠️ Failed to retrieve PaymentIntent after retries:", id, lastError);
  return null;
}

/**
 * POST /api/stripe/webhook
 * Handle Stripe webhook events
 * 
 * @body Raw webhook payload from Stripe
 * @headers stripe-signature - Stripe webhook signature
 * @returns Success or error response
 */
export async function POST(request: NextRequest) {
  console.log("🔔 WEBHOOK CALLED - Stripe event received");
  console.log("🔍 Webhook - STRIPE_SECRET_KEY exists:", !!process.env.STRIPE_SECRET_KEY);
  console.log("🔍 Webhook - STRIPE_WEBHOOK_SECRET exists:", !!process.env.STRIPE_WEBHOOK_SECRET);

  // 1. Check if Stripe is configured
  if (!stripe) {
    console.error("[Webhook Error] Stripe not configured - missing STRIPE_SECRET_KEY");
    return new Response(
      JSON.stringify({ error: "Stripe not configured" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // 2. Verify webhook signature
  const sig = request.headers.get("stripe-signature");
  console.log("🔍 Webhook - Stripe signature exists:", !!sig);

  if (!sig) {
    console.error("[Webhook Error] Missing Stripe signature");
    return new Response(
      JSON.stringify({ error: "Missing Stripe signature" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("[Webhook Error] Missing STRIPE_WEBHOOK_SECRET env variable");
    return new Response(
      JSON.stringify({ error: "Webhook secret not configured" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // 3. Read raw body as Buffer (required for Stripe signature verification)
  let rawBody: Buffer;
  try {
    const arrayBuffer = await request.arrayBuffer();
    rawBody = Buffer.from(arrayBuffer);
    console.log("🔍 Webhook - Raw body read successfully, length:", rawBody.length);
  } catch (error) {
    console.error("[Webhook Error] Failed to read request body:", error);
    return new Response(
      JSON.stringify({ error: "Failed to read request body" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // 4. Construct and verify Stripe event
  let event: Stripe.Event;
  try {
    console.log("🔍 Webhook - Attempting to construct event...");
    console.log("🔍 Webhook - Using secret (exists):", !!process.env.STRIPE_WEBHOOK_SECRET);
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log("✅ Webhook - Event constructed successfully, type:", event.type);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Webhook Error] Event construction failed:", message);
    console.error("🧪 Raw headers: content-type=", request.headers.get("content-type"));
    console.error("🧪 Raw headers: stripe-signature=", sig);
    console.error("🧪 Raw body length:", rawBody.length);
    console.error("🧪 Raw body preview:", rawBody.toString('utf8').substring(0, 200));
    console.error("🧪 Webhook secret exists:", !!process.env.STRIPE_WEBHOOK_SECRET);
    console.error("🧪 Webhook secret length:", process.env.STRIPE_WEBHOOK_SECRET?.length);

    // Dev-only bypass to unblock local testing if signature keeps failing
    const allowBypass = process.env.ALLOW_UNVERIFIED_WEBHOOKS === 'true' && process.env.NODE_ENV !== 'production';
    if (allowBypass) {
      try {
        console.warn("⚠️ Bypassing Stripe signature verification (DEV ONLY). Do NOT use in production.");
        const json = JSON.parse(rawBody.toString('utf8'));
        event = json as Stripe.Event;
        console.log("✅ Webhook - Event parsed without verification (DEV BYPASS), type:", event.type);
      } catch (parseErr) {
        console.error("❌ Failed to parse event during dev bypass:", parseErr);
        return new Response(
          JSON.stringify({ error: `Webhook Error: ${message}` }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ error: `Webhook Error: ${message}` }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  // 5. Process webhook event
  console.log(`🔔 Processing event: ${event.type}`);

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      // Fallback: some accounts may see timing anomalies; use charge.succeeded
      // REMOVED to prevent duplicates: listening to payment_intent.succeeded is sufficient
      // case "charge.succeeded":
      //   await handleChargeSucceeded(event.data.object as Stripe.Charge);
      //   break;

      case "payment_intent.payment_failed":
        handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.canceled":
        handlePaymentIntentCanceled(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.requires_action":
        handlePaymentIntentRequiresAction(event.data.object as Stripe.PaymentIntent);
        break;

      case "charge.failed":
        handleChargeFailed(event.data.object as Stripe.Charge);
        break;

      case "customer.created":
        handleCustomerCreated(event.data.object as Stripe.Customer);
        break;

      case "customer.updated":
        handleCustomerUpdated(event.data.object as Stripe.Customer);
        break;

      default:
        console.log(`🔔 Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true, type: event.type }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(`[Webhook Error] Failed to process ${event.type}:`, error);

    // Return 200 to acknowledge receipt, even if processing failed
    // This prevents Stripe from retrying
    return new Response(
      JSON.stringify({
        received: true,
        type: event.type,
        warning: "Event received but processing failed",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

/**
 * Handle payment_intent.succeeded event
 * Creates SuperFaktúra invoice for online payments
 */
async function handlePaymentIntentSucceeded(pi: Stripe.PaymentIntent): Promise<void> {
  if (!stripe) return;

  console.log("💰 Payment succeeded:", pi.id);
  console.log("📋 Order ID from event:", pi.metadata?.orderId);
  console.log("💳 Payment method:", pi.metadata?.paymentMethod);

  // Retrieve full PaymentIntent for complete metadata (retry for eventual consistency)
  const paymentIntent = await retrievePaymentIntentWithRetry(pi.id, 4, 500) || pi;
  console.log("ℹ️ PaymentIntent status:", paymentIntent.status, "amount_received:", paymentIntent.amount_received);
  console.log("ℹ️ Latest charge:", paymentIntent.latest_charge);

  // Validate that funds were received
  if (paymentIntent.status !== "succeeded" || (paymentIntent.amount_received ?? 0) <= 0) {
    console.warn("⚠️ PaymentIntent not finalized yet, skipping invoice for now:", {
      status: paymentIntent.status,
      amount_received: paymentIntent.amount_received
    });
    return;
  }

  await processPaidOrder(paymentIntent);
}

/**
 * Handle charge.succeeded as a fallback path to process paid orders
 */
async function handleChargeSucceeded(charge: Stripe.Charge): Promise<void> {
  if (!stripe) return;
  console.log("💳 Charge succeeded:", charge.id, "paid:", charge.paid, "status:", charge.status);
  const piId = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
  if (!piId) {
    console.warn("⚠️ charge.succeeded without payment_intent id. Skipping.");
    return;
  }
  const paymentIntent = await retrievePaymentIntentWithRetry(piId, 4, 500);
  if (!paymentIntent) return;
  console.log("ℹ️ PI from charge:", paymentIntent.id, "status:", paymentIntent.status, "amount_received:", paymentIntent.amount_received);

  if (paymentIntent.amount_received && paymentIntent.amount_received > 0) {
    await processPaidOrder(paymentIntent);
  } else {
    console.warn("⚠️ charge.succeeded but PaymentIntent has no amount_received. Skipping.");
  }
}

/**
 * Shared path to create invoice and send emails for a paid order
 */
async function processPaidOrder(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  if (!stripe) {
    console.error("❌ Stripe not configured, cannot process order");
    return;
  }

  const metadata = paymentIntent.metadata as Record<string, string>;
  const orderId = metadata.orderId || paymentIntent.id;
  const locale = metadata.locale || 'sk'; // Get locale from metadata

  // Idempotency: In serverless (Vercel), we cannot rely on in-memory Sets (processedOrderIds).
  // We rely on Stripe's strict ordering and our downstream systems (SuperFaktura check) to handle duplicates.
  // Ideally, use a database (Redis/Postgres) to track orderId status.

  // Get charge email if available
  let chargeEmail: string | null | undefined;
  try {
    if (paymentIntent.latest_charge && typeof paymentIntent.latest_charge === "string") {
      const charge = await stripe.charges.retrieve(paymentIntent.latest_charge);
      chargeEmail = charge.billing_details?.email;
      console.log("📧 Charge email:", chargeEmail);
    }
  } catch (error) {
    console.warn("⚠️ Unable to retrieve charge for email:", error);
  }

  // Create SuperFaktúra invoice (best-effort — emails always go out regardless)
  let invoiceId: string | undefined;
  try {
    console.log("🧾 Creating SuperFaktúra invoice for order:", orderId);
    invoiceId = await createSuperFakturaInvoice(paymentIntent, chargeEmail);

    if (!invoiceId) {
      console.warn("⚠️ SuperFaktúra invoice creation returned undefined.");
    } else {
      console.log("✅ SuperFaktúra invoice created successfully, Invoice ID:", invoiceId);
    }
  } catch (error) {
    // Log the error in detail but DO NOT throw — emails must still go out
    console.error("❌ SuperFaktura invoice creation FAILED (emails will still be sent):", error);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown; statusText?: string } };
      console.error("❌ SuperFaktura HTTP response:", {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: JSON.stringify(axiosError.response?.data),
      });
    }
    // invoiceId stays undefined — emails go out without invoice attachment
  }

  // Send emails (Secondary Step)
  // If invoice was created, we try to send emails. 
  // If email sending fails, we currently DO NOT fail the whole webhook (to avoid creating duplicate invoices on retry).
  const customerEmail = chargeEmail || paymentIntent.receipt_email || metadata.billing_email || metadata.shipping_email;

  if (!customerEmail) {
    console.warn("⚠️ No customer email available for sending confirmation emails");
    return;
  }

  try {
    // Build OrderBody from metadata
    // Support new compact JSON format (cart_items, billing, shipping keys)
    // and old per-field format as fallback
    const cartItems: OrderCartItem[] = [];

    // --- Parse cart items ---
    if (metadata.cart_items) {
      // New compact format: single JSON string
      try {
        const parsed = JSON.parse(metadata.cart_items) as Array<{ id: string; title: string; qty: number; price: number }>;
        parsed.forEach(item => {
          cartItems.push({
            ID: item.id || '',
            Title: item.title || '',
            Slug: item.id || '',
            Enabled: true,
            CatalogVisible: true,
            ProductCategories: [],
            ProductImageGallery: [],
            RegularPrice: item.price?.toString() || '0',
            SalePrice: item.price?.toString() || '',
            quantity: item.qty || 1,
            FeatureImageURL: '',
            ShortDescription: '',
            LongDescription: '',
            Currency: 'EUR',
            SubscriptionEnabled: false,
            SubscriptionType: '',
            ProductType: 'wine',
          });
        });
      } catch {
        console.warn('⚠️ Failed to parse cart_items JSON from metadata');
      }
    } else {
      // Old format: item_1_id, item_1_title, etc.
      const indices = new Set<number>();
      Object.keys(metadata).forEach(k => {
        const m = k.match(/^item_(\d+)_/);
        if (m) indices.add(parseInt(m[1], 10));
      });
      indices.forEach(i => {
        cartItems.push({
          ID: metadata[`item_${i}_id`] || '',
          Title: metadata[`item_${i}_title`] || '',
          Slug: metadata[`item_${i}_id`] || '',
          Enabled: true,
          CatalogVisible: true,
          ProductCategories: [],
          ProductImageGallery: [],
          RegularPrice: metadata[`item_${i}_price`] || '0',
          SalePrice: metadata[`item_${i}_price`] || '',
          quantity: parseInt(metadata[`item_${i}_qty`] || '1', 10),
          FeatureImageURL: '',
          ShortDescription: '',
          LongDescription: '',
          Currency: 'EUR',
          SubscriptionEnabled: false,
          SubscriptionType: '',
          ProductType: 'wine',
        });
      });
    }

    // --- Parse shipping form ---
    let shippingParsed: Record<string, string> = {};
    if (metadata.shipping) {
      try { shippingParsed = JSON.parse(metadata.shipping); } catch { /* ignore */ }
    }
    const shippingFirstName = shippingParsed.fn || metadata.shipping_firstName || '';
    const shippingLastName = shippingParsed.ln || metadata.shipping_lastName || '';
    const shippingEmail = shippingParsed.email || metadata.shipping_email || customerEmail || '';
    const shippingPhone = shippingParsed.phone || metadata.shipping_phone || '';
    const shippingAddr = shippingParsed.addr || metadata.shipping_address1 || '';
    const shippingCity = shippingParsed.city || metadata.shipping_city || '';
    const shippingZip = shippingParsed.zip || metadata.shipping_postalCode || '';
    const shippingCountry = shippingParsed.country || metadata.shipping_country || '';
    const shippingIsCompany = shippingParsed.company === '1' || metadata.shipping_is_company === '1';

    // --- Parse billing form ---
    let billingParsed: Record<string, string> = {};
    if (metadata.billing) {
      try { billingParsed = JSON.parse(metadata.billing); } catch { /* ignore */ }
    }
    const billingFirstName = billingParsed.fn || metadata.billing_firstName || shippingFirstName;
    const billingLastName = billingParsed.ln || metadata.billing_lastName || shippingLastName;
    const billingEmail = billingParsed.email || metadata.billing_email || shippingEmail;
    const billingPhone = billingParsed.phone || metadata.billing_phone || shippingPhone;
    const billingAddr = billingParsed.addr || metadata.billing_address1 || shippingAddr;
    const billingCity = billingParsed.city || metadata.billing_city || shippingCity;
    const billingZip = billingParsed.zip || metadata.billing_postalCode || shippingZip;
    const billingCountry = billingParsed.country || metadata.billing_country || shippingCountry;
    const billingIsCompany = billingParsed.company === '1' || metadata.billing_is_company === '1';

    const orderBody: OrderBody = {
      orderId: metadata.orderId || paymentIntent.id,
      orderDate: new Date().toISOString(),
      cartItems,
      shippingForm: {
        firstName: shippingFirstName,
        lastName: shippingLastName,
        country: shippingCountry,
        state: shippingParsed.state || metadata.shipping_state || '',
        city: shippingCity,
        address1: shippingAddr,
        address2: shippingParsed.addr2 || metadata.shipping_address2 || '',
        postalCode: shippingZip,
        phone: shippingPhone,
        email: shippingEmail,
        isCompany: shippingIsCompany,
        companyName: shippingParsed.cname || metadata.shipping_company_name,
        companyICO: shippingParsed.ico || metadata.shipping_company_ico,
        companyDIC: shippingParsed.dic || metadata.shipping_company_dic,
        companyICDPH: metadata.shipping_company_icdph,
      },
      billingForm: {
        firstName: billingFirstName,
        lastName: billingLastName,
        country: billingCountry,
        state: billingParsed.state || metadata.billing_state || '',
        city: billingCity,
        address1: billingAddr,
        address2: billingParsed.addr2 || metadata.billing_address2 || '',
        postalCode: billingZip,
        phone: billingPhone,
        email: billingEmail,
        isCompany: billingIsCompany,
        companyName: billingParsed.cname || metadata.billing_company_name,
        companyICO: billingParsed.ico || metadata.billing_company_ico,
        companyDIC: billingParsed.dic || metadata.billing_company_dic,
        companyICDPH: metadata.billing_company_icdph,
      },
      shippingMethod: {
        id: 'stripe',
        name: metadata.shippingMethod || 'Doprava',
        price: parseFloat(metadata.shippingPriceCents || '0') / 100,
        currency: metadata.shippingCurrency || 'EUR',
      },
      paymentMethodId: 'stripe',
    };

    // Send customer email
    try {
      await sendCustomerEmail(orderBody, invoiceId, locale);
      console.log("✅ Customer email sent");
    } catch (error) {
      console.error("❌ Failed to send customer email:", error);
    }

    // Send admin email
    try {
      await sendAdminEmail(orderBody, locale);
      console.log("✅ Admin email sent");
    } catch (error) {
      console.error("❌ Failed to send admin email:", error);
    }

  } catch (error) {
    console.error("❌ Failed to prepare/send order emails:", error);
    // We do NOT throw here, because invoice is already created. 
    // Retrying would duplicate invoices.
  }
}

/**
 * Handle payment_intent.payment_failed event
 */
function handlePaymentIntentFailed(pi: Stripe.PaymentIntent): void {
  console.log("❌ Payment failed:", pi.id);
  console.log("💸 Amount:", pi.amount, pi.currency);
  console.log("📋 Order ID:", pi.metadata?.orderId);
  console.log("🔴 Last payment error:", pi.last_payment_error?.message);

  // TODO: Send failure notification email to customer?
  // TODO: Update order status in database?
}

/**
 * Handle payment_intent.canceled event
 */
function handlePaymentIntentCanceled(pi: Stripe.PaymentIntent): void {
  console.log("🚫 Payment canceled:", pi.id);
  console.log("📋 Order ID:", pi.metadata?.orderId);
  console.log("💸 Amount:", pi.amount, pi.currency);

  // TODO: Update order status in database?
}

/**
 * Handle payment_intent.requires_action event
 */
function handlePaymentIntentRequiresAction(pi: Stripe.PaymentIntent): void {
  console.log("⚠️ Payment requires action:", pi.id);
  console.log("📋 Order ID:", pi.metadata?.orderId);
  console.log("🔐 Next action:", pi.next_action?.type);

  // This is usually for 3D Secure authentication
  // No action needed - customer will complete authentication
}

/**
 * Handle charge.failed event
 */
function handleChargeFailed(charge: Stripe.Charge): void {
  console.log("❌ Charge failed:", charge.id);
  console.log("💸 Amount:", charge.amount, charge.currency);
  console.log("🔴 Failure code:", charge.failure_code);
  console.log("🔴 Failure message:", charge.failure_message);

  // TODO: Send failure notification?
}

/**
 * Handle customer.created event
 */
function handleCustomerCreated(customer: Stripe.Customer): void {
  console.log("👤 New customer created:", customer.id);
  console.log("📧 Email:", customer.email);
  console.log("👤 Name:", customer.name);

  // TODO: Store customer ID in database?
}

/**
 * Handle customer.updated event
 */
function handleCustomerUpdated(customer: Stripe.Customer): void {
  console.log("👤 Customer updated:", customer.id);
  console.log("📧 Email:", customer.email);

  // TODO: Update customer data in database?
}

