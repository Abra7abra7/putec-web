"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { getMediaUrl } from "../../utils/media";
import "yet-another-react-lightbox/styles.css";

// Defer heavy lightbox bundle until needed (client-only)
const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
  ssr: false,
});

interface ProductLightboxProps {
  images: string[];
}

export default function ProductLightbox({ images }: ProductLightboxProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div>
      {/* MAIN IMAGE (Click to Open Lightbox) */}
      <div
        className="w-full cursor-pointer"
        onClick={() => {
          setLightboxIndex(0);
          setLightboxOpen(true);
        }}
      >
        <Image
          src={getMediaUrl(images[0])}
          alt={`Hlavný obrázok produktu`}
          width={800}
          height={600}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="w-full h-auto object-contain rounded-lg border"
        />
      </div>

      {/* IMAGE GALLERY REMOVED PER CLIENT REQUEST */}

      {/* LIGHTBOX MODAL */}
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={images.map((src) => ({ src: getMediaUrl(src) }))}
        />
      )}
    </div>
  );
}
