"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function AccommodationPreview() {
  const [slides, setSlides] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/gallery/ubytovanie');
        const data = await res.json();
        setSlides(data.photos?.slice(0, 8) || []);
        setIsLoaded(true);
      } catch (e) {
        console.error('Nepodarilo sa načítať galériu ubytovania', e);
        setIsLoaded(true);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!isLoaded || slides.length === 0) return;
    const t = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, [slides, isLoaded]);

  const goPrev = () => slides.length && setCurrent((p) => (p - 1 + slides.length) % slides.length);
  const goNext = () => slides.length && setCurrent((p) => (p + 1) % slides.length);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Slider */}
          <div className="relative flex items-center">
                        <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
                          {!isLoaded || slides.length === 0 ? (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <span className="text-foreground">Načítavam fotografie...</span>
                            </div>
                          ) : (
                slides.map((src, index) => (
                  <div key={src} className={`absolute inset-0 transition-opacity duration-700 ${index === current ? 'opacity-100' : 'opacity-0'}`}>
                    <Image src={src} alt="Ubytovanie" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority={index === current} />
                  </div>
                ))
              )}

              {/* Controls */}
              {slides.length > 1 && (
                <>
                  <button type="button" onClick={goPrev} aria-label="Predchádzajúci" className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center">‹</button>
                  <button type="button" onClick={goNext} aria-label="Ďalší" className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center">›</button>
                </>
              )}

              {/* Dots */}
              {slides.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
                  {slides.map((_, i) => (
                    <button key={i} onClick={() => setCurrent(i)} aria-label={`Snímka ${i + 1}`} className={`w-2.5 h-2.5 rounded-full ${i === current ? 'bg-white' : 'bg-white/50'}`} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center">
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
        </div>
      </div>
    </section>
  );
}
