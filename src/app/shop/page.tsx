"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import FilterBar from "@/components/shop/FilterBar";
import ProductGrid from "@/components/shop/ProductGrid";
import { products } from "@/data/products";
import { Product } from "@/types";

function ShopContent() {
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
  }, [activeCategory, activeSort]);

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

export default function ShopPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-[#F5F0EB] py-16 md:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-light text-[#1A1A1A] mb-4">
              Alle Smykker
            </h1>
            <p className="text-[#1A1A1A]/60 font-sans max-w-md mx-auto">
              Udforsk vores komplette kollektion af håndlavede smykker
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Products Section */}
      <section className="py-12 md:py-16">
        <Container>
          <Suspense
            fallback={
              <div className="text-center py-20">
                <p className="text-[#1A1A1A]/60 font-sans">Indlæser produkter...</p>
              </div>
            }
          >
            <ShopContent />
          </Suspense>
        </Container>
      </section>
    </div>
  );
}
