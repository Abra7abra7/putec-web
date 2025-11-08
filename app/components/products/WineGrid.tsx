"use client";

import { useState, useEffect, useCallback } from "react";
import ProductCardWithProvider from "./ProductCardWithProvider";
import WineFilters from "./WineFilters";
import { Product } from "../../../types/Product";
import { useLocalization } from "../../context/LocalizationContext";
import { Container } from "../ui/container";

export default function WineGrid() {
  const [allWines, setAllWines] = useState<Product[]>([]);
  const [filteredWines, setFilteredWines] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { labels } = useLocalization();

  useEffect(() => {
    const fetchWines = async () => {
      try {
        const response = await fetch('/api/wines');
        const data = await response.json();
        const wines = data.wines || [];
        setAllWines(wines);
        setFilteredWines(wines);
      } catch (error) {
        console.error('Chyba pri načítaní vín:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWines();
  }, []);

  const handleFilterChange = useCallback((filtered: Product[]) => {
    setFilteredWines(filtered);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-foreground">{labels.loadingProducts || "Načítavanie vín..."}</p>
      </div>
    );
  }

  if (allWines.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground">{labels.noProductsFound || "Žiadne vína sa nenašli..."}</p>
      </div>
    );
  }

  return (
    <Container>
      <WineFilters wines={allWines} onFilterChange={handleFilterChange} />
      
      {filteredWines.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-foreground-muted text-lg">🔍 Žiadne vína nezodpovedajú vašim filtrom</p>
          <p className="text-sm text-foreground-muted mt-2">Skúste zmeniť kritériá vyhľadávania</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 desktop:grid-cols-3 gap-6 desktop:gap-8">
          {filteredWines.map((wine) => (
            <ProductCardWithProvider key={wine.ID} product={wine} />
          ))}
        </div>
      )}
    </Container>
  );
}
