import type { Metadata } from "next";
import HomepageBanner from "@/app/components/homepage/HomepageBanner";
import dynamic from "next/dynamic";
import { getGoogleRating } from "@/app/utils/getGoogleRating";

import { getMediaUrl } from "@/app/utils/media";

// Lazy-load below-the-fold sections to improve LCP/TBT
const DegustaciePreview = dynamic(() => import("@/app/components/homepage/DegustaciePreview"), { ssr: true });
const AccommodationPreview = dynamic(() => import("@/app/components/homepage/AccommodationPreview"), { ssr: true });
const BrandStory = dynamic(() => import("@/app/components/homepage/BrandStory"), { ssr: true });
const Testimonials = dynamic(() => import("@/app/components/homepage/Testimonials"), { ssr: true, loading: () => null });
const NewsletterSignup = dynamic(() => import("@/app/components/homepage/NewsletterSignup"), { ssr: true, loading: () => null });
const Achievements = dynamic(() => import("@/app/components/homepage/Achievements"), { ssr: true, loading: () => null });


// Set page metadata
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.home' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      type: "website",
      locale: locale === 'sk' ? 'sk_SK' : 'en_US',
      images: [
        {
          url: getMediaUrl("/o-nas/rodina2.jpg"),
          width: 1200,
          height: 630,
          alt: "Rodinné vinárstvo Putec Vinosady",
        },
      ],
    },
    alternates: {
      canonical: "https://vinoputec.sk",
      languages: {
        'sk-SK': '/',
        'en-US': '/en',
      },
    },
  };
}

export default async function Home() {
  const googleRating = await getGoogleRating();

  return (
    <main>
      <HomepageBanner ratingValue={googleRating.rating} reviewCount={googleRating.totalReviews} />

      <DegustaciePreview />
      <AccommodationPreview />

      <BrandStory />
      <Testimonials />
      <NewsletterSignup />
      <Achievements />

    </main>
  );
}
