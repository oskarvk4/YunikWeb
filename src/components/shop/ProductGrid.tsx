"use client";

import Link from "next/link";
import { Product } from "@/types";
import { useCopy } from "@/components/CopyProvider";
import { fillText } from "@/lib/copy-text";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  // Set when the selected category has no pieces at all (not just none after other filters).
  emptyCategory?: { value: string; label: string };
}

export default function ProductGrid({ products, emptyCategory }: ProductGridProps) {
  const { grid } = useCopy().shop;

  if (products.length === 0 && emptyCategory) {
    // Earrings are the fallback suggestion, so there is nothing else to point to if they are the empty one.
    const suggestEarrings = emptyCategory.value !== "earrings";
    return (
      <div className="text-center py-20">
        <h2 className="font-serif text-2xl md:text-3xl font-light text-[#1A1A1A]">
          {fillText(grid.emptyCategoryTitle, { category: emptyCategory.label })}
        </h2>
        <p className="mt-3 text-[#1A1A1A]/60 font-sans">
          {grid.emptyCategoryText}
          {suggestEarrings && ` ${grid.emptyCategoryEarringsHint}`}
        </p>
        <Link
          href={suggestEarrings ? "/shop?category=earrings" : "/shop"}
          className="mt-6 inline-flex items-center justify-center px-6 py-3 text-sm font-sans font-medium tracking-wide border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1A1A1A]"
        >
          {suggestEarrings ? grid.emptyCategoryEarringsLink : grid.emptyCategoryAllLink}
        </Link>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-[#1A1A1A]/60 font-sans">
          {grid.noMatches}
        </p>
        <Link
          href="/shop"
          className="mt-4 inline-block text-xs font-sans uppercase tracking-[0.15em] text-[#1A1A1A] underline underline-offset-4 hover:text-[#8D6553] transition-colors"
        >
          {grid.noMatchesLink}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
