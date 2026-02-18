import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { getLocalization } from "../../../utils/getLocalization";

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

// Zod validation schemas
const BillingAddressSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  country: z.string(),
  state: z.string().optional(),
  city: z.string(),
  address1: z.string(),
  address2: z.string().optional(),
  postalCode: z.string(),
  phone: z.string().optional(),
  email: z.string().email(),
  isCompany: z.boolean().optional(),
  companyName: z.string().optional(),
  companyICO: z.string().optional(),
  companyDIC: z.string().optional(),
  companyICDPH: z.string().optional(),
});

const CartItemSchema = z.object({
  ID: z.string(),
  Title: z.string(),
  Slug: z.string(),
  RegularPrice: z.string(),
  SalePrice: z.string().optional(),
  quantity: z.number().positive(),
});

const PaymentIntentSchema = z.object({
  amount: z.number().positive().int(),
  currency: z.string().length(3), // EUR, USD, etc.
  orderId: z.string(),
  cartItems: z.array(CartItemSchema).optional(),
  shippingMethodName: z.string(),
  shippingCost: z.number().nonnegative(),
  customerEmail: z.string().email().optional(),
  customerName: z.string().optional(),
  shippingForm: BillingAddressSchema.optional(),
  billingForm: BillingAddressSchema.optional(),
  paymentMethodId: z.string().optional(),
  paymentIntentId: z.string().optional(), // ID existujúceho intentu pre update
  locale: z.string().optional(),
});

/**
 * POST /api/stripe/create-payment-intent
 * Create a Stripe PaymentIntent for checkout
 * 
 * @body PaymentIntentSchema - Payment intent data
 * @returns clientSecret for Stripe Elements
 */
export async function POST(request: NextRequest) {
  // Check if Stripe is configured
  if (!stripe) {
    console.error("[API Error - Stripe] STRIPE_SECRET_KEY not configured");
    return NextResponse.json(
      { error: "Payment system not configured" },
      { status: 500 }
    );
  }

  try {
    // Parse and validate request body
    const body = await request.json();
    console.log("🔍 create-payment-intent - received request");

    const validationResult = PaymentIntentSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("[API Error - Stripe PaymentIntent] Validation failed:", validationResult.error.issues);
      return NextResponse.json(
        {
          error: "Invalid payment intent data",
          details: validationResult.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const {
      amount,
      currency,
      orderId,
      cartItems = [],
      shippingMethodName,
      shippingCost,
      customerEmail,
      shippingForm,
      billingForm,
      paymentMethodId,
      locale = 'sk', // Default to SK if not provided
      // customerName is available but not used in PaymentIntent creation
    } = validationResult.data;

    console.log("🔍 create-payment-intent - orderId:", orderId);
    console.log("🔍 create-payment-intent - paymentMethodId:", paymentMethodId);

    // Get localization data
    const localization = await getLocalization();
    const siteName = localization.siteName || "Vino Putec";

    // Build metadata for Stripe
    const metadata: Record<string, string> = {
      orderId,
      siteName,
      shippingMethod: shippingMethodName,
      shippingPriceCents: Math.round((shippingCost || 0) * 100).toString(),
      shippingCurrency: currency,
      paymentMethod: paymentMethodId || "stripe",
      locale,
    };

    // Add cart items to metadata
    if (Array.isArray(cartItems) && cartItems.length > 0) {
      cartItems.forEach((item, index) => {
        const unit = parseFloat(item.SalePrice || item.RegularPrice || "0");
        const unitCents = Math.round(unit * 100);

        metadata[`item_${index + 1}_id`] = item.Slug;
        metadata[`item_${index + 1}_title`] = item.Title;
        metadata[`item_${index + 1}_qty`] = item.quantity.toString();
        metadata[`item_${index + 1}_price`] = unit.toString();
        metadata[`item_${index + 1}_price_cents`] = unitCents.toString();
      });
    }

    // Add billing metadata
    if (billingForm) {
      metadata["billing_is_company"] = billingForm.isCompany ? "1" : "0";

      if (billingForm.isCompany) {
        if (billingForm.companyName) metadata["billing_company_name"] = billingForm.companyName;
        if (billingForm.companyICO) metadata["billing_company_ico"] = billingForm.companyICO;
        if (billingForm.companyDIC) metadata["billing_company_dic"] = billingForm.companyDIC;
        if (billingForm.companyICDPH) metadata["billing_company_icdph"] = billingForm.companyICDPH;
      }

      // Add billing address
      metadata["billing_firstName"] = billingForm.firstName;
      metadata["billing_lastName"] = billingForm.lastName;
      metadata["billing_address1"] = billingForm.address1;
      metadata["billing_address2"] = billingForm.address2 || "";
      metadata["billing_city"] = billingForm.city;
      metadata["billing_state"] = billingForm.state || "";
      metadata["billing_postalCode"] = billingForm.postalCode;
      metadata["billing_country"] = billingForm.country;
      metadata["billing_phone"] = billingForm.phone || "";
      metadata["billing_email"] = billingForm.email;
    }

    // Add shipping metadata
    if (shippingForm) {
      metadata["shipping_firstName"] = shippingForm.firstName;
      metadata["shipping_lastName"] = shippingForm.lastName;
      metadata["shipping_address1"] = shippingForm.address1;
      metadata["shipping_address2"] = shippingForm.address2 || "";
      metadata["shipping_city"] = shippingForm.city;
      metadata["shipping_state"] = shippingForm.state || "";
      metadata["shipping_postalCode"] = shippingForm.postalCode;
      metadata["shipping_country"] = shippingForm.country;
      metadata["shipping_phone"] = shippingForm.phone || "";
      metadata["shipping_email"] = shippingForm.email;
      metadata["shipping_is_company"] = shippingForm.isCompany ? "1" : "0";

      if (shippingForm.isCompany) {
        if (shippingForm.companyName) metadata["shipping_company_name"] = shippingForm.companyName;
        if (shippingForm.companyICO) metadata["shipping_company_ico"] = shippingForm.companyICO;
        if (shippingForm.companyDIC) metadata["shipping_company_dic"] = shippingForm.companyDIC;
        if (shippingForm.companyICDPH) metadata["shipping_company_icdph"] = shippingForm.companyICDPH;
      }
    }

    // Create PaymentIntent without customer to avoid Link
    // Customer not needed for one-time payments
    // Check if we can update an existing PaymentIntent
    // ----------------------------------------------------------------
    let paymentIntent: Stripe.PaymentIntent;

    if (validationResult.data.paymentIntentId) {
      try {
        console.log(`🔍 Checking existing PaymentIntent: ${validationResult.data.paymentIntentId}`);
        const existingIntent = await stripe.paymentIntents.retrieve(validationResult.data.paymentIntentId);

        // We can only update if it's not succeeded/canceled/processing
        if (
          existingIntent.status === 'requires_payment_method' ||
          existingIntent.status === 'requires_confirmation' ||
          existingIntent.status === 'requires_action'
        ) {
          console.log(`🔄 Updating existing PaymentIntent: ${existingIntent.id}`);
          paymentIntent = await stripe.paymentIntents.update(existingIntent.id, {
            amount,
            currency: currency.toLowerCase(),
            metadata, // Update metadata just in case items changed
            receipt_email: customerEmail,
          });
        } else {
          console.log(`⚠️ Existing Intent status is ${existingIntent.status}, creating new one.`);
          // Create new if old one is effectively 'done' or invalid state for update
          paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: currency.toLowerCase(),
            description: `${siteName} Order ${orderId}`,
            metadata,
            payment_method_types: ['card'],
            receipt_email: customerEmail,
          });
        }
      } catch (err) {
        console.warn("⚠️ Failed to retrieve/update existing intent, creating new one:", err);
        paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: currency.toLowerCase(),
          description: `${siteName} Order ${orderId}`,
          metadata,
          payment_method_types: ['card'],
          receipt_email: customerEmail,
        });
      }
    } else {
      // Create PaymentIntent
      // ----------------------------------------------------------------
      paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: currency.toLowerCase(),
        description: `${siteName} Order ${orderId}`,
        metadata,
        payment_method_types: ['card'], // Len karty (+ Google/Apple Pay automaticky)
        // Bez customer a setup_future_usage - nebude Link ani možnosť ukladať karty
        receipt_email: customerEmail, // Email na potvrdenie
      });
    }

    console.log("✅ PaymentIntent created successfully:", paymentIntent.id);

    return NextResponse.json(
      {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API Error - Stripe PaymentIntent]", error);

    // Handle Stripe-specific errors
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        {
          error: "Payment processing error",
          message: error.message,
          type: error.type,
        },
        { status: 400 }
      );
    }

    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Generic error
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

