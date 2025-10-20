"use client";

import { useCheckoutSettings } from "../../context/CheckoutContext";
import { useLocalization } from "../../context/LocalizationContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setShippingForm } from "../../store/slices/checkoutSlice";
import { useEffect, useMemo } from "react";

export default function ShippingForm() {
  const { shippingCountries, countryStates } = useCheckoutSettings();
  const { labels } = useLocalization();
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.checkout.shippingForm);

  useEffect(() => {
    if (!form.country && shippingCountries.length > 0) {
      // Predvolene nastaviť Slovensko (SK)
      const defaultCountry = shippingCountries.find(c => c.code === 'SK') || shippingCountries[0];
      dispatch(setShippingForm({ country: defaultCountry.code }));
    }
  }, [form.country, shippingCountries, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (type === 'checkbox') {
      dispatch(setShippingForm({ [name]: checked }));
    } else {
      dispatch(setShippingForm({ [name]: value }));
    }
  };

  // Get the list of states for selected country
  const availableStates = useMemo(() => {
    return countryStates[form.country] || null;
  }, [countryStates, form.country]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-foreground">{labels.shippingInformation || "Shipping Information"}</h3>
        
        {/* Company Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isCompany"
            checked={form.isCompany}
            onChange={handleChange}
            className="w-4 h-4 text-accent bg-background border-accent rounded focus:ring-accent focus:ring-2"
          />
          <label htmlFor="isCompany" className="ml-2 text-sm font-medium text-foreground">
            {labels.isCompany}
          </label>
        </div>
      </div>

      {/* Company Information - shown at top if company is selected */}
      {form.isCompany && (
        <div className="bg-accent/10 p-4 rounded-lg mb-4">
          <h4 className="text-lg font-semibold text-foreground mb-3">Firemné údaje</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              placeholder={labels.companyName}
              className="input bg-background border-2 border-accent p-3 pl-4 rounded-lg focus:border-accent-dark focus:outline-none"
              required={form.isCompany}
            />
            <input
              name="companyICO"
              value={form.companyICO}
              onChange={handleChange}
              placeholder={labels.companyICO}
              className="input bg-background border-2 border-accent p-3 pl-4 rounded-lg focus:border-accent-dark focus:outline-none"
              required={form.isCompany}
            />
            <input
              name="companyDIC"
              value={form.companyDIC}
              onChange={handleChange}
              placeholder={labels.companyDIC}
              className="input bg-background border-2 border-accent p-3 pl-4 rounded-lg focus:border-accent-dark focus:outline-none"
            />
            <input
              name="companyICDPH"
              value={form.companyICDPH}
              onChange={handleChange}
              placeholder={labels.companyICDPH}
              className="input bg-background border-2 border-accent p-3 pl-4 rounded-lg focus:border-accent-dark focus:outline-none"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input name="firstName" value={form.firstName} onChange={handleChange} placeholder={`${labels.firstName} *`} className="input bg-background border-2 border-accent p-3 pl-4 rounded-lg focus:border-accent-dark focus:outline-none w-full" required />
        </div>
        <div>
          <input name="lastName" value={form.lastName} onChange={handleChange} placeholder={`${labels.lastName} *`} className="input bg-background border-2 border-accent p-3 pl-4 rounded-lg focus:border-accent-dark focus:outline-none w-full" required />
        </div>
        
        <div>
          <select name="country" value={form.country} onChange={handleChange} className="input bg-background border-2 border-accent p-3 pl-4 rounded-lg focus:border-accent-dark focus:outline-none w-full" required>
            {shippingCountries.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <input name="city" value={form.city} onChange={handleChange} placeholder={`${labels.city || "Mesto"} *`} className="input bg-background border-2 border-accent p-3 pl-4 rounded-lg focus:border-accent-dark focus:outline-none w-full" required />
        </div>

        <div className="md:col-span-2">
          <input name="address1" value={form.address1} onChange={handleChange} placeholder={`${labels.address1} *`} className="input bg-background border-2 border-accent p-3 pl-4 rounded-lg focus:border-accent-dark focus:outline-none w-full" required />
        </div>
        
        <div className="md:col-span-2">
          <input name="address2" value={form.address2} onChange={handleChange} placeholder={labels.address2} className="input bg-background border-2 border-accent p-3 pl-4 rounded-lg focus:border-accent-dark focus:outline-none w-full" />
        </div>
        
        <div>
          <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder={`${labels.postalCode} *`} className="input bg-background border-2 border-accent p-3 pl-4 rounded-lg focus:border-accent-dark focus:outline-none w-full" required />
        </div>
        
        <div>
          <input 
            name="phone" 
            value={form.phone} 
            onChange={handleChange} 
            placeholder={`${labels.phone} (voliteľné)`} 
            className="input bg-background border-2 border-accent p-3 pl-4 rounded-lg focus:border-accent-dark focus:outline-none w-full" 
          />
        </div>
        
        <div className="md:col-span-2">
          <input name="email" value={form.email} onChange={handleChange} placeholder={`${labels.email} *`} type="email" className="input bg-background border-2 border-accent p-3 pl-4 rounded-lg focus:border-accent-dark focus:outline-none w-full" required />
        </div>
      </div>
    </div>
  );
}
