"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundImageUrl: string;
  mobileBackgroundImageUrl?: string; // New prop for Art Direction
  focalPoint?: string; // e.g. "center 25%" or "50% 30%"
  heightClass?: string;
  headingLevel?: "h1" | "h2";
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
  headingLevel = "h1",
}: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const Heading = motion[headingLevel];

  return (
    <section ref={containerRef} className={`relative ${heightClass} bg-background overflow-hidden`}>
      <motion.div className="absolute inset-0" style={{ y }}>
        {/* Desktop Image (Hidden on mobile if mobile image exists) */}
        <div className={`relative w-full h-[120%] -top-[10%] ${mobileBackgroundImageUrl ? 'hidden md:block' : ''}`}>
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
          <div className="relative w-full h-[120%] -top-[10%] md:hidden">
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

        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80" />
      </motion.div>

      <div className="relative z-10 h-full">
        <div className="container mx-auto px-6 h-full flex flex-col items-center justify-center text-center">
          <Heading
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-xl mb-6 !text-white tracking-tight"
          >
            {title}
          </Heading>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl max-w-3xl mx-auto mb-10 !text-white drop-shadow-md font-medium"
            >
              {subtitle}
            </motion.p>
          )}
          {(primaryCta || secondaryCta) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              {primaryCta && (
                <Link
                  href={primaryCta.href}
                  className="bg-accent hover:bg-accent-dark text-foreground px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-accent/20"
                >
                  {primaryCta.label}
                </Link>
              )}
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="border-2 border-accent text-white hover:bg-accent hover:text-foreground px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/20"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}


