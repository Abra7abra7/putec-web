import { getTranslations } from "next-intl/server";
import ContactUsForm from "../../components/ContactUsForm";
import dynamic from "next/dynamic";
import type { Metadata } from "next";

// Dynamic import for GoogleMaps - only loads when page is visited
const GoogleMaps = dynamic(() => import("../../components/GoogleMaps"), {
  loading: () => (
    <div className="w-full h-[400px] bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Načítavam mapu...</p>
    </div>
  ),
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.contact" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: "https://vinoputec.sk/kontakt",
      languages: {
        "sk-SK": "/kontakt",
        "en-US": "/en/kontakt",
      },
    },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  return (
    <main>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12">
        <div className="flex flex-col gap-12">
          {/* Contact Form */}
          <div>
            <ContactUsForm />
          </div>

          {/* Google Maps */}
          <div>
            <GoogleMaps />
          </div>
        </div>
      </div>
    </main>
  );
}