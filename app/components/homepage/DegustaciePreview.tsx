"use client";

import Link from "next/link";
import { Wine, Users, MapPin, ChefHat } from "lucide-react";
import { Section } from "../ui/section";
import { Container } from "../ui/container";
import { Button } from "../ui/button";
import { SectionHeader } from "../business/SectionHeader";
import { FeatureIcon } from "../business/FeatureIcon";
import DegustationSliderClient from "./DegustationSliderClient";

export default function DegustaciePreview() {
  const slides = [
    { src: "/degustacie/brano-degustacia-x.jpg", alt: "Degustácia s majiteľom", position: "top" }, // Image 1 (Starts at top to see heads)
    { src: "/degustacie/degustacia-skupina.jpg", alt: "Degustácia so skupinou", position: "center" },
    { src: "/degustacie/degustacia-x.jpg", alt: "Degustácia - atmosféra", position: "center" },
    { src: "/degustacie/IMG_6063-2.jpg", alt: "Ochutnávka vína", position: "top" }, // Image 4 (Focus on top)
    { src: "/degustacie/degustacia-brano-x.jpg", alt: "Degustácia vo vinárstva", position: "top" }, // Image 5 (Focus on top)
  ];

  const packages = [
    { icon: <Wine className="w-5 h-5" />, title: "Malá vínna chvíľka", people: "2-5 osôb", price: "119€" },
    { icon: <Wine className="w-5 h-5" />, title: "Víno trochu inak", people: "6-9 osôb", price: "295,90€" },
    { icon: <Wine className="w-5 h-5" />, title: "Víno trochu inak Vol.2", people: "10-15 osôb", price: "490€" },
    { icon: <Wine className="w-5 h-5" />, title: "Romantika na deke", people: "2 osoby", price: "59,90€" },
  ];

  const features = [
    { icon: <Wine className="w-5 h-5" />, label: "Ochutnávka prémiových vín" },
    { icon: <Users className="w-5 h-5" />, label: "Vedúci degustácie" },
    { icon: <MapPin className="w-5 h-5" />, label: "Prehliadka vinárstva" },
    { icon: <ChefHat className="w-5 h-5" />, label: "Studená misa" },
  ];

  return (
    <Section>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
          {/* Content - Text HORE na mobile, vľavo na desktop */}
          <div className="flex flex-col justify-center order-1 md:order-1">
            <SectionHeader
              title="Degustácie vína"
              description="Objavte svet našich prémiových vín prostredníctvom nezabudnuteľných degustačných zážitkov. Vyberte si z našich špeciálne pripravených balíkov pre rôzne veľkosti skupín."
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
              <h3 className="text-lg font-semibold text-foreground mb-4">Čo vás čaká:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-foreground font-bold">✓</span>
                    <span className="text-foreground">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
              <Button asChild>
                <Link href="/degustacie">Rezervovať degustáciu</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/degustacie">Zobraziť všetky balíky</Link>
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
