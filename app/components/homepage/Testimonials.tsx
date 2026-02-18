import { getLocalization } from "../../utils/getLocalization";
import Image from "next/image";
import { Section } from "../ui/section";
import { Container } from "../ui/container";
import { Card, CardContent } from "../ui/card";

// Server-side function to fetch testimonials
export default async function Testimonials() {
  const { homepage } = await getLocalization();

  if (!homepage?.testimonials || homepage.testimonials.length === 0) {
    return null; // Prevent rendering if no testimonials
  }

  const getStarElements = (rating: number) => {
    const stars = [];
    const maxStars = 5;

    for (let i = 0; i < maxStars; i++) {
      if (i < Math.floor(rating)) {
        stars.push(<span key={i} className="text-foreground-gold text-lg">★</span>); // Full star
      } else if (i < Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(<span key={i} className="text-foreground-gold text-lg">⯪</span>); // Half star symbol
      } else {
        stars.push(<span key={i} className="text-foreground text-lg">☆</span>); // Empty star
      }
    }

    return stars;
  };

  return (
    <Section spacing="lg">
      <Container>
        <div className="text-center">
          {/* Social Proof Badge */}


          {/* Section Title */}
          <h2 className="mb-4 text-3xl md:text-4xl font-bold tracking-tighter">
            {homepage.testimonialsTitle || "Čo o nás hovoria naši zákazníci"}
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto italic">
            "Vaša spokojnosť je pre nás najväčším ocenením. Každá fľaša vína nesie náš príbeh a vášeň pre tradíciu."
          </p>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 justify-items-center">
            {homepage.testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="hover:shadow-lg transition-all hover:scale-[1.02]"
              >
                <CardContent className="flex flex-col items-center text-center p-6">
                  {/* User Avatar */}
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name || "Customer Avatar"}
                    width={64}
                    height={64}
                    className="rounded-full mb-4 border-2 border-accent"
                    priority={false}
                    sizes="(max-width: 768px) 64px, 64px"
                  />

                  {/* Name */}
                  <h3 className="text-xl font-semibold text-foreground mb-2">{testimonial.name}</h3>

                  {/* Star Rating */}
                  <div className="flex mb-3">{getStarElements(Number(testimonial.rating) || 0)}</div>

                  {/* Review Text */}
                  <p className="text-foreground-muted text-base italic">{testimonial.review}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
