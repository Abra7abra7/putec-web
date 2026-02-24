"use client";

import { useAppSelector } from "../../store/hooks";
import { useCheckoutSettings } from "../../context/CheckoutContext";
import { useLocalization } from "../../context/LocalizationContext";
import { getCurrencySymbol } from "../../utils/getCurrencySymbol";
import Image from "next/image";
import Link from "next/link";
import { getMediaUrl } from "../../utils/media";

import { ShieldCheck, Zap, Wine } from "lucide-react";
import IconWrapper from "../ui/IconWrapper";

export default function OrderSummary() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const { shippingMethodId, shippingForm, billingForm, differentBilling } = useAppSelector((state) => state.checkout);
  const { shippingMethods, shippingCountries } = useCheckoutSettings();
  const { labels } = useLocalization();
  const l = labels.checkout;

  const shipping = shippingMethods.find((s) => s.id === shippingMethodId);
  const { freeShippingThreshold, codFee } = useCheckoutSettings();
  const paymentMethodId = useAppSelector((state) => state.checkout.paymentMethodId);

  const cartTotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * parseFloat(item.SalePrice || item.RegularPrice),
    0
  );

  // Free shipping threshold (only for courier, not pickup)
  const actualShippingCost = (shipping?.id === "courier" && cartTotal >= freeShippingThreshold)
    ? 0
    : (shipping?.price || 0);

  const codCost = paymentMethodId === "cod" ? codFee : 0;
  const totalAmount = cartTotal + actualShippingCost + codCost;

  // Get currency symbol from first cart item or default to EUR
  const currencySymbol = cartItems.length > 0 ? getCurrencySymbol(cartItems[0].Currency) : "€";

  // Get country name from code
  const getCountryName = (code: string) => {
    return shippingCountries.find(c => c.code === code)?.name || code;
  };

  const getLocalizedShippingName = (id: string, name: string) => {
    if (id === "courier") return l.shippingCourier;
    if (id === "pickup") return l.shippingPickup;
    return name;
  };

  return (
    <div className="bg-background rounded-lg shadow-lg p-6 border border-accent">
      <h2 className="text-lg font-semibold mb-4">{labels.orderSummary || "Súhrn objednávky"}</h2>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.ID} className="flex items-center gap-4">
            <Image src={getMediaUrl(item.FeatureImageURL)} alt={item.Title} width={60} height={60} className="rounded object-cover" />
            <div className="flex-1">
              <Link
                href={`/vina/${item.Slug}`}
                className="text-sm font-medium text-foreground hover:text-gray-700"
              >
                {item.Title}
              </Link>
              <p className="text-sm text-gray-700">
                {labels.quantity || "Množstvo"}: {item.quantity} × {getCurrencySymbol(item.Currency)}{parseFloat(item.SalePrice || item.RegularPrice).toFixed(2)}
              </p>
            </div>
            <div className="text-sm font-medium text-foreground">
              {getCurrencySymbol(item.Currency)}{(item.quantity * parseFloat(item.SalePrice || item.RegularPrice)).toFixed(2)}
            </div>
          </div>
        ))}

        <hr className="my-4" />

        <div className="flex justify-between text-sm">
          <span>{labels.subtotal || "Medzisúčet"}:</span>
          <span>{currencySymbol}{cartTotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>{labels.shipping || "Doprava"}:</span>
          <span>
            {shipping
              ? `${getLocalizedShippingName(shipping.id, shipping.name)} ${actualShippingCost === 0 ? l.shippingFree || "Zadarmo" : `${currencySymbol}${actualShippingCost.toFixed(2)}`}`
              : labels.noShippingSelected || "Nevybrané"}
          </span>
        </div>

        {paymentMethodId === "cod" && (
          <div className="flex justify-between text-sm">
            <span>{l.codFeeLabel || "Poplatok za dobierku"}:</span>
            <span>{currencySymbol}{codFee.toFixed(2)}</span>
          </div>
        )}

        <hr className="my-4" />

        <div className="flex justify-between font-bold text-base">
          <span>{labels.total || "Celkom"}:</span>
          <span>{currencySymbol}{totalAmount.toFixed(2)}</span>
        </div>

        {/* Dodacie údaje */}
        {shippingForm.email && (
          <>
            <hr className="my-4" />
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-foreground">{l.deliveryData}</h3>
              <div className="text-sm text-gray-800 space-y-1">
                <p className="font-medium">{shippingForm.firstName} {shippingForm.lastName}</p>
                {shippingForm.companyName && <p className="text-xs">{shippingForm.companyName}</p>}
                <p>{shippingForm.address1}</p>
                {shippingForm.address2 && <p>{shippingForm.address2}</p>}
                <p>{shippingForm.postalCode} {shippingForm.city}</p>
                <p>{getCountryName(shippingForm.country)}</p>
                <p className="pt-2"><strong>Email:</strong> {shippingForm.email}</p>
                {shippingForm.phone && <p><strong>{labels.phone}:</strong> {shippingForm.phone}</p>}
              </div>
            </div>
          </>
        )}

        {/* Fakturačné údaje - len ak sú odlišné */}
        {differentBilling && billingForm.email && (
          <>
            <hr className="my-4" />
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-foreground">{l.billingData}</h3>
              <div className="text-sm text-gray-800 space-y-1">
                <p className="font-medium">{billingForm.firstName} {billingForm.lastName}</p>
                {billingForm.companyName && <p className="text-xs">{billingForm.companyName}</p>}
                <p>{billingForm.address1}</p>
                {billingForm.address2 && <p>{billingForm.address2}</p>}
                <p>{billingForm.postalCode} {billingForm.city}</p>
                <p>{getCountryName(billingForm.country)}</p>
                {billingForm.companyICO && <p><strong>{labels.companyICO}:</strong> {billingForm.companyICO}</p>}
                {billingForm.companyDIC && <p><strong>{labels.companyDIC}:</strong> {billingForm.companyDIC}</p>}
                {billingForm.companyICDPH && <p><strong>{labels.companyICDPH}:</strong> {billingForm.companyICDPH}</p>}
              </div>
            </div>
          </>
        )}

        {/* Trust Badges */}
        <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
          <div className="flex items-center gap-3 text-sm text-gray-800 font-bold group">
            <IconWrapper size="sm">
              <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
            </IconWrapper>
            <span>{l.paymentSecured}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-800 font-bold group">
            <IconWrapper size="sm">
              <Zap className="w-4 h-4" strokeWidth={1.5} />
            </IconWrapper>
            <span>{l.fastDelivery}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-800 font-bold group">
            <IconWrapper size="sm">
              <Wine className="w-4 h-4" strokeWidth={1.5} />
            </IconWrapper>
            <span>{l.premiumWines}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
