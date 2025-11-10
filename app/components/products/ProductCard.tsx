"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "../../../types/Product";
import { getCurrencySymbol } from "../../utils/getCurrencySymbol";
import AddToCartButton from "./AddToCartButton";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const isOnSale = product.SalePrice !== product.RegularPrice;
  const displayPrice = product.SalePrice || product.RegularPrice;
  const currency = getCurrencySymbol(product.Currency);

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Product Image */}
      <Link href={`/vina/${product.Slug}`} className="relative w-full aspect-[3/4] block overflow-hidden">
        <Image
          src={product.FeatureImageURL}
          alt={product.Title}
          fill
          className="object-contain hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
        {isOnSale && (
          <div className="absolute top-3 right-3">
            <Badge variant="error">ZĽAVA</Badge>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <CardContent className="p-4 flex flex-col flex-1">
        <Link href={`/vina/${product.Slug}`}>
          <h3 className="text-base font-bold text-foreground mb-2 hover:text-accent transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.Title}
          </h3>
        </Link>

        <p className="text-xs text-foreground-muted mb-3 line-clamp-2 flex-1">
          {product.ShortDescription}
        </p>

        {/* Price */}
        <div className="mb-3">
          {isOnSale ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl font-bold text-red-600">
                {currency}{displayPrice}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {currency}{product.RegularPrice}
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold text-foreground">
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

