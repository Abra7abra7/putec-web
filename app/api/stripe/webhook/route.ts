import Stripe from "stripe";
import { NextRequest } from "next/server";
import { createSuperFakturaInvoice } from "../../../actions/superfaktura";

/**
 * Webhook configuration
 * - bodyParser disabled: Required for Stripe signature verification
 * - runtime: nodejs - Required for crypto operations
 * - dynamic: force-dynamic - Always server-rendered
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {})
  : null;

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

  // 3. Read raw body
  let rawBody: string;
  try {
    rawBody = await request.text();
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
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("✅ Webhook - Event constructed successfully, type:", event.type);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Webhook Error] Event construction failed:", message);
    console.error("🧪 Raw headers: content-type=", request.headers.get("content-type"));
    console.error("🧪 Raw headers: stripe-signature=", sig);
    console.error("🧪 Raw body length:", rawBody.length);
    console.error("🧪 Raw body preview:", rawBody.substring(0, 200));

    return new Response(
      JSON.stringify({ error: `Webhook Error: ${message}` }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // 5. Process webhook event
  console.log(`🔔 Processing event: ${event.type}`);

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

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

  // Retrieve full PaymentIntent for complete metadata
  let paymentIntent = pi;
  try {
    paymentIntent = await stripe.paymentIntents.retrieve(pi.id);
    console.log("📋 Order ID after retrieve:", paymentIntent.metadata?.orderId);
  } catch (error) {
    console.warn("⚠️ Failed to retrieve full PaymentIntent:", error);
    // Continue with event data
  }

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

  // Create SuperFaktúra invoice (only for online payments via Stripe)
  try {
    await createSuperFakturaInvoice(paymentIntent, chargeEmail);
    console.log("✅ SuperFaktúra invoice created successfully");
  } catch (error) {
    console.error("❌ SuperFaktura invoice creation failed:", error);
    // Don't throw - we still want to acknowledge the webhook
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

