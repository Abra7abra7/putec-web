"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "../../types/Product";

// Define context type
interface ProductContextType {
  products: Product[];
  filteredProducts: Product[];
  setFilteredProducts: (products: Product[]) => void;
  categories: string[];
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  setSortBy: (sort: string) => void;
}

// Create context with default values
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Context provider component
export function ProductProvider({
  children,
  initialData = [],
}: {
  children: ReactNode;
  initialData?: Product[];
}) {
  const [products] = useState<Product[]>(initialData);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialData);
  const [categories] = useState<string[]>(
    [...new Set(initialData.flatMap((p) => p.ProductCategories))].sort()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState<string>("name");

  useEffect(() => {
    let updatedProducts = [...products];

    if (searchQuery) {
      updatedProducts = updatedProducts.filter((product) =>
        product.Title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter) {
      updatedProducts = updatedProducts.filter((product) =>
        product.ProductCategories.includes(categoryFilter)
      );
    }

    updatedProducts.sort((a, b) => {
      if (sortBy === "price") return parseFloat(a.SalePrice) - parseFloat(b.SalePrice);
      if (sortBy === "newest") return b.ID.localeCompare(a.ID);
      return a.Title.localeCompare(b.Title);
    });

    setFilteredProducts(updatedProducts);
  }, [searchQuery, categoryFilter, sortBy, products]);

  return (
    <ProductContext.Provider
      value={{
        products,
        filteredProducts,
        setFilteredProducts,
        categories,
        setSearchQuery,
        setCategoryFilter,
        setSortBy,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

// Custom hook to use the product context
export function useProductContext() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
}
