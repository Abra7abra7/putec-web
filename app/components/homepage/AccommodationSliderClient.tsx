"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function AccommodationSliderClient({ slides }: { slides: string[] }) {
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

  return (
    <div className="relative flex items-center" role="region" aria-label="Ubytovanie – obrazový slider">
      <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
        {slides.map((src, index) => (
          <div key={src} className={`absolute inset-0 transition-opacity duration-700 ${index === current ? 'opacity-100' : 'opacity-0'}`}>
            <Image src={src} alt={`Ubytovanie – snímka ${index + 1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
        ))}

        {slides.length > 1 && (
          <>
            <button type="button" onClick={goPrev} aria-label="Predchádzajúci snímok" className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center">‹</button>
            <button type="button" onClick={goNext} aria-label="Ďalší snímok" className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center">›</button>
          </>
        )}

        {slides.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2" role="tablist" aria-label="Navigácia slidera">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} aria-label={`Snímka ${i + 1}`} role="tab" aria-selected={i === current} className={`w-2.5 h-2.5 rounded-full ${i === current ? 'bg-white' : 'bg-white/50'}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


