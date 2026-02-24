"use client";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { useCheckoutSettings } from "../../context/CheckoutContext";
import { useLocalization } from "../../context/LocalizationContext";
import { useState } from "react";
import { clearCart } from "../../store/slices/cartSlice";
import { useRouter } from "next/navigation";

export default function PlaceOrderButton() {
  const dispatch = useAppDispatch();
  const { labels } = useLocalization();
  const { shippingMethods, codFee } = useCheckoutSettings();
  const router = useRouter();

  const cartItems = useAppSelector((state) => state.cart.items);
  const shippingForm = useAppSelector((state) => state.checkout.shippingForm);
  const billingForm = useAppSelector((state) => state.checkout.billingForm);
  const shippingMethodId = useAppSelector((state) => state.checkout.shippingMethodId);
  const paymentMethodId = useAppSelector((state) => state.checkout.paymentMethodId);
  const orderId = useAppSelector((state) => state.checkout.orderId);
  const orderDate = useAppSelector((state) => state.checkout.orderDate);

  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const missingFields: string[] = [];
    const c = labels.checkout;

    if (!shippingForm.firstName?.trim()) missingFields.push(c.fieldFirstName);
    if (!shippingForm.lastName?.trim()) missingFields.push(c.fieldLastName);
    if (!shippingForm.country?.trim()) missingFields.push(c.fieldCountry);
    if (!shippingForm.address1?.trim()) missingFields.push(c.fieldAddress);
    if (!shippingForm.postalCode?.trim()) missingFields.push(c.fieldPostalCode);
    if (!shippingForm.phone?.trim()) missingFields.push(c.fieldPhone);
    if (!shippingForm.email?.trim()) missingFields.push(c.fieldEmail);

    if (!billingForm.firstName?.trim()) missingFields.push(c.fieldBillingFirstName);
    if (!billingForm.lastName?.trim()) missingFields.push(c.fieldBillingLastName);
    if (!billingForm.country?.trim()) missingFields.push(c.fieldBillingCountry);
    if (!billingForm.address1?.trim()) missingFields.push(c.fieldBillingAddress);
    if (!billingForm.postalCode?.trim()) missingFields.push(c.fieldBillingPostalCode);
    if (!billingForm.phone?.trim()) missingFields.push(c.fieldBillingPhone);
    if (!billingForm.email?.trim()) missingFields.push(c.fieldBillingEmail);

    if (!shippingMethodId?.trim()) missingFields.push(c.fieldShippingMethod);
    if (!paymentMethodId?.trim()) missingFields.push(labels.paymentMethod);

    if (missingFields.length > 0) {
      setErrorMsg(`${c.validationCompleteFields}: ${missingFields.join(", ")}`);
      return false;
    }

    setErrorMsg("");
    return true;
  };

  const handlePlaceOrder = async () => {
    // Note: Only Cash on Delivery and Personal Pickup should trigger this button
    if (paymentMethodId !== "cod" && paymentMethodId !== "pickup") {
      setErrorMsg("Please select Cash on Delivery or Personal Pickup to place the order here.");
      return;
    }

    if (!validate()) return;

    setIsLoading(true);

    const shippingMethod = shippingMethods.find((s) => s.id === shippingMethodId);
    const orderData = {
      orderId,
      orderDate,
      cartItems,
      shippingForm,
      billingForm,
      shippingMethod,
      paymentMethodId,
      codFee: paymentMethodId === "cod" ? codFee : 0,
    };

    try {
      const res = await fetch("/api/checkout/placeorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result: { error?: string } = await res.json();

      if (!res.ok) {
        throw new Error(result?.error || "Order failed");
      }

      localStorage.setItem("recentOrder", JSON.stringify(orderData));
      dispatch(clearCart());
      router.push("/ordersummary");
    } catch (err) {
      const error = err as Error;
      setErrorMsg(error.message || "Something went wrong while placing the order.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={handlePlaceOrder}
        className={`w-full text-foreground font-semibold py-3 px-4 rounded-md transition-colors
          ${isLoading
            ? "bg-accent cursor-not-allowed opacity-50"
            : "bg-accent hover:bg-accent-dark"}`}
        disabled={isLoading}
      >
        {isLoading
          ? labels.placingOrder || "Placing Order..."
          : labels.placeOrder || "Place Order"}
      </button>
      {errorMsg && <p className="text-gray-700 mt-2 text-sm">{errorMsg}</p>}
    </div>
  );
}
