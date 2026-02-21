"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/types";
import { trackBeginCheckout } from "@/lib/analytics";

export default function CheckoutPage() {
  const { items, getTotal, removeItem, updateQuantity } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsLoading(true);
    setError(null);

    // Track begin checkout
    trackBeginCheckout(
      items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category,
        quantity: item.quantity,
      })),
      getTotal()
    );

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Der opstod en fejl");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Der opstod en fejl ved betaling");
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-20">
        <section className="py-16 md:py-24">
          <Container size="narrow">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-[#F5F0EB] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-[#1A1A1A]/30"
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
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-light text-[#1A1A1A] mb-4">
                Din kurv er tom
              </h1>
              <p className="text-[#1A1A1A]/60 font-sans mb-8">
                Tilføj nogle smykker til din kurv for at fortsætte
              </p>
              <Link href="/shop">
                <Button variant="primary" size="lg">
                  Gå til Shop
                </Button>
              </Link>
            </motion.div>
          </Container>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-[#F5F0EB] py-12 md:py-16">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-3xl md:text-4xl font-light text-[#1A1A1A]">
              Checkout
            </h1>
          </motion.div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="font-serif text-xl font-light text-[#1A1A1A] mb-6">
                  Din Ordre ({items.length} {items.length === 1 ? "vare" : "varer"})
                </h2>

                <div className="space-y-6">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 pb-6 border-b border-[#1A1A1A]/10"
                    >
                      <div className="relative w-24 h-24 md:w-32 md:h-32 bg-[#F5F0EB] flex-shrink-0">
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-serif text-lg text-[#1A1A1A]">
                              {item.name}
                            </h3>
                            <p className="text-sm text-[#1A1A1A]/60 font-sans capitalize mt-1">
                              {item.category === "rings" && "Ringe"}
                              {item.category === "necklaces" && "Halskæder"}
                              {item.category === "earrings" && "Øreringe"}
                              {item.category === "bracelets" && "Armbånd"}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-1 rounded-sm"
                            aria-label="Fjern vare"
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
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 border border-[#1A1A1A]/20 flex items-center justify-center text-sm hover:border-[#1A1A1A] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-1"
                              aria-label="Reducer antal"
                            >
                              -
                            </button>
                            <span className="text-sm font-sans w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 border border-[#1A1A1A]/20 flex items-center justify-center text-sm hover:border-[#1A1A1A] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-1"
                              aria-label="Øg antal"
                            >
                              +
                            </button>
                          </div>
                          <p className="font-serif text-lg text-[#1A1A1A]">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-[#8D6553] font-sans mt-6 hover:underline outline-none focus-visible:ring-2 focus-visible:ring-[#8D6553] focus-visible:ring-offset-2 rounded-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Fortsæt shopping
                </Link>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-[#F5F0EB] p-6 md:p-8 sticky top-24"
              >
                <h2 className="font-serif text-xl font-light text-[#1A1A1A] mb-6">
                  Ordreoversigt
                </h2>

                <div className="space-y-4 border-b border-[#1A1A1A]/10 pb-4 mb-4">
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-[#1A1A1A]/60">Subtotal</span>
                    <span className="text-[#1A1A1A]">{formatPrice(getTotal())}</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-[#1A1A1A]/60">Fragt</span>
                    <span className="text-[#1A1A1A]">Beregnes ved betaling</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="font-serif text-lg text-[#1A1A1A]">Total</span>
                  <span className="font-serif text-2xl text-[#1A1A1A]">
                    {formatPrice(getTotal())}
                  </span>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-sm mb-4 text-sm font-sans">
                    {error}
                  </div>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Behandler...
                    </span>
                  ) : (
                    "Gå til Betaling"
                  )}
                </Button>

                <div className="mt-6 flex items-center justify-center gap-2 text-[#1A1A1A]/50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span className="text-xs font-sans">Sikker betaling med Stripe</span>
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
