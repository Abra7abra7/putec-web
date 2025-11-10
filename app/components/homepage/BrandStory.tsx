import Link from "next/link";
import Image from "next/image";
import { Heart, Cog, Star as StarIcon, Wine as WineIcon } from "lucide-react";
import { Section } from "../ui/section";
import { Container } from "../ui/container";
import { Button } from "../ui/button";
import { FeatureIcon } from "../business/FeatureIcon";

export default function BrandStory() {
  const keyFeatures = [
    { icon: <Heart className="w-6 h-6" />, title: "\"Žijeme vínom\"", description: "Víno je pre rodinu spôsobom života" },
    { icon: <Cog className="w-6 h-6" />, title: "Moderné technológie", description: "Kombinujeme tradíciu s inováciami" },
    { icon: <StarIcon className="w-6 h-6" />, title: "Remeselné víno", description: "Kvalitné víno, na ktoré sme hrdí" },
    { icon: <WineIcon className="w-6 h-6" />, title: "Francúzske sudy", description: "Dozrievanie v kvalitných sudoch" },
  ];

  return (
    <Section spacing="lg" background="accent">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
          
          {/* Left Side - Content (hore na mobile, vľavo na desktop) */}
          <div className="space-y-8 order-1 md:order-1">
            <div className="space-y-4">
              <h2 className="text-foreground">
                Víno Pútec
              </h2>
              <p className="text-xl md:text-2xl text-accent font-semibold">
                Tradícia a kvalita vína
              </p>
            </div>
            
            <div className="space-y-6 text-foreground-muted">
              <p className="text-base md:text-lg leading-relaxed">
                Víno Pútec je malé rodinné vinárstvo vo Vinosadoch na úpätí Malých Karpát. 
                Výrobe vín sa s láskou venujeme už niekoľko generácií a sme hrdí na svetové úspechy našich vín.
              </p>
              
              <p className="text-base md:text-lg leading-relaxed">
                Sme malé rodinné vinárstvo vo Vinosadoch – naša rodina sa výrobe vína venuje už niekoľko generácií. 
                Žijeme vínom a chceme vám priniesť skvelý pôžitok z tohto unikátneho umenia, ktorým víno je.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {keyFeatures.map((feature) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <FeatureIcon icon={feature.icon} size="sm" className="mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                    <p className="text-sm text-foreground-muted">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <Button asChild size="lg">
                <Link href="/o-nas">Dozvedieť sa viac</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/vina">Naše vína</Link>
              </Button>
            </div>
          </div>

          {/* Right Side - Image (dole na mobile, vpravo na desktop) */}
          <div className="relative order-2 md:order-2">
            <div className="relative">
              <Image
                src="/o-nas/rodina2.jpg"
                alt="Rodinné vinárstvo Putec Vinosady - tradícia a kvalita"
                width={500}
                height={333}
                className="rounded-2xl shadow-2xl w-full h-auto"
                priority
                sizes="(max-width: 1024px) 100vw, 500px"
              />
              <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-accent rounded-full flex items-center justify-center shadow-xl">
                <span className="text-2xl">🍷</span>
              </div>
            </div>
            
            {/* Floating Stats */}
            <div className="absolute -top-4 -left-4 bg-background border border-accent/20 rounded-xl p-3 shadow-lg">
              <div className="text-center">
                <div className="text-xl font-bold text-accent">2012</div>
                <div className="text-xs text-foreground-muted">Založenie vinárstva</div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-background border border-accent/20 rounded-xl p-3 shadow-lg">
              <div className="text-center">
                <div className="text-xl font-bold text-accent">Generácie</div>
                <div className="text-xs text-foreground-muted">Rodinná tradícia</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
