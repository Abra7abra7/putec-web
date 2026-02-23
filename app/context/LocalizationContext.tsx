"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Define Localization Structure
interface LocalizationData {
  locale: string;
  email: string;
  phone: string;
  address: string;
  siteName: string;
  siteTagline: string;
  labels: {
    email: string;
    phone: string;
    address: string;
    quickLinks: string;
    contactUs: string;
    followUs: string;
    searchPlaceholder: string;
    allCategories: string;
    sortByName: string;
    sortByPrice: string;
    sortByNewest: string;
    loadingProducts: string;
    noProductsFound: string;
    productDetails: string;
    products: string;
    recentProducts: string;
    orderConfirmationTitle: string;
    orderConfirmationMessage: string;
    legal: string;
    cart: string;
    closeCart: string;
    cartEmpty: string;
    upsellTitle: string;
    total: string;
    viewCart: string;
    proceedToCheckout: string;
    openMenu: string;
    closeMenu: string;
    price: string;
    differentBilling: string;
    billingInformation: string;
    sameAsShipping: string;
    shippingInformation: string;
    firstName: string;
    lastName: string;
    city: string;
    address1: string;
    address2: string;
    postalCode: string;
    isCompany: string;
    companyName: string;
    companyICO: string;
    companyDIC: string;
    companyICDPH: string;
    orderSummary: string;
    orderId: string;
    orderDate: string;
    orderDetails: string;
    subtotal: string;
    shipping: string;
    shippingMethod: string;
    paymentMethod: string;
    accommodation: string;
    tastings: string;
    placingOrder: string;
    placeOrder: string;
    payNow: string;
    addToCart: string;
    quantity: string;
    noShippingSelected: string;
    remove: string;
    unitPrice: string;
    productTotal: string;
    cartTitle: string;
    // Filter labels
    searchTitle: string;
    clearFilters: string;
    searchLabel: string;
    searchPlaceholderLong: string;
    categoryLabel: string;
    colorLabel: string;
    allColors: string;
    whiteWine: string;
    redWine: string;
    roseWine: string;
    priceRangeLabel: string;
    sortByLabel: string;
    nameAZ: string;
    priceLowHigh: string;
    priceHighLow: string;
    vintageNewest: string;
    showingWines: string;
    noWinesFound: string;
    tryChangingFilters: string;
    // Product details
    backToWines: string;
    aboutWine: string;
    vintage: string;
    wineType: string;
    quality: string;
    region: string;
    characteristics: string;
    color: string;
    aroma: string;
    taste: string;
    technicalData: string;
    alcoholContent: string;
    residualSugar: string;
    sugar: string;
    bottleVolume: string;
    storageTemp: string;
    servingTemp: string;
    batchNumber: string;
    gtin: string;
    producer: string;
    producedBy: string;
    bottledBy: string;
    countryOfOrigin: string;
    additionalInfo: string;
    warnings: string;
    nutritionalInfo: string;
    viewNutritionalInfo: string;
    aboutDegustation: string;
    capacity: string;
    duration: string;
    refundableDeposit: string;
    includedInPackage: string;
    // Accommodation
    accommodationSection: {
      whatWeOffer: string;
      facilitiesAndSpaces: string;
    };
    checkout: {
      fillRequiredFields: string;
      shippingCourier: string;
      shippingPickup: string;
      paymentCod: string;
      paymentStripe: string;
      fieldFirstName: string;
      fieldLastName: string;
      fieldCountry: string;
      fieldCity: string;
      fieldAddress: string;
      fieldPostalCode: string;
      fieldEmail: string;
      fieldShippingMethod: string;
      fieldBillingFirstName: string;
      fieldBillingLastName: string;
      fieldBillingCountry: string;
      fieldBillingCity: string;
      fieldBillingAddress: string;
      fieldBillingPostalCode: string;
      fieldBillingEmail: string;
      validationRequired: string;
      validationEmail: string;
      validationPSC: string;
      companyDetails: string;
      optional: string;
      deliveryData: string;
      billingData: string;
      shippingMethodName: string;
      paymentSecured: string;
      fastDelivery: string;
      premiumWines: string;
    };
    // Contact
    contactHeading: string;
    contactDirectly: string;
    // Shipping/Payment
    courier: string;
    personalPickup: string;
    cartLabels: {
      backToShopping: string;
      cartTitle: string;
      emptyCart: string;
      price: string;
      total: string;
      proceedToCheckout: string;
      quantity: string;
    };
    inquiry: {
      title: string;
      description: string;
      capacityTitle: string;
      capacityDetail: string;
      tastingsTitle: string;
      tastingsDetail: string;
      contactUs: string;
      traditionalWinery: string;
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      phoneLabel: string;
      phonePlaceholder: string;
      peopleCountLabel: string;
      peopleCountPlaceholder: string;
      dateLabel: string;
      datePlaceholder: string;
      messageLabel: string;
      messagePlaceholder: string;
      submitButton: string;
      successMessage: string;
      errorMessage: string;
      validationError: string;
    };
  };
  menu: { label: string; href: string }[];
  ubytovanieMenu: { label: string; href: string }[];
  footerLinks: { label: string; href: string }[];
  legalLinks: { label: string; href: string }[];
  socialLinks: { id: string; icon: string; url: string }[];
  homepage: {
    banner: {
      title: string;
      subtitle: string;
      buttonText: string;
      imagePath: string;
      ctaLink: string;
    };
    newsletter: {
      title: string;
      description: string;
      placeholder: string;
      buttonText: string;
    };
    degustaciePreview: {
      title: string;
      description: string;
      whatToExpect: string;
      features: string[];
      ctaReserve: string;
      ctaViewAll: string;
    };
    accommodationPreview: {
      title: string;
      description: string;
      features: string[];
      ctaReserve: string;
      ctaDetails: string;
    };
    brandStory: {
      title: string;
      subtitle: string;
      p1: string;
      p2: string;
      keyFeatures: { title: string; description: string }[];
      stat1Value: string;
      stat1Label: string;
      stat2Value: string;
      stat2Label: string;
      ctaLearnMore: string;
      ctaOurWines: string;
    };
    testimonialsTitle: string;
    testimonials: {
      id: number;
      name: string;
      avatar: string;
      rating: number;
      review: string;
    }[];
    brandsTitle: string;
    brands: { name: string; logo: string }[];
    achievements: {
      title: string;
      description: string;
      tabs: {
        diplomy: string;
        ocenenia: string;
      };
      diplomy: { id: number; title: string; subtitle: string; image: string }[];
      ocenenia: { id: number; title: string; subtitle: string; image: string }[];
      showMore: string;
      showLess: string;
      ctaText: string;
      ctaWines: string;
      ctaReserve: string;
    };
  };
  about: {
    title: string;
    imagePath: string;
    content: string;
  };
  contactForm: {
    title: string;
    nameLabel: string;
    emailLabel: string;
    messageLabel: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    buttonText: string;
    successMessage: string;
    errorMessage: string;
    captchaError: string;
  };
  copyright: string;
}

// Create Context
const LocalizationContext = createContext<LocalizationData | null>(null);

export function LocalizationProvider({ children, initialData }: { children: React.ReactNode; initialData: LocalizationData }) {
  const [localization, setLocalization] = useState<LocalizationData | null>(initialData);

  useEffect(() => {
    if (initialData) {
      setLocalization(initialData);
    } else {
      fetch("/api/localization")
        .then((res) => res.json())
        .then((data) => setLocalization(data))
        .catch(() => console.error("Failed to load localization"));
    }
  }, [initialData]);

  if (!localization) {
    return <p className="text-center text-gray-600">Loading...</p>; // Show loading state while fetching
  }

  return <LocalizationContext.Provider value={localization}>{children}</LocalizationContext.Provider>;
}

// Hook for using localization data
export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error("useLocalization must be used within LocalizationProvider");
  }
  return context;
}
