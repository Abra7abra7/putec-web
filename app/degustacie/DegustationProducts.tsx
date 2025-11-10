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
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Naše degustačné balíky
            </h2>
            <p className="text-foreground-muted text-lg max-w-2xl mx-auto">
              Vyberte si z našich špeciálne pripravených degustačných balíkov, 
              ktoré sú navrhnuté pre rôzne veľkosti skupín a príležitosti.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {products.map((product) => (
              <div key={product.ID} className="relative rounded-lg shadow-lg overflow-hidden border border-gray-200 h-[500px] md:h-[600px]">
                {/* Full background image */}
                <Image
                  src={product.FeatureImageURL || '/placeholder.png'}
                  alt={product.Title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Gradient overlay - silnejsi zdola */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
                
                {/* Content overlay */}
                <div className="relative h-full flex flex-col justify-between p-6 text-white">
                  {/* Top section - Title & Info */}
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold drop-shadow-lg mb-3">{product.Title}</h3>
                    <div className="flex gap-4 text-sm md:text-base">
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {product.Capacity}
                      </span>
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {product.Duration}
                      </span>
                    </div>
                  </div>

                  {/* Bottom section - Description, Features, Price, Button */}
                  <div className="space-y-4">
                    {/* Description */}
                    <p className="text-white/90 text-sm md:text-base leading-relaxed drop-shadow">
                      {product.ShortDescription}
                    </p>

                    {/* Features */}
                    {product.Features && (
                      <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4">
                        <h5 className="font-semibold text-white mb-2 text-sm">Zahrnuté v balíku:</h5>
                        <ul className="space-y-1">
                          {product.Features.map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2 text-sm">
                              <Check className="w-4 h-4 text-accent flex-shrink-0" />
                              <span className="text-white/90">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Price & Button */}
                    <div className="flex items-center justify-between gap-4 bg-black/40 backdrop-blur-sm rounded-lg p-4">
                      <div>
                        <div className="text-2xl md:text-3xl font-bold text-white">
                          {product.SalePrice}€
                        </div>
                        {product.Deposit && (
                          <p className="text-xs text-white/80">
                            Vratná záloha: {product.Deposit}€
                          </p>
                        )}
                      </div>
                      <Link
                        href={`/degustacie/${product.Slug}`}
                        className="bg-accent hover:bg-accent-dark text-foreground px-6 py-3 rounded-lg font-semibold transition-colors text-center whitespace-nowrap"
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
