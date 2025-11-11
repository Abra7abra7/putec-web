"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import OrderInfoInitializer from "../components/checkout/OrderInfoInitializer";
import ShippingForm from "../components/checkout/ShippingForm";
import ShippingMethod from "../components/checkout/ShippingMethod";
import BillingForm from "../components/checkout/BillingForm";
import OrderSummary from "../components/checkout/OrderSummary";
import PaymentMethods from "../components/checkout/PaymentMethods";
import { CheckoutProvider } from "../context/CheckoutContext";
import { ReduxProvider } from "../providers";

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-foreground">Načítavam...</p>
        </div>
      </div>
    );
  }

  return (
    <ReduxProvider>
      <CheckoutProvider>
        <div className="min-h-screen bg-background">
          {/* Header */}
          <div className="bg-background border-b border-gray-200">
            <div className="container mx-auto px-4 py-6">
              {/* Back button - vľavo hore */}
              <a 
                href="/kosik"
                className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors mb-4 group"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Späť do košíka</span>
              </a>

              <div className="flex items-center justify-center">
                <Image
                  src="/putec-logo.jpg"
                  alt="Pútec Logo"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <h1 className="ml-4 text-2xl font-bold text-foreground">
                  Pokladňa
                </h1>
              </div>
            </div>
          </div>

          {/* Checkout Content */}
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Forms */}
                <div className="space-y-6">
                  <OrderInfoInitializer />
                  <ShippingForm />
                  <ShippingMethod />
                  <BillingForm />
                  <PaymentMethods />
                </div>

                {/* Right Column - Order Summary */}
                <div className="lg:sticky lg:top-8">
                  <OrderSummary />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CheckoutProvider>
    </ReduxProvider>
  );
}