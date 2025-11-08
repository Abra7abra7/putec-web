import Image from "next/image";
import Link from "next/link";

interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundImageUrl: string;
  heightClass?: string; // e.g. h-[60vh] h-[70vh]
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export default function Hero({
  title,
  subtitle,
  backgroundImageUrl,
  heightClass = "h-[60vh]",
  primaryCta,
  secondaryCta,
}: HeroProps) {
  return (
    <section className={`relative ${heightClass} bg-background text-foreground`}> 
      <div className="absolute inset-0">
        <Image
          src={backgroundImageUrl}
          alt={title}
          fill
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, 90vw"
          className="object-cover"
          style={{ objectPosition: 'center 25%' }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      <div className="relative z-10 h-full">
        <div className="container mx-auto px-6 h-full flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold drop-shadow mb-4" style={{ color: '#ffffff' }}>{title}</h1>
          {subtitle && (
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8" style={{ color: 'rgba(255,255,255,0.9)' }}>
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


