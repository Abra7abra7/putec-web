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
import { getLocalization } from "@/app/utils/getLocalization";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins"
});

export const metadata = {
  title: "Vino Putec",
  description: "Rodinné vinárstvo v srdci Malokarpatskej oblasti",
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
  if (!['sk'].includes(locale)) {
    notFound();
  }

  const messages = await getMessages();
  const localizationData = await getLocalization();

  return (
    <html lang={locale} className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <LocalizationProvider initialData={localizationData}>
          <Providers>
            <Header />
            {children}
            <Footer />
            <Toaster position="top-center" />
          </Providers>
                  </LocalizationProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}