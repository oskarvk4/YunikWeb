"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FilterBar from "@/components/shop/FilterBar";
import ProductGrid from "@/components/shop/ProductGrid";
import { Product } from "@/types";

interface ShopContentProps {
  products: Product[];
}

const VALID_METALS = ["gold", "silver"] as const;
type Metal = (typeof VALID_METALS)[number];

function parseMetals(value: string | null): Metal[] {
  if (!value) return [];
  return value
    .split(",")
    .map((m) => m.trim().toLowerCase())
    .filter((m): m is Metal => (VALID_METALS as readonly string[]).includes(m));
}

export default function ShopContent({ products }: ShopContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeCategory = searchParams.get("category") || "all";
  const activeSort = searchParams.get("sort") || "newest";
  const activeMetals = useMemo(
    () => parseMetals(searchParams.get("metal")),
    [searchParams]
  );
  const minPrice = Number(searchParams.get("minPrice")) || null;
  const maxPrice = Number(searchParams.get("maxPrice")) || null;

  const updateURL = (category: string, sort: string, metals: Metal[]) => {
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (sort !== "newest") params.set("sort", sort);
    if (metals.length > 0) params.set("metal", metals.join(","));
    if (minPrice !== null) params.set("minPrice", String(minPrice));
    if (maxPrice !== null) params.set("maxPrice", String(maxPrice));
    const queryString = params.toString();
    router.push(`/shop${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  };

  const handleCategoryChange = (category: string) => {
    updateURL(category, activeSort, activeMetals);
  };

  const handleSortChange = (sort: string) => {
    updateURL(activeCategory, sort, activeMetals);
  };

  const handleMetalToggle = (metal: string) => {
    if (!(VALID_METALS as readonly string[]).includes(metal)) return;
    const m = metal as Metal;
    const next = activeMetals.includes(m)
      ? activeMetals.filter((x) => x !== m)
      : [...activeMetals, m];
    updateURL(activeCategory, activeSort, next);
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Filter by metal (OR within selected metals)
    if (activeMetals.length > 0) {
      result = result.filter((p) => activeMetals.includes(p.metal));
    }

    // Filter by price
    if (minPrice !== null) {
      result = result.filter((p) => p.price >= minPrice);
    }
    if (maxPrice !== null) {
      result = result.filter((p) => p.price <= maxPrice);
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
        // Products arrive pre-sorted by created_at DESC from Supabase — preserve that order
        break;
    }

    return result;
  }, [products, activeCategory, activeSort, activeMetals, minPrice, maxPrice]);

  return (
    <>
      <FilterBar
        activeCategory={activeCategory}
        activeSort={activeSort}
        activeMetals={activeMetals}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
        onMetalToggle={handleMetalToggle}
      />
      <ProductGrid products={filteredAndSortedProducts} />
    </>
  );
}
