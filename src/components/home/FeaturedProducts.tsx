"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import { getFeaturedProducts } from "@/data/products";
import { formatPrice } from "@/types";
import { useCart } from "@/lib/cart";

export default function FeaturedProducts() {
  const featuredProducts = getFeaturedProducts().slice(0, 4);
  const { addItem } = useCart();

  return (
    <section className="py-20 md:py-28 bg-[#F5F0EB]">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-light text-[#1A1A1A] mb-4">
            Featured Pieces
          </h2>
          <p className="text-[#1A1A1A]/60 font-sans max-w-md mx-auto">
            Our most loved designs, chosen for their exceptional beauty
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              {/* Product Image */}
              <Link
                href={`/product/${product.slug}`}
                className="block relative aspect-square overflow-hidden bg-white mb-4"
              >
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                  {product.newArrival && <Badge variant="new">New</Badge>}
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
                  sizes="(max-width: 768px) 50vw, 25vw"
                />

                {/* Hover Image */}
                {product.images[1] && (
                  <Image
                    src={product.images[1]}
                    alt={`${product.name} - alternate view`}
                    fill
                    className="object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 scale-105 group-hover:scale-100"
                    sizes="(max-width: 768px) 50vw, 25vw"
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
                    Quick Add
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
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-sans uppercase tracking-[0.15em] text-[#1A1A1A] hover:text-[#8D6553] transition-colors group"
          >
            View All Products
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
