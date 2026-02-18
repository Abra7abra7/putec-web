"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function AccommodationSliderClient({ slides }: { slides: { src: string; alt: string }[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) return; // disable autoplay on mobile
    const t = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides]);

  const goPrev = () => slides.length && setCurrent((p) => (p - 1 + slides.length) % slides.length);
  const goNext = () => slides.length && setCurrent((p) => (p + 1) % slides.length);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="relative flex items-center h-full" role="region" aria-label="Ubytovanie – obrazový slider">
      <div className="relative w-full aspect-[4/5] md:aspect-auto md:h-full md:min-h-[600px] rounded-xl overflow-hidden shadow-2xl">
        {slides.map((slide, index) => (
          <div key={slide.src} className={`absolute inset-0 transition-opacity duration-700 ${index === current ? 'opacity-100' : 'opacity-0'}`}>
            <Image src={slide.src} alt={slide.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px" priority={index === 0} />
          </div>
        ))}

        {slides.length > 1 && (
          <>
            <button type="button" onClick={goPrev} aria-label="Predchádzajúci snímok" className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors">‹</button>
            <button type="button" onClick={goNext} aria-label="Ďalší snímok" className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors">›</button>
          </>
        )}

        {slides.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2" role="tablist" aria-label="Navigácia slidera">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} aria-label={`Snímka ${i + 1}`} role="tab" aria-selected={i === current} className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-white w-8' : 'bg-white/50'}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


