"use client";

import { Elements } from "@stripe/react-stripe-js";
import getStripe from "../../utils/get-stripejs";
import StripePaymentElement from "./StripePaymentElement";
import type { StripeElementsOptions } from "@stripe/stripe-js";

export default function StripeWrapper({ clientSecret }: { clientSecret: string }) {
  const options: StripeElementsOptions = {
    clientSecret,
    locale: 'sk', // Slovenčina
    appearance: {
      theme: "stripe",
    },
    loader: 'auto',
    // Link is disabled by not using customer and setup_future_usage in PaymentIntent
    // Payment methods are restricted to 'card' in PaymentIntent creation
  };

  return (
    <Elements stripe={getStripe()} options={options}>
      <StripePaymentElement />
    </Elements>
  );
}
