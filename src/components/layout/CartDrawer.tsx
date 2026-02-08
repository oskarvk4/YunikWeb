"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/types";
import Button from "@/components/ui/Button";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#1A1A1A]/10">
              <h2 className="font-serif text-xl font-light tracking-wide text-[#1A1A1A]">
                Your Bag ({items.length})
              </h2>
              <button
                onClick={closeCart}
                className="p-2 -mr-2"
                aria-label="Close cart"
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

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <svg
                    className="w-16 h-16 text-[#1A1A1A]/20 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <p className="text-[#1A1A1A]/60 font-sans mb-6">
                    Your bag is empty
                  </p>
                  <Button variant="outline" onClick={closeCart}>
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map((item, index) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      {/* Product Image */}
                      <div className="relative w-24 h-24 bg-[#F5F0EB] flex-shrink-0">
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-sm font-medium text-[#1A1A1A] truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs text-[#1A1A1A]/60 font-sans mt-1 capitalize">
                          {item.category}
                        </p>
                        <p className="text-sm font-sans font-medium text-[#1A1A1A] mt-2">
                          {formatPrice(item.price)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 border border-[#1A1A1A]/20 flex items-center justify-center text-sm hover:border-[#1A1A1A] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="text-sm font-sans w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 border border-[#1A1A1A]/20 flex items-center justify-center text-sm hover:border-[#1A1A1A] transition-colors"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors self-start"
                        aria-label="Remove item"
                      >
                        <svg
                          className="w-5 h-5"
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
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[#1A1A1A]/10 p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-sans text-[#1A1A1A]/60">
                    Subtotal
                  </span>
                  <span className="font-serif text-lg font-medium text-[#1A1A1A]">
                    {formatPrice(getTotal())}
                  </span>
                </div>
                <p className="text-xs text-[#1A1A1A]/50 font-sans">
                  Shipping calculated at checkout
                </p>
                <Button fullWidth variant="primary" size="lg">
                  Checkout
                </Button>
                <button
                  onClick={closeCart}
                  className="w-full text-center text-sm font-sans text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors py-2"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
