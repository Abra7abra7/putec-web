"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import "yet-another-react-lightbox/styles.css";

const Lightbox = dynamic(() => import("yet-another-react-lightbox"), { ssr: false });

interface GalleryGridProps {
    images: string[];
}

export default function GalleryGrid({ images }: GalleryGridProps) {
    const [index, setIndex] = useState(-1);

    if (!images || images.length === 0) return null;

    return (
        <>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                {images.map((src, i) => (
                    <div
                        key={src}
                        className="break-inside-avoid relative group cursor-pointer rounded-lg overflow-hidden"
                        onClick={() => setIndex(i)}
                    >
                        <Image
                            src={src}
                            alt={`Gallery Image ${i + 1}`}
                            width={800}
                            height={600}
                            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <span className="text-white bg-black/50 px-3 py-1 rounded-full text-sm">Zväčšiť</span>
                        </div>
                    </div>
                ))}
            </div>

            <Lightbox
                open={index >= 0}
                index={index}
                close={() => setIndex(-1)}
                slides={images.map((src) => ({ src }))}
            />
        </>
    );
}
