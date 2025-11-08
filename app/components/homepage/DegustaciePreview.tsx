"use client";

import Link from "next/link";
import { Section } from "../ui/section";
import { Container } from "../ui/container";
import { Button } from "../ui/button";
import { SectionHeader } from "../business/SectionHeader";
import { FeatureIcon } from "../business/FeatureIcon";
import { Slider } from "../business/Slider";

export default function DegustaciePreview() {
  const slides = [
    { src: "/degustacie/degustacia-x.jpg", alt: "Degustácia - atmosféra" },
    { src: "/degustacie/brano-degustacia-x.jpg", alt: "Degustácia s majiteľom" },
    { src: "/degustacie/sudy-x.jpg", alt: "Sudy a pivnica" },
  ];

  const packages = [
    { icon: "🍇", title: "Malá vínna chvíľka", people: "2-5 osôb", price: "119€" },
    { icon: "🍷", title: "Víno trochu inak", people: "6-9 osôb", price: "295,90€" },
    { icon: "🍾", title: "Víno trochu inak Vol.2", people: "10-15 osôb", price: "490€" },
    { icon: "🧺", title: "Romantika na deke", people: "2 osoby", price: "59,90€" },
  ];

  const features = [
    "Ochutnávka prémiových vín",
    "Vedúci degustácie",
    "Prehliadka vinárstva",
    "Studená misa",
  ];

  return (
    <Section>
      <Container>
        <div className="grid grid-cols-1 desktop:grid-cols-2 gap-8 desktop:gap-12 items-stretch">
          {/* Content */}
          <div className="flex flex-col justify-center">
            <SectionHeader
              title="Degustácie vína"
              description="Objavte svet našich prémiových vín prostredníctvom nezabudnuteľných degustačných zážitkov. Vyberte si z našich špeciálne pripravených balíkov pre rôzne veľkosti skupín."
              showLogo
            />

            {/* Package Highlights */}
            <div className="grid grid-cols-1 desktop:grid-cols-2 gap-4 mb-8">
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
              <div className="grid grid-cols-1 desktop:grid-cols-2 gap-2">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <span className="text-foreground font-bold">✓</span>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col desktop:flex-row gap-4">
              <Button asChild>
                <Link href="/degustacie">Rezervovať degustáciu</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/degustacie">Zobraziť všetky balíky</Link>
              </Button>
            </div>
          </div>

          {/* Slider */}
          <div className="flex items-center">
            <Slider slides={slides} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
