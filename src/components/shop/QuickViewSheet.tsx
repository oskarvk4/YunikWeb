"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Product, formatPrice } from "@/types";
import { useCart } from "@/lib/cart";

interface QuickViewSheetProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewSheet({
  product,
  isOpen,
  onClose,
}: QuickViewSheetProps) {
  const { addItem } = useCart();
  const isOutOfStock = product.stockQuantity <= 0;

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleAdd = () => {
    addItem(product);
    onClose();
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.y > 100 || info.velocity.y > 500) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Detaljer: ${product.name}`}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={handleDragEnd}
            className="fixed inset-x-0 bottom-0 z-[70] bg-[#F5F0EB] rounded-t-2xl max-h-[90vh] flex flex-col shadow-2xl"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 rounded-full bg-[#1A1A1A]/20" />
            </div>

            {/* Header */}
            <div className="relative flex items-center justify-center px-5 pt-2 pb-3 border-b border-[#1A1A1A]/10">
              <span className="text-xs font-sans uppercase tracking-[0.15em] text-[#1A1A1A]/70">
                Detaljer
              </span>
              <button
                onClick={onClose}
                aria-label="Luk"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] rounded-sm"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 overscroll-contain">
              {/* Image carousel */}
              <div className="relative aspect-square bg-[#EDE6DE]">
                <div className="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {product.images.map((src, i) => (
                    <div
                      key={i}
                      className="relative shrink-0 w-full h-full snap-center"
                    >
                      <Image
                        src={src}
                        alt={`${product.name} - billede ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="100vw"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="px-5 py-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h2 className="font-serif text-2xl font-light text-[#1A1A1A]">
                    {product.name}
                  </h2>
                  <p className="font-sans text-lg text-[#1A1A1A] whitespace-nowrap pt-1">
                    {formatPrice(product.price)}
                  </p>
                </div>

                <p className="text-sm font-sans text-[#1A1A1A]/70 leading-relaxed mb-6">
                  {product.description}
                </p>

                {product.materials && (
                  <p className="text-xs font-sans text-[#1A1A1A]/50 uppercase tracking-[0.1em]">
                    {product.materials}
                  </p>
                )}
              </div>
            </div>

            {/* Sticky footer */}
            <div className="px-5 py-4 border-t border-[#1A1A1A]/10 bg-[#F5F0EB] space-y-3">
              <button
                onClick={handleAdd}
                disabled={isOutOfStock}
                className="w-full py-4 bg-[#1A1A1A] text-white text-xs font-sans uppercase tracking-[0.15em] hover:bg-[#333] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white focus:ring-inset disabled:cursor-not-allowed disabled:bg-[#1A1A1A]/45"
              >
                {isOutOfStock ? "Udsolgt" : "Tilføj til Kurv"}
              </button>
              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="block text-center text-xs font-sans uppercase tracking-[0.15em] text-[#1A1A1A]/70 hover:text-[#1A1A1A] py-2"
              >
                Se Fuld Produktside
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
