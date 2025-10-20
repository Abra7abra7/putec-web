import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getLocalization } from "../../../utils/getLocalization";
import type { CartItem } from "../../../../types/CartItem";
// Local type that includes optional company fields used in checkout FormData
type BillingAddress = {
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
};

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {})
  : null;

interface StripeIntentBody {
  amount: number;
  currency: string;
  orderId: string;
  cartItems?: CartItem[]; // Mark as optional
  shippingMethodName: string;
  shippingCost: number;
  customerEmail?: string;
  customerName?: string;
  shippingForm?: BillingAddress;
  billingForm?: BillingAddress;
  paymentMethodId?: string; // Added to track payment method type
}

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();
    console.log('🔍 create-payment-intent - received body:', body);
    
    const {
      amount,
      currency,
      orderId,
      cartItems = [], // fallback to empty array
      shippingMethodName,
      shippingCost,
      customerEmail,
      customerName,
      shippingForm,
      billingForm,
      paymentMethodId,
    }: StripeIntentBody = body;
    
    console.log('🔍 create-payment-intent - orderId:', orderId);
    console.log('🔍 create-payment-intent - paymentMethodId:', paymentMethodId);

    const localization = getLocalization();
    const siteName = localization.siteName || "Vino Putec";

    const metadata: Record<string, string> = {
      orderId,
      siteName,
      shippingMethod: shippingMethodName,
      shippingPriceCents: Math.round((shippingCost || 0) * 100).toString(),
      shippingCurrency: currency,
      paymentMethod: paymentMethodId || 'stripe', // Default to stripe if not provided
    };

    if (Array.isArray(cartItems)) {
      cartItems.forEach((item, index) => {
        const unit = parseFloat(item.SalePrice || item.RegularPrice || "0");
        const unitCents = Math.round(unit * 100);

        metadata[`item_${index + 1}_id`] = item.Slug; // Use Slug as ID
        metadata[`item_${index + 1}_title`] = item.Title;
        metadata[`item_${index + 1}_qty`] = item.quantity.toString();
        metadata[`item_${index + 1}_price`] = unit.toString();
        metadata[`item_${index + 1}_price_cents`] = unitCents.toString();
      });
    }

    // Company / billing metadata
    if (billingForm) {
      metadata["billing_is_company"] = (billingForm.isCompany ? "1" : "0");
      if (billingForm.isCompany) {
        if (billingForm.companyName) metadata["billing_company_name"] = String(billingForm.companyName);
        if (billingForm.companyICO) metadata["billing_company_ico"] = String(billingForm.companyICO);
        if (billingForm.companyDIC) metadata["billing_company_dic"] = String(billingForm.companyDIC);
        if (billingForm.companyICDPH) metadata["billing_company_icdph"] = String(billingForm.companyICDPH);
      }
      // billing address
      metadata["billing_firstName"] = String(billingForm.firstName || "");
      metadata["billing_lastName"] = String(billingForm.lastName || "");
      metadata["billing_address1"] = String(billingForm.address1 || "");
      metadata["billing_address2"] = String(billingForm.address2 || "");
      metadata["billing_city"] = String(billingForm.city || "");
      metadata["billing_state"] = String(billingForm.state || "");
      metadata["billing_postalCode"] = String(billingForm.postalCode || "");
      metadata["billing_country"] = String(billingForm.country || "");
      metadata["billing_phone"] = String(billingForm.phone || "");
      metadata["billing_email"] = String(billingForm.email || "");
    }

    // Shipping address
    if (shippingForm) {
      metadata["shipping_firstName"] = String(shippingForm.firstName || "");
      metadata["shipping_lastName"] = String(shippingForm.lastName || "");
      metadata["shipping_address1"] = String(shippingForm.address1 || "");
      metadata["shipping_address2"] = String(shippingForm.address2 || "");
      metadata["shipping_city"] = String(shippingForm.city || "");
      metadata["shipping_state"] = String(shippingForm.state || "");
      metadata["shipping_postalCode"] = String(shippingForm.postalCode || "");
      metadata["shipping_country"] = String(shippingForm.country || "");
      metadata["shipping_phone"] = String(shippingForm.phone || "");
      metadata["shipping_email"] = String(shippingForm.email || "");
    }

    // Ensure we have or create a Customer
    let customerId: string | undefined = undefined;
    if (customerEmail) {
      const existing = await stripe.customers.search({ query: `email:'${customerEmail}'` });
      if (existing.data.length > 0) customerId = existing.data[0].id;
      else {
        const created = await stripe.customers.create({ email: customerEmail, name: customerName });
        customerId = created.id;
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      description: `${siteName} Order ${orderId}`,
      metadata,
      automatic_payment_methods: { enabled: true },
      customer: customerId,
      setup_future_usage: 'off_session',
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ Stripe create-payment-intent error:", err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
