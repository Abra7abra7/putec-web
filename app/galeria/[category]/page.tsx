import Image from "next/image";
import fs from "fs";
import path from "path";

function listImagesFrom(dirPath: string): string[] {
  try {
    if (!fs.existsSync(dirPath)) return [];
    const files = fs.readdirSync(dirPath);
    const images = files.filter((name) => /\.(png|jpe?g|webp|avif)$/i.test(name));
    return images.map((file) => `/galeria/${path.basename(dirPath)}/${file}`);
  } catch {
    return [];
  }
}

export default async function GalleryCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const safeCategory = category.replace(/[^a-z0-9-_]/gi, "");
  const base = path.join(process.cwd(), "public", "galeria", safeCategory);
  const photos = listImagesFrom(base);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-foreground mb-8">Galéria – {safeCategory}</h1>
        {photos.length === 0 ? (
          <p className="text-foreground-muted">Žiadne fotografie.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((src) => (
              <div key={src} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200">
                <Image src={src} alt={safeCategory} fill className="object-cover" sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

