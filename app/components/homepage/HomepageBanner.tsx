"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocalization } from "../../context/LocalizationContext";
import RatingBadge from "../RatingBadge";
import { Button } from "../ui/button";
import { getMediaUrl } from "../../utils/media";

interface HomepageBannerProps {
  ratingValue?: number;
  reviewCount?: number;
}

export default function HomepageBanner({ ratingValue = 5, reviewCount = 35 }: HomepageBannerProps) {
  const { homepage } = useLocalization();

  if (!homepage?.banner) {
    return null;
  }

  const { buttonText, ctaLink, imagePath } = homepage.banner;
  const mediaUrl = getMediaUrl(imagePath);

  return (
    <section
      className="w-full relative overflow-hidden text-white flex justify-center items-center text-center"
      style={{ minHeight: "500px" }}
    >
      {/* LCP image as Next/Image with priority to improve LCP */}
      <Image
        src={mediaUrl}
        alt="Vinohrad Putec – úvodný banner"
        fill
        priority
        loading="eager"
        fetchPriority="high"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 1200px, 1920px"
        placeholder="empty"
        quality={60}
        style={{ objectFit: "cover", objectPosition: "center" }}
        className="z-0"
      />
      {/* Stronger gradient overlay for better text contrast on mobile */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-10" aria-hidden />

      <div className="relative z-20 max-w-4xl mx-auto px-6 py-32 md:py-48 flex flex-col items-center text-center">
        <RatingBadge ratingValue={ratingValue} reviewCount={reviewCount} className="mb-4" />

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-6 drop-shadow-2xl !text-white tracking-tight">
          Rodinné vinárstvo Putec
        </h1>

        <p className="text-lg md:text-xl lg:text-2xl mb-10 max-w-2xl drop-shadow-xl !text-white font-medium text-white/90">
          Prémiové vína z Vinosád, ubytovanie a degustácie vína v Pezinku
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
          <Button asChild variant="primary" size="lg" className="w-full sm:w-auto min-w-[200px] shadow-lg hover:shadow-xl">
            <Link href={ctaLink}>
              {buttonText}
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto min-w-[200px] bg-white/10 backdrop-blur-sm border-white hover:bg-white hover:text-foreground shadow-lg hover:shadow-xl">
            <Link href="/ubytovanie">
              Ubytovanie
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto min-w-[200px] bg-white/10 backdrop-blur-sm border-white hover:bg-white hover:text-foreground shadow-lg hover:shadow-xl">
            <Link href="/degustacie">
              Degustácie
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
