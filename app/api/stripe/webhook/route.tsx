import Stripe from "stripe";
import { createSuperFakturaInvoice } from "../../../utils/superfaktura";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Ensure Node.js runtime on Vercel (needed for Stripe signature verification)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {})
  : null;

export async function POST(req: Request) {
  console.log("🔔 WEBHOOK CALLED - Stripe event received");
  console.log("🔍 Webhook - STRIPE_SECRET_KEY exists:", !!process.env.STRIPE_SECRET_KEY);
  console.log("🔍 Webhook - STRIPE_WEBHOOK_SECRET exists:", !!process.env.STRIPE_WEBHOOK_SECRET);
  
  if (!stripe) {
    console.error("❌ Stripe not configured - missing STRIPE_SECRET_KEY");
    return new Response("Stripe not configured", { status: 500 });
  }

  const sig = req.headers.get("stripe-signature");
  console.log("🔍 Webhook - Stripe signature exists:", !!sig);

  if (!sig) {
    console.error("❌ Missing Stripe signature");
    return new Response("Missing Stripe signature", { status: 400 });
  }

  let rawBody: string;

  try {
    rawBody = await req.text();
  } catch {
    return new Response("Failed to read request body", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    console.log("🔍 Webhook - Attempting to construct event...");
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log("✅ Webhook - Event constructed successfully, type:", event.type);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ Webhook error:", message);
    console.error("🧪 Raw headers: content-type=", req.headers.get('content-type'));
    console.error("🧪 Raw headers: stripe-signature=", sig);
    console.error("🧪 Raw body length:", rawBody.length);
    console.error("🧪 Raw body preview:", rawBody.substring(0, 200));
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  console.log(`🔔 Processing event: ${event.type}`);
  
  // Handle different event types
  switch (event.type) {
    case "payment_intent.succeeded":
      let paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("📋 Order ID from event:", paymentIntent.metadata?.orderId);
      console.log("💳 Payment method:", paymentIntent.metadata?.paymentMethod);
      
      // Načítaj plný PaymentIntent pre kompletné metadáta
      try {
        paymentIntent = await (stripe as Stripe).paymentIntents.retrieve(paymentIntent.id);
        console.log("📋 Order ID after retrieve:", paymentIntent.metadata?.orderId);
      } catch (e) {
        console.warn("⚠️ Failed to retrieve full PaymentIntent:", e);
      }
      
      let chargeEmail: string | null | undefined = undefined;
      try {
        if (paymentIntent.latest_charge && typeof paymentIntent.latest_charge === "string") {
          const charge = await (stripe as Stripe).charges.retrieve(paymentIntent.latest_charge);
          chargeEmail = charge.billing_details?.email;
        }
      } catch (e) {
        console.warn("⚠️ Unable to retrieve charge for email:", e);
      }

      // Vytvor SuperFaktúru faktúru (len pri online platbe)
      try {
        await createSuperFakturaInvoice(paymentIntent, chargeEmail);
      } catch (error) {
        console.error("❌ SuperFaktura invoice creation failed:", error);
      }
      break;

    case "payment_intent.payment_failed":
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      console.log("❌ Payment failed:", failedPayment.id);
      console.log("💸 Amount:", failedPayment.amount, failedPayment.currency);
      console.log("📋 Order ID:", failedPayment.metadata?.orderId);
      break;

    case "payment_intent.canceled":
      const canceledPayment = event.data.object as Stripe.PaymentIntent;
      console.log("🚫 Payment canceled:", canceledPayment.id);
      console.log("📋 Order ID:", canceledPayment.metadata?.orderId);
      break;

    case "payment_intent.requires_action":
      const actionRequired = event.data.object as Stripe.PaymentIntent;
      console.log("⚠️ Payment requires action:", actionRequired.id);
      console.log("📋 Order ID:", actionRequired.metadata?.orderId);
      break;

    // removed charge.succeeded to avoid double-processing

    case "charge.failed":
      const failedCharge = event.data.object as Stripe.Charge;
      console.log("❌ Charge failed:", failedCharge.id);
      console.log("💸 Amount:", failedCharge.amount, failedCharge.currency);
      break;

    case "customer.created":
      const customer = event.data.object as Stripe.Customer;
      console.log("👤 New customer created:", customer.id);
      console.log("📧 Email:", customer.email);
      break;

    case "customer.updated":
      const updatedCustomer = event.data.object as Stripe.Customer;
      console.log("👤 Customer updated:", updatedCustomer.id);
      break;

    default:
      console.log(`🔔 Unhandled event type: ${event.type}`);
  }

  return new Response("ok", { status: 200 });
}
