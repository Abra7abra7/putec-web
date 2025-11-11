import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galéria | Putec",
  description: "Fotogalérie vinárstva Pútec",
};

const categories = [
  { 
    slug: "degustacie", 
    title: "Degustácie",
    thumbnail: "/degustacie/brano-degustacia-x.jpg",
    description: "Ochutnajte naše prémiové vína"
  },
  { 
    slug: "ubytovanie", 
    title: "Ubytovanie",
    thumbnail: "/galeria/ubytovanie/vyhlad-na-vinohrad-x.jpg",
    description: "Pohodlie v srdci viníc"
  },
  { 
    slug: "rodina", 
    title: "Rodina",
    thumbnail: "/o-nas/rodina2.jpg",
    description: "Rodinná tradícia"
  },
];

export default function GalleryIndexPage() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center md:text-left">Galéria</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {categories.map((c) => (
            <Link 
              key={c.slug} 
              href={`/galeria/${c.slug}`} 
              className="group block overflow-hidden rounded-xl border-2 border-gray-200 hover:border-accent transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Obrázok miniatúry */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                <Image
                  src={c.thumbnail}
                  alt={c.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Gradient overlay - silnejší pre lepší kontrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-1 drop-shadow-lg">
                    {c.title}
                  </h2>
                  <p className="text-white text-sm drop-shadow-md">
                    {c.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


