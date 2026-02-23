"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Cog, Star as StarIcon, Wine as WineIcon } from "lucide-react";
import { Section } from "../ui/section";
import { Container } from "../ui/container";
import { Button } from "../ui/button";
import { FeatureIcon } from "../business/FeatureIcon";
import { getMediaUrl } from "../../utils/media";
import { useLocalization } from "../../context/LocalizationContext";
import { usePathname } from "next/navigation";

export default function BrandStory() {
  const { homepage } = useLocalization();

  if (!homepage?.brandStory) return null;

  const { title, subtitle, p1, p2, keyFeatures, stat1Value, stat1Label, stat2Value, stat2Label, ctaLearnMore, ctaOurWines } = homepage.brandStory;

  const icons = [<Heart className="w-6 h-6" />, <Cog className="w-6 h-6" />, <StarIcon className="w-6 h-6" />, <WineIcon className="w-6 h-6" />];

  const pathname = usePathname();
  const localePrefix = pathname.startsWith('/en') ? '/en' : '';
  const getLocalizedLink = (path: string) =>
    path.startsWith('/en') || path.startsWith('http') ? path : `${localePrefix}${path}`;

  return (
    <Section spacing="lg" background="accent">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">

          {/* Left Side - Content (hore na mobile, vľavo na desktop) */}
          <div className="space-y-8 order-1 md:order-1">
            <div className="space-y-4">
              <h2 className="text-foreground">
                {title}
              </h2>
              <p className="text-xl md:text-2xl text-accent font-semibold">
                {subtitle}
              </p>
            </div>

            <div className="space-y-6 text-foreground-muted">
              <p className="text-base md:text-lg leading-relaxed">
                {p1}
              </p>

              <p className="text-base md:text-lg leading-relaxed">
                {p2}
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(keyFeatures ?? []).map((feature: { title: string; description: string }, index: number) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <FeatureIcon icon={icons[index % icons.length]} size="sm" className="mt-1" />
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-foreground-muted">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <Button asChild size="lg">
                <Link href={getLocalizedLink("/o-nas")}>{ctaLearnMore}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={getLocalizedLink("/vina")}>{ctaOurWines}</Link>
              </Button>
            </div>
          </div>

          {/* Right Side - Image (dole na mobile, vpravo na desktop) */}
          <div className="relative order-2 md:order-2 pt-6 pb-6 pl-6">
            <div className="relative">
              <Image
                src={getMediaUrl("o-nas/rodina2.jpg")}
                alt={`${title} - ${subtitle}`}
                width={500}
                height={333}
                className="rounded-2xl shadow-2xl w-full h-auto"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                quality={60}
                fetchPriority="low"
              />
              <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-accent rounded-full flex items-center justify-center shadow-xl">
                <span className="text-2xl">🍷</span>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute top-4 -left-4 bg-white/90 backdrop-blur-md border-2 border-accent/30 rounded-2xl p-4 shadow-2xl z-20 min-w-[140px] hover:scale-105 transition-transform duration-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-0.5">{stat1Value}</div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-foreground/60">{stat1Label}</div>
              </div>
            </div>

            <div className="absolute -bottom-4 left-6 bg-white/90 backdrop-blur-md border-2 border-accent/30 rounded-2xl p-4 shadow-2xl z-20 min-w-[140px] hover:scale-105 transition-transform duration-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-0.5">{stat2Value}</div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-foreground/60">{stat2Label}</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
