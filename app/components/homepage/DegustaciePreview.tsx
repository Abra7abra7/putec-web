"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function DegustaciePreview() {
  const slides = [
    { src: "/degustacie/degustacia-x.jpg", alt: "Degustácia - atmosféra" },
    { src: "/degustacie/brano-degustacia-x.jpg", alt: "Degustácia s majiteľom" },
    { src: "/degustacie/sudy-x.jpg", alt: "Sudy a pivnica" },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(id);
  }, [slides.length]);

  const goPrev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const goNext = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
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
                Degustácie vína
              </h2>
              <p className="text-lg text-foreground mb-6">
                Objavte svet našich prémiových vín prostredníctvom nezabudnuteľných degustačných zážitkov. 
                Vyberte si z našich špeciálne pripravených balíkov pre rôzne veľkosti skupín.
              </p>
            </div>

            {/* Package Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-lg text-foreground">🍇</span>
                </div>
                <div>
                  <span className="text-foreground font-semibold">Malá vínna chvíľka</span>
                  <p className="text-foreground text-sm">2-5 osôb • 119€</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-lg text-foreground">🍷</span>
                </div>
                <div>
                  <span className="text-foreground font-semibold">Víno trochu inak</span>
                  <p className="text-foreground text-sm">6-9 osôb • 295,90€</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-lg text-foreground">🍾</span>
                </div>
                <div>
                  <span className="text-foreground font-semibold">Víno trochu inak Vol.2</span>
                  <p className="text-foreground text-sm">10-15 osôb • 490€</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-lg text-foreground">🧺</span>
                </div>
                <div>
                  <span className="text-foreground font-semibold">Romantika na deke</span>
                  <p className="text-foreground text-sm">2 osoby • 59,90€</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Čo vás čaká:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-foreground font-bold">✓</span>
                  <span className="text-foreground">Ochutnávka prémiových vín</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-foreground font-bold">✓</span>
                  <span className="text-foreground">Vedúci degustácie</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-foreground font-bold">✓</span>
                  <span className="text-foreground">Prehliadka vinárstva</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-foreground font-bold">✓</span>
                  <span className="text-foreground">Studená misa</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/degustacie"
                className="bg-accent hover:bg-accent-dark text-foreground px-6 py-3 rounded-lg font-semibold transition-colors text-center"
              >
                Rezervovať degustáciu
              </Link>
              <Link
                href="/degustacie"
                className="border-2 border-accent text-foreground hover:bg-accent hover:text-foreground px-6 py-3 rounded-lg font-semibold transition-colors text-center"
              >
                Zobraziť všetky balíky
              </Link>
            </div>
          </div>

          {/* Slider */}
          <div className="relative flex items-center">
            <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
              {slides.map((slide, index) => (
                <div
                  key={slide.src}
                  className={`absolute inset-0 transition-opacity duration-700 ${index === current ? 'opacity-100' : 'opacity-0'}`}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={index === current}
                  />
                </div>
              ))}

              {/* Controls */}
              <button
                type="button"
                aria-label="Predchádzajúci"
                onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Ďalší"
                onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center"
              >
                ›
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Prejsť na snímku ${i + 1}`}
                    onClick={() => setCurrent(i)}
                    className={`w-2.5 h-2.5 rounded-full ${i === current ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
