"use client";

import { useCheckoutSettings } from "../../context/CheckoutContext";
import { useLocalization } from "../../context/LocalizationContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setBillingForm, setDifferentBilling } from "../../store/slices/checkoutSlice";
import { useEffect, useMemo } from "react";

export default function BillingForm() {
  const { billingCountries, countryStates } = useCheckoutSettings();
  const { labels } = useLocalization();

  const dispatch = useAppDispatch();
  const billingForm = useAppSelector((state) => state.checkout.billingForm);
  const shippingForm = useAppSelector((state) => state.checkout.shippingForm);
  const differentBilling = useAppSelector((state) => state.checkout.differentBilling);

  useEffect(() => {
    if (!billingForm.country && billingCountries.length > 0) {
      // Predvolene nastaviť Slovensko (SK)
      const defaultCountry = billingCountries.find(c => c.code === 'SK') || billingCountries[0];
      dispatch(setBillingForm({ country: defaultCountry.code }));
    }
  }, [billingCountries, billingForm.country, dispatch]);

  // Keep billing same as shipping when differentBilling is false
  useEffect(() => {
    if (!differentBilling) {
      dispatch(setBillingForm({ 
        ...shippingForm,
        isCompany: shippingForm.isCompany || false,
        companyName: shippingForm.companyName || "",
        companyICO: shippingForm.companyICO || "",
        companyDIC: shippingForm.companyDIC || "",
        companyICDPH: shippingForm.companyICDPH || ""
      }));
    }
  }, [differentBilling, shippingForm, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name === "differentBilling") {
      dispatch(setDifferentBilling(checked));
    } else if (name === "country") {
      // Reset state when changing country
      dispatch(setBillingForm({ country: value, state: "" }));
    } else if (type === 'checkbox') {
      dispatch(setBillingForm({ [name]: checked }));
    } else {
      dispatch(setBillingForm({ [name]: value }));
    }
  };

  const handleSameAsShipping = () => {
    dispatch(setBillingForm({ 
      ...shippingForm,
      isCompany: shippingForm.isCompany || false,
      companyName: shippingForm.companyName || "",
      companyICO: shippingForm.companyICO || "",
      companyDIC: shippingForm.companyDIC || "",
      companyICDPH: shippingForm.companyICDPH || ""
    }));
  };

  const availableStates = useMemo(() => {
    return countryStates[billingForm.country] || null;
  }, [countryStates, billingForm.country]);

  return (
    <div className="space-y-4 mt-8">
      {/* Different Billing Checkbox */}
      <div className="flex items-center justify-center py-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="differentBilling"
            checked={differentBilling}
            onChange={handleChange}
            className="w-4 h-4 text-accent bg-background border-accent rounded focus:ring-accent focus:ring-2"
          />
          <label htmlFor="differentBilling" className="ml-2 text-sm font-medium text-foreground">
            {labels.differentBilling || "Fakturačné údaje sú odlišné od dodacích"}
          </label>
        </div>
      </div>

      {/* Billing Form - only shown if different billing is selected */}
      {differentBilling && (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-foreground">
              {labels.billingInformation || "Billing Information"}
            </h3>
            <button
              type="button"
              onClick={handleSameAsShipping}
              className="text-sm text-gray-700 underline hover:text-foreground"
            >
              {labels.sameAsShipping || "Same as Shipping"}
            </button>
          </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input name="firstName" value={billingForm.firstName} onChange={handleChange} placeholder={`${labels.firstName} *`} className="input bg-background border-2 border-accent p-3 pl-4 rounded-lg focus:border-accent-dark focus:outline-none w-full" required />
        </div>
        <div>
          <input name="lastName" value={billingForm.lastName} onChange={handleChange} placeholder={`${labels.lastName} *`} className="input bg-background border-2 border-accent p-3 pl-4 rounded-lg focus:border-accent-dark focus:outline-none w-full" required />
        </div>
        
        <div>
          <select name="country" value={billingForm.country} onChange={handleChange} className="input bg-background border-2 border-accent p-3 pl-4 rounded-lg focus:border-accent-dark focus:outline-none w-full" required>
            {billingCountries.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <input name="city" value={billingForm.city} onChange={handleChange} placeholder={`${labels.city || "Mesto"} *`} className="input bg-background border-2 border-accent p-3 pl-4 rounded-lg focus:border-accent-dark focus:outline-none w-full" required />
        </div>

        <div className="md:col-span-2">
          <input name="address1" value={billingForm.address1} onChange={handleChange} placeholder={`${labels.address1} *`} className="input bg-background border-2 border-accent p-3 pl-4 rounded-lg focus:border-accent-dark focus:outline-none w-full" required />
        </div>
        
        <div className="md:col-span-2">
          <input name="address2" value={billingForm.address2} onChange={handleChange} placeholder={labels.address2} className="input bg-background border-2 border-accent p-3 pl-4 rounded-lg focus:border-accent-dark focus:outline-none w-full" />
        </div>
        
        <div>
          <input name="postalCode" value={billingForm.postalCode} onChange={handleChange} placeholder={`${labels.postalCode} *`} className="input bg-background border-2 border-accent p-3 pl-4 rounded-lg focus:border-accent-dark focus:outline-none w-full" required />
        </div>
        
        <div>
          <input 
            name="phone" 
            value={billingForm.phone} 
            onChange={handleChange} 
            placeholder={`${labels.phone} (voliteľné)`} 
            className="input bg-background border-2 border-accent p-3 pl-4 rounded-lg focus:border-accent-dark focus:outline-none w-full" 
          />
        </div>
        
        <div className="md:col-span-2">
          <input name="email" value={billingForm.email} onChange={handleChange} placeholder={`${labels.email} *`} type="email" className="input bg-background border-2 border-accent p-3 pl-4 rounded-lg focus:border-accent-dark focus:outline-none w-full" required />
        </div>
      </div>

      {/* Company Information */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            name="isCompany"
            checked={billingForm.isCompany}
            onChange={handleChange}
            className="w-4 h-4 text-accent bg-background border-accent rounded focus:ring-accent focus:ring-2"
          />
          <label htmlFor="isCompany" className="ml-2 text-sm font-medium text-foreground">
            {labels.isCompany}
          </label>
        </div>

        {billingForm.isCompany && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="companyName"
              value={billingForm.companyName}
              onChange={handleChange}
              placeholder={labels.companyName}
              className="input bg-background border-2 border-accent p-3 pl-4 rounded-lg focus:border-accent-dark focus:outline-none"
              required={billingForm.isCompany}
            />
            <input
              name="companyICO"
              value={billingForm.companyICO}
              onChange={handleChange}
              placeholder={labels.companyICO}
              className="input bg-background border-2 border-accent p-3 pl-4 rounded-lg focus:border-accent-dark focus:outline-none"
              required={billingForm.isCompany}
            />
            <input
              name="companyDIC"
              value={billingForm.companyDIC}
              onChange={handleChange}
              placeholder={labels.companyDIC}
              className="input bg-background border-2 border-accent p-3 pl-4 rounded-lg focus:border-accent-dark focus:outline-none"
            />
            <input
              name="companyICDPH"
              value={billingForm.companyICDPH}
              onChange={handleChange}
              placeholder={labels.companyICDPH}
              className="input bg-background border-2 border-accent p-3 pl-4 rounded-lg focus:border-accent-dark focus:outline-none"
            />
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
}
