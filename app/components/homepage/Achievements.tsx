"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Section } from "../ui/section";
import { Container } from "../ui/container";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export default function Achievements() {
  const [selectedCategory, setSelectedCategory] = useState<'diplomy' | 'ocenenia'>('diplomy');
  const [isMobile, setIsMobile] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    setIsLoaded(true);
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const diplomy = [
    {
      id: 1,
      title: "Víno Inak 2025",
      subtitle: "Cabernet Rosé",
      image: "/uspechy/diplomy/VI-2025 Cabernet Rosé_page-0001.jpg"
    },
    {
      id: 2,
      title: "Víno Inak 2024",
      subtitle: "Chardonnay",
      image: "/uspechy/diplomy/VI-2024 Chardonnay_page-0001.jpg"
    },
    {
      id: 3,
      title: "Linčanský džbánek 2024",
      subtitle: "Cabernet 2018",
      image: "/uspechy/diplomy/Linčanský džbánek 2024 Cabernet 2018_page-0001.jpg"
    },
    {
      id: 4,
      title: "Víno Inak 2020",
      subtitle: "Müller",
      image: "/uspechy/diplomy/VI-2020 Muller_page-0001.jpg"
    },
    {
      id: 5,
      title: "Víno Inak 2020",
      subtitle: "Rizling",
      image: "/uspechy/diplomy/VI-2020 rizling opravený_page-0001.jpg"
    },
    {
      id: 6,
      title: "Víno Inak 2018",
      subtitle: "Tramín",
      image: "/uspechy/diplomy/VI- 2018 Tramin_page-0001.jpg"
    },
    {
      id: 7,
      title: "Víno Inak 2018",
      subtitle: "Müller",
      image: "/uspechy/diplomy/VI-2018 Muller_page-0001.jpg"
    },
    {
      id: 8,
      title: "Víno Inak 2017",
      subtitle: "Rizling Vlašský",
      image: "/uspechy/diplomy/VI-2017 Rizling Vlašský_page-0001.jpg"
    }
  ];

  const ocenenia = [
    {
      id: 1,
      title: "Ocenenie 2025",
      subtitle: "Víno Inak",
      image: "/uspechy/ocenenia/VI-2025_page-0001.jpg"
    },
    {
      id: 2,
      title: "Ocenenie 2024",
      subtitle: "Víno Inak",
      image: "/uspechy/ocenenia/VI-2024_page-0001.jpg"
    },
    {
      id: 3,
      title: "Ocenenie 2020",
      subtitle: "Víno Inak",
      image: "/uspechy/ocenenia/VI-2020_page-0001.jpg"
    }
  ];

  const currentItems = selectedCategory === 'diplomy' ? diplomy : ocenenia;
  const maxItems = isMobile ? 4 : 6;
  const displayItems = showAll ? currentItems : currentItems.slice(0, maxItems);

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

  return (
    <Section>
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-foreground mb-4">
            Naše úspechy a ocenenia
          </h2>
          <p className="text-base md:text-lg text-foreground-muted max-w-3xl mx-auto">
            Pridajte sa k tisíckam spokojných zákazníkov, ktorí si vybrali naše prémiové vína
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-lg p-1">
            <Button
              variant={selectedCategory === 'diplomy' ? 'primary' : 'ghost'}
              onClick={() => setSelectedCategory('diplomy')}
              className="rounded-md"
            >
              Diplomy
            </Button>
            <Button
              variant={selectedCategory === 'ocenenia' ? 'primary' : 'ghost'}
              onClick={() => setSelectedCategory('ocenenia')}
              className="rounded-md"
            >
              Ocenenia
            </Button>
          </div>
        </div>

        {/* Achievements Grid - Responsive layout */}
        <div className="flex justify-center">
          <div className={`grid gap-4 max-w-full ${
            selectedCategory === 'ocenenia' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl' 
              : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
          }`}>
            {displayItems.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-xl transition-all hover:scale-[1.02]"
              >
                <div className={`relative w-full ${
                  selectedCategory === 'ocenenia' ? 'h-56 md:h-72' : 'h-28 md:h-36'
                }`}>
                  <Image
                    src={item.image}
                    alt={`${item.title} - ${item.subtitle}`}
                    fill
                    className="object-cover"
                    sizes={selectedCategory === 'ocenenia' 
                      ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      : "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                    }
                  />
                </div>
                <div className={selectedCategory === 'ocenenia' ? 'p-4 md:p-5' : 'p-2 md:p-3'}>
                  <h3 className={`font-semibold text-foreground mb-1 line-clamp-2 ${
                    selectedCategory === 'ocenenia' ? 'text-lg md:text-xl' : 'text-sm md:text-base'
                  }`}>
                    {item.title}
                  </h3>
                  <p className={`text-foreground-muted line-clamp-1 ${
                    selectedCategory === 'ocenenia' ? 'text-base md:text-lg' : 'text-xs md:text-sm'
                  }`}>
                    {item.subtitle}
                  </p>
                </div>
              </Card>
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
          <p className="text-foreground-muted mb-6">
            Chcete sa dozvedieť viac o našich vínoch?
          </p>
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
    </Section>
  );
}
