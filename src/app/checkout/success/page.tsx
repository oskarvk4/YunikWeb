"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { useCart } from "@/lib/cart";
import { trackPurchase } from "@/lib/analytics";

export default function CheckoutSuccessPage() {
  const { items, getTotal, clearCart } = useCart();
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only run once and only if there are items to clear
    if (!hasTracked.current && items.length > 0) {
      hasTracked.current = true;

      // Track purchase
      trackPurchase(
        `order_${Date.now()}`,
        items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          category: item.category,
          quantity: item.quantity,
        })),
        getTotal()
      );

      // Clear cart after successful purchase
      clearCart();
    }
  }, [items, getTotal, clearCart]);

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
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>

            <h1 className="font-serif text-3xl md:text-4xl font-light text-[#1A1A1A] mb-4">
              Tak for din ordre!
            </h1>

            <p className="text-[#1A1A1A]/70 font-sans leading-relaxed mb-8 max-w-md mx-auto">
              Vi har modtaget din ordre og sender dig en bekræftelse på email.
              Du kan forvente at modtage dine smykker inden for 2-5 hverdage.
            </p>

            <div className="bg-[#F5F0EB] p-6 md:p-8 rounded-sm mb-8">
              <h2 className="font-serif text-lg text-[#1A1A1A] mb-4">
                Hvad sker der nu?
              </h2>
              <ul className="text-left space-y-3 text-[#1A1A1A]/70 font-sans text-sm">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#8D6553] text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">
                    1
                  </span>
                  <span>Du modtager en ordrebekræftelse på email</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#8D6553] text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">
                    2
                  </span>
                  <span>Vi pakker dine smykker med omhu</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#8D6553] text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">
                    3
                  </span>
                  <span>Du får besked når din pakke er afsendt</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#8D6553] text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">
                    4
                  </span>
                  <span>Din pakke leveres inden for 2-5 hverdage</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button variant="primary" size="lg">
                  Fortsæt Shopping
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="lg">
                  Tilbage til Forsiden
                </Button>
              </Link>
            </div>

            <p className="mt-8 text-sm text-[#1A1A1A]/50 font-sans">
              Spørgsmål? Kontakt os på{" "}
              <a href="mailto:kontakt@yunik.dk" className="text-[#8D6553] hover:underline">
                kontakt@yunik.dk
              </a>
            </p>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
