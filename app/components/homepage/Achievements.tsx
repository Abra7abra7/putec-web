"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Section } from "../ui/section";
import { Container } from "../ui/container";
import { Button } from "../ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface AchievementItem {
  id: number;
  title: string;
  subtitle: string;
  image: string;
}

export default function Achievements() {
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

  const diplomy: AchievementItem[] = [
    { id: 1, title: "Zlatá medaila Paris Vinalies 2025", subtitle: "Cabernet Sauvignon Rosé 2024", image: "/uspechy/diplomy/VI-2025 Cabernet Rosé_page-0001.jpg" },
    { id: 2, title: "Zlatá medaila Paris Vinalies 2024", subtitle: "Chardonnay 2023", image: "/uspechy/diplomy/VI-2024 Chardonnay_page-0001.jpg" },
    { id: 3, title: "Linčanský džbánek zlatá medaila 2024", subtitle: "Cabernet Sauvignon 2018", image: "/uspechy/diplomy/Linčanský džbánek 2024 Cabernet 2018_page-0001.jpg" },
    { id: 4, title: "Strieborná medaila Paris Vinalies 2020", subtitle: "Muller Thurgau 2019", image: "/uspechy/diplomy/VI-2020 Muller_page-0001.jpg" },
    { id: 5, title: "Strieborná medaila Paris Vinalies 2020", subtitle: "Rizling Vlašský 2019", image: "/uspechy/diplomy/VI-2020 rizling opravený_page-0001.jpg" },
    { id: 6, title: "Zlatá medaila Paris Vinalies 2018", subtitle: "Tramín Červený 2018", image: "/uspechy/diplomy/VI- 2018 Tramin_page-0001.jpg" },
    { id: 7, title: "Strieborná medaila Paris Vinalies 2018", subtitle: "Muller Thurgau 2017", image: "/uspechy/diplomy/VI-2018 Muller_page-0001.jpg" },
    { id: 8, title: "Strieborná medaila Paris Vinalies 2017", subtitle: "Rizling Vlašský 2016", image: "/uspechy/diplomy/VI-2017 Rizling Vlašský_page-0001.jpg" },
  ];

  const ocenenia: AchievementItem[] = [
    { id: 1, title: "Ocenenie 2025", subtitle: "Víno Inak", image: "/uspechy/ocenenia/VI-2025_page-0001.jpg" },
    { id: 2, title: "Ocenenie 2024", subtitle: "Víno Inak", image: "/uspechy/ocenenia/VI-2024_page-0001.jpg" },
    { id: 3, title: "Ocenenie 2020", subtitle: "Víno Inak", image: "/uspechy/ocenenia/VI-2020_page-0001.jpg" },
  ];

  const currentItems = selectedCategory === 'diplomy' ? diplomy : ocenenia;
  const maxItems = isMobile ? 4 : 6;
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
            <p className="text-foreground">Načítavam...</p>
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
          <h2 className="text-foreground mb-4">Naše úspechy a ocenenia</h2>
          <p className="text-base md:text-lg text-foreground-muted max-w-3xl mx-auto">
            Naša vášeň pre vinárstvo ocenená na medzinárodných súťažiach.
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
              Diplomy
            </Button>
            <Button
              variant={selectedCategory === 'ocenenia' ? 'primary' : 'ghost'}
              onClick={() => { setSelectedCategory('ocenenia'); setShowAll(false); }}
              className="rounded-md"
            >
              Ocenenia
            </Button>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="flex justify-center">
          <div className={`grid gap-5 w-full ${isDiplomy
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-5xl'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-4xl'
            }`}>
            {displayItems.map((item, index) => (
              <div
                key={item.id}
                className="group cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-100"
                onClick={() => openLightbox(index)}
                title="Kliknite pre zväčšenie"
              >
                {/* Image - taller aspect ratio so diplomas are fully visible */}
                <div className={`relative w-full overflow-hidden ${isDiplomy ? 'aspect-[3/4]' : 'aspect-[3/4]'
                  }`}>
                  <Image
                    src={item.image}
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
                      🔍 Zväčšiť
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
              {showAll ? 'Zobraziť menej' : `Zobraziť všetky (${currentItems.length})`}
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-foreground-muted mb-6">Chcete sa dozvedieť viac o našich vínoch?</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/vina">Pozrieť naše vína</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/degustacie">Rezervovať degustáciu</Link>
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
            aria-label="Zavrieť"
          >
            <X size={24} />
          </button>

          {/* Prev button */}
          {displayItems.length > 1 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/40 rounded-full p-3 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Predchádzajúci"
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
              src={displayItems[lightboxIndex].image}
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
              aria-label="Nasledujúci"
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
