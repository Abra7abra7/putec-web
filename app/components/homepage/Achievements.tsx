"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Section } from "../ui/section";
import { Container } from "../ui/container";
import { Button } from "../ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocalization } from "../../context/LocalizationContext";
import { getMediaUrl } from "../../utils/media";
import { usePathname } from "next/navigation";

export default function Achievements() {
  const { homepage } = useLocalization();
  const achievements = homepage?.achievements;

  const [selectedCategory, setSelectedCategory] = useState<'diplomy' | 'ocenenia'>('diplomy');
  const [isMobile, setIsMobile] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    setIsLoaded(true);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!achievements) return null;

  const { title, description, tabs, diplomy, ocenenia, showMore, showLess, ctaText, ctaWines, ctaReserve } = achievements;

  const currentItems = selectedCategory === 'diplomy' ? diplomy : ocenenia;
  const maxItems = isMobile ? 4 : 8;
  const displayItems = showAll ? currentItems : currentItems.slice(0, maxItems);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % displayItems.length);
  }, [lightboxIndex, displayItems.length]);

  const goPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + displayItems.length) % displayItems.length);
  }, [lightboxIndex, displayItems.length]);

  const pathname = usePathname();
  const localePrefix = pathname.startsWith('/en') ? '/en' : '';
  const getLocalizedLink = (path: string) =>
    path.startsWith('/en') || path.startsWith('http') ? path : `${localePrefix}${path}`;

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, goNext, goPrev]);

  if (!isLoaded) {
    return (
      <Section>
        <Container>
          <div className="text-center">
            <p className="text-foreground">Loading...</p>
          </div>
        </Container>
      </Section>
    );
  }

  const isDiplomy = selectedCategory === 'diplomy';

  return (
    <Section>
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-foreground mb-4">{title}</h2>
          <p className="text-base md:text-lg text-foreground-muted max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-lg p-1">
            <Button
              variant={selectedCategory === 'diplomy' ? 'primary' : 'ghost'}
              onClick={() => { setSelectedCategory('diplomy'); setShowAll(false); }}
              className="rounded-md"
            >
              {tabs.diplomy}
            </Button>
            <Button
              variant={selectedCategory === 'ocenenia' ? 'primary' : 'ghost'}
              onClick={() => { setSelectedCategory('ocenenia'); setShowAll(false); }}
              className="rounded-md"
            >
              {tabs.ocenenia}
            </Button>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="flex justify-center">
          <div className={`grid gap-5 w-full ${isDiplomy
            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-5xl'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-4xl'
            }`}>
            {displayItems.map((item: any, index: number) => (
              <div
                key={`${selectedCategory}-${item.id}`}
                className="group cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-100"
                onClick={() => openLightbox(index)}
              >
                {/* Image - taller aspect ratio so diplomas are fully visible */}
                <div className={`relative w-full overflow-hidden aspect-[3/4]`}>
                  <Image
                    src={getMediaUrl(item.image)}
                    alt={`${item.title} - ${item.subtitle}`}
                    fill
                    className="object-contain object-top bg-gray-50 group-hover:scale-105 transition-transform duration-300"
                    sizes={isDiplomy
                      ? "(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                      : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    }
                  />
                  {/* Zoom hint overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                      🔍
                    </span>
                  </div>
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="font-bold text-foreground text-sm md:text-base leading-snug mb-1">
                    {item.title}
                  </h3>
                  <p className="text-foreground-muted text-xs md:text-sm">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Show more/less button */}
        {currentItems.length > maxItems && (
          <div className="text-center mt-6">
            <Button onClick={() => setShowAll(!showAll)}>
              {showAll ? showLess : `${showMore} (${currentItems.length})`}
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-foreground-muted mb-6">{ctaText}</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href={getLocalizedLink("/vina")}>{ctaWines}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={getLocalizedLink("/degustacie")}>{ctaReserve}</Link>
            </Button>
          </div>
        </div>
      </Container>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors z-10"
            onClick={closeLightbox}
          >
            <X size={24} />
          </button>

          {/* Prev button */}
          {displayItems.length > 1 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/40 rounded-full p-3 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-3xl max-h-[85vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={getMediaUrl(displayItems[lightboxIndex].image)}
              alt={displayItems[lightboxIndex].title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority
            />
          </div>

          {/* Next button */}
          {displayItems.length > 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/40 rounded-full p-3 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* Caption */}
          <div className="absolute bottom-6 left-0 right-0 text-center text-white">
            <p className="font-bold text-lg drop-shadow">{displayItems[lightboxIndex].title}</p>
            <p className="text-sm text-white/80 drop-shadow">{displayItems[lightboxIndex].subtitle}</p>
            <p className="text-xs text-white/50 mt-1">{lightboxIndex + 1} / {displayItems.length}</p>
          </div>
        </div>
      )}
    </Section>
  );
}
