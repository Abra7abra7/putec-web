"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Define the shape of configs/checkout.json
interface CheckoutSettings {
  shippingMethods: {
    id: string;
    name: string;
    price: number;
    currency: string;
  }[];
  shippingCountries: {
    code: string;
    name: string;
  }[];
  billingCountries: {
    code: string;
    name: string;
  }[];
  paymentMethods: {
    id: string;
    name: string;
    enabled: boolean;
    icon: string;
  }[];
  countryStates: {
    [countryCode: string]: {
      code: string;
      name: string;
    }[];
  };
}

// Create context
const CheckoutContext = createContext<CheckoutSettings | null>(null);

// Provider component
export function CheckoutProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData: CheckoutSettings;
}) {
  const [checkout] = useState<CheckoutSettings>(initialData);

  return (
    <CheckoutContext.Provider value={checkout}>
      {children}
    </CheckoutContext.Provider>
  );
}

// Hook to consume context
export function useCheckoutSettings() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckoutSettings must be used within CheckoutProvider");
  }
  return context;
}
