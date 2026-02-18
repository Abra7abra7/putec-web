"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "../../../types/Product";
import { getCurrencySymbol } from "../../utils/getCurrencySymbol";
import AddToCartButton from "./AddToCartButton";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Wine, Calendar } from "lucide-react";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const isOnSale = product.SalePrice !== product.RegularPrice;
  const displayPrice = product.SalePrice || product.RegularPrice;
  const currency = getCurrencySymbol(product.Currency);

  // Extrahovať farbu vína z kategórií
  const getWineColor = () => {
    if (product.ProductCategories?.includes("Biele vína")) return { label: "Biele", color: "bg-amber-100 text-amber-800 border-amber-300" };
    if (product.ProductCategories?.includes("Červené vína")) return { label: "Červené", color: "bg-red-100 text-red-800 border-red-300" };
    if (product.ProductCategories?.includes("Ružové vína")) return { label: "Ružové", color: "bg-pink-100 text-pink-800 border-pink-300" };
    return null;
  };

  const wineColor = getWineColor();
  const vintage = product.WineDetails?.vintage;
  const wineType = product.WineDetails?.wineType;

  return (
    <Card className="group overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full border-2 hover:border-accent/30">
      {/* Product Image */}
      <Link href={`/vina/${product.Slug}`} className="relative w-full aspect-[1/1] block overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <Image
          src={product.FeatureImageURL}
          alt={product.Title || "Product Image"}
          fill
          className="object-contain hover:scale-110 transition-transform duration-500 p-4"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          priority={false}
        />

        {/* Gradient overlay na hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {wineColor && (
            <Badge className={`${wineColor.color} border shadow-sm font-semibold`}>
              {wineColor.label}
            </Badge>
          )}
        </div>

        {isOnSale && (
          <div className="absolute top-3 right-3">
            <Badge variant="error" className="shadow-lg">ZĽAVA</Badge>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <CardContent className="p-5 flex flex-col flex-1 bg-white">
        <Link href={`/vina/${product.Slug}`}>
          <h3 className="text-lg font-bold text-foreground mb-2 hover:text-accent transition-colors line-clamp-2 min-h-[3.5rem] leading-tight">
            {product.Title}
          </h3>
        </Link>

        {/* Wine details */}
        <div className="flex items-center gap-3 mb-3 text-xs text-foreground-muted">
          {vintage && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{vintage}</span>
            </div>
          )}
          {wineType && (
            <div className="flex items-center gap-1">
              <Wine className="w-3.5 h-3.5" />
              <span className="capitalize">{wineType}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-foreground-muted mb-4 line-clamp-2 flex-1">
          {product.ShortDescription}
        </p>

        {/* Price Section */}
        <div className="mb-4 pt-3 border-t border-gray-100">
          {isOnSale ? (
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-2xl font-bold text-red-600">
                {currency}{displayPrice}
              </span>
              <span className="text-sm text-gray-400 line-through">
                {currency}{product.RegularPrice}
              </span>
            </div>
          ) : (
            <span className="text-2xl font-bold text-accent">
              {currency}{displayPrice}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <AddToCartButton product={product} />
      </CardContent>
    </Card>
  );
}

