"use client";

import { useAppSelector } from "../../store/hooks";
import { useCheckoutSettings } from "../../context/CheckoutContext";
import { useLocalization } from "../../context/LocalizationContext";
import { getCurrencySymbol } from "../../utils/getCurrencySymbol";
import Image from "next/image";
import Link from "next/link";

export default function OrderSummary() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const { shippingMethodId } = useAppSelector((state) => state.checkout);
  const { shippingMethods } = useCheckoutSettings();
  const { labels } = useLocalization();

  const shipping = shippingMethods.find((s) => s.id === shippingMethodId);

  const cartTotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * parseFloat(item.SalePrice || item.RegularPrice),
    0
  );

  const shippingCost = shipping?.price || 0;
  const totalAmount = cartTotal + shippingCost;
  
  // Get currency symbol from first cart item or default to EUR
  const currencySymbol = cartItems.length > 0 ? getCurrencySymbol(cartItems[0].Currency) : "€";

  return (
    <div className="bg-background rounded-lg shadow-lg p-6 border border-accent">
      <h2 className="text-lg font-semibold mb-4">{labels.orderSummary || "Order Summary"}</h2>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.ID} className="flex items-center gap-4">
            <Image src={item.FeatureImageURL} alt={item.Title} width={60} height={60} className="rounded object-cover" />
            <div className="flex-1">
              <Link
                href={`/vina/${item.Slug}`}
                className="text-sm font-medium text-foreground hover:text-gray-700"
              >
                {item.Title}
              </Link>
              <p className="text-sm text-gray-700">
                {labels.quantity || "Qty"}: {item.quantity} × {getCurrencySymbol(item.Currency)}{parseFloat(item.SalePrice || item.RegularPrice).toFixed(2)}
              </p>
            </div>
            <div className="text-sm font-medium text-foreground">
              {getCurrencySymbol(item.Currency)}{(item.quantity * parseFloat(item.SalePrice || item.RegularPrice)).toFixed(2)}
            </div>
          </div>
        ))}

        <hr className="my-4" />

        <div className="flex justify-between text-sm">
          <span>{labels.subtotal || "Subtotal"}:</span>
          <span>{currencySymbol}{cartTotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>{labels.shipping || "Shipping"}:</span>
          <span>{shipping ? `${shipping.name} ${getCurrencySymbol(shipping.currency)}${shipping.price.toFixed(2)}` : labels.noShippingSelected || "Not selected"}</span>
        </div>

        <hr className="my-4" />

        <div className="flex justify-between font-bold text-base">
          <span>{labels.total || "Total"}:</span>
          <span>{currencySymbol}{totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
