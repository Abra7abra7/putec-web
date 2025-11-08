import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { sendEmail } from "../../../utils/emailUtilities";

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {})
  : null;

// Zod validation schema
const InvoiceRequestSchema = z.object({
  orderId: z.string().optional(),
  paymentIntentId: z.string().optional(),
}).refine(
  (data) => data.orderId || data.paymentIntentId,
  {
    message: "Either orderId or paymentIntentId must be provided",
  }
);

/**
 * Ensure Stripe customer exists by email
 */
async function ensureCustomerByEmail(
  email?: string | null,
  name?: string | null
): Promise<Stripe.Customer | null> {
  if (!stripe || !email) return null;

  try {
    const existing = await stripe.customers.search({
      query: `email:'${email}'`,
      limit: 1,
    });

    if (existing.data.length > 0) {
      return existing.data[0];
    }

    return await stripe.customers.create({
      email: email || undefined,
      name: name || undefined,
    });
  } catch (error) {
    console.error("❌ Failed to ensure customer:", error);
    return null;
  }
}

/**
 * Create Stripe invoice from PaymentIntent if not already created
 */
async function createInvoiceIfMissing(
  pi: Stripe.PaymentIntent,
  chargeEmail?: string | null
): Promise<{
  status: "error" | "no_customer" | "invoiced" | "exists" | "created";
  invoiceId?: string;
  error?: string;
}> {
  if (!stripe) {
    return { status: "error", error: "Stripe not configured" };
  }

  const md = (pi.metadata || {}) as Record<string, string>;
  const orderId = md.orderId || "N/A";
  let customerId = typeof pi.customer === "string" ? pi.customer : pi.customer?.id;
  const email = md["billing_email"] || pi.receipt_email || chargeEmail || undefined;

  // 1. Ensure customer exists
  if (!customerId) {
    const customer = await ensureCustomerByEmail(email, undefined);
    if (!customer) {
      return { status: "no_customer", error: "Failed to create customer" };
    }
    customerId = customer.id;
  }

  // 2. Check idempotency: if already invoiced, skip
  const piMetadata = (pi.metadata ?? {}) as Record<string, string | undefined>;
  if (piMetadata.invoiced === "1") {
    console.log("✅ Invoice already created (metadata flag)");
    return { status: "invoiced" };
  }

  // 3. Check if invoice already exists
  try {
    const existing = await stripe.invoices.search({
      query: `metadata['orderId']:'${orderId}'`,
      limit: 1,
    });

    if (existing.data.length > 0) {
      console.log("✅ Invoice already exists:", existing.data[0].id);
      return { status: "exists", invoiceId: existing.data[0].id };
    }
  } catch (error) {
    console.error("⚠️ Failed to check existing invoices:", error);
    // Continue anyway - we'll create a new one
  }

  // 4. Update customer with billing/shipping info
  try {
    await stripe.customers.update(customerId, {
      preferred_locales: ["sk", "sk-SK"],
      email,
      name: md["billing_firstName"] || md["billing_lastName"]
        ? `${md["billing_firstName"] || ""} ${md["billing_lastName"] || ""}`.trim()
        : undefined,
      address: {
        line1: md["billing_address1"] || undefined,
        line2: md["billing_address2"] || undefined,
        city: md["billing_city"] || undefined,
        state: md["billing_state"] || undefined,
        postal_code: md["billing_postalCode"] || undefined,
        country: md["billing_country"] || undefined,
      },
      shipping: {
        name: `${md["shipping_firstName"] || ""} ${md["shipping_lastName"] || ""}`.trim(),
        address: {
          line1: md["shipping_address1"] || undefined,
          line2: md["shipping_address2"] || undefined,
          city: md["shipping_city"] || undefined,
          state: md["shipping_state"] || undefined,
          postal_code: md["shipping_postalCode"] || undefined,
          country: md["shipping_country"] || undefined,
        },
      },
      metadata: {
        ico: md["billing_company_ico"] || "",
        dic: md["billing_company_dic"] || "",
        ic_dph: md["billing_company_icdph"] || "",
        company_name: md["billing_company_name"] || "",
      },
    });
    console.log("✅ Customer updated with billing/shipping info");
  } catch (error) {
    console.error("⚠️ Failed to update customer:", error);
    // Continue anyway
  }

  // 5. Attach payment method to customer
  let defaultPm: string | undefined;
  if (typeof pi.payment_method === "string") {
    defaultPm = pi.payment_method;
  } else if (pi.latest_charge && typeof pi.latest_charge === "string") {
    try {
      const ch = await stripe.charges.retrieve(pi.latest_charge);
      if (typeof ch.payment_method === "string") {
        defaultPm = ch.payment_method;
      }
    } catch (error) {
      console.error("⚠️ Failed to retrieve charge payment method:", error);
    }
  }

  if (defaultPm) {
    try {
      await stripe.paymentMethods.attach(defaultPm, { customer: customerId });
      console.log("✅ Payment method attached to customer");
    } catch (error) {
      console.error("⚠️ Failed to attach payment method:", error);
      // Already attached or error - continue
    }
  }

  // 6. Clean pending invoice items for this order
  try {
    const pending = await stripe.invoiceItems.list({
      customer: customerId,
      limit: 100,
    });

    for (const ii of pending.data) {
      const desc = (ii.description ?? undefined) as string | undefined;
      if (!ii.invoice && desc && desc.includes(`[${orderId}]`)) {
        await stripe.invoiceItems.del(ii.id);
      }
    }
    console.log("✅ Cleaned pending invoice items");
  } catch (error) {
    console.error("⚠️ Failed to clean pending items:", error);
    // Continue anyway
  }

  // 7. Create invoice items from metadata
  const currency = pi.currency;
  const indices = new Set<number>();

  Object.keys(md).forEach((k) => {
    const m = k.match(/^item_(\d+)_/);
    if (m) indices.add(parseInt(m[1], 10));
  });

  for (const i of Array.from(indices).sort((a, b) => a - b)) {
    const title = md[`item_${i}_title`] || `Položka ${i}`;
    const qty = parseInt(md[`item_${i}_qty`] || "1", 10) || 1;
    const unitCents =
      parseInt(md[`item_${i}_price_cents`] || "0", 10) ||
      Math.round(parseFloat(md[`item_${i}_price`] || "0") * 100);
    const amount = unitCents * qty;

    if (amount > 0) {
      await stripe.invoiceItems.create({
        customer: customerId,
        amount,
        currency,
        description: `[${orderId}] ${title} × ${qty}`,
      });
    }
  }

  // Add shipping item
  const shippingCents = parseInt(md["shippingPriceCents"] || "0", 10) || 0;
  if (shippingCents > 0) {
    await stripe.invoiceItems.create({
      customer: customerId,
      amount: shippingCents,
      currency,
      description: `[${orderId}] Doprava: ${md["shippingMethod"] || ""}`.trim(),
    });
  }

  console.log("✅ Invoice items created");

  // 8. Create and finalize invoice
  const invoice: Stripe.Invoice = await stripe.invoices.create({
    customer: customerId,
    auto_advance: true,
    collection_method: "charge_automatically",
    description: `Objednávka ${orderId}`,
    metadata: { orderId },
    default_payment_method: defaultPm,
  });

  const finalized: Stripe.Invoice = await stripe.invoices.finalizeInvoice(
    invoice.id as string
  );

  console.log("✅ Invoice created and finalized:", finalized.id);

  // 9. Send invoice PDF via email
  try {
    const pdf = (finalized as unknown as Stripe.Invoice).invoice_pdf as
      | string
      | undefined;

    if (pdf && email) {
      await sendEmail({
        to: email,
        subject: `Faktúra – objednávka ${orderId}`,
        text: `Dobrý deň,\n\nVaša faktúra je pripravená na stiahnutie (PDF):\n${pdf}\n\nĎakujeme za nákup.`,
      });
      console.log("✅ Invoice PDF sent via email");
    }
  } catch (error) {
    console.error("⚠️ Failed to send invoice email:", error);
    // Continue anyway
  }

  // 10. Mark PaymentIntent as invoiced
  try {
    await stripe.paymentIntents.update(pi.id, {
      metadata: {
        ...piMetadata,
        invoiced: "1",
      } as Stripe.MetadataParam,
    });
    console.log("✅ PaymentIntent marked as invoiced");
  } catch (error) {
    console.error("⚠️ Failed to update PI metadata:", error);
    // Continue anyway
  }

  return { status: "created", invoiceId: finalized.id };
}

/**
 * POST /api/stripe/create-invoice-from-order
 * Create Stripe invoice from order data
 * 
 * @body InvoiceRequestSchema - orderId or paymentIntentId
 * @returns Invoice creation result
 */
export async function POST(request: NextRequest) {
  if (!stripe) {
    console.error("[API Error - Stripe Invoice] STRIPE_SECRET_KEY not configured");
    return NextResponse.json(
      { error: "Payment system not configured" },
      { status: 500 }
    );
  }

  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = InvoiceRequestSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("[API Error - Stripe Invoice] Validation failed:", validationResult.error.issues);
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: validationResult.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const { orderId, paymentIntentId } = validationResult.data;
    console.log("🧾 create-invoice-from-order called", { orderId, paymentIntentId });

    // Find PaymentIntent by ID or orderId
    let pi: Stripe.PaymentIntent | null = null;

    if (paymentIntentId) {
      try {
        pi = await stripe.paymentIntents.retrieve(paymentIntentId);
        console.log("🧾 Found PI by id:", pi.id, "status:", pi.status);
      } catch (error) {
        console.error("❌ Failed to retrieve PI by id:", error);
      }
    }

    if (!pi && orderId) {
      try {
        const query = `metadata['orderId']:'${orderId}'`;
        const piList = await stripe.paymentIntents.search({ query });
        console.log("🧾 Search PI by orderId, found:", piList.data.length);

        if (piList.data.length > 0) {
          pi = piList.data[0];
        }
      } catch (error) {
        console.error("❌ Failed to search PI by orderId:", error);
      }
    }

    if (!pi) {
      return NextResponse.json(
        { error: "PaymentIntent not found" },
        { status: 404 }
      );
    }

    // Get charge email if available
    let chargeEmail: string | null | undefined;
    try {
      if (pi.latest_charge && typeof pi.latest_charge === "string") {
        const charge = await stripe.charges.retrieve(pi.latest_charge);
        chargeEmail = charge.billing_details?.email;
      }
    } catch (error) {
      console.error("⚠️ Failed to retrieve charge email:", error);
    }

    // Create invoice
    const result = await createInvoiceIfMissing(pi, chargeEmail);

    return NextResponse.json(
      { ok: true, result },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API Error - Stripe Invoice]", error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        {
          error: "Stripe API error",
          message: error.message,
          type: error.type,
        },
        { status: 400 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

