import { Section } from "../ui/section";
import { Container } from "../ui/container";
import { Card, CardContent } from "../ui/card";
import { getLocalization } from "../../utils/getLocalization";
import { getLocale } from "next-intl/server";

interface GoogleReviewData {
  authorName: string;
  authorPhoto: string;
  authorUrl: string;
  rating: number;
  text: string;
  relativeTime: string;
  publishTime: string;
  googleMapsUri: string;
}

interface ReviewsResponse {
  rating: number;
  totalReviews: number;
  googleMapsUri: string;
  reviews: GoogleReviewData[];
}

// Fetch reviews at build/request time (server component)
async function fetchReviews(): Promise<ReviewsResponse | null> {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) return null;

    const placeId = "ChIJF97lFUaXbEcRdEgkc1S1z_4"; // Víno Pútec

    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "reviews,rating,userRatingCount,googleMapsUri",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) return null;

    const data = await response.json();

    return {
      rating: data.rating || 0,
      totalReviews: data.userRatingCount || 0,
      googleMapsUri: data.googleMapsUri || "",
      reviews: (data.reviews || []).map((review: any) => ({
        authorName: review.authorAttribution?.displayName || "Zákazník",
        authorPhoto: review.authorAttribution?.photoUri || "",
        authorUrl: review.authorAttribution?.uri || "",
        rating: review.rating || 5,
        text: review.originalText?.text || review.text?.text || "",
        relativeTime: review.relativePublishTimeDescription || "",
        publishTime: review.publishTime || "",
        googleMapsUri: review.googleMapsUri || "",
      })),
    };
  } catch (error) {
    console.error("[Testimonials] Failed to fetch reviews:", error);
    return null;
  }
}

function StarRating({ rating }: { rating: number }) {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < Math.floor(rating)) {
      stars.push(
        <span key={i} className="text-foreground-gold text-lg">★</span>
      );
    } else if (i < Math.ceil(rating) && rating % 1 !== 0) {
      stars.push(
        <span key={i} className="text-foreground-gold text-lg">⯪</span>
      );
    } else {
      stars.push(
        <span key={i} className="text-foreground text-lg">☆</span>
      );
    }
  }
  return <div className="flex">{stars}</div>;
}

export default async function Testimonials() {
  const data = await fetchReviews();
  const locale = await getLocale();
  const localization = await getLocalization(locale);
  const { labels } = localization;

  if (!data || data.reviews.length === 0) {
    return null;
  }

  return (
    <Section spacing="lg">
      <Container>
        <div className="text-center">
          {/* Google Rating Badge */}
          <div className="flex items-center justify-center gap-3 mb-6">
            {/* Google "G" logo */}
            <svg viewBox="0 0 24 24" width="28" height="28" className="flex-shrink-0">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.33c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1c-4.3 0-7.7 2.47-9.82 6.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-foreground">{data.rating.toFixed(1)}</span>
              <StarRating rating={data.rating} />
            </div>
            <a
              href={data.googleMapsUri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-muted hover:text-accent transition-colors text-sm underline"
            >
              {data.totalReviews} {locale === 'en' ? 'reviews on Google' : 'recenzií na Google'}
            </a>
          </div>

          {/* Section Title */}
          <h2 className="mb-4 text-3xl md:text-4xl font-bold tracking-tighter">
            {localization.homepage.testimonialsTitle}
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto italic">
            &quot;{locale === 'en' ? 'Your satisfaction is our greatest award. Every bottle of wine carries our story and passion for tradition.' : 'Vaša spokojnosť je pre nás najväčším ocenením. Každá fľaša vína nesie náš príbeh a vášeň pre tradíciu.'}&quot;
          </p>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 justify-items-center">
            {data.reviews.slice(0, 6).map((review, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all hover:scale-[1.02] w-full"
              >
                <CardContent className="flex flex-col items-center text-center p-6">
                  {/* Author Avatar */}
                  {review.authorPhoto ? (
                    <img
                      src={review.authorPhoto}
                      alt={review.authorName}
                      width={64}
                      height={64}
                      className="rounded-full mb-4 border-2 border-accent w-16 h-16 object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full mb-4 border-2 border-accent bg-accent/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-accent">
                        {review.authorName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* Name */}
                  <a
                    href={review.authorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-semibold text-foreground mb-1 hover:text-accent transition-colors"
                  >
                    {review.authorName}
                  </a>

                  {/* Relative Time */}
                  <span className="text-xs text-foreground-muted mb-2">
                    {review.relativeTime}
                  </span>

                  {/* Star Rating */}
                  <div className="mb-3">
                    <StarRating rating={review.rating} />
                  </div>

                  {/* Review Text */}
                  {review.text && (
                    <p className="text-foreground-muted text-base italic line-clamp-4">
                      &quot;{review.text}&quot;
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Write a Review CTA + Google Attribution */}
          <div className="mt-10 flex flex-col items-center gap-3">
            <a
              href={data.googleMapsUri ? `${data.googleMapsUri}` : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-accent text-foreground px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              </svg>
              {locale === 'en' ? 'Write a review' : 'Napísať recenziu'}
            </a>
            <span className="text-xs text-foreground-muted">
              {locale === 'en' ? 'Reviews provided by Google' : 'Recenzie poskytuje Google'}
            </span>
          </div>
        </div>
      </Container>
    </Section>
  );
}
