import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getMediaUrl } from "../../utils/media";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.gallery" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: "https://vinoputec.sk/galeria",
      languages: {
        "sk-SK": "/galeria",
        "en-US": "/en/galeria",
      },
    },
  };
}

export default async function GalleryIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.gallery" });

  const categories = [
    {
      slug: "degustacie",
      title: t("categories.degustacie.title"),
      thumbnail: getMediaUrl("degustacie/brano-degustacia-x.jpg"),
      description: t("categories.degustacie.desc"),
    },
    {
      slug: "ubytovanie",
      title: t("categories.ubytovanie.title"),
      thumbnail: getMediaUrl("vyhlad-na-vinohrad-x.jpg"),
      description: t("categories.ubytovanie.desc"),
    },
    {
      slug: "rodina",
      title: t("categories.rodina.title"),
      thumbnail: getMediaUrl("o-nas/rodina2.jpg"),
      description: t("categories.rodina.desc"),
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center md:text-left">
          {t("breadcrumb")}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/galeria/${c.slug}`}
              className="group block overflow-hidden rounded-xl border-2 border-gray-200 hover:border-accent transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                <Image
                  src={c.thumbnail}
                  alt={c.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20">
                  <h2
                    className="text-xl md:text-2xl font-bold mb-1"
                    style={{ color: "#ffffff", textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                  >
                    {c.title}
                  </h2>
                  <p
                    className="text-sm"
                    style={{ color: "#ffffff", textShadow: "1px 1px 3px rgba(0,0,0,0.8)" }}
                  >
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


