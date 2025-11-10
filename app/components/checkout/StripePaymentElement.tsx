"use client";

import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useAppSelector } from "../../store/hooks";
import { useLocalization } from "../../context/LocalizationContext";
import { useState } from "react";

export default function StripePaymentElement() {
  const stripe = useStripe();
  const elements = useElements();
  const { labels } = useLocalization();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const orderId = useAppSelector((state) => state.checkout.orderId);
  const shippingForm = useAppSelector((state) => state.checkout.shippingForm);
  const billingForm = useAppSelector((state) => state.checkout.billingForm);
  const differentBilling = useAppSelector((state) => state.checkout.differentBilling);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.log('❌ Stripe or Elements not loaded');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    console.log('🔄 Starting payment confirmation...');
    console.log('📦 Order ID:', orderId);
    console.log('👤 Shipping form:', shippingForm);
    console.log('🏢 Billing form:', billingForm);
    console.log('📋 Different billing:', differentBilling);

    try {
      // Jednoduchý confirmPayment - Stripe automaticky použije údaje z PaymentElement
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/ordersummary?orderId=${orderId}`,
        },
      });

      if (error) {
        console.error('❌ Payment error:', error);
        setErrorMessage(error.message || 'Platba zlyhala. Skúste to znova.');
        setIsProcessing(false);
        return;
      }

      // Payment succeeded - redirect will be handled by Stripe
      console.log('✅ Payment confirmed, redirecting...');
    } catch (err) {
      console.error('❌ Unexpected error:', err);
      setErrorMessage('Nastala neočakávaná chyba. Skúste to znova.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-400 rounded-lg">
          <p className="text-sm text-red-800 font-medium">{errorMessage}</p>
        </div>
      )}
      
      <PaymentElement 
        options={{
          layout: {
            type: 'tabs',
            defaultCollapsed: false,
          },
          wallets: {
            applePay: 'auto',
            googlePay: 'auto',
          },
          terms: {
            card: 'never', // Bez extra checkboxov pre ukladanie kariet
          },
        }}
      />
      
      <button
        type="submit"
        className="mt-4 w-full bg-accent text-foreground py-2 px-4 rounded hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!stripe || !elements || isProcessing}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Spracúvam platbu...
          </span>
        ) : (
          labels.payNow || "Zaplatiť teraz"
        )}
      </button>
    </form>
  );
}
