"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
const MotionDiv = dynamic(() => import("framer-motion").then(m => m.motion.div), { ssr: false });
const MotionH1 = dynamic(() => import("framer-motion").then(m => m.motion.h1), { ssr: false });
const MotionP = dynamic(() => import("framer-motion").then(m => m.motion.p), { ssr: false });
import { useEffect, useState } from "react";
import { useLocalization } from "../../context/LocalizationContext";
import RatingBadge from "../RatingBadge";
import { Button } from "../ui/button";

export default function HomepageBanner() {
  const { homepage } = useLocalization(); // Get homepage data
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReduceMotion(mq.matches);
      const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
      mq.addEventListener?.('change', handler);
      return () => mq.removeEventListener?.('change', handler);
    }
  }, []);

  if (!homepage?.banner) {
    return null; // Prevent render if localization data is missing
  }

  const { buttonText, ctaLink, imagePath } = homepage.banner;

  return (
    <section
      className="w-full relative overflow-hidden text-white flex justify-center items-center text-center"
      style={{ minHeight: "500px" }}
    >
      {/* LCP image as Next/Image with priority to improve LCP */}
      <Image
        src={imagePath}
        alt="Vinohrad Putec – úvodný banner"
        fill
        priority
        fetchPriority="high"
        sizes="(max-width: 768px) 100vw, 100vw"
        placeholder="empty"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
      {/* soft overlay for readability */}
      <div className="absolute inset-0 bg-black/30" aria-hidden />
      <MotionDiv
        initial={reduceMotion ? undefined : { opacity: 0, scale: 0.8 }}
        animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.8, ease: "easeOut" }}
        className="relative max-w-4xl mx-auto px-6 py-32 md:py-48 flex flex-col items-center"
      >
        <RatingBadge ratingValue={5} reviewCount={31} className="mb-4" />
        <MotionH1
          initial={reduceMotion ? undefined : { opacity: 0, y: -20 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-4xl font-extrabold mb-6 drop-shadow-lg !text-white"
          style={{ color: 'white' }}
        >
          Rodinné vinárstvo Putec
        </MotionH1>
        
        <MotionP
          initial={reduceMotion ? undefined : { opacity: 0, y: -20 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl mb-8 max-w-2xl drop-shadow-lg !text-white"
          style={{ color: 'white' }}
        >
          Prémiové vína z Vinosád, ubytovanie a degustácie vína v Pezinku
        </MotionP>

        {/* Action Buttons */}
        <MotionDiv
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.6 }}
          className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto"
        >
          <Button asChild variant="secondary" size="lg" className="w-full md:w-auto">
            <Link href={ctaLink}>
              {buttonText}
            </Link>
          </Button>
          
          <Button asChild variant="primary" size="lg" className="w-full md:w-auto">
            <Link href="/ubytovanie">
              Ubytovanie
            </Link>
          </Button>
          
          <Button asChild variant="primary" size="lg" className="w-full md:w-auto">
            <Link href="/degustacie">
              Degustácie
            </Link>
          </Button>
        </MotionDiv>
      </MotionDiv>
    </section>
  );
}
