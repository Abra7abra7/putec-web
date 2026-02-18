import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import "@/app/globals.css";
import { Inter, Poppins } from "next/font/google";
import { ReduxProvider as Providers } from "@/app/providers";
import { Toaster } from 'sonner';
import { LocalizationProvider } from "@/app/context/LocalizationContext";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import JsonLd from "@/app/components/JsonLd";
import { getLocalization } from "@/app/utils/getLocalization";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins"
});

export const metadata = {
  metadataBase: new URL('https://vinoputec.sk'),
  title: {
    default: "Vino Putec - Rodinné vinárstvo Pezinok, Vinosady",
    template: "%s | Vino Putec"
  },
  description: "Rodinné vinárstvo v srdci Malokarpatskej oblasti. Ponúkame degustácie vína, ubytovanie vo Vinosadoch a predaj kvalitných odrodových vín.",
  keywords: ["víno", "vinárstvo", "Pezinok", "Vinosady", "degustácia", "ubytovanie", "Malokarpatská oblasť", "slovenské víno"],
  authors: [{ name: "Vino Putec" }],
  creator: "Vino Putec",
  publisher: "Vino Putec",
  openGraph: {
    title: "Vino Putec - Rodinné vinárstvo",
    description: "Tradičné rodinné vinárstvo z Vinosád. Objavte naše vína, rezervujte si degustáciu alebo ubytovanie.",
    url: 'https://vinoputec.sk',
    siteName: 'Vino Putec',
    locale: 'sk_SK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Vino Putec",
    description: "Rodinné vinárstvo Pezinok - Vinosady",
  },
  alternates: {
    canonical: './',
  }
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!['sk', 'en'].includes(locale)) {
    notFound();
  }

  const messages = await getMessages();
  const localizationData = await getLocalization();

  const winerySchema = {
    "@context": "https://schema.org",
    "@type": "Winery",
    "name": "Vino Putec",
    "image": "https://vinoputec.sk/putec-logo.jpg",
    "url": "https://vinoputec.sk",
    "telephone": localizationData.phone,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Vinosady",
      "postalCode": "902 01",
      "addressCountry": "SK"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 48.3082,
      "longitude": 17.2934
    },
    "priceRange": "€€",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "08:00",
      "closes": "16:00"
    }
  };

  return (
    <html lang={locale} className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <LocalizationProvider initialData={localizationData}>
            <Providers>
              <Header />
              {children}
              <Footer />
              <JsonLd data={winerySchema} />
              <Toaster position="top-center" />
            </Providers>
          </LocalizationProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}