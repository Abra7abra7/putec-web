"use client";

import { useCheckoutSettings } from "../../context/CheckoutContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setPaymentMethod } from "../../store/slices/checkoutSlice";
import { useLocalization } from "../../context/LocalizationContext";
import StripeClientSecretLoader from "./StripeClientSecretLoader";
import PlaceOrderButton from "./PlaceOrderButton";
import Image from "next/image";

export default function PaymentMethods() {
  const { labels } = useLocalization();
  const { paymentMethods } = useCheckoutSettings();
  const dispatch = useAppDispatch();
  const selectedMethodId = useAppSelector((state) => state.checkout.paymentMethodId);

  const shippingForm = useAppSelector((state) => state.checkout.shippingForm);
  const billingForm = useAppSelector((state) => state.checkout.billingForm);
  const shippingMethodId = useAppSelector((state) => state.checkout.shippingMethodId);
  const differentBilling = useAppSelector((state) => state.checkout.differentBilling);

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
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        {labels.paymentMethod || "Payment Method"}
      </h2>

      {!formReady && (
        <p className="text-sm text-gray-700 mb-2">
          {labels.completeBeforePayment ||
            "Please complete all shipping and billing fields before selecting a payment method."}
        </p>
      )}

      <div
        className={`space-y-4 bg-background rounded p-5 transition-all duration-300 ${
          formReady ? "" : "opacity-80 blur-[1px] pointer-events-none"
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
                      src={method.icon}
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
