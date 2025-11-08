import Link from "next/link";
import Image from "next/image";

export default function BrandStory() {
  return (
    <section className="relative w-full py-20 bg-gradient-to-br from-accent/5 to-accent/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Víno Pútec
              </h2>
              <p className="text-2xl text-accent font-semibold">
                Tradícia a kvalita vína
              </p>
            </div>
            
            <div className="space-y-6 text-foreground-muted">
              <p className="text-lg leading-relaxed">
                Víno Pútec je malé rodinné vinárstvo vo Vinosadoch na úpätí Malých Karpát. 
                Výrobe vín sa s láskou venujeme už niekoľko generácií a sme hrdí na svetové úspechy našich vín.
              </p>
              
              <p className="text-lg leading-relaxed">
                Sme malé rodinné vinárstvo vo Vinosadoch – naša rodina sa výrobe vína venuje už niekoľko generácií. 
                Žijeme vínom a chceme vám priniesť skvelý pôžitok z tohto unikátneho umenia, ktorým víno je.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">❤️</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">&quot;Žijeme vínom&quot;</h4>
                  <p className="text-sm text-foreground-muted">Víno je pre rodinu spôsobom života</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">⚙️</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Moderné technológie</h4>
                  <p className="text-sm text-foreground-muted">Kombinujeme tradíciu s inováciami</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">⭐</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Remeselné víno</h4>
                  <p className="text-sm text-foreground-muted">Kvalitné víno, na ktoré sme hrdí</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">🍷</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Francúzske sudy</h4>
                  <p className="text-sm text-foreground-muted">Dozrievanie v kvalitných sudoch</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/o-nas"
                className="bg-accent hover:bg-accent-dark text-foreground px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg text-center"
              >
                Dozvedieť sa viac
              </Link>
              <Link
                href="/vina"
                className="border-2 border-accent text-accent hover:bg-accent hover:text-foreground px-8 py-4 rounded-lg font-semibold transition-all text-center"
              >
                Naše vína
              </Link>
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
      </div>
    </section>
  );
}
