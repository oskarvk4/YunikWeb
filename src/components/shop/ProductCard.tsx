"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Product, formatPrice } from "@/types";
import Badge from "@/components/ui/Badge";
import { useCart } from "@/lib/cart";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group"
    >
      {/* Product Image */}
      <Link
        href={`/product/${product.slug}`}
        className="block relative aspect-square overflow-hidden bg-[#F5F0EB] mb-4"
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.newArrival && <Badge variant="new">Nyhed</Badge>}
          {product.featured && !product.newArrival && (
            <Badge variant="bestseller">Bestseller</Badge>
          )}
        </div>

        {/* Main Image */}
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-0"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Hover Image */}
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt={`${product.name} - alternate view`}
            fill
            className="object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 scale-105 group-hover:scale-100"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            className="w-full py-3 bg-[#1A1A1A] text-white text-xs font-sans uppercase tracking-[0.15em] hover:bg-[#333] transition-colors"
          >
            Tilføj Hurtigt
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="text-center">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif text-sm md:text-base font-medium text-[#1A1A1A] hover:text-[#8D6553] transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm font-sans text-[#1A1A1A]/70 mt-1">
          {formatPrice(product.price)}
        </p>
      </div>
    </motion.div>
  );
}
