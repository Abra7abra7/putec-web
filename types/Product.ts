export interface Product {
    ID: string;
    Title: string;
    Slug: string;
    Enabled: boolean;
    CatalogVisible: boolean;
    ProductCategories: string[];
    FeatureImageURL: string;
    ProductImageGallery: string[];
    ShortDescription: string;
    LongDescription: string;
    RegularPrice: string;
    SalePrice: string;
    Currency: string;
    SubscriptionEnabled: boolean;
    SubscriptionType: string;
    SaleSubscriptionType?: string;
    // Nové vlastnosti pre degustácie a sety
    ProductType?: 'wine' | 'degustation' | 'wine-set';
    Capacity?: string;
    Duration?: string;
    Features?: string[];
    Deposit?: number;
    // Rozšírené vlastnosti pre vína
    WineDetails?: {
      vintage?: string; // 2024
      color?: string; // Iskrivá zlato-žltá farba
      taste?: string; // Medovo-ovocná chuť, plná broskýň, byliniek a jemného tymiánu
      aroma?: string; // Expresívna pomarančová kôra a sušené marhule
      wineType?: string; // biele polosuché
      quality?: string; // Akostné víno
      protectedOrigin?: string; // Chránené označenie pôvodu
      region?: string; // Malokarpatská vinohradnícka oblasť
      residualSugar?: string; // 10 g/l
      sugar?: string; // 22 NM
      bottleVolume?: string; // 0,75 l
      storageTemp?: string; // 10 – 12°C
      servingTemp?: string; // 10 – 12 °C
      batchNumber?: string; // L.23
      warnings?: string; // Obsahuje siričitany
      alcoholContent?: string; // 12%
      producer?: string; // Pútec s.r.o., Pezinská 154, 902 01 Vinosady, SR
      bottler?: string; // Putec s.r.o.
      countryOfOrigin?: string; // Slovensko
      nutritionalInfoUrl?: string; // https://eanonline.gs1sk.org/...
      gtin?: string; // 08582000037412
    };
  }
  