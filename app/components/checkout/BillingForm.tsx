"use client";

import { useCheckoutSettings } from "../../context/CheckoutContext";
import { useLocalization } from "../../context/LocalizationContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setBillingForm, setDifferentBilling } from "../../store/slices/checkoutSlice";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function BillingForm() {
  const { billingCountries } = useCheckoutSettings();
  const { labels } = useLocalization();
  const l = labels.checkout;

  const dispatch = useAppDispatch();
  const billingForm = useAppSelector((state) => state.checkout.billingForm);
  const shippingForm = useAppSelector((state) => state.checkout.shippingForm);
  const differentBilling = useAppSelector((state) => state.checkout.differentBilling);

  // State pre chybové hlásenia
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      // Vymazať chyby pri synchronizácii s dodacími údajmi
      setErrors({});
    }
  }, [differentBilling, shippingForm, dispatch]);

  // Validačná funkcia
  const validateField = (name: string, value: string): string => {
    if (name === 'email') {
      if (!value.trim()) return l.validationRequired;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return l.validationEmail;
    }

    if (['firstName', 'lastName', 'country', 'city', 'address1', 'postalCode'].includes(name)) {
      if (!value.trim()) return l.validationRequired;
    }

    if (name === 'postalCode' && value.trim()) {
      // Základná validácia PSČ (5 číslic alebo formát XXX XX)
      const pscRegex = /^\d{5}$|^\d{3}\s?\d{2}$/;
      if (!pscRegex.test(value.trim())) return l.validationPSC;
    }

    if (billingForm.isCompany && name === 'companyName' && !value.trim()) {
      return l.validationRequired;
    }

    if (billingForm.isCompany && name === 'companyICO' && !value.trim()) {
      return l.validationRequired;
    }

    return '';
  };

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

  return (
    <div className="space-y-4 mt-8">
      {/* Different Billing Checkbox */}
      <div className="flex items-center justify-center py-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="differentBilling"
            id="differentBilling"
            checked={differentBilling}
            onChange={handleChange}
            className="w-4 h-4 text-accent bg-background border-accent rounded focus:ring-accent focus:ring-2"
          />
          <label htmlFor="differentBilling" className="ml-2 text-sm font-medium text-foreground">
            {labels.differentBilling}
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
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSameAsShipping}
            >
              {labels.sameAsShipping || "Same as Shipping"}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="firstName"
              value={billingForm.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.firstName}
              placeholder={`${labels.firstName} *`}
              required
            />
            <Input
              name="lastName"
              value={billingForm.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.lastName}
              placeholder={`${labels.lastName} *`}
              required
            />

            <select
              name="country"
              value={billingForm.country}
              onChange={handleChange}
              className="flex h-11 w-full rounded-lg border-2 border-gray-300 bg-background px-4 py-3 text-base transition-colors focus-visible:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20"
              required
            >
              {billingCountries.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>

            <Input
              name="city"
              value={billingForm.city}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.city}
              placeholder={`${labels.city || "Mesto"} *`}
              required
            />

            <div className="md:col-span-2">
              <Input
                name="address1"
                value={billingForm.address1}
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
                value={billingForm.address2}
                onChange={handleChange}
                placeholder={labels.address2}
              />
            </div>

            <Input
              name="postalCode"
              value={billingForm.postalCode}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.postalCode}
              placeholder={`${labels.postalCode} *`}
              required
            />

            <Input
              name="phone"
              value={billingForm.phone}
              onChange={handleChange}
              placeholder={`${labels.phone} (${l.optional})`}
            />

            <div className="md:col-span-2">
              <Input
                name="email"
                value={billingForm.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                placeholder={`${labels.email} *`}
                type="email"
                required
              />
            </div>
          </div>

          {/* Company Information */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="isCompany"
                id="isCompanyBilling"
                checked={billingForm.isCompany}
                onChange={handleChange}
                className="w-4 h-4 text-accent bg-background border-accent rounded focus:ring-accent focus:ring-2"
              />
              <label htmlFor="isCompanyBilling" className="ml-2 text-sm font-medium text-foreground">
                {labels.isCompany}
              </label>
            </div>

            {billingForm.isCompany && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="companyName"
                  value={billingForm.companyName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.companyName}
                  placeholder={labels.companyName}
                  required={billingForm.isCompany}
                />
                <Input
                  name="companyICO"
                  value={billingForm.companyICO}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.companyICO}
                  placeholder={labels.companyICO}
                  required={billingForm.isCompany}
                />
                <Input
                  name="companyDIC"
                  value={billingForm.companyDIC}
                  onChange={handleChange}
                  placeholder={labels.companyDIC}
                />
                <Input
                  name="companyICDPH"
                  value={billingForm.companyICDPH}
                  onChange={handleChange}
                  placeholder={labels.companyICDPH}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
