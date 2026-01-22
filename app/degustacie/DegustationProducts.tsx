"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Clock, Check } from "lucide-react";
import { Product } from "../../types/Product";

export default function DegustationProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/degustacie');
        const data = await response.json();
        setProducts(data.degustacie || []);
      } catch (error) {
        console.error('Chyba pri načítaní degustačných produktov:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-foreground">Načítavam degustácie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Products Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-3 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Naše degustačné balíky
            </h2>
            <p className="text-foreground-muted text-lg max-w-2xl mx-auto">
              Vyberte si z našich špeciálne pripravených degustačných balíkov,
              ktoré sú navrhnuté pre rôzne veľkosti skupín a príležitosti.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-8">
            {products.map((product) => (
              <div key={product.ID} className="relative rounded-lg shadow-lg overflow-hidden border border-gray-200 min-h-[400px] md:min-h-[600px]">
                {/* Full background image */}
                <Image
                  src={product.FeatureImageURL || '/placeholder.png'}
                  alt={product.Title}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />

                {/* Gradient overlay - jemnejší, obrázok viditeľný navrch */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/40" />

                {/* Content overlay */}
                <div className="relative h-full flex flex-col justify-between p-3 md:p-6 text-white">
                  {/* Top section - Title & Info */}
                  <div>
                    <h3 className="text-lg md:text-3xl font-bold drop-shadow-xl mb-3 leading-tight !text-white">{product.Title}</h3>
                    <div className="flex flex-wrap gap-2 text-xs md:text-base">
                      <span className="bg-black/40 backdrop-blur-sm px-2 md:px-3 py-1 rounded-full flex items-center gap-1.5 md:gap-2 text-white border border-white/10">
                        <Users className="w-3 h-3 md:w-4 md:h-4" />
                        {product.Capacity}
                      </span>
                      <span className="bg-black/40 backdrop-blur-sm px-2 md:px-3 py-1 rounded-full flex items-center gap-1.5 md:gap-2 text-white border border-white/10">
                        <Clock className="w-3 h-3 md:w-4 md:h-4" />
                        {product.Duration}
                      </span>
                    </div>
                  </div>

                  {/* Bottom section - Description, Features, Price, Button */}
                  <div className="space-y-3 md:space-y-4 mt-auto">
                    {/* Description */}
                    <p className="!text-white text-xs md:text-base leading-relaxed drop-shadow-md font-medium">
                      {product.ShortDescription}
                    </p>

                    {/* Features */}
                    {product.Features && (
                      <div className="bg-black/60 backdrop-blur-md rounded-lg p-3 md:p-4 border border-white/10 shadow-lg">
                        <h5 className="font-semibold !text-white mb-2 text-xs md:text-sm">Zahrnuté v balíku:</h5>
                        <ul className="space-y-1">
                          {product.Features.map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2 text-xs md:text-sm">
                              <Check className="w-3 h-3 md:w-4 md:h-4 text-accent flex-shrink-0" />
                              <span className="!text-white/95">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Price & Button */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4 bg-black/70 backdrop-blur-md rounded-lg p-3 md:p-4 border border-white/10 shadow-lg">
                      <div>
                        <div className="text-xl md:text-3xl font-bold text-white">
                          {product.SalePrice}€
                        </div>
                        {product.Deposit && (
                          <p className="text-xs text-white/90">
                            Vratná záloha: {product.Deposit}€
                          </p>
                        )}
                      </div>
                      <Link
                        href={`/degustacie/${product.Slug}`}
                        className="bg-accent hover:bg-accent-dark text-foreground px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-colors text-center whitespace-nowrap w-full sm:w-auto text-sm md:text-base"
                      >
                        Rezervovať
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
