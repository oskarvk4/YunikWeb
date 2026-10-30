"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FilterBar, { CATEGORY_FILTER_VALUES } from "@/components/shop/FilterBar";
import ProductGrid from "@/components/shop/ProductGrid";
import { Product } from "@/types";
import { GIFT_PRICE_LIMIT } from "@/lib/storefront";
import { useCopy } from "@/components/CopyProvider";
import { categoryLabel } from "@/lib/copy-text";

interface ShopContentProps {
  products: Product[];
}

const VALID_METALS = ["gold", "silver"] as const;
type Metal = (typeof VALID_METALS)[number];

type UrlChanges = {
  category?: string;
  sort?: string;
  metals?: Metal[];
  maxPrice?: number | null;
};

function parseMetals(value: string | null): Metal[] {
  if (!value) return [];
  return value
    .split(",")
    .map((m) => m.trim().toLowerCase())
    .filter((m): m is Metal => (VALID_METALS as readonly string[]).includes(m));
}

export default function ShopContent({ products }: ShopContentProps) {
  const copy = useCopy();
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

  // The selected category, when it has no pieces at all (not merely none left after
  // the metal or price filters), so the grid can say it is on its way.
  const emptyCategory = useMemo(() => {
    if (activeCategory === "all") return undefined;
    if (products.some((p) => p.category === activeCategory)) return undefined;
    if (!(CATEGORY_FILTER_VALUES as readonly string[]).includes(activeCategory)) return undefined;
    return { value: activeCategory, label: categoryLabel(copy.site, activeCategory) };
  }, [products, activeCategory, copy.site]);

  const updateURL = (changes: UrlChanges) => {
    const category = changes.category ?? activeCategory;
    const sort = changes.sort ?? activeSort;
    const metals = changes.metals ?? activeMetals;
    const max = changes.maxPrice !== undefined ? changes.maxPrice : maxPrice;

    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (sort !== "newest") params.set("sort", sort);
    if (metals.length > 0) params.set("metal", metals.join(","));
    if (minPrice !== null) params.set("minPrice", String(minPrice));
    if (max !== null) params.set("maxPrice", String(max));
    const queryString = params.toString();
    router.push(`/shop${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  };

  const handleCategoryChange = (category: string) => {
    updateURL({ category });
  };

  const handleSortChange = (sort: string) => {
    updateURL({ sort });
  };

  const handleMetalToggle = (metal: string) => {
    if (!(VALID_METALS as readonly string[]).includes(metal)) return;
    const m = metal as Metal;
    const next = activeMetals.includes(m)
      ? activeMetals.filter((x) => x !== m)
      : [...activeMetals, m];
    updateURL({ metals: next });
  };

  const handleUnderPriceToggle = () => {
    updateURL({
      maxPrice: maxPrice === GIFT_PRICE_LIMIT ? null : GIFT_PRICE_LIMIT,
    });
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
        underPriceActive={maxPrice === GIFT_PRICE_LIMIT}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
        onMetalToggle={handleMetalToggle}
        onUnderPriceToggle={handleUnderPriceToggle}
      />
      <ProductGrid products={filteredAndSortedProducts} emptyCategory={emptyCategory} />
    </>
  );
}
