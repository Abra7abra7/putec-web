"use client";

import { useCheckoutSettings } from "../../context/CheckoutContext";
import { useLocalization } from "../../context/LocalizationContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setShippingForm } from "../../store/slices/checkoutSlice";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

export default function ShippingForm() {
  const { shippingCountries } = useCheckoutSettings();
  const { labels } = useLocalization();
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.checkout.shippingForm);

  // State pre chybové hlásenia
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!form.country && shippingCountries.length > 0) {
      // Predvolene nastaviť Slovensko (SK)
      const defaultCountry = shippingCountries.find(c => c.code === 'SK') || shippingCountries[0];
      dispatch(setShippingForm({ country: defaultCountry.code }));
    }
  }, [form.country, shippingCountries, dispatch]);

  // Validačná funkcia
  const validateField = (name: string, value: string): string => {
    if (name === 'email') {
      if (!value.trim()) return 'Email je povinný';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Neplatný formát emailu';
    }
    
    if (['firstName', 'lastName', 'country', 'city', 'address1', 'postalCode'].includes(name)) {
      if (!value.trim()) return 'Toto pole je povinné';
    }

    if (name === 'postalCode' && value.trim()) {
      // Základná validácia PSČ (5 číslic alebo formát XXX XX)
      const pscRegex = /^\d{5}$|^\d{3}\s?\d{2}$/;
      if (!pscRegex.test(value.trim())) return 'Neplatné PSČ (napr. 90301 alebo 903 01)';
    }

    if (form.isCompany && name === 'companyName' && !value.trim()) {
      return 'Názov firmy je povinný';
    }

    if (form.isCompany && name === 'companyICO' && !value.trim()) {
      return 'IČO je povinné';
    }

    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (type === 'checkbox') {
      dispatch(setShippingForm({ [name]: checked }));
    } else {
      dispatch(setShippingForm({ [name]: value }));
      // Vymazať chybu pri začatí písania
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

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
            <Input
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.companyName}
              placeholder={labels.companyName}
              required={form.isCompany}
            />
            <Input
              name="companyICO"
              value={form.companyICO}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.companyICO}
              placeholder={labels.companyICO}
              required={form.isCompany}
            />
            <Input
              name="companyDIC"
              value={form.companyDIC}
              onChange={handleChange}
              placeholder={labels.companyDIC}
            />
            <Input
              name="companyICDPH"
              value={form.companyICDPH}
              onChange={handleChange}
              placeholder={labels.companyICDPH}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          name="firstName" 
          value={form.firstName} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.firstName}
          placeholder={`${labels.firstName} *`} 
          required 
        />
        <Input 
          name="lastName" 
          value={form.lastName} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.lastName}
          placeholder={`${labels.lastName} *`} 
          required 
        />


        
        <select 
          name="country" 
          value={form.country} 
          onChange={handleChange} 
          className="flex h-11 w-full rounded-lg border-2 border-gray-300 bg-background px-4 py-3 text-base transition-colors focus-visible:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20" 
          required
        >
          {shippingCountries.map((c) => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>

        <Input 
          name="city" 
          value={form.city} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.city}
          placeholder={`${labels.city || "Mesto"} *`} 
          required 
        />

        <div className="md:col-span-2">
          <Input 
            name="address1" 
            value={form.address1} 
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.address1}
            placeholder={`${labels.address1} *`} 
            required 
          />
        </div>
        
        <div className="md:col-span-2">
          <Input 
            name="address2" 
            value={form.address2} 
            onChange={handleChange} 
            placeholder={labels.address2} 
          />
        </div>
        
        <Input 
          name="postalCode" 
          value={form.postalCode} 
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.postalCode}
          placeholder={`${labels.postalCode} *`} 
          required 
        />
        
        <Input 
          name="phone" 
          value={form.phone} 
          onChange={handleChange} 
          placeholder={`${labels.phone} (voliteľné)`} 
        />
        
        <div className="md:col-span-2">
          <Input 
            name="email" 
            value={form.email} 
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            placeholder={`${labels.email} *`} 
            type="email" 
            required 
          />
        </div>
      </div>
    </div>
  );
}
