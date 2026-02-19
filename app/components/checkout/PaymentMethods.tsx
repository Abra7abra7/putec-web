"use client";

import { useState } from "react";
import { useCheckoutSettings } from "../../context/CheckoutContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setPaymentMethod } from "../../store/slices/checkoutSlice";
import { useLocalization } from "../../context/LocalizationContext";
import StripeClientSecretLoader from "./StripeClientSecretLoader";
import PlaceOrderButton from "./PlaceOrderButton";
import FormValidationAlert from "./FormValidationAlert";
import Image from "next/image";
import { getMediaUrl } from "../../utils/media";

export default function PaymentMethods() {
  const { labels } = useLocalization();
  const { paymentMethods } = useCheckoutSettings();
  const dispatch = useAppDispatch();
  const selectedMethodId = useAppSelector((state) => state.checkout.paymentMethodId);

  const shippingForm = useAppSelector((state) => state.checkout.shippingForm);
  const billingForm = useAppSelector((state) => state.checkout.billingForm);
  const shippingMethodId = useAppSelector((state) => state.checkout.shippingMethodId);
  const differentBilling = useAppSelector((state) => state.checkout.differentBilling);

  const [showValidation, setShowValidation] = useState(false);

  const getMissingFields = (): string[] => {
    const missing: string[] = [];

    if (!shippingForm.firstName?.trim()) missing.push("Meno");
    if (!shippingForm.lastName?.trim()) missing.push("Priezvisko");
    if (!shippingForm.country?.trim()) missing.push("Krajina");
    if (!shippingForm.city?.trim()) missing.push("Mesto");
    if (!shippingForm.address1?.trim()) missing.push("Adresa");
    if (!shippingForm.postalCode?.trim()) missing.push("PSČ");
    if (!shippingForm.email?.trim()) missing.push("Email");
    if (!shippingMethodId) missing.push("Spôsob dopravy");

    if (differentBilling) {
      if (!billingForm.firstName?.trim()) missing.push("Fakturačné meno");
      if (!billingForm.lastName?.trim()) missing.push("Fakturačné priezvisko");
      if (!billingForm.country?.trim()) missing.push("Fakturačná krajina");
      if (!billingForm.city?.trim()) missing.push("Fakturačné mesto");
      if (!billingForm.address1?.trim()) missing.push("Fakturačná adresa");
      if (!billingForm.postalCode?.trim()) missing.push("Fakturačné PSČ");
      if (!billingForm.email?.trim()) missing.push("Fakturačný email");
    }

    return missing;
  };

  const isFormComplete = () => {
    // Povinné polia pre dodanie (telefón je voliteľný)
    const baseFields = [
      shippingForm.firstName,
      shippingForm.lastName,
      shippingForm.country,
      shippingForm.address1,
      shippingForm.city,
      shippingForm.postalCode,
      shippingForm.email,
      shippingMethodId,
    ];

    // Ak sú fakturačné údaje odlišné, vyžaduj aj tie (telefón je voliteľný)
    const billingFields = differentBilling
      ? [
        billingForm.firstName,
        billingForm.lastName,
        billingForm.country,
        billingForm.address1,
        billingForm.city,
        billingForm.postalCode,
        billingForm.email,
      ]
      : [];

    const all = [...baseFields, ...billingFields];
    return all.every((field) => field && field.trim() !== "");
  };

  const formReady = isFormComplete();

  const handleChange = (id: string) => {
    if (formReady) {
      dispatch(setPaymentMethod(id));
      setShowValidation(false);
    } else {
      setShowValidation(true);
    }
  };

  const missingFields = getMissingFields();

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        {labels.paymentMethod || "Spôsob platby"}
      </h2>

      {!formReady && showValidation && (
        <FormValidationAlert
          missingFields={missingFields}
          onClose={() => setShowValidation(false)}
        />
      )}

      {!formReady && !showValidation && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mb-6">
          <p className="text-sm text-amber-800 font-medium flex items-center">
            <svg className="h-5 w-5 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Prosím vyplňte všetky povinné údaje vyššie pred výberom platby
          </p>
        </div>
      )}

      <div
        className={`space-y-4 bg-background rounded p-5 transition-all duration-300 ${formReady ? "" : "opacity-80 blur-[1px] pointer-events-none"
          }`}
      >
        {paymentMethods
          .filter((method) => method.enabled)
          .map((method) => (
            <div key={method.id}>
              <label className="flex items-center justify-between p-1 cursor-pointer transition">
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedMethodId === method.id}
                    onChange={() => handleChange(method.id)}
                    className="accent-wine-red"
                  />
                  <span className="text-sm font-medium text-foreground">{method.name}</span>
                  {method.icon && (
                    <Image
                      src={getMediaUrl(method.icon)}
                      alt={method.name}
                      width={40}
                      height={24}
                      className="object-contain"
                    />
                  )}
                </div>
              </label>


              {method.id === "cod" && selectedMethodId === "cod" && (
                <div className="mt-4 ml-6">
                  <PlaceOrderButton />
                </div>
              )}

              {method.id === "stripe" && selectedMethodId === "stripe" && formReady && (
                <div className="mt-4 ml-6">
                  <StripeClientSecretLoader />
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
