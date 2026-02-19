"use client";

import { ReduxProvider } from "../../providers";
import { CheckoutProvider } from "../../context/CheckoutContext";
import OrderSummaryClient from "./OrderSummaryClient";

export default function OrderSummaryWrapper({ initialCheckoutData }: { initialCheckoutData: any }) {
  return (
    <ReduxProvider>
      <CheckoutProvider initialData={initialCheckoutData}>
        <OrderSummaryClient />
      </CheckoutProvider>
    </ReduxProvider>
  );
}
