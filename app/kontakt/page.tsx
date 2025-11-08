import ContactUsForm from "../components/ContactUsForm";
import dynamic from "next/dynamic";
import type { Metadata } from "next";

// Dynamic import for GoogleMaps - only loads when page is visited
const GoogleMaps = dynamic(() => import("../components/GoogleMaps"), {
  loading: () => (
    <div className="w-full h-[400px] bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Načítavam mapu...</p>
    </div>
  ),
});

export const metadata: Metadata = {
  title: "Kontakt | Putec Vinosady | Kontaktné údaje vinárstva",
  description: "Kontakt na rodinné vinárstvo Putec vo Vinosadoch pri Pezinku. Adresa, telefón, email. Kontaktujte nás pre vína, ubytovanie a degustácie. Bratislava, Senec, Trnava.",
  keywords: "kontakt, Putec, Vinosady, Pezinok, adresa, telefón, email, vinárstvo, Bratislava, Senec, Trnava",
  openGraph: {
    title: "Kontakt | Putec Vinosady",
    description: "Kontaktné údaje rodinného vinárstva Putec vo Vinosadoch",
    type: "website",
    locale: "sk_SK",
  },
  alternates: {
    canonical: "https://vinoputec.sk/kontakt",
  },
};

export default function ContactPage() {
    return (
      <main>
        <div className="flex flex-col gap-8">
          {/* Contact Form */}
          <div>
            <ContactUsForm />
          </div>
          
          {/* Google Maps */}
          <div>
            <GoogleMaps />
          </div>
        </div>
      </main>
    );
  }