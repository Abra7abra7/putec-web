"use client";

import { useCheckoutSettings } from "../../context/CheckoutContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setShippingMethod } from "../../store/slices/checkoutSlice";
import { useLocalization } from "../../context/LocalizationContext";
import { getCurrencySymbol } from "../../utils/getCurrencySymbol";

export default function ShippingMethod() {
  const { labels } = useLocalization();
  const l = labels.checkout;
  const { shippingMethods } = useCheckoutSettings();
  const dispatch = useAppDispatch();
  const selectedMethodId = useAppSelector((state) => state.checkout.shippingMethodId);

  const handleChange = (id: string) => {
    dispatch(setShippingMethod(id));
  };

  const getLocalizedName = (id: string, name: string) => {
    if (id === "courier") return l.shippingCourier;
    if (id === "pickup") return l.shippingPickup;
    return name;
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        {labels.shippingMethod || "Shipping Method"}
      </h2>

      <div className="space-y-4 bg-background rounded p-5">
        {shippingMethods.map((method) => (
          <label
            key={method.id}
            className="flex items-center justify-between p-1 rounded-md cursor-pointer hover:border-accent transition"
          >
            <div className="flex items-center gap-4">
              <input
                type="radio"
                name="shippingMethod"
                value={method.id}
                checked={selectedMethodId === method.id}
                onChange={() => handleChange(method.id)}
                className="accent-wine-red"
              />
              <span className="text-sm font-medium text-foreground">
                {getLocalizedName(method.id, method.name)}
              </span>
            </div>
            <span className="text-sm text-gray-700">
              {getCurrencySymbol(method.currency)}
              {method.price.toFixed(2)}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
