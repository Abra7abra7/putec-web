import Image from "next/image";
import Link from "next/link";

interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundImageUrl: string;
  mobileBackgroundImageUrl?: string; // New prop for Art Direction
  focalPoint?: string; // e.g. "center 25%" or "50% 30%"
  heightClass?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export default function Hero({
  title,
  subtitle,
  backgroundImageUrl,
  mobileBackgroundImageUrl,
  focalPoint = "center 25%", // Default focal point
  heightClass = "h-[60vh]",
  primaryCta,
  secondaryCta,
}: HeroProps) {
  return (
    <section className={`relative ${heightClass} bg-background text-foreground`}>
      <div className="absolute inset-0">
        {/* Desktop Image (Hidden on mobile if mobile image exists) */}
        <div className={`relative w-full h-full ${mobileBackgroundImageUrl ? 'hidden md:block' : ''}`}>
          <Image
            src={backgroundImageUrl}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: focalPoint }}
          />
        </div>

        {/* Mobile Image (Only if provided) */}
        {mobileBackgroundImageUrl && (
          <div className="relative w-full h-full md:hidden">
            <Image
              src={mobileBackgroundImageUrl}
              alt={title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: 'center center' }} // Mobile usually needs center
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      <div className="relative z-10 h-full">
        <div className="container mx-auto px-6 h-full flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold drop-shadow mb-4 text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white/90">
              {subtitle}
            </p>
          )}
          {(primaryCta || secondaryCta) && (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {primaryCta && (
                <Link
                  href={primaryCta.href}
                  className="bg-accent hover:bg-accent-dark text-foreground px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  {primaryCta.label}
                </Link>
              )}
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="border-2 border-accent text-white hover:bg-accent hover:text-foreground px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


