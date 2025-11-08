import type { Metadata } from "next";
import HomepageBanner from "./components/homepage/HomepageBanner";
import dynamic from "next/dynamic";

// Lazy-load below-the-fold sections to improve LCP/TBT
const DegustaciePreview = dynamic(() => import("./components/homepage/DegustaciePreview"), { ssr: true });
const AccommodationPreview = dynamic(() => import("./components/homepage/AccommodationPreview"), { ssr: true });
const BrandStory = dynamic(() => import("./components/homepage/BrandStory"), { ssr: true });
const Testimonials = dynamic(() => import("./components/homepage/Testimonials"), { ssr: true, loading: () => null });
const NewsletterSignup = dynamic(() => import("./components/homepage/NewsletterSignup"), { ssr: true, loading: () => null });
const Achievements = dynamic(() => import("./components/homepage/Achievements"), { ssr: true, loading: () => null });


// Set page metadata
export const metadata: Metadata = {
  title: "Vino Putec - Rodinné vinárstvo Pezinok | Ubytovanie Vinosady | Degustácie vína",
  description: "Prémiové vína z Vinosád, ubytovanie a degustácie vína v Pezinku. Rodinné vinárstvo s tradíciou pre Bratislavu, Senec, Trnavu a okolie. Rezervujte si ubytovanie a degustácie vína už dnes.",
  keywords: "víno, vinárstvo, Putec, Vinosady, Pezinok, Bratislava, Senec, Trnava, rodinné vinárstvo, prémiové vína, ubytovanie, degustácie vína",
  openGraph: {
    title: "Vino Putec - Rodinné vinárstvo Pezinok",
    description: "Prémiové vína z Vinosád, ubytovanie a degustácie vína v Pezinku",
    type: "website",
    locale: "sk_SK",
    images: [
      {
        url: "/o-nas/rodina2.jpg",
        width: 1200,
        height: 630,
        alt: "Rodinné vinárstvo Putec Vinosady",
      },
    ],
  },
  alternates: {
    canonical: "https://vinoputec.sk",
  },
};

export default function Home() {
  return (
    <main>
      <HomepageBanner />
      
      <DegustaciePreview />
      <AccommodationPreview />
      
      <BrandStory />
      <Testimonials />
      <NewsletterSignup />
      <Achievements />
      
    </main>
  );
}
