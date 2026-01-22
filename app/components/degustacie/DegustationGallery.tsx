"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface DegustationGalleryProps {
    featureImage: string;
    title: string;
    galleryImages?: string[] | null;
}

export default function DegustationGallery({ featureImage, title, galleryImages = [] }: DegustationGalleryProps) {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    // Ensure galleryImages is an array and filter out empty strings if any
    const validGalleryImages = (galleryImages || []).filter(Boolean);
    const allImages = [featureImage, ...validGalleryImages];

    return (
        <div className="space-y-4">
            {/* Feature Image */}
            <div
                className="relative cursor-pointer group overflow-hidden rounded-xl shadow-lg border border-gray-100"
                onClick={() => { setIndex(0); setOpen(true); }}
            >
                <Image
                    src={featureImage}
                    alt={title}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 bg-black/50 px-6 py-2 rounded-full backdrop-blur-sm font-medium">
                        Zobraziť galériu
                    </span>
                </div>
            </div>

            {/* Gallery Grid */}
            {validGalleryImages.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                    {validGalleryImages.map((image, i) => (
                        <div
                            key={i}
                            className="relative aspect-[4/3] cursor-pointer group overflow-hidden rounded-xl shadow-md border border-gray-100"
                            onClick={() => { setIndex(i + 1); setOpen(true); }}
                        >
                            <Image
                                src={image}
                                alt={`${title} - galéria ${i + 1}`}
                                fill
                                sizes="(max-width: 768px) 50vw, 33vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    🔍
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Lightbox
                open={open}
                close={() => setOpen(false)}
                index={index}
                slides={allImages.map(src => ({ src }))}
                styles={{ container: { backgroundColor: "rgba(0, 0, 0, .9)" } }}
            />
        </div>
    );
}
