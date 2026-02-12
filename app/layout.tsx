import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CookiesBanner from "./components/CookiesBanner";
import { LocalizationProvider } from "./context/LocalizationContext";
import { getLocalization } from "./utils/getLocalization";
import { ReduxProvider } from "./providers";
import type { Metadata } from "next";

// Primary font (Body)
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

// Secondary font (Headings)
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vino Putec - Rodinné vinárstvo vo Vinosadoch | Pezinok",
  description: "Prémiové vína z Vinosád. Degustácie a ubytovanie v srdci Malokarpatskej oblasti. Blízko miest Pezinok, Bratislava, Senec a Trnava.",
  metadataBase: new URL("https://vino-putec-web.vercel.app"),
  keywords: ["Vino Putec", "Vinosady", "Pezinok", "Bratislava", "Trnava", "Senec", "Slovenské víno", "Degustácia vína", "Ubytovanie Pezinok", "Malokarpatská vínna cesta"],
  icons: {
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon-32.png",
    apple: "/favicon-192.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sk">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Winery",
              "name": "Vino Pútec",
              "url": "https://vinoputec.sk",
              "image": "https://vinoputec.sk/putec-logo.jpg",
              "logo": "https://vinoputec.sk/putec-logo.jpg",
              "description": "Rodinné vinárstvo vo Vinosadoch s tradíciou. Ponúkame prémiové vína, degustácie a ubytovanie.",
              "aggregateRating": { "@type": "AggregateRating", "ratingValue": 5, "reviewCount": 31 },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Pezinská 154",
                "addressLocality": "Vinosady",
                "postalCode": "902 01",
                "addressCountry": "SK"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 48.3092284,
                "longitude": 17.2952674
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "08:00",
                  "closes": "16:00"
                }
              ],
              "telephone": "+421 903465666",
              "email": "info@vinoputec.sk",
              "priceRange": "€€",
              "servesCuisine": "Slovak",
              "sameAs": [
                "https://www.facebook.com/vinoputec",
                "https://www.instagram.com/vinoputec/",
                "https://www.youtube.com/channel/UC4jSLd6VZSsxC34-lS7fFMw"
              ],
              "areaServed": [
                { "@type": "City", "name": "Vinosady" },
                { "@type": "City", "name": "Pezinok" },
                { "@type": "City", "name": "Bratislava" },
                { "@type": "City", "name": "Senec" },
                { "@type": "City", "name": "Trnava" },
                { "@type": "AdministrativeArea", "name": "Bratislavský kraj" }
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Vína karta",
                "itemListElement": [
                  { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Degustácia vín" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Ubytovanie Kúria Vinosady" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Predaj vína" } }
                ]
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "url": "https://vinoputec.sk",
              "name": "Vino Putec",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://vinoputec.sk/vina?query={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body
        className={`
          antialiased
          ${inter.variable}
          ${poppins.variable}
        `}
      >
        <ReduxProvider>
          <LocalizationProvider initialData={await getLocalization()}>
            <Header />
            <main className="flex-grow min-h-screen">
              {children}
            </main>
            <Footer />
            <CookiesBanner />
          </LocalizationProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
