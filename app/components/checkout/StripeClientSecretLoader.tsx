"use client";

import { useEffect, useState } from "react";
import StripeWrapper from "./StripeWrapper";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { useCheckoutSettings } from "../../context/CheckoutContext";
import { useLocale } from "next-intl";

export default function StripeClientSecretLoader() {
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const locale = useLocale();

  const cartItems = useAppSelector((state) => state.cart.items);
  const shippingMethodId = useAppSelector((state) => state.checkout.shippingMethodId);
  const orderId = useAppSelector((state) => state.checkout.orderId);
  const orderDate = useAppSelector((state) => state.checkout.orderDate);
  const shippingForm = useAppSelector((state) => state.checkout.shippingForm);
  const billingForm = useAppSelector((state) => state.checkout.billingForm);
  const paymentMethodId = useAppSelector((state) => state.checkout.paymentMethodId);
  const { shippingMethods } = useCheckoutSettings();

  const shippingMethod = shippingMethods.find((m) => m.id === shippingMethodId);
  const shippingCost = shippingMethod?.price || 0;
  const currency = shippingMethod?.currency || "USD";

  const total =
    cartItems.reduce(
      (sum, item) =>
        sum + item.quantity * parseFloat(item.SalePrice || item.RegularPrice),
      0
    ) + shippingCost;

  // Create stable string keys from cart/form objects to avoid infinite re-renders
  // (objects/arrays change reference on every render, causing useEffect to fire in a loop)
  const cartKey = cartItems.map(i => `${i.ID}:${i.quantity}`).join(',');
  const shippingKey = `${shippingForm?.firstName}|${shippingForm?.lastName}|${shippingForm?.email}|${shippingForm?.address1}|${shippingForm?.city}|${shippingForm?.postalCode}|${shippingForm?.country}`;
  const billingKey = `${billingForm?.firstName}|${billingForm?.lastName}|${billingForm?.email}|${billingForm?.address1}|${billingForm?.city}|${billingForm?.postalCode}|${billingForm?.country}`;

  useEffect(() => {
    // Flag to prevent race conditions or updates after unmount
    let isMounted = true;

    const loadSecret = async () => {
      console.log('🔍 StripeClientSecretLoader - orderId:', orderId);

      if (!orderId || cartItems.length === 0 || !shippingMethod) return;

      try {
        const res = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(total * 100), // Stripe expects cents
            currency,
            orderId,
            cartItems,
            shippingMethodName: shippingMethod.name,
            shippingCost,
            customerEmail: shippingForm?.email,
            customerName: `${shippingForm?.firstName || ''} ${shippingForm?.lastName || ''}`.trim(),
            shippingForm,
            billingForm,
            paymentMethodId,
            paymentIntentId: paymentIntentId || undefined, // Send existing ID if available
            locale,
          }),
        });

        const data = await res.json();

        if (isMounted && res.ok && data.clientSecret) {
          setClientSecret(data.clientSecret);
          // Update local state with the returned ID (whether new or existing)
          if (data.paymentIntentId) {
            setPaymentIntentId(data.paymentIntentId);
          }

          const orderData = {
            orderId,
            orderDate,
            cartItems,
            shippingForm,
            billingForm,
            shippingMethod,
            paymentMethodId: 'stripe',
          };

          // Store order data for webhook processing
          localStorage.setItem("recentOrder", JSON.stringify(orderData));
          localStorage.setItem("stripeOrderData", JSON.stringify(orderData));
        } else if (isMounted) {
          console.error("❌ Stripe API Error:", data.error || "No clientSecret returned");
        }
      } catch (error) {
        if (isMounted) console.error("❌ Failed to load payment intent:", error);
      }
    };

    // Debounce slightly to prevent double-calls in strict mode
    const timer = setTimeout(() => {
      loadSecret();
    }, 500); // 500ms debounce

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [
    total,
    orderId,
    cartKey,       // Stable string key instead of cartItems array reference
    shippingKey,   // Stable string key instead of shippingForm object reference
    billingKey,    // Stable string key instead of billingForm object reference
    shippingCost,
    paymentMethodId,
    currency,
    locale,
    // paymentIntentId is NOT in dependency array to avoid infinite loop!
    // cartItems, shippingForm, billingForm, shippingMethod are used in the body
    // but their stable keys above handle the dependency tracking
  ]);

  if (!clientSecret) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
          <p className="text-center text-sm text-foreground-muted">
            Načítavam platobné možnosti...
          </p>
        </div>
      </div>
    );
  }

  return <StripeWrapper clientSecret={clientSecret} />;
}
