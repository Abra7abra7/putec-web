import fs from "fs/promises";
import path from "path";
import { cache } from "react";

// Define Localization Structure
interface LocalizationData {
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
  };
  menu: { label: string; href: string }[];
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
    brandStory: {
      title: string;
      description: string;
      buttonText: string;
      ctaLink: string;
    };
    newsletter: {
      title: string;
      description: string;
      placeholder: string;
      buttonText: string;
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
  };
  about: {
    title: string,
    imagePath: string,
    content: string
  },
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

// Default Localization Fallback
const defaultLocalization: LocalizationData = {
  email: "info@vinoputec.sk",
  phone: "+421 903 465 666",
  address: "Pezinská 154, 902 01 Vinosady",
  siteName: "Vino Putec",
  siteTagline: "Rodinné vinárstvo",
  labels: {
    email: "Email",
    phone: "Telefón",
    address: "Adresa",
    quickLinks: "Rýchle odkazy",
    contactUs: "Kontaktujte nás",
    followUs: "Sledujte nás",
    searchPlaceholder: "Hľadať produkty...",
    allCategories: "Všetky kategórie",
    sortByName: "Zoradiť podľa mena",
    sortByPrice: "Zoradiť podľa ceny",
    sortByNewest: "Zoradiť od najnovších",
    loadingProducts: "Načítavam produkty...",
    noProductsFound: "Neboli nájdené žiadne produkty...",
    productDetails: "Detaily produktu",
    products: "Vína",
    recentProducts: "Nedávne produkty",
    orderConfirmationTitle: "Potvrdenie objednávky",
    orderConfirmationMessage: "Vaša objednávka bola úspešne odoslaná. Budeme vás informovať o jej spracovaní.",
  },
  menu: [
    { label: "Domov", href: "/" },
    { label: "Vína", href: "/vina" },
    { label: "O nás", href: "/o-nas" },
    { label: "Kontakt", href: "/kontakt" },
  ],
  footerLinks: [
    { label: "Domov", href: "/" },
    { label: "Vína", href: "/vina" },
    { label: "Degustácie", href: "/degustacie" },
    { label: "Ubytovanie", href: "/ubytovanie" },
  ],
  legalLinks: [
    { label: "Ochrana súkromia", href: "/ochrana-sukromia" },
    { label: "Obchodné podmienky", href: "/obchodne-podmienky" },
  ],
  socialLinks: [
    { id: "facebook", icon: "SiFacebook", url: "https://www.facebook.com/vinoputec" },
    { id: "instagram", icon: "SiInstagram", url: "https://www.instagram.com/vinoputec/" },
    { id: "youtube", icon: "SiYoutube", url: "https://www.youtube.com/channel/UC4jSLd6VZSsxC34-lS7fFMw" },
  ],
  homepage: {
    banner: {
      title: "Vitajte vo Vino Putec",
      subtitle: "Rodinné vinárstvo z Vinosád",
      buttonText: "Naša ponuka",
      imagePath: "/o-nas/rodina1.JPG",
      ctaLink: "/vina",
    },
    brandStory: {
      title: "Náš príbeh",
      description:
        "Sme rodinné vinárstvo oddané tradícii a kvalite. Naša misia je prinášať vám tie najlepšie vína z Malokarpatskej oblasti.",
      buttonText: "Čítať viac",
      ctaLink: "/o-nas",
    },
    newsletter: {
      title: "Zostaňte v obraze",
      description: "Prihláste sa na odber noviniek a získajte informácie o nových vínach a akciách.",
      placeholder: "Váš email",
      buttonText: "Odoberať",
    },
    testimonialsTitle: "Čo hovoria naši zákazníci",
    testimonials: [],
    brandsTitle: 'Partneri',
    brands: []
  },
  about: {
    title: "O našom rodinnom vinárstve",
    imagePath: "/o-nas/rodina1.JPG",
    content:
      "Sme rodinné vinárstvo oddané tradícii a kvalite. Naša misia je prinášať vám tie najlepšie vína z Malokarpatskej oblasti.",
  },
  contactForm: {
    title: "Napíšte nám",
    nameLabel: "Meno",
    emailLabel: "Email",
    messageLabel: "Správa",
    namePlaceholder: "Vaše meno",
    emailPlaceholder: "Váš email",
    messagePlaceholder: "Ako vám môžeme pomôcť?",
    buttonText: "Odoslať správu",
    successMessage: "Správa bola úspešne odoslaná.",
    errorMessage: "Nepodarilo sa odoslať správu.",
    captchaError: "Prosím, potvrďte, že nie ste robot."
  },
  copyright: "© 2026 Vino Putec. Všetky práva vyhradené.",
};

/**
 * Fetch Localization Data
 * Cached async function to load localization from JSON
 * Uses React cache() for automatic request deduplication
 */
export const getLocalization = cache(async (): Promise<LocalizationData> => {
  try {
    const localePath = path.join(process.cwd(), "configs/locale.en.json");
    const data = await fs.readFile(localePath, "utf-8");
    return JSON.parse(data) as LocalizationData;
  } catch (error) {
    console.error("Error loading localization file:", error);
    return defaultLocalization;
  }
});
