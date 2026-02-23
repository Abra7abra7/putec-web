import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GALLERY_IMAGES } from "@/app/data/gallery-data";
import GalleryGrid from "@/app/components/gallery/GalleryGrid";
import { getMediaUrl } from "@/app/utils/media";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; category: string }>
}): Promise<Metadata> {
  const { locale, category } = await params;
  const t = await getTranslations({ locale, namespace: "pages.gallery" });

  // Safe check for category title
  let categoryTitle = "";
  try {
    categoryTitle = t(`categories.${category}.title`);
  } catch {
    categoryTitle = category;
  }

  return {
    title: t("titleDetail", { category: categoryTitle }),
    description: t(`categories.${category}.desc`),
    alternates: {
      canonical: `https://vinoputec.sk/galeria/${category}`,
      languages: {
        "sk-SK": `/galeria/${category}`,
        "en-US": `/en/galeria/${category}`,
      },
    },
  };
}

function listImagesFrom(category: string): string[] {
  const images = GALLERY_IMAGES[category] || [];
  return images.map((file) => getMediaUrl(`/galeria/${category}/${file}`));
}

export default async function GalleryCategoryPage({
  params
}: {
  params: Promise<{ locale: string; category: string }>
}) {
  const { locale, category } = await params;
  const t = await getTranslations({ locale, namespace: "pages.gallery" });

  const safeCategory = category.replace(/[^a-z0-9-_]/gi, "").toLowerCase();

  if (!GALLERY_IMAGES[safeCategory]) {
    return (
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">{t("notFound")}</h1>
          <Link href="/galeria" className="text-accent hover:underline">{t("back")}</Link>
        </div>
      </section>
    );
  }

  const categoryTitle = t(`categories.${safeCategory}.title`);
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
          <span className="font-medium">{t("back")}</span>
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
          {t("titleDetail", { category: categoryTitle })}
        </h1>
        {photos.length === 0 ? (
          <p className="text-foreground-muted">{t("noImages")}</p>
        ) : (
          <GalleryGrid images={photos} />
        )}
      </div>
    </section>
  );
}
