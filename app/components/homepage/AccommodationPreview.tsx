"use client";

import Link from "next/link";
import { Bed, Wine, Sunrise, Coffee } from "lucide-react";
import { Section } from "../ui/section";
import { Container } from "../ui/container";
import { Button } from "../ui/button";
import { SectionHeader } from "../business/SectionHeader";
import { FeatureIcon } from "../business/FeatureIcon";
import AccommodationSliderClient from "./AccommodationSliderClient";
import { getMediaUrl } from "@/app/utils/media";
import { useLocalization } from "../../context/LocalizationContext";
import { usePathname } from "next/navigation";

export default function AccommodationPreview() {
  const { homepage } = useLocalization();

  if (!homepage?.accommodationPreview) return null;

  const { title, description, features: localizedFeatures, ctaReserve, ctaDetails } = homepage.accommodationPreview;

  const slides = [
    { src: getMediaUrl("galeria/ubytovanie/vyhlad-na-vinohrad-x.jpg"), alt: "Výhľad na vinohrad" },
    { src: getMediaUrl("galeria/ubytovanie/dvor-s-kostolom-x.jpg"), alt: "Dvor s kostolom" },
    { src: getMediaUrl("galeria/ubytovanie/dvor-so-sudom-x.jpg"), alt: "Dvor so sudom" },
    { src: getMediaUrl("galeria/ubytovanie/izba-interier-x.jpg"), alt: "Interiér izby" },
    { src: getMediaUrl("galeria/ubytovanie/kuchyna-x.jpg"), alt: "Kuchyňa" },
    { src: getMediaUrl("galeria/ubytovanie/kupelna-2-x.jpg"), alt: "Kúpeľňa" },
  ];

  const icons = [<Bed className="w-5 h-5" />, <Wine className="w-5 h-5" />, <Sunrise className="w-5 h-5" />, <Coffee className="w-5 h-5" />];

  const pathname = usePathname();
  const localePrefix = pathname.startsWith('/en') ? '/en' : '';
  const getLocalizedLink = (path: string) =>
    path.startsWith('/en') || path.startsWith('http') ? path : `${localePrefix}${path}`;

  return (
    <Section>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
          {/* Content - Text HORE na mobile, vpravo na desktop */}
          <div className="flex flex-col justify-center order-1 md:order-2">
            <SectionHeader
              title={title}
              description={description}
              showLogo
            />

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {localizedFeatures.map((feature: string, index: number) => (
                <div key={feature} className="flex items-center gap-3">
                  <FeatureIcon icon={icons[index % icons.length]} />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
              <Button asChild>
                <Link href={getLocalizedLink("/ubytovanie")}>{ctaReserve}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={getLocalizedLink("/ubytovanie")}>{ctaDetails}</Link>
              </Button>
            </div>
          </div>

          {/* Slider - DOLE na mobile, vľavo na desktop */}
          <div className="order-2 md:order-1">
            <AccommodationSliderClient slides={slides} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
