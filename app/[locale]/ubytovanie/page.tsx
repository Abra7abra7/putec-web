import Hero from "../../components/Hero";
import Link from "next/link";
import PrevioBookingClient from "../../components/PrevioBookingClient";
import InquiryForm from "../../components/ubytovanie/InquiryForm";
import { Slider } from "../../components/business/Slider";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getMediaUrl } from "../../utils/media";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.accommodation" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: locale === "en" ? "https://ubytovanie.vinoputec.sk/en" : "https://ubytovanie.vinoputec.sk/",
      languages: {
        "sk-SK": "https://ubytovanie.vinoputec.sk/",
        "en-US": "https://ubytovanie.vinoputec.sk/en",
      },
    },
  };
}

export default async function AccommodationPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.accommodation" });

  // Slider slides - fotky z ubytovania
  const accommodationSlides = [
    { src: getMediaUrl("galeria/ubytovanie/izba-interier-x.jpg"), alt: t("facilities.kitchen.items.0") }, // fallback or specific alt
    { src: getMediaUrl("galeria/ubytovanie/altanok-krb-x.jpg"), alt: "Altánok s krbom" },
    { src: getMediaUrl("galeria/ubytovanie/altanok-x.jpg"), alt: "Altánok" },
    { src: getMediaUrl("galeria/ubytovanie/kuchyna-x.jpg"), alt: "Kuchyňa" },
    { src: getMediaUrl("galeria/ubytovanie/kupelna-x.jpg"), alt: "Kúpeľňa" },
    { src: getMediaUrl("galeria/ubytovanie/veranda-na-poschodi-x.jpg"), alt: "Veranda na poschodí" },
    { src: getMediaUrl("galeria/ubytovanie/dvor-so-sudom-x.jpg"), alt: "Dvor so sudom" },
    { src: getMediaUrl("galeria/ubytovanie/vyhlad-na-vinohrad-x.jpg"), alt: "Výhľad na vinohrad" },
  ];

  return (
    <div className="min-h-screen bg-background selection:bg-accent/30">
      <Hero
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        backgroundImageUrl="galeria/ubytovanie/vyhlad-na-vinohrad-x.jpg"
        backgroundVideoUrl="Ubytovanie Video.mp4"
        primaryCta={{ label: t("hero.cta"), href: "#rezervacia" }}
        secondaryCta={{ label: t("hero.gallery"), href: "/galeria/ubytovanie" }}
        heightClass="h-[80vh]"
      />

      {/* Main Content */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-6">

          {/* Introduction */}
          <div className="text-center mb-24 max-w-4xl mx-auto">
            <span className="text-accent font-bold uppercase tracking-[0.2em] text-sm mb-4 block">{t("welcome.badge")}</span>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-10 leading-tight">
              {t("welcome.title")}
            </h2>
            <p className="text-xl md:text-2xl text-foreground-muted leading-relaxed mb-8">
              {t("welcome.p1")}
            </p>
            <div className="w-24 h-1 bg-accent mx-auto mb-8 opacity-50"></div>
            <p className="text-lg text-foreground-muted leading-relaxed">
              {t("welcome.p2")}
            </p>
          </div>

          {/* Capacity and Rooms */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
            <div className="relative group">
              <div className="absolute -inset-4 bg-accent/5 rounded-[2rem] blur-2xl group-hover:bg-accent/10 transition-colors"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-accent/10">
                <Slider slides={accommodationSlides} height="h-[450px] md:h-[600px]" />
              </div>
            </div>

            <div>
              <span className="text-accent font-bold uppercase tracking-widest text-sm mb-4 block">{t("capacity.badge")}</span>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-10">{t("capacity.title")}</h3>

              <div className="space-y-8">
                <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 bg-accent text-white rounded-xl flex items-center justify-center mr-5 shadow-lg shadow-accent/20">
                      <span className="font-bold text-2xl">15</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-foreground">{t("capacity.total")}</h4>
                      <p className="text-accent text-sm font-medium">{t("capacity.sub")}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-gray-50 mt-4">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">🛏️</div>
                      <div>
                        <p className="font-bold text-foreground">{t("capacity.rooms3")}</p>
                        <p className="text-xs text-foreground-muted uppercase tracking-tighter">{t("capacity.triple")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">🛏️</div>
                      <div>
                        <p className="font-bold text-foreground">{t("capacity.rooms2")}</p>
                        <p className="text-xs text-foreground-muted uppercase tracking-tighter">{t("capacity.double")}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 px-4">
                  <div className="flex items-center group">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-4 group-hover:bg-accent transition-colors">
                      <span className="text-accent group-hover:text-white transition-colors">✓</span>
                    </div>
                    <span className="text-foreground text-lg font-medium group-hover:text-accent transition-colors">{t("capacity.enSuite")}</span>
                  </div>
                  <div className="flex items-center group">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-4 group-hover:bg-accent transition-colors">
                      <span className="text-accent group-hover:text-white transition-colors">✓</span>
                    </div>
                    <span className="text-foreground text-lg font-medium group-hover:text-accent transition-colors">{t("capacity.comfortZone")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Equipment and Facilities */}
          <div className="mb-32">
            <div className="text-center mb-16">
              <span className="text-accent font-bold uppercase tracking-widest text-sm mb-4 block">{t("facilities.badge")}</span>
              <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-6">{t("facilities.title")}</h3>
              <div className="w-20 h-1 bg-accent/30 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex items-center mb-8">
                  <div className="w-20 h-20 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mr-6 group-hover:bg-accent group-hover:text-white transition-all transform group-hover:rotate-6">
                    <span className="text-4xl">🍳</span>
                  </div>
                  <h4 className="text-2xl md:text-3xl font-bold text-foreground">{t("facilities.kitchen.title")}</h4>
                </div>
                <div className="space-y-4">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start">
                      <span className="text-accent mr-3 mt-1 font-bold">→</span>
                      <span className="text-foreground-muted text-lg">{t(`facilities.kitchen.items.${i}`)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex items-center mb-8">
                  <div className="w-20 h-20 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mr-6 group-hover:bg-accent group-hover:text-white transition-all transform group-hover:-rotate-6">
                    <span className="text-4xl">📍</span>
                  </div>
                  <h4 className="text-2xl md:text-3xl font-bold text-foreground">{t("facilities.location.title")}</h4>
                </div>
                <div className="space-y-4 text-lg">
                  <div className="flex items-start">
                    <span className="text-accent mr-3 mt-1">📍</span>
                    <span className="text-foreground-muted underline decoration-accent/30">{t("facilities.location.address")}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-accent mr-3 mt-1">🏔️</span>
                    <span className="text-foreground-muted">{t("facilities.location.region")}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-accent mr-3 mt-1">🍇</span>
                    <span className="text-foreground-muted">{t("facilities.location.vineyards")}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-accent mr-3 mt-1">🏠</span>
                    <span className="text-foreground-muted">{t("facilities.location.authentic")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="mb-32">
            <div className="text-center mb-16">
              <span className="text-accent font-bold uppercase tracking-widest text-sm mb-4 block">{t("services.badge")}</span>
              <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-6">{t("services.title")}</h3>
              <p className="text-xl text-foreground-muted max-w-3xl mx-auto">
                {t("services.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Catering */}
              <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-accent/5 text-accent rounded-full flex items-center justify-center mr-5 group-hover:bg-accent group-hover:text-white transition-all">
                    <span className="text-3xl">🍽️</span>
                  </div>
                  <h4 className="text-2xl font-bold text-foreground">{t("services.catering.title")}</h4>
                </div>
                <div className="space-y-4">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center group/item">
                      <span className="w-2 h-2 rounded-full bg-accent/30 mr-4 group-hover/item:scale-150 group-hover/item:bg-accent transition-all"></span>
                      <span className="text-foreground-muted text-lg">{t(`services.catering.items.${i}`)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Corporate Services */}
              <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-accent/5 text-accent rounded-full flex items-center justify-center mr-5 group-hover:bg-accent group-hover:text-white transition-all">
                    <span className="text-3xl">🏢</span>
                  </div>
                  <h4 className="text-2xl font-bold text-foreground">{t("services.corporate.title")}</h4>
                </div>
                <div className="space-y-4">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center group/item">
                      <span className="w-2 h-2 rounded-full bg-accent/30 mr-4 group-hover/item:scale-150 group-hover/item:bg-accent transition-all"></span>
                      <span className="text-foreground-muted text-lg">{t(`services.corporate.items.${i}`)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Form Section */}
          <div id="teambuilding" className="mt-32">
            <InquiryForm />
          </div>

          {/* CTA Section */}
          <div className="bg-accent text-white rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div
              className="absolute top-0 left-0 w-full h-full opacity-5 mix-blend-overlay"
              style={{ backgroundImage: `url(${getMediaUrl('putec-logo.jpg')})`, backgroundSize: 'cover' }}
            ></div>
            <div className="relative z-10">
              <h3 className="text-3xl md:text-5xl font-bold mb-8">
                {t("cta.title")}
              </h3>
              <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto opacity-90">
                {t("cta.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href="#rezervacia"
                  className="bg-white text-accent hover:bg-gray-100 px-10 py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl"
                >
                  {t("cta.reserve")}
                </a>
                <Link
                  href="/galeria/ubytovanie"
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-5 rounded-2xl font-bold text-lg transition-all"
                >
                  {t("cta.gallery")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation Section */}
      <section id="rezervacia" className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">{t("reservation.title")}</h2>
              <p className="text-lg text-foreground-muted">
                {t("reservation.subtitle")}
              </p>
            </div>

            <div className="bg-background rounded-lg shadow-lg p-8">
              <PrevioBookingClient />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-foreground mb-6">{t("faq.title")}</h2>
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <details key={i} className="bg-background border border-gray-200 rounded-lg p-4">
                <summary className="font-semibold text-foreground">{t(`faq.items.${i}.q`)}</summary>
                <p className="text-foreground-muted mt-2">{t(`faq.items.${i}.a`)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
