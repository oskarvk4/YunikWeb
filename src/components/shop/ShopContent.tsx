"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FilterBar from "@/components/shop/FilterBar";
import ProductGrid from "@/components/shop/ProductGrid";
import { Product } from "@/types";

interface ShopContentProps {
  products: Product[];
}

export default function ShopContent({ products }: ShopContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam = searchParams.get("category") || "all";
  const sortParam = searchParams.get("sort") || "newest";

  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [activeSort, setActiveSort] = useState(sortParam);

  // Sync state with URL params
  useEffect(() => {
    setActiveCategory(categoryParam);
    setActiveSort(sortParam);
  }, [categoryParam, sortParam]);

  const updateURL = (category: string, sort: string) => {
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (sort !== "newest") params.set("sort", sort);
    const queryString = params.toString();
    router.push(`/shop${queryString ? `?${queryString}` : ""}`, { scroll: false });
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    updateURL(category, activeSort);
  };

  const handleSortChange = (sort: string) => {
    setActiveSort(sort);
    updateURL(activeCategory, sort);
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Sort
    switch (activeSort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        // Newest first - prioritize new arrivals
        result.sort((a, b) => {
          if (a.newArrival && !b.newArrival) return -1;
          if (!a.newArrival && b.newArrival) return 1;
          return 0;
        });
        break;
    }

    return result;
  }, [products, activeCategory, activeSort]);

  return (
    <>
      <FilterBar
        activeCategory={activeCategory}
        activeSort={activeSort}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
      />
      <ProductGrid products={filteredAndSortedProducts} />
    </>
  );
}
