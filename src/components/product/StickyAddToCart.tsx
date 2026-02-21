"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product, formatPrice } from "@/types";
import { useCart } from "@/lib/cart";

interface StickyAddToCartProps {
  product: Product;
}

export default function StickyAddToCart({ product }: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling past 400px
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#1A1A1A]/10 shadow-lg md:hidden"
        >
          <div className="flex items-center justify-between p-4 gap-4">
            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <p className="font-serif text-sm font-medium text-[#1A1A1A] truncate">
                {product.name}
              </p>
              <p className="text-sm font-sans text-[#8D6553]">
                {formatPrice(product.price)}
              </p>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="flex-shrink-0 px-6 py-3 bg-[#1A1A1A] text-white text-sm font-sans uppercase tracking-wider hover:bg-[#333] transition-colors"
            >
              Tilføj
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
