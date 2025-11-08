import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CookiesBanner from "./components/CookiesBanner";
import { LocalizationProvider } from "./context/LocalizationContext";
import { ReduxProvider } from "./providers";
import type { Metadata } from "next";

// Load single font family for whole site (lighter payload)
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Vino Putec - Rodinné vinárstvo vo Vinosadoch",
  description: "Prémiové vína z Vinosád, ubytovanie a degustácie vína v Pezinku",
  metadataBase: new URL("https://vino-putec-web.vercel.app"),
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

export default function RootLayout({
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
              "name": "Vino Putec",
              "url": "https://vinoputec.sk",
              "image": "https://vinoputec.sk/putec-logo.jpg",
              "aggregateRating": {"@type":"AggregateRating","ratingValue": 5, "reviewCount": 31},
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Pezinská 154",
                "addressLocality": "Vinosady",
                "postalCode": "902 01",
                "addressCountry": "SK"
              },
              "telephone": "+421 903465666",
              "priceRange": "€€",
              "servesCuisine": "Slovak",
              "sameAs": [
                "https://www.facebook.com/vinoputec",
                "https://www.instagram.com/vinoputec/",
                "https://www.youtube.com/channel/UC4jSLd6VZSsxC34-lS7fFMw"
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Vino Putec",
              "url": "https://vinoputec.sk",
              "logo": "https://vinoputec.sk/putec-logo.jpg",
              "aggregateRating": {"@type":"AggregateRating","ratingValue": 5, "reviewCount": 31},
              "sameAs": [
                "https://www.facebook.com/vinoputec",
                "https://www.instagram.com/vinoputec/",
                "https://www.youtube.com/channel/UC4jSLd6VZSsxC34-lS7fFMw"
              ],
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Pezinská 154",
                "addressLocality": "Vinosady",
                "postalCode": "902 01",
                "addressCountry": "SK"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+421 903465666",
                "contactType": "customer service",
                "areaServed": "SK"
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
        <style dangerouslySetInnerHTML={{
          __html: `
            body { 
              margin: 0; 
              font-family: ${inter.style.fontFamily}, system-ui, sans-serif;
              background-color: #ffffff;
              color: #000000;
            }
            * { box-sizing: border-box; }
          `
        }} />
      </head>
      <body
        className={`
          antialiased
          ${inter.variable}
        `}
      >
        <ReduxProvider>
          <LocalizationProvider>
            <Header />
            {children}
            <Footer />
            <CookiesBanner />
          </LocalizationProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
