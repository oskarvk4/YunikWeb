"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Product, formatPrice } from "@/types";
import { useCart } from "@/lib/cart";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Accordion from "./Accordion";
import SizeGuide from "./SizeGuide";
import TrustBadges from "./TrustBadges";

interface ProductInfoProps {
  product: Product;
}

const categoryNames: Record<string, string> = {
  rings: "Ringe",
  necklaces: "Halskæder",
  earrings: "Øreringe",
  bracelets: "Armbånd",
};

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
      title: "Hvad er i æsken",
      content: "Dit smykke leveres i en elegant Yunik-smykkeboks med silkeforet interiør. Inkluderet er også et plejekort med vedligeholdelsesinstruktioner, så dit smykke bevarer sin skønhed i mange år.",
    },
    {
      title: "Levering & Retur",
      content: "Gratis fragt på ordrer over 500 DKK. Standardlevering tager 3-5 hverdage i Danmark. Du har 14 dages fuld returret. Se vores leveringspolitik for mere information.",
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
        {categoryNames[product.category] || product.category}
      </p>

      {/* Price */}
      <p className="font-serif text-2xl text-[#1A1A1A] mb-6">
        {formatPrice(product.price)}
      </p>

      {/* Short Description */}
      <p className="text-[#1A1A1A]/70 font-sans leading-relaxed mb-6">
        {product.description}
      </p>

      {/* Size Guide (for rings) */}
      <div className="mb-6">
        <SizeGuide category={product.category} />
      </div>

      {/* Quantity Selector */}
      <div className="mb-6">
        <label className="block text-xs font-sans uppercase tracking-[0.1em] text-[#1A1A1A]/60 mb-3">
          Antal
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 border border-[#1A1A1A]/20 flex items-center justify-center text-lg hover:border-[#1A1A1A] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
            aria-label="Reducer antal"
          >
            -
          </button>
          <span className="w-12 text-center font-sans text-lg">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 border border-[#1A1A1A]/20 flex items-center justify-center text-lg hover:border-[#1A1A1A] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
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
        className="mb-6"
      >
        Læg i Kurv — {formatPrice(product.price * quantity)}
      </Button>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Accordion Sections */}
      <div className="mt-8">
        <Accordion items={accordionItems} />
      </div>
    </motion.div>
  );
}
