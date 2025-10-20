"use client";

import { useState, useMemo, useEffect } from "react";
import { Product } from "../../../types/Product";

interface WineFiltersProps {
  wines: Product[];
  onFilterChange: (filtered: Product[]) => void;
}

export default function WineFilters({ wines, onFilterChange }: WineFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedColor, setSelectedColor] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState<string>("name");

  // Extract unique categories and colors from wines
  const categories = useMemo(() => {
    const cats = new Set<string>();
    wines.forEach(wine => {
      wine.ProductCategories?.forEach(cat => cats.add(cat));
    });
    return Array.from(cats).sort();
  }, [wines]);

  const wineColors = useMemo(() => {
    const colors = new Set<string>();
    wines.forEach(wine => {
      const details = wine.WineDetails;
      if (details?.color) colors.add(details.color);
    });
    return Array.from(colors).sort();
  }, [wines]);

  // Max price for range slider
  const maxPrice = useMemo(() => {
    return Math.max(...wines.map(w => parseFloat(w.SalePrice || "0")), 100);
  }, [wines]);

  // Filter and sort wines
  const filteredWines = useMemo(() => {
    const filtered = wines.filter(wine => {
      // Search filter
      const matchesSearch = wine.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           wine.ShortDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           wine.WineDetails?.wineType?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = selectedCategory === "all" || 
                              wine.ProductCategories?.includes(selectedCategory);
      
      // Color filter
      const matchesColor = selectedColor === "all" || 
                          wine.WineDetails?.color === selectedColor;
      
      // Price filter
      const price = parseFloat(wine.SalePrice || "0");
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesColor && matchesPrice;
    });

    // Sort (create sorted copy to avoid mutation)
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.Title || "").localeCompare(b.Title || "");
        case "price-asc":
          return parseFloat(a.SalePrice || "0") - parseFloat(b.SalePrice || "0");
        case "price-desc":
          return parseFloat(b.SalePrice || "0") - parseFloat(a.SalePrice || "0");
        case "vintage":
          const yearA = parseInt(a.WineDetails?.vintage || "0");
          const yearB = parseInt(b.WineDetails?.vintage || "0");
          return yearB - yearA; // Newest first
        default:
          return 0;
      }
    });

    return sorted;
  }, [wines, searchTerm, selectedCategory, selectedColor, priceRange, sortBy]);

  // Trigger parent callback when filters change
  useEffect(() => {
    onFilterChange(filteredWines);
  }, [filteredWines, onFilterChange]);

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedColor("all");
    setPriceRange([0, maxPrice]);
    setSortBy("name");
  };

  const activeFiltersCount = 
    (searchTerm ? 1 : 0) +
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedColor !== "all" ? 1 : 0) +
    (priceRange[0] !== 0 || priceRange[1] !== maxPrice ? 1 : 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <span>🔍</span> Filtrovanie a vyhľadávanie
        </h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={handleReset}
            className="text-sm text-accent hover:text-accent-dark font-medium transition-colors flex items-center gap-1"
          >
            <span>✕</span> Zrušiť filtre ({activeFiltersCount})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            Vyhľadať
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Názov, odroda, popis..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Kategória
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
          >
            <option value="all">Všetky kategórie</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Farba vína
          </label>
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
          >
            <option value="all">Všetky farby</option>
            {wineColors.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Cenové rozpätie: {priceRange[0]}€ - {priceRange[1]}€
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max={maxPrice}
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
              className="flex-1"
            />
            <input
              type="range"
              min="0"
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="flex-1"
            />
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Zoradiť podľa
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
          >
            <option value="name">Názov (A-Z)</option>
            <option value="price-asc">Cena (od najnižšej)</option>
            <option value="price-desc">Cena (od najvyššej)</option>
            <option value="vintage">Ročník (najnovší)</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-foreground-muted">
          Zobrazených <span className="font-semibold text-accent">{filteredWines.length}</span> z {wines.length} vín
        </p>
      </div>
    </div>
  );
}

