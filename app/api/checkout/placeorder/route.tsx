import { NextRequest, NextResponse } from "next/server";
import { sendAdminEmail, sendCustomerEmail, OrderBody } from "../../../utils/emailUtilities";
import getProducts from "../../../utils/getProducts";
import { getCheckoutSettings } from "../../../utils/getCheckout";
import { createSuperFakturaInvoice } from "../../../utils/superFakturaApi";

// In-memory cache to prevent duplicate order processing
const processedOrders = new Map<string, number>();
const IDEMPOTENCY_WINDOW = 5000; // 5 seconds

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [orderId, timestamp] of processedOrders.entries()) {
    if (now - timestamp > 60000) { // Remove after 1 minute
      processedOrders.delete(orderId);
    }
  }
}, 30000); // Clean every 30 seconds

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as OrderBody;

    // Idempotency check - prevent duplicate processing
    const now = Date.now();
    const lastProcessed = processedOrders.get(body.orderId);
    if (lastProcessed && (now - lastProcessed) < IDEMPOTENCY_WINDOW) {
      console.log("⚠️ Duplicate request detected for order:", body.orderId, "- ignoring");
      return NextResponse.json({ message: "Order already processed", duplicate: true }, { status: 200 });
    }
    processedOrders.set(body.orderId, now);
    console.log("✅ Processing order:", body.orderId);

    // 1. Basic validation
    if (
      !body.cartItems?.length ||
      !body.shippingForm?.email ||
      !body.billingForm?.email ||
      !body.shippingMethod?.id ||
      !body.paymentMethodId
    ) {
      return NextResponse.json({ error: "Invalid or incomplete order data." }, { status: 400 });
    }

    // 2. Load settings and validate payment method
    const settings = getCheckoutSettings();
    const paymentMethodValid = settings.paymentMethods.some(
      (pm) => pm.id === body.paymentMethodId && pm.enabled
    );

    if (!paymentMethodValid) {
      return NextResponse.json({ error: "Invalid payment method." }, { status: 400 });
    }

    // 3. Validate shipping method exists and matches price
    const expectedShipping = settings.shippingMethods.find(
      (s) => s.id === body.shippingMethod?.id
    );

    if (
      !expectedShipping ||
      expectedShipping.price !== body.shippingMethod.price ||
      expectedShipping.name !== body.shippingMethod.name
    ) {
      return NextResponse.json({ error: "Invalid shipping method or price mismatch." }, { status: 400 });
    }

    // 4. Validate product prices and IDs
    const allProducts = await getProducts();
    const validProducts = body.cartItems.every((item) => {
      const found = allProducts.find((p) => p.ID === item.ID);
      if (!found) return false;
      const expectedPrice = parseFloat(found.SalePrice || found.RegularPrice);
      const submittedPrice = parseFloat(item.SalePrice || item.RegularPrice);
      return expectedPrice === submittedPrice;
    });

    if (!validProducts) {
      return NextResponse.json({ error: "One or more product prices are invalid." }, { status: 400 });
    }

    // Send admin email
    try {
      await sendAdminEmail(body);
    } catch (err) {
      console.error("❌ Failed to send admin email:", err);
    }

    // Create SuperFaktura invoice first
    let invoiceId: string | undefined;
    try {
      if (process.env.SUPERFAKTURA_API_KEY) {
        invoiceId = await createSuperFakturaInvoice(body);
        console.log("✅ SuperFaktúra faktúra vytvorená:", invoiceId);
      } else {
        console.log("⚠️ SuperFaktúra API kľúč nie je nastavený, preskakujem vytvorenie faktúry");
      }
    } catch (err) {
      console.error("❌ Failed to create SuperFaktúra invoice:", err);
      // Nezlyháme celú objednávku ak sa nepodarí vytvoriť faktúru
    }

    // Send customer email with invoice PDF attachment
    try {
      await sendCustomerEmail(body, invoiceId);
    } catch (err) {
      console.error("❌ Failed to send customer email:", err);
    }

    return NextResponse.json({ message: "Order placed successfully" });
  } catch (error) {
    console.error("❌ Order placement error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
