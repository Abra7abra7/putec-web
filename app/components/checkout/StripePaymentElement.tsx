"use client";

import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useAppSelector } from "../../store/hooks";
import { useLocalization } from "../../context/LocalizationContext";

export default function StripePaymentElement() {
  const stripe = useStripe();
  const elements = useElements();
  const { labels } = useLocalization();

  const orderId = useAppSelector((state) => state.checkout.orderId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/ordersummary?orderId=${orderId}`,
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    // Payment succeeded - redirect will be handled by Stripe
    // OrderSummaryClient will handle email sending with proper guards
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <PaymentElement />
      <button
        type="submit"
        className="mt-4 w-full bg-accent text-foreground py-2 px-4 rounded hover:bg-accent-dark transition-colors"
        disabled={!stripe || !elements}
      >
        {labels.payNow || "Pay Now"}
      </button>
    </form>
  );
}
