"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Product, formatPrice } from "@/types";
import { useCart } from "@/lib/cart";
import { trackViewItem } from "@/lib/analytics";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Accordion from "./Accordion";
import SizeGuide from "./SizeGuide";
import TrustBadges from "./TrustBadges";
import { useCopy } from "@/components/CopyProvider";
import { categoryLabel, fillText } from "@/lib/copy-text";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const copy = useCopy();
  const { info, accordion } = copy.product;
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const maxQuantity = Math.max(0, product.stockQuantity);
  const isOutOfStock = maxQuantity === 0;

  useEffect(() => {
    trackViewItem({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
    });
  }, [product.id, product.name, product.price, product.category]);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, quantity);
  };

  // The description is already shown under the price, so the first panel is the materials.
  const accordionItems = [
    {
      title: accordion.materialsTitle,
      content: product.materials,
    },
    {
      title: accordion.boxTitle,
      content: accordion.boxText,
    },
    {
      title: accordion.deliveryTitle,
      content: accordion.deliveryText,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="lg:sticky lg:top-36"
    >
      {/* Badges */}
      <div className="flex gap-2 mb-4">
        {product.oneOfOne && <Badge variant="unique">{copy.shop.card.badgeUnique}</Badge>}
        {product.newArrival && <Badge variant="new">{copy.shop.card.badgeNew}</Badge>}
        {product.featured && <Badge variant="bestseller">{copy.shop.card.badgeBestseller}</Badge>}
      </div>

      {/* Product Name */}
      <h1 className="font-serif text-3xl md:text-4xl font-light text-[#1A1A1A] mb-2">
        {product.name}
      </h1>

      {/* One-of-one provenance line */}
      {product.oneOfOne && (
        <p className="font-serif italic text-base text-[#8D6553] mb-3">
          {info.oneOfOneNote}
        </p>
      )}

      {/* Category */}
      <p className="text-sm font-sans text-[#1A1A1A]/50 uppercase tracking-[0.15em] mb-4">
        {categoryLabel(copy.site, product.category)}
      </p>

      {/* Price */}
      <p className="font-serif text-2xl text-[#1A1A1A] mb-6">
        {formatPrice(product.price)}
      </p>

      <p className="text-sm font-sans text-[#1A1A1A]/60 mb-6">
        {isOutOfStock
          ? info.soldOut
          : maxQuantity <= 3
          ? fillText(copy.shop.card.onlyLeft, { count: maxQuantity })
          : info.inStock}
      </p>

      {/* Short Description */}
      <p className="text-[#1A1A1A]/70 font-sans leading-relaxed mb-6">
        {product.description}
      </p>

      {/* Ring size + guide (rings only) */}
      {product.category === "rings" && (
        <div className="mb-6">
          <p className="text-xs font-sans uppercase tracking-[0.1em] text-[#1A1A1A]/60 mb-3">
            {info.sizeLabel}
          </p>
          {/* Grouped left rather than spread across the column — at desktop
              width justify-between pushed the guide link ~700px from its label. */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="font-serif text-lg text-[#1A1A1A]">
              {product.ringSize
                ? fillText(info.sizeValue, { size: product.ringSize })
                : info.sizeContact}
            </span>
            <SizeGuide category={product.category} ringSize={product.ringSize} />
          </div>
          {product.ringSize && (
            <p className="mt-2 text-sm font-sans text-[#1A1A1A]/50">
              {info.sizeOnlyThis}
            </p>
          )}
        </div>
      )}

      {/* Quantity Selector */}
      <div className="mb-6">
        <label className="block text-xs font-sans uppercase tracking-[0.1em] text-[#1A1A1A]/60 mb-3">
          {info.quantityLabel}
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={isOutOfStock}
            className="w-10 h-10 border border-[#1A1A1A]/20 flex items-center justify-center text-lg hover:border-[#1A1A1A] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
            aria-label={info.decreaseQuantity}
          >
            -
          </button>
          <span className="w-12 text-center font-sans text-lg">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
            disabled={isOutOfStock || quantity >= maxQuantity}
            className="w-10 h-10 border border-[#1A1A1A]/20 flex items-center justify-center text-lg hover:border-[#1A1A1A] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={info.increaseQuantity}
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        id="primary-add-to-cart"
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleAddToCart}
        className="mb-3"
        disabled={isOutOfStock}
      >
        {isOutOfStock
          ? info.soldOutButton
          : fillText(info.addToCart, { price: formatPrice(product.price * quantity) })}
      </Button>

      <p className="mb-6 text-center text-xs font-sans text-[#1A1A1A]/60">
        {info.shippingNote}
      </p>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Accordion Sections */}
      <div className="mt-8">
        <Accordion items={accordionItems} />
      </div>
    </motion.div>
  );
}
