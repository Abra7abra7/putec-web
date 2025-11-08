import { NextRequest, NextResponse } from "next/server";
import { sendAdminEmail, sendCustomerEmail, OrderBody } from "../../../utils/emailUtilities";
import getProducts from "../../../utils/getProducts";
import { getCheckoutSettings } from "../../../utils/getCheckout";
import { z } from "zod";

// Zod validation schemas
const CartItemSchema = z.object({
  ID: z.string(),
  Title: z.string(),
  RegularPrice: z.string(),
  SalePrice: z.string().optional(),
  quantity: z.number().positive(),
});

const AddressSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  address1: z.string().min(1),
  address2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().optional(),
  postalCode: z.string().min(1),
  country: z.string().min(2),
  companyName: z.string().optional(),
  companyICO: z.string().optional(),
  companyDIC: z.string().optional(),
  companyICDPH: z.string().optional(),
});

const OrderSchema = z.object({
  orderId: z.string(),
  orderDate: z.string(),
  cartItems: z.array(CartItemSchema).min(1),
  shippingForm: AddressSchema,
  billingForm: AddressSchema,
  shippingMethod: z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
  }),
  paymentMethodId: z.string(),
  differentBilling: z.boolean().optional(),
});

/**
 * POST /api/checkout/placeorder
 * Place order with validation and send confirmation emails
 * 
 * @body OrderBody - Complete order data
 * @returns Success message or error
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = OrderSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("[API Error - PlaceOrder] Validation failed:", validationResult.error.issues);
      return NextResponse.json(
        {
          error: "Invalid or incomplete order data",
          details: validationResult.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const orderData = validationResult.data as OrderBody;

    // Load checkout settings
    const settings = getCheckoutSettings();

    // 2. Validate payment method
    const paymentMethodValid = settings.paymentMethods.some(
      (pm) => pm.id === orderData.paymentMethodId && pm.enabled
    );

    if (!paymentMethodValid) {
      return NextResponse.json(
        { error: "Invalid or disabled payment method" },
        { status: 400 }
      );
    }

    // 3. Validate shipping method and price
    const expectedShipping = settings.shippingMethods.find(
      (s) => s.id === orderData.shippingMethod?.id
    );

    if (!expectedShipping) {
      return NextResponse.json(
        { error: "Invalid shipping method" },
        { status: 400 }
      );
    }

    if (
      expectedShipping.price !== orderData.shippingMethod.price ||
      expectedShipping.name !== orderData.shippingMethod.name
    ) {
      console.error("[API Error - PlaceOrder] Shipping price/name mismatch:", {
        expected: expectedShipping,
        received: orderData.shippingMethod,
      });
      return NextResponse.json(
        { error: "Shipping method price or name mismatch. Please refresh and try again." },
        { status: 400 }
      );
    }

    // 4. Validate product prices and availability
    const allProducts = await getProducts();
    const invalidItems: string[] = [];

    for (const item of orderData.cartItems) {
      const product = allProducts.find((p) => p.ID === item.ID);
      
      if (!product) {
        invalidItems.push(`Product ${item.ID} not found`);
        continue;
      }

      const expectedPrice = parseFloat(product.SalePrice || product.RegularPrice);
      const submittedPrice = parseFloat(item.SalePrice || item.RegularPrice);

      if (expectedPrice !== submittedPrice) {
        invalidItems.push(
          `${product.Title}: expected ${expectedPrice}€, got ${submittedPrice}€`
        );
      }
    }

    if (invalidItems.length > 0) {
      console.error("[API Error - PlaceOrder] Invalid product prices:", invalidItems);
      return NextResponse.json(
        {
          error: "Product prices have changed. Please refresh your cart.",
          details: invalidItems,
        },
        { status: 400 }
      );
    }

    // 5. Send confirmation emails
    const emailResults = {
      admin: false,
      customer: false,
    };

    // Send admin notification email
    try {
      await sendAdminEmail(orderData);
      emailResults.admin = true;
      console.log("✅ Admin email sent successfully");
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("❌ Failed to send admin email:", error);
      // Continue even if admin email fails
    }

    // Send customer confirmation email
    try {
      await sendCustomerEmail(orderData);
      emailResults.customer = true;
      console.log("✅ Customer email sent successfully");
    } catch (error) {
      console.error("❌ Failed to send customer email:", error);
      // This is more critical - we should still return success but log warning
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        emailsSent: emailResults,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API Error - PlaceOrder]", error);

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

