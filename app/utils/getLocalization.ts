import fs from "fs/promises";
import path from "path";
import { cache } from "react";
import { LocalizationData } from "@/types/Localization";

// Define Localization Structure
// Interface moved to @/types/Localization

// Default Localization Fallback
const defaultLocalization: LocalizationData = {
  locale: "sk",
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
    legal: "Právne informácie",
    cart: "Váš košík",
    closeCart: "Zavrieť košík",
    cartEmpty: "Váš košík je prázdny.",
    upsellTitle: "Mohlo by sa vám hodiť",
    total: "Celkom",
    shippingFree: "Zadarmo",
    viewCart: "Zobraziť košík",
    proceedToCheckout: "Pokračovať k objednávke",
    openMenu: "Otvoriť menu",
    closeMenu: "Zatvoriť menu",
    price: "Cena",
    differentBilling: "Fakturačné údaje sú odlišné od dodacích",
    billingInformation: "Fakturačné údaje",
    sameAsShipping: "Rovnaké ako dodacie údaje",
    shippingInformation: "Dodacie údaje",
    firstName: "Meno",
    lastName: "Priezvisko",
    city: "Mesto",
    address1: "Ulica a číslo domu",
    address2: "Apartmán, poschodie atď. (voliteľné)",
    postalCode: "PSČ",
    isCompany: "Nákup ako firma",
    companyName: "Názov firmy",
    companyICO: "IČO",
    companyDIC: "DIČ",
    companyICDPH: "IČ DPH",
    orderSummary: "Súhrn objednávky",
    orderId: "Číslo objednávky",
    orderDate: "Dátum objednávky",
    orderDetails: "Detaily objednávky",
    subtotal: "Medzisúčet",
    shipping: "Doprava",
    shippingMethod: "Spôsob doručenia",
    paymentMethod: "Spôsob platby",
    accommodation: "Ubytovanie",
    tastings: "Degustácie",
    placingOrder: "Objednávam...",
    placeOrder: "Objednať",
    payNow: "Zaplatiť teraz",
    addToCart: "Pridať do košíka",
    quantity: "Množstvo",
    noShippingSelected: "Nie je vybrané",
    remove: "Odstrániť",
    unitPrice: "Jednotková cena",
    productTotal: "Celkom za produkt",
    cartTitle: "Nákupný košík",
    // Filter labels
    searchTitle: "Filtrovanie a vyhľadávanie",
    clearFilters: "Zrušiť filtre",
    searchLabel: "Vyhľadať",
    searchPlaceholderLong: "Názov, odroda, popis...",
    categoryLabel: "Kategória",
    colorLabel: "Farba vína",
    allColors: "Všetky farby",
    whiteWine: "Biele",
    redWine: "Červené",
    roseWine: "Ružové",
    priceRangeLabel: "Cenové rozpätie",
    sortByLabel: "Zoradiť podľa",
    nameAZ: "Názov (A-Z)",
    priceLowHigh: "Cena (od najnižšej)",
    priceHighLow: "Cena (od najvyššej)",
    vintageNewest: "Ročník (najnovší)",
    showingWines: "Zobrazených",
    noWinesFound: "Žiadne vína nezodpovedajú vašim filtrom",
    tryChangingFilters: "Skúste zmeniť kritériá vyhľadávania",
    // Product details
    backToWines: "Späť na vína",
    aboutWine: "O víne",
    vintage: "Ročník",
    wineType: "Typ vína",
    quality: "Akostná klasifikácia",
    region: "Vinohradnícka oblasť",
    characteristics: "Charakteristika",
    color: "Farba",
    aroma: "Vôňa",
    taste: "Chuť",
    technicalData: "Technické údaje",
    alcoholContent: "Obsah alkoholu",
    residualSugar: "Zbytkový cukor",
    sugar: "Cukor",
    bottleVolume: "Objem fľaše",
    storageTemp: "Teplota skladovania",
    servingTemp: "Teplota podávania",
    batchNumber: "Výrobná dávka",
    gtin: "GTIN",
    producer: "Výrobca",
    cartLabels: {
      backToShopping: "Späť na nákup",
      cartTitle: "Váš košík",
      emptyCart: "Váš košík je prázdny",
      price: "Cena",
      total: "Celkom",
      proceedToCheckout: "Pokračovať k objednávke",
      quantity: "Množstvo"
    },
    inquiry: {
      title: "Plánujete teambuilding alebo oslavu?",
      description: "Radi pre Vás pripravíme ponuku na mieru. Či už ide o firemnú akciu, rodinnú oslavu alebo súkromnú degustáciu so skupinovým ubytovaním.",
      capacityTitle: "Kapacita ubytovania",
      capacityDetail: "Až 15 osôb v 6 komfortných izbách.",
      tastingsTitle: "Degustácie",
      tastingsDetail: "Pripravíme riadenú ochutnávku našich vín.",
      contactUs: "Kontaktujte nás",
      traditionalWinery: "Tradičné vinárstvo Vinosady",
      nameLabel: "Meno a priezvisko",
      namePlaceholder: "Jozef Mrkva",
      emailLabel: "E-mail",
      emailPlaceholder: "jozef@firma.sk",
      phoneLabel: "Telefón",
      phonePlaceholder: "+421 9xx xxx xxx",
      peopleCountLabel: "Počet osôb (cca)",
      peopleCountPlaceholder: "napr. 12",
      dateLabel: "Predbežný termín",
      datePlaceholder: "napr. máj 2026",
      messageLabel: "Vaša predstava o akcii",
      messagePlaceholder: "Napíšte nám stručne, o čo máte záujem...",
      submitButton: "Odoslať nezáväzný dopyt",
      successMessage: "Váš dopyt bol úspešne odoslaný. Budeme Vás čoskoro kontaktovať.",
      errorMessage: "Chyba pri odosielaní dopytu. Skúste to prosím neskôr.",
      validationError: "Prosím, skontrolujte formulár"
    },
    producedBy: "Vyrobil",
    bottledBy: "Plnil",
    countryOfOrigin: "Krajina pôvodu",
    additionalInfo: "Dodatočné informácie",
    warnings: "Upozornenia",
    nutritionalInfo: "Nutričné informácie",
    viewNutritionalInfo: "Zobraziť výživové údaje",
    aboutDegustation: "O degustácii",
    capacity: "Kapacita",
    duration: "Trvanie",
    refundableDeposit: "Vratná záloha",
    includedInPackage: "Zahrnuté v balíku",
    accommodationSection: {
      whatWeOffer: "Čo ponúkame",
      facilitiesAndSpaces: "Vybavenie a priestory"
    },
    checkout: {
      fillRequiredFields: "Prosím vyplňte všetky povinné údaje vyššie pred výberom platby",
      shippingCourier: "Kurier (2-3 pracovné dni)",
      shippingPickup: "Osobne na prevádzke (Vinosady)",
      shippingFree: "Zadarmo",
      paymentCod: "Dobierka",
      paymentStripe: "Stripe (kreditná / debetná karta)",
      paymentPickup: "Osobne na prevádzke",
      fieldFirstName: "Meno",
      fieldLastName: "Priezvisko",
      fieldCountry: "Krajina",
      fieldCity: "Mesto",
      fieldAddress: "Adresa",
      fieldPostalCode: "PSČ",
      fieldEmail: "Email",
      fieldPhone: "Telefón",
      fieldShippingMethod: "Spôsob dopravy",
      fieldBillingFirstName: "Fakturačné meno",
      fieldBillingLastName: "Fakturačné priezvisko",
      fieldBillingCountry: "Fakturačná krajina",
      fieldBillingCity: "Fakturačné mesto",
      fieldBillingAddress: "Fakturačná adresa",
      fieldBillingPostalCode: "Fakturačné PSČ",
      fieldBillingEmail: "Fakturačný email",
      fieldBillingPhone: "Fakturačný telefón",
      validationRequired: "Toto pole je povinné",
      validationEmail: "Neplatný formát emailu",
      validationPSC: "Neplatné PSČ",
      companyDetails: "Firemné údaje",
      optional: "voliteľné",
      deliveryData: "Dodacie údaje",
      billingData: "Fakturačné údaje",
      shippingMethodName: "Spôsob dopravy",
      paymentSecured: "Bezpečná platba cez Stripe",
      fastDelivery: "Rýchle doručenie (SR a ČR)",
      premiumWines: "Prémiove slovenské vína",
      validationCompleteFields: "Prosím doplňte nasledujúce polia",
      codFeeLabel: "Poplatok za dobierku"
    },
    // Contact
    contactHeading: "Máte otázky? Napíšte nám!",
    contactDirectly: "Alebo nás kontaktujte priamo:",
    // Shipping/Payment
    courier: "Kurier (2-3 pracovné dni)",
    personalPickup: "Osobne na prevádzke (Vinosady)",
  },
  menu: [
    { label: "Domov", href: "/" },
    { label: "Vína", href: "/vina" },
    { label: "O nás", href: "/o-nas" },
    { label: "Kontakt", href: "/kontakt" },
  ],
  ubytovanieMenu: [
    { label: "Ubytovanie", href: "/" },
    { label: "Teambuilding", href: "/#teambuilding" },
    { label: "Rezervácia", href: "/#rezervacia" },
    { label: "Galéria", href: "/galeria/ubytovanie" },
    { label: "Vína & Vinárstvo", href: "https://vinoputec.sk" },
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
    newsletter: {
      title: "Zostaňte v obraze",
      description: "Prihláste sa na odber noviniek a získajte informácie o nových vínach a akciách.",
      placeholder: "Váš email",
      buttonText: "Odoberať",
    },
    degustaciePreview: {
      title: "Degustácie vína",
      description: "Objavte svet našich prémiových vín prostredníctvom nezabudnuteľných degustačných zážitkov.",
      whatToExpect: "Čo vás čaká:",
      features: ["Ochutnávka prémiových vín", "Vedúci degustácie", "Prehliadka vinárstva", "Studená misa"],
      ctaReserve: "Rezervovať degustáciu",
      ctaViewAll: "Zobraziť všetky balíky",
    },
    accommodationPreview: {
      title: "Ubytovanie v srdci Malých Karpát",
      description: "Prežite nezabudnuteľné chvíle v našom ubytovaní obklopenom vinohradmi a prírodou.",
      features: ["Komfortné izby", "Degustácie vína", "Krásne výhľady", "Raňajky"],
      ctaReserve: "Rezervovať ubytovanie",
      ctaDetails: "Zobraziť detaily",
    },
    brandStory: {
      title: "Víno Pútec",
      subtitle: "Tradícia a kvalita vína",
      p1: "Víno Pútec je malé rodinné vinárstvo vo Vinosadoch na úpätí Malých Karpát.",
      p2: "Sme malé rodinné vinárstvo vo Vinosadoch – naša rodina sa výrobe vína venuje už niekoľko generácií.",
      keyFeatures: [
        { title: "\"Žijeme vínom\"", description: "Víno je pre rodinu spôsobom života" },
        { title: "Moderné technológie", description: "Kombinujeme tradíciu s inováciami" }
      ],
      stat1Value: "2012",
      stat1Label: "Založenie vinárstva",
      stat2Value: "Generácie",
      stat2Label: "Rodinná tradícia",
      ctaLearnMore: "Dozvedieť sa viac",
      ctaOurWines: "Naše vína",
    },
    testimonialsTitle: "Čo hovoria naši zákazníci",
    testimonials: [],
    brandsTitle: 'Partneri',
    brands: [],
    achievements: {
      title: "Naše úspechy",
      description: "Naša vášeň pre vinárstvo ocenená na medzinárodných súťažiach.",
      tabs: {
        diplomy: "Diplomy",
        ocenenia: "Ocenenia"
      },
      diplomy: [],
      ocenenia: [],
      showMore: "Zobraziť všetky",
      showLess: "Zobraziť menej",
      ctaText: "Chcete sa dozvedieť viac?",
      ctaWines: "Naše vína",
      ctaReserve: "Rezervácia"
    }
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
  metadata: {
    title: "Vino Putec",
    description: "Rodinné vinárstvo",
  },
  copyright: "© 2026 Vino Putec. Všetky práva vyhradené.",
};

/**
 * Fetch Localization Data
 * Cached async function to load localization from JSON
 * Uses React cache() for automatic request deduplication
 */
export const getLocalization = cache(async (localeArg?: string): Promise<LocalizationData> => {
  try {
    let locale = localeArg;

    // 1. If no locale provided, try to detect it
    if (!locale) {
      // We import getting locale dynamically to avoid static-gen issues if needed
      try {
        const { getLocale } = await import('next-intl/server');
        locale = await getLocale();
      } catch (e) {
        // Fallback if called outside request context
        locale = 'sk';
      }
    }

    // 2. Load the correct JSON file based on locale
    const messagesPath = path.join(process.cwd(), `messages/${locale}.json`);

    // 3. Fallback to SK if specific locale file doesn't exist
    let dataStr = '';
    try {
      dataStr = await fs.readFile(messagesPath, "utf-8");
    } catch (e) {
      // If EN missing, fallback to SK
      const fallbackPath = path.join(process.cwd(), `messages/sk.json`);
      dataStr = await fs.readFile(fallbackPath, "utf-8");
    }

    const parsed = JSON.parse(dataStr);
    return { ...parsed, locale } as LocalizationData;
  } catch (error) {
    console.error("Error loading localization file:", error);
    return defaultLocalization;
  }
});
