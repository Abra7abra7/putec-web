import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GALLERY_IMAGES } from "@/app/data/gallery-data";
import GalleryGrid from "@/app/components/gallery/GalleryGrid";
import { getMediaUrl } from "@/app/utils/media";

function listImagesFrom(category: string): string[] {
  const images = GALLERY_IMAGES[category] || [];
  return images.map((file) => getMediaUrl(`/galeria/${category}/${file}`));
}

const categoryTitles: Record<string, string> = {
  degustacie: "Degustácie",
  ubytovanie: "Ubytovanie",
  rodina: "Rodina",
};

export default async function GalleryCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const safeCategory = category.replace(/[^a-z0-9-_]/gi, "");

  const categoryTitle = categoryTitles[safeCategory];

  if (!categoryTitle) {
    return (
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Galéria sa nenašla</h1>
          <Link href="/galeria" className="text-accent hover:underline">Späť na galériu</Link>
        </div>
      </section>
    );
  }

  const photos = listImagesFrom(safeCategory);

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        {/* Back button - vľavo hore */}
        <Link
          href="/galeria"
          className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Späť na galériu</span>
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
          Galéria – {categoryTitle}
        </h1>
        {photos.length === 0 ? (
          <p className="text-foreground-muted">Žiadne fotografie v tejto kategórii.</p>
        ) : (
          <GalleryGrid images={photos} />
        )}
      </div>
    </section>
  );
}
