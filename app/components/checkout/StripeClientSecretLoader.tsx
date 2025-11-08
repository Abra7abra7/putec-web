"use client";

import { useEffect, useState } from "react";
import StripeWrapper from "./StripeWrapper";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { useCheckoutSettings } from "../../context/CheckoutContext";

export default function StripeClientSecretLoader() {
  const [clientSecret, setClientSecret] = useState("");
  const dispatch = useAppDispatch();

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

  useEffect(() => {
    const loadSecret = async () => {
      console.log('🔍 StripeClientSecretLoader - orderId:', orderId);
      console.log('🔍 StripeClientSecretLoader - cartItems.length:', cartItems.length);
      console.log('🔍 StripeClientSecretLoader - shippingMethod:', shippingMethod);
      
      if (!orderId || cartItems.length === 0 || !shippingMethod) return;

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
          paymentMethodId, // Send payment method to track in metadata
        }),
      });

      const data = await res.json();
      
      if (res.ok && data.clientSecret) {
        setClientSecret(data.clientSecret);

        const orderData = {
          orderId,
          orderDate,
          cartItems,
          shippingForm,
          billingForm,
          shippingMethod,
          paymentMethodId,
        };

        // Store order data for webhook processing
        localStorage.setItem("recentOrder", JSON.stringify(orderData));
        localStorage.setItem("stripeOrderData", JSON.stringify(orderData));
      } else {
        console.error("❌ Stripe API Error:", data.error || "No clientSecret returned");
        console.error("❌ Response status:", res.status);
        console.error("❌ Full response:", data);
        
        // Show user-friendly error message
        if (data.error === "Stripe not configured") {
          console.error("💡 Stripe is not configured. Please set up Stripe API keys in environment variables.");
        }
      }
    };

    loadSecret();
  }, [
    total,
    orderId,
    orderDate,
    cartItems,
    shippingForm,
    billingForm,
    shippingMethod,
    shippingCost,
    paymentMethodId,
    currency,
    dispatch,
  ]);

  if (!clientSecret) {
    return (
      <div className="p-4 bg-background border border-gray-200 rounded-md">
        <p className="text-gray-700">
          ⚠️ Stripe nie je nakonfigurovaný. Pre testovanie platieb nastavte Stripe API kľúče v environment premenných.
        </p>
        <p className="text-sm text-gray-700 mt-2">
          Môžete použiť dobierku (Cash on Delivery) ako alternatívnu platobnú metódu.
        </p>
      </div>
    );
  }

  return <StripeWrapper clientSecret={clientSecret} />;
}
