"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Product, formatPrice } from "@/types";
import { useCart } from "@/lib/cart";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Accordion from "./Accordion";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
  };

  const accordionItems = [
    {
      title: "Beskrivelse",
      content: product.description,
    },
    {
      title: "Materialer & Pleje",
      content: product.materials,
    },
    {
      title: "Levering",
      content:
        "Gratis fragt på ordrer over 500 DKK. Standardlevering tager 3-5 hverdage i Danmark. International forsendelse er tilgængelig til udvalgte lande.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="lg:sticky lg:top-28"
    >
      {/* Badges */}
      <div className="flex gap-2 mb-4">
        {product.newArrival && <Badge variant="new">Nyhed</Badge>}
        {product.featured && <Badge variant="bestseller">Bestseller</Badge>}
      </div>

      {/* Product Name */}
      <h1 className="font-serif text-3xl md:text-4xl font-light text-[#1A1A1A] mb-2">
        {product.name}
      </h1>

      {/* Category */}
      <p className="text-sm font-sans text-[#1A1A1A]/50 uppercase tracking-[0.15em] mb-4">
        {product.category}
      </p>

      {/* Price */}
      <p className="font-serif text-2xl text-[#1A1A1A] mb-6">
        {formatPrice(product.price)}
      </p>

      {/* Short Description */}
      <p className="text-[#1A1A1A]/70 font-sans leading-relaxed mb-8">
        {product.description}
      </p>

      {/* Quantity Selector */}
      <div className="mb-6">
        <label className="block text-xs font-sans uppercase tracking-[0.1em] text-[#1A1A1A]/60 mb-3">
          Antal
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 border border-[#1A1A1A]/20 flex items-center justify-center text-lg hover:border-[#1A1A1A] transition-colors"
            aria-label="Reducer antal"
          >
            -
          </button>
          <span className="w-12 text-center font-sans text-lg">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 border border-[#1A1A1A]/20 flex items-center justify-center text-lg hover:border-[#1A1A1A] transition-colors"
            aria-label="Øg antal"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleAddToCart}
        className="mb-8"
      >
        Læg i Kurv — {formatPrice(product.price * quantity)}
      </Button>

      {/* Accordion Sections */}
      <Accordion items={accordionItems} />
    </motion.div>
  );
}
