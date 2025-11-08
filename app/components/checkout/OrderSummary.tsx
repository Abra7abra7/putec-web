"use client";

import { useAppSelector } from "../../store/hooks";
import { useCheckoutSettings } from "../../context/CheckoutContext";
import { useLocalization } from "../../context/LocalizationContext";
import { getCurrencySymbol } from "../../utils/getCurrencySymbol";
import Image from "next/image";
import Link from "next/link";

export default function OrderSummary() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const { shippingMethodId, shippingForm, billingForm, differentBilling } = useAppSelector((state) => state.checkout);
  const { shippingMethods, shippingCountries } = useCheckoutSettings();
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

  // Get country name from code
  const getCountryName = (code: string) => {
    return shippingCountries.find(c => c.code === code)?.name || code;
  };

  return (
    <div className="bg-background rounded-lg shadow-lg p-6 border border-accent">
      <h2 className="text-lg font-semibold mb-4">{labels.orderSummary || "Súhrn objednávky"}</h2>

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
          <span>{shipping ? `${shipping.name} ${getCurrencySymbol(shipping.currency)}${shipping.price.toFixed(2)}` : labels.noShippingSelected || "Nevybrané"}</span>
        </div>

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
              <h3 className="font-semibold text-sm text-foreground">Dodacie údaje</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium">{shippingForm.firstName} {shippingForm.lastName}</p>
                {shippingForm.companyName && <p className="text-xs">{shippingForm.companyName}</p>}
                <p>{shippingForm.address1}</p>
                {shippingForm.address2 && <p>{shippingForm.address2}</p>}
                <p>{shippingForm.postalCode} {shippingForm.city}</p>
                <p>{getCountryName(shippingForm.country)}</p>
                <p className="pt-2"><strong>Email:</strong> {shippingForm.email}</p>
                {shippingForm.phone && <p><strong>Telefón:</strong> {shippingForm.phone}</p>}
              </div>
            </div>
          </>
        )}

        {/* Fakturačné údaje - len ak sú odlišné */}
        {differentBilling && billingForm.email && (
          <>
            <hr className="my-4" />
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-foreground">Fakturačné údaje</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium">{billingForm.firstName} {billingForm.lastName}</p>
                {billingForm.companyName && <p className="text-xs">{billingForm.companyName}</p>}
                <p>{billingForm.address1}</p>
                {billingForm.address2 && <p>{billingForm.address2}</p>}
                <p>{billingForm.postalCode} {billingForm.city}</p>
                <p>{getCountryName(billingForm.country)}</p>
                {billingForm.companyICO && <p><strong>IČO:</strong> {billingForm.companyICO}</p>}
                {billingForm.companyDIC && <p><strong>DIČ:</strong> {billingForm.companyDIC}</p>}
                {billingForm.companyICDPH && <p><strong>IČ DPH:</strong> {billingForm.companyICDPH}</p>}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
