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
import Script from 'next/script';
import ConsentManagerInitializer from "@/app/components/ConsentManagerInitializer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins"
});

import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    metadataBase: new URL('https://vinoputec.sk'),
    title: {
      default: t('title'),
      template: "%s | Vino Putec"
    },
    description: t('description'),
    keywords: t('keywords').split(',').map(k => k.trim()),
    authors: [{ name: "Vino Putec" }],
    creator: "Vino Putec",
    publisher: "Vino Putec",
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: 'https://vinoputec.sk',
      siteName: 'Vino Putec',
      locale: locale === 'sk' ? 'sk_SK' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('twitterTitle'),
      description: t('twitterDescription'),
    },
    alternates: {
      canonical: '/',
      languages: {
        'sk-SK': '/',
        'en-US': '/en',
      },
    }
  };
}

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
      <head>
        {/* Google Consent Mode v2 Default State - MUST BE BEFORE GTM */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied',
                'functionality_storage': 'granted',
                'security_storage': 'granted',
                'wait_for_update': 500
              });
            `,
          }}
        />
        <link rel="stylesheet" href="/silktide-consent-manager.css" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <LocalizationProvider initialData={localizationData}>
            <Providers>
              <Header locale={locale} />
              <main className="flex-grow flex flex-col">
                {children}
              </main>
              <Footer />
              <JsonLd data={winerySchema} />
              <Toaster position="top-center" />
              <ConsentManagerInitializer />
            </Providers>
          </LocalizationProvider>
        </NextIntlClientProvider>
        <Script
          src="/silktide-consent-manager.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}