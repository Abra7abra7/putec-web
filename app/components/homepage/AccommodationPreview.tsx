import Link from "next/link";
import fs from "fs";
import path from "path";
import { Bed, Wine, Sunrise, Coffee } from "lucide-react";
import { Section } from "../ui/section";
import { Container } from "../ui/container";
import { Button } from "../ui/button";
import { SectionHeader } from "../business/SectionHeader";
import { FeatureIcon } from "../business/FeatureIcon";
import AccommodationSliderClient from "./AccommodationSliderClient";

function listImagesFrom(dirPath: string): string[] {
  try {
    if (!fs.existsSync(dirPath)) return [];
    const files = fs.readdirSync(dirPath);
    const images = files.filter((name) => /\.(png|jpe?g|webp|avif)$/i.test(name));
    return images.map((file) => `/galeria/ubytovanie/${file}`);
  } catch {
    return [];
  }
}

export default async function AccommodationPreview() {
  const base = path.join(process.cwd(), "public", "galeria", "ubytovanie");
  const slides = listImagesFrom(base).slice(0, 8);

  const features = [
    { icon: <Bed className="w-5 h-5" />, label: "Komfortné izby" },
    { icon: <Wine className="w-5 h-5" />, label: "Degustácie vína" },
    { icon: <Sunrise className="w-5 h-5" />, label: "Krásne výhľady" },
    { icon: <Coffee className="w-5 h-5" />, label: "Raňajky" },
  ];

  return (
    <Section>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
          {/* Content - Text vpravo na desktop */}
          <div className="flex flex-col justify-center order-2 md:order-2">
            <SectionHeader
              title="Ubytovanie v srdci Malých Karpát"
              description="Prežite nezabudnuteľné chvíle v našom ubytovaní obklopenom vinohradmi a prírodou. Ideálne miesto pre relaxáciu a degustácie našich prémiových vín."
              showLogo
            />

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {features.map((feature) => (
                <div key={feature.label} className="flex items-center gap-3">
                  <FeatureIcon icon={feature.icon} />
                  <span className="text-foreground">{feature.label}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
              <Button asChild>
                <Link href="/ubytovanie">Rezervovať ubytovanie</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/ubytovanie">Zobraziť detaily</Link>
              </Button>
            </div>
          </div>

          {/* Slider second on mobile */}
          <div className="order-1 md:order-1">
            <AccommodationSliderClient slides={slides} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
