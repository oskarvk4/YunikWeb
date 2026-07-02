"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";
import { Product, formatPrice } from "@/types";
import { useCart } from "@/lib/cart";

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const { addItem } = useCart();

  if (products.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-[#F5F0EB]">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="font-serif text-2xl md:text-3xl font-light text-[#1A1A1A]">
            Måske Kan Du Også Lide
          </h2>
        </motion.div>

        {/* Horizontal Scroll Container */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          <div className="flex gap-4 md:gap-6" style={{ minWidth: "max-content" }}>
            {products.map((product, index) => (
              (() => {
                const isOutOfStock = product.stockQuantity <= 0;
                return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-[200px] md:w-[280px] flex-shrink-0 group"
              >
                <Link
                  href={`/product/${product.slug}`}
                  className="block relative aspect-square overflow-hidden bg-white mb-4"
                >
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="280px"
                  />

                  {/* Quick Add */}
                  <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addItem(product);
                      }}
                      disabled={isOutOfStock}
                      className="w-full py-2.5 bg-[#1A1A1A] text-white text-xs font-sans uppercase tracking-[0.1em] hover:bg-[#333] transition-colors disabled:cursor-not-allowed disabled:bg-[#1A1A1A]/45"
                    >
                      {isOutOfStock ? "Udsolgt" : "Tilføj Hurtigt"}
                    </button>
                  </div>
                </Link>

                <div className="text-center">
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-serif text-sm font-medium text-[#1A1A1A] hover:text-[#8D6553] transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm font-sans text-[#1A1A1A]/70 mt-1">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </motion.div>
                );
              })()
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
