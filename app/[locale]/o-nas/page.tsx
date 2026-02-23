import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import Hero from "../../components/Hero";
import { getMediaUrl } from "../../utils/media";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.about" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: "https://vinoputec.sk/o-nas",
      languages: {
        "sk-SK": "/o-nas",
        "en-US": "/en/o-nas",
      },
    },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.about" });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero
        title={t("title")}
        subtitle={t("subtitle")}
        backgroundImageUrl="o-nas/rodina2.jpg"
        secondaryCta={{ label: t("breadcrumb"), href: "#uvod" }}
        heightClass="h-[60vh]"
      />

      {/* Main Content */}
      <section id="uvod" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          {/* Introduction Section */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">{t("intro.title")}</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-foreground-muted leading-relaxed mb-6">{t("intro.p1")}</p>
              <p className="text-lg text-foreground-muted leading-relaxed">{t("intro.p2")}</p>
            </div>
          </div>

          {/* History Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="relative">
              <Image
                src={getMediaUrl("o-nas/rodina1.JPG")}
                alt={`${t("history.title")} - subgroup`}
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
                priority
              />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent rounded-full flex items-center justify-center">
                <span className="text-3xl">🍷</span>
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-foreground mb-6">{t("history.title")}</h3>
              <div className="space-y-4 text-foreground-muted">
                <p>{t("history.p1")}</p>
                <p>{t("history.p2")}</p>
                <p>{t("history.p3")}</p>
              </div>
            </div>
          </div>

          {/* Philosophy Section */}
          <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-3xl p-12 mb-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-6">{t("philosophy.title")}</h3>
              <p className="text-xl text-foreground-muted max-w-3xl mx-auto">{t("philosophy.subtitle")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center">
                  <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">{i === 1 ? "❤️" : i === 2 ? "👨‍👩‍👧‍👦" : i === 3 ? "⚙️" : "⭐"}</span>
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-3">{t(`philosophy.item${i}.title`)}</h4>
                  <p className="text-foreground-muted">{t(`philosophy.item${i}.desc`)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Technology Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-6">{t("technology.title")}</h3>
              <p className="text-xl text-foreground-muted max-w-3xl mx-auto">{t("technology.subtitle")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-background border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                  {i < 2 && (
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-6">
                      <span className="text-2xl">{i === 0 ? "🌱" : "🍇"}</span>
                    </div>
                  )}
                  <h4 className="text-xl font-semibold text-foreground mb-4">{t(`technology.items.${i}.title`)}</h4>
                  <p className="text-foreground-muted">{t(`technology.items.${i}.desc`)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Vision and Mission */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-6">{t("vision.title")}</h3>
              <p className="text-xl text-foreground-muted max-w-3xl mx-auto">{t("vision.subtitle")}</p>
            </div>

            <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-3xl p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="text-center">
                    <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-3xl">
                        {i === 0 ? "🌱" : i === 1 ? "🏔️" : i === 2 ? "🍷" : i === 3 ? "📜" : i === 4 ? "🌍" : "🤝"}
                      </span>
                    </div>
                    <h4 className="text-xl font-semibold text-foreground mb-4">{t(`vision.items.${i}.title`)}</h4>
                    <p className="text-foreground-muted">{t(`vision.items.${i}.desc`)}</p>
                  </div>
                ))}
              </div>

              {/* Thank you message */}
              <div className="mt-12 text-center">
                <div className="bg-background/50 rounded-2xl p-8 max-w-4xl mx-auto">
                  <h4 className="text-2xl font-semibold text-foreground mb-4">{t("vision.partners.title")}</h4>
                  <p className="text-lg text-foreground-muted leading-relaxed">{t("vision.partners.p")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Family Gallery */}
          <div className="text-center">
            <h3 className="text-3xl font-bold text-foreground mb-8">{t("family.title")}</h3>
            <p className="text-xl text-foreground-muted mb-12 max-w-3xl mx-auto">{t("family.subtitle")}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="group">
                <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  <Image
                    src={getMediaUrl("o-nas/rodina1.JPG")}
                    alt={t("family.card1.title")}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h4 className="text-white font-semibold text-xl">{t("family.card1.title")}</h4>
                    <p className="text-white/90">{t("family.card1.desc")}</p>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  <Image
                    src={getMediaUrl("o-nas/rodina2.jpg")}
                    alt={t("family.card2.title")}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h4 className="text-white font-semibold text-xl">{t("family.card2.title")}</h4>
                    <p className="text-white/90">{t("family.card2.desc")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
