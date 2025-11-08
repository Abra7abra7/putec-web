import Link from "next/link";
import Image from "next/image";
import fs from "fs";
import path from "path";
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

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Content first on mobile */}
          <div className="flex flex-col justify-center order-1 lg:order-none">
            <div className="mb-6">
              <Image
                src="/putec-logo.jpg"
                alt="Pútec Logo"
                width={80}
                height={80}
                className="rounded-full shadow-xl border-4 border-accent mb-4"
              />
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ubytovanie v srdci Malých Karpát
              </h2>
              <p className="text-lg text-foreground mb-6">
                Prežite nezabudnuteľné chvíle v našom ubytovaní obklopenom vinohradmi a prírodou. 
                Ideálne miesto pre relaxáciu a degustácie našich prémiových vín.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-lg text-foreground">🏡</span>
                </div>
                <span className="text-foreground">Komfortné izby</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-lg text-foreground">🍷</span>
                </div>
                <span className="text-foreground">Degustácie vína</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-lg text-foreground">🌅</span>
                </div>
                <span className="text-foreground">Krásne výhľady</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-lg text-foreground">🍽️</span>
                </div>
                <span className="text-foreground">Raňajky</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/ubytovanie"
                className="bg-accent hover:bg-accent-dark text-foreground px-6 py-3 rounded-lg font-semibold transition-colors text-center"
              >
                Rezervovať ubytovanie
              </Link>
              <Link
                href="/ubytovanie"
                className="border-2 border-accent text-foreground hover:bg-accent hover:text-foreground px-6 py-3 rounded-lg font-semibold transition-colors text-center"
              >
                Zobraziť detaily
              </Link>
            </div>
          </div>

          {/* Slider second on mobile */}
          <div className="order-2 lg:order-none">
            <AccommodationSliderClient slides={slides} />
          </div>
        </div>
      </div>
    </section>
  );
}
