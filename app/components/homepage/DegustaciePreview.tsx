"use client";

import Link from "next/link";
import { Wine, Users, MapPin, ChefHat } from "lucide-react";
import { Section } from "../ui/section";
import { Container } from "../ui/container";
import { Button } from "../ui/button";
import { SectionHeader } from "../business/SectionHeader";
import { FeatureIcon } from "../business/FeatureIcon";
import DegustationSliderClient from "./DegustationSliderClient";
import { getMediaUrl } from "../../utils/media";
import { useLocalization } from "../../context/LocalizationContext";
import { usePathname } from "next/navigation";

export default function DegustaciePreview() {
  const { homepage } = useLocalization();

  if (!homepage?.degustaciePreview) return null;

  const { title, description, whatToExpect, features: localizedFeatures, ctaReserve, ctaViewAll } = homepage.degustaciePreview;

  const slides = [
    { src: getMediaUrl("degustacie/brano-degustacia-x.jpg"), alt: "Degustácia s majiteľom", position: "top" },
    { src: getMediaUrl("degustacie/degustacia-skupina.jpg"), alt: "Degustácia so skupinou", position: "center" },
    { src: getMediaUrl("degustacie/degustacia-x.jpg"), alt: "Degustácia - atmosféra", position: "center" },
    { src: getMediaUrl("degustacie/IMG_6063-2.jpg"), alt: "Ochutnávka vína", position: "top" },
    { src: getMediaUrl("degustacie/degustacia-brano-x.jpg"), alt: "Degustácia vo vinárstva", position: "top" },
  ];

  // For simplicity, keeping packages as is for now or could move to JSON later
  const packages = [
    { icon: <Wine className="w-5 h-5" />, title: "Malá vínna chvíľka", people: "2-5 osôb", price: "119€" },
    { icon: <Wine className="w-5 h-5" />, title: "Víno trochu inak", people: "6-9 osôb", price: "295,90€" },
    { icon: <Wine className="w-5 h-5" />, title: "Víno trochu inak Vol.2", people: "10-15 osôb", price: "490€" },
    { icon: <Wine className="w-5 h-5" />, title: "Romantika na deke", people: "2 osoby", price: "59,90€" },
  ];

  const icons = [<Wine className="w-5 h-5" />, <Users className="w-5 h-5" />, <MapPin className="w-5 h-5" />, <ChefHat className="w-5 h-5" />];

  const pathname = usePathname();
  const localePrefix = pathname.startsWith('/en') ? '/en' : '';
  const getLocalizedLink = (path: string) =>
    path.startsWith('/en') || path.startsWith('http') ? path : `${localePrefix}${path}`;

  return (
    <Section>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
          {/* Content - Text HORE na mobile, vľavo na desktop */}
          <div className="flex flex-col justify-center order-1 md:order-1">
            <SectionHeader
              title={title}
              description={description}
              showLogo
            />

            {/* Package Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {packages.map((pkg) => (
                <div key={pkg.title} className="flex items-center gap-3">
                  <FeatureIcon icon={pkg.icon} />
                  <div>
                    <span className="text-foreground font-semibold block">{pkg.title}</span>
                    <p className="text-foreground-muted text-sm">{pkg.people} • {pkg.price}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">{whatToExpect}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {localizedFeatures.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-foreground font-bold">✓</span>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
              <Button asChild>
                <Link href={getLocalizedLink("/degustacie")}>{ctaReserve}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={getLocalizedLink("/degustacie")}>{ctaViewAll}</Link>
              </Button>
            </div>
          </div>

          {/* Slider - vpravo na desktop, DOLE na mobile */}
          <div className="order-2 md:order-2">
            <DegustationSliderClient slides={slides} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
