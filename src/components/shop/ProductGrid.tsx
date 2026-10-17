"use client";

import Link from "next/link";
import { Product } from "@/types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-[#1A1A1A]/60 font-sans">
          Ingen smykker matcher dine valg.
        </p>
        <Link
          href="/shop"
          className="mt-4 inline-block text-xs font-sans uppercase tracking-[0.15em] text-[#1A1A1A] underline underline-offset-4 hover:text-[#8D6553] transition-colors"
        >
          Se alle smykker
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
