"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface Slide {
  src: string;
  alt: string;
  position?: string; // e.g. "top", "center", "bottom 20%"
}

export default function DegustationSliderClient({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) return; // disable autoplay on mobile
    const t = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides]);

  const goPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    slides.length && setCurrent((p) => (p - 1 + slides.length) % slides.length);
  }

  const goNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    slides.length && setCurrent((p) => (p + 1) % slides.length);
  }

  if (!slides || slides.length === 0) return null;

  return (
    <>
      <div className="relative flex items-center h-full group" role="region" aria-label="Degustácie – obrazový slider">
        {/* Main Slider Container - Click to Open Lightbox */}
        <div
          className="relative w-full aspect-[4/5] md:aspect-auto md:h-full md:min-h-[600px] rounded-xl overflow-hidden shadow-2xl cursor-zoom-in"
          onClick={() => setIsOpen(true)}
        >
          {slides.map((slide, index) => (
            <div key={slide.src} className={`absolute inset-0 transition-opacity duration-700 ${index === current ? 'opacity-100' : 'opacity-0'}`}>
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                style={{ objectPosition: slide.position || 'center' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                priority={index === 0}
              />
            </div>
          ))}

          {/* Navigation Overlay */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors pointer-events-none" />

          {/* Arrows */}
          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Predchádzajúci snímok"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-accent text-white rounded-full w-10 h-10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 pointer-events-auto"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Ďalší snímok"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-accent text-white rounded-full w-10 h-10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 pointer-events-auto"
              >
                ›
              </button>
            </>
          )}

          {/* Dots */}
          {slides.length > 1 && (
            <div
              className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 pointer-events-auto"
              role="tablist"
              aria-label="Navigácia slidera"
              onClick={(e) => e.stopPropagation()}
            >
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrent(i);
                  }}
                  aria-label={`Snímka ${i + 1}`}
                  role="tab"
                  aria-selected={i === current}
                  className="w-12 h-12 flex items-center justify-center focus:outline-none group"
                >
                  <span className={`block rounded-full transition-all shadow-sm ${i === current ? 'bg-white w-8 h-2.5' : 'bg-white/50 w-2.5 h-2.5 group-hover:bg-white/80'}`} />
                </button>
              ))}
            </div>
          )}

          {/* Zoom hint icon */}
          <div className="absolute top-4 right-4 bg-black/40 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 21-6-6" /><circle cx="10" cy="10" r="7" /><line x1="10" x2="10" y1="7" y2="13" /><line x1="7" x2="13" y1="10" y2="10" /></svg>
          </div>
        </div>
      </div>

      {/* Lightbox Component */}
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        index={current}
        slides={slides.map(s => ({ src: s.src, alt: s.alt }))}
        on={{
          view: ({ index }) => setCurrent(index),
        }}
        controller={{ closeOnBackdropClick: true }}
      />
    </>
  );
}

