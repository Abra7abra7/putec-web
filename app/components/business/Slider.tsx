"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/app/utils/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface SliderSlide {
  src: string;
  alt: string;
}

export interface SliderProps {
  /**
   * Array of slides to display
   */
  slides: SliderSlide[];
  /**
   * Auto-play interval in milliseconds
   * @default 4000
   */
  autoPlayInterval?: number;
  /**
   * Enable auto-play
   * @default true
   */
  autoPlay?: boolean;
  /**
   * Additional className for the container
   */
  className?: string;
  /**
   * Height of the slider
   * @default "h-80 md:h-[500px]"
   */
  height?: string;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      slides,
      autoPlayInterval = 4000,
      autoPlay = true,
      className,
      height = "h-80 md:h-[500px]",
    },
    ref
  ) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
      if (!autoPlay || slides.length <= 1) return;

      const id = setInterval(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
      }, autoPlayInterval);

      return () => clearInterval(id);
    }, [slides.length, autoPlay, autoPlayInterval]);

    const goPrev = () => {
      setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goNext = () => {
      setCurrent((prev) => (prev + 1) % slides.length);
    };

    if (!slides || slides.length === 0) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn("relative flex items-center", className)}
      >
        <div className={cn("relative w-full rounded-lg overflow-hidden shadow-lg", height)}>
          {/* Slides */}
          {slides.map((slide, index) => (
            <div
              key={`${slide.src}-${index}`}
              className={cn(
                "absolute inset-0 transition-opacity duration-700",
                index === current ? "opacity-100" : "opacity-0"
              )}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index === 0}
              />
            </div>
          ))}

          {/* Navigation Controls */}
          {slides.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Predchádzajúci"
                onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                aria-label="Ďalší"
                onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {slides.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 z-10">
              {slides.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Prejsť na snímku ${i + 1}`}
                  onClick={() => setCurrent(i)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all",
                    i === current ? "bg-white w-8" : "bg-white/50"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };

