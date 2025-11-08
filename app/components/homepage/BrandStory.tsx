import Link from "next/link";
import Image from "next/image";
import { Section } from "../ui/section";
import { Container } from "../ui/container";
import { Button } from "../ui/button";
import { FeatureIcon } from "../business/FeatureIcon";

export default function BrandStory() {
  const keyFeatures = [
    { icon: "❤️", title: "\"Žijeme vínom\"", description: "Víno je pre rodinu spôsobom života" },
    { icon: "⚙️", title: "Moderné technológie", description: "Kombinujeme tradíciu s inováciami" },
    { icon: "⭐", title: "Remeselné víno", description: "Kvalitné víno, na ktoré sme hrdí" },
    { icon: "🍷", title: "Francúzske sudy", description: "Dozrievanie v kvalitných sudoch" },
  ];

  return (
    <Section spacing="lg" background="accent">
      <Container>
        <div className="grid grid-cols-1 desktop:grid-cols-2 gap-12 desktop:gap-16 items-center">
          
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-foreground">
                Víno Pútec
              </h2>
              <p className="text-xl desktop:text-2xl text-accent font-semibold">
                Tradícia a kvalita vína
              </p>
            </div>
            
            <div className="space-y-6 text-foreground-muted">
              <p className="text-base desktop:text-lg leading-relaxed">
                Víno Pútec je malé rodinné vinárstvo vo Vinosadoch na úpätí Malých Karpát. 
                Výrobe vín sa s láskou venujeme už niekoľko generácií a sme hrdí na svetové úspechy našich vín.
              </p>
              
              <p className="text-base desktop:text-lg leading-relaxed">
                Sme malé rodinné vinárstvo vo Vinosadoch – naša rodina sa výrobe vína venuje už niekoľko generácií. 
                Žijeme vínom a chceme vám priniesť skvelý pôžitok z tohto unikátneho umenia, ktorým víno je.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 desktop:grid-cols-2 gap-6">
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
            <div className="flex flex-col desktop:flex-row gap-4 pt-4">
              <Button asChild size="lg">
                <Link href="/o-nas">Dozvedieť sa viac</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/vina">Naše vína</Link>
              </Button>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="relative">
            <div className="relative">
              <Image
                src="/o-nas/rodina2.jpg"
                alt="Rodinné vinárstvo Putec Vinosady - tradícia a kvalita"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
                priority
                sizes="(max-width: 1024px) 100vw, 600px"
              />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent rounded-full flex items-center justify-center shadow-xl">
                <span className="text-3xl">🍷</span>
              </div>
            </div>
            
            {/* Floating Stats */}
            <div className="absolute -top-4 -left-4 bg-background border border-accent/20 rounded-xl p-4 shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">2012</div>
                <div className="text-sm text-foreground-muted">Založenie vinárstva</div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-background border border-accent/20 rounded-xl p-4 shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">Generácie</div>
                <div className="text-sm text-foreground-muted">Rodinná tradícia</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
